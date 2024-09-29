from fastapi import FastAPI, Response
import cv2
import numpy as np
from vidgear.gears import CamGear
from starlette.responses import StreamingResponse

app = FastAPI()

# Load YOLOv4 network
net = cv2.dnn.readNet('yolo-files/yolov4.weights', 'yolo-files/yolov4.cfg')
layer_names = net.getLayerNames()
output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]

# Load class labels
with open('yolo-files/coco.names', 'r') as f:
    classes = [line.strip() for line in f.readlines()]

def generate_frames():
    stream = CamGear(source='https://www.youtube.com/watch?v=eCucedzZT1A', stream_mode=True, logging=True, ytdl_options={'format': 'worst'}).start()

    frame_count = 0
    
    while True:
        frame = stream.read()
        
        frame_count += 1
        
        if frame is None or frame_count % 5 != 0:
            continue
        
        #frame = cv2.resize(frame, (640, 360))

        # Process the frame (e.g., resize, detect objects, draw bounding boxes)
        height, width, channels = frame.shape
        blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
        net.setInput(blob)
        outs = net.forward(output_layers)

        boxes = []
        confidences = []
        class_ids = []

        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]

                # Detect only persons (class_id == 0 for "person" in coco.names)
                if confidence > 0.1 and class_id == 0:
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

        # Draw bounding boxes and labels for "person"
        for i in range(len(boxes)):
            if i in indexes and class_ids[i] == 0:
                x, y, w, h = boxes[i]
                label = str(classes[class_ids[i]])
                confidence_label = f"{label} {confidences[i]:.2f}"
                color = (0, 255, 0)
                cv2.rectangle(frame, (x, y), (x + w, y + h), color, 3)
                cv2.putText(frame, confidence_label, (x, y - 10), cv2.FONT_HERSHEY_PLAIN, 1, color, 2)

                person_counter += 1

        # Overlay the person counter
        cv2.putText(frame, f"People Detected: {person_counter}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

        # Encode the frame in JPEG format
        ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 50])  # Reduce JPEG quality to 50%
        frame = buffer.tobytes()

        # Yield the frame as part of a multipart HTTP response
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    stream.stop()

@app.get("/video_feed")
async def video_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

