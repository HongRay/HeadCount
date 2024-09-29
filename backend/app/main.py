from fastapi import FastAPI
import cv2
import numpy as np
from starlette.responses import StreamingResponse
from vidgear.gears import CamGear
from pydantic import BaseModel

app = FastAPI()

# Define a model for video URL input
class VideoURLRequest(BaseModel):
    url: str

# Global variables to store the video URL and person counters
video_url_storage = None
current_person_count_video = 0  # Global person counter for video feed
current_person_count_live = 0  # Global person counter for live feed (webcam)

# Load YOLOv4-tiny for faster performance
net = cv2.dnn.readNet('yolo-files/yolov4.weights', 'yolo-files/yolov4.cfg')
net.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)  # Use GPU if available
net.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA)

# Load class labels
with open('yolo-files/coco.names', 'r') as f:
    classes = [line.strip() for line in f.readlines()]

#-------------------------------------------- WEBCAM -------------------------------------------
def generate_webcam_feed():
    global current_person_count_live
    cap = cv2.VideoCapture(0)  # Use webcam
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)  # Set width to 1280 pixels
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)  # Set height to 720 pixels

    frame_count = 0
    
    while True:
        ret, frame = cap.read()
        frame_count += 1
        
        if frame_count % 5 != 0:
            continue
        
        if not ret:
            break

        # YOLO object detection
        blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
        net.setInput(blob)
        outs = net.forward(net.getUnconnectedOutLayersNames())

        boxes = []
        confidences = []
        class_ids = []

        height, width, _ = frame.shape
        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]

                if confidence > 0.1:  # Confidence threshold
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)

                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)

                    boxes.append([x, y, w, h])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)

        indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.3)
        person_counter = 0

        # Draw bounding boxes and labels for detected objects
        for i in range(len(boxes)):
            if i in indexes and class_ids[i] == 0:
                x, y, w, h = boxes[i]
                label = str(classes[class_ids[i]])
                confidence_label = f"{label} {confidences[i]:.2f}"
                color = (0, 255, 0)
                cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
                # cv2.putText(frame, confidence_label, (x, y - 10), cv2.FONT_HERSHEY_PLAIN, 1, color, 2) its all person so can remove this label

                if class_ids[i] == 0:  # Count only persons
                    person_counter += 1

        # Update the global person counter for live feed
        current_person_count_live = person_counter

        # Overlay the person counter
        cv2.putText(frame, f"People Detected: {person_counter}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

        # Encode frame in JPEG format
        ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 30])
        frame = buffer.tobytes()

        # Yield the frame as part of a multipart HTTP response
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

#-------------------------------------------- VIDEO -------------------------------------------
def generate_video_feed():
    global current_person_count_video
    stream = CamGear(source=video_url_storage, stream_mode=True, logging=True).start()
    frame_count = 0

    while True:
        frame = stream.read()
        
        frame_count += 1
        
        if frame is None or frame_count % 5 != 0:
            continue

        # YOLO object detection
        height, width, _ = frame.shape
        blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
        net.setInput(blob)
        outs = net.forward(net.getUnconnectedOutLayersNames())

        boxes = []
        confidences = []
        class_ids = []

        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]

                if confidence > 0.1:  # Confidence threshold
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)

                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)

                    boxes.append([x, y, w, h])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)

        indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.3)
        person_counter = 0

        # Draw bounding boxes and labels for detected objects
        for i in range(len(boxes)):
            if i in indexes and class_ids[i] == 0:
                x, y, w, h = boxes[i]
                label = str(classes[class_ids[i]])
                confidence_label = f"{label} {confidences[i]:.2f}"
                color = (0, 255, 0)
                cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
                # cv2.putText(frame, confidence_label, (x, y - 10), cv2.FONT_HERSHEY_PLAIN, 1, color, 2) its all person so can remove this label
                
                if class_ids[i] == 0:  # Count only persons
                    person_counter += 1

        # Update the global person counter for video feed
        current_person_count_video = person_counter
        
        cv2.putText(frame, f"People Detected: {person_counter}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

        # Encode frame in JPEG format
        ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 30])
        frame = buffer.tobytes()

        # Yield the frame as part of a multipart HTTP response
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    stream.stop()

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the HeadCount API!"}

# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "ok"}

# Endpoint 1: Return the video stream from a stored video URL with people detection labels
@app.get("/video_feed")
async def video_feed():
    if not video_url_storage:
        return {"error": "No video URL is stored. Please upload a video URL first."}

    # Use the stored video URL to stream
    return StreamingResponse(generate_video_feed(), media_type="multipart/x-mixed-replace; boundary=frame")

# Endpoint 2: Accept video URL and store it for future use
@app.post("/process_feed")
async def process_feed(video_url_request: VideoURLRequest):
    global video_url_storage
    # Store the URL in memory
    video_url_storage = video_url_request.url
    return {"message": f"Video URL stored: {video_url_storage}"}

# Endpoint 3: Return the number of people detected in the video feed or live feed
@app.get("/countPeople")
async def count_people(source: str):
    # Return the current person count from the video feed or live feed based on the source
    if source == "video":
        if not video_url_storage:
            return {"error": "No video URL is stored. Please upload a video URL first."}
        return {"person_count": current_person_count_video}
    elif source == "live":
        return {"person_count": current_person_count_live}
    else:
        return {"error": "Invalid source. Use 'video' or 'live' as the source parameter."}

# Endpoint for live feed from webcam
@app.get("/live_feed")
async def live_feed():
    return StreamingResponse(generate_webcam_feed(), media_type="multipart/x-mixed-replace; boundary=frame")
