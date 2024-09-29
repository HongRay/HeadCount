from fastapi import FastAPI
import cv2
import numpy as np
from starlette.responses import StreamingResponse

app = FastAPI()

# Load YOLOv4-tiny for faster performance
net = cv2.dnn.readNet('yolo-files/yolov4.weights', 'yolo-files/yolov4.cfg')
net.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)  # Use GPU if available
net.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA)

# Load class labels
with open('yolo-files/coco.names', 'r') as f:
    classes = [line.strip() for line in f.readlines()]

def generate_frames():
    cap = cv2.VideoCapture(0)  # Use webcam, might need to change if wan set webcam
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)  # Set width to 1280 pixels
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)  # Set height to 720 pixels

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Resize frame to reduce processing overhead
        # frame = cv2.resize(frame, (640, 360))

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
                cv2.putText(frame, confidence_label, (x, y - 10), cv2.FONT_HERSHEY_PLAIN, 1, color, 2)

                if class_ids[i] == 0:  # Count only persons
                    person_counter += 1

        # Overlay the person counter
        cv2.putText(frame, f"Persons: {person_counter}", (50, 60), cv2.FONT_HERSHEY_COMPLEX, 2, (255, 255, 255), 2)

        # Encode frame in JPEG format
        ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 50])
        frame = buffer.tobytes()

        # Yield the frame as part of a multipart HTTP response
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

@app.get("/video_feed")
async def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")
