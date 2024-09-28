import cv2
import numpy as np
from vidgear.gears import CamGear

# Load YOLOv4 network
net = cv2.dnn.readNet('yolo-files/yolov4.weights', 'yolo-files/yolov4.cfg')
layer_names = net.getLayerNames()
output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]

# Load class labels
with open('yolo-files/coco.names', 'r') as f:
    classes = [line.strip() for line in f.readlines()]

# Start video stream
stream = CamGear(source='https://www.youtube.com/watch?v=KMJS66jBtVQ', stream_mode=True, logging=True, ytdl_options={'format': 'worst'}).start()

frame_skip = 5  # Number of frames to skip for faster processing
frame_count = 0  # Initialize frame counter

while True:
    frame = stream.read()

    if frame is None:
        print("Frame is None, exiting.")
        break

    # Skip frames to speed up processing
    if frame_count % frame_skip != 0:
        frame_count += 1
        continue

    frame_count += 1

    # Get frame dimensions
    height, width, channels = frame.shape

    # Prepare frame for YOLO
    blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
    net.setInput(blob)

    # Run YOLO object detection
    outs = net.forward(output_layers)

    # Post-processing to extract bounding boxes, labels, and confidence scores
    boxes = []
    confidences = []
    class_ids = []

    for out in outs:
        for detection in out:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]

            # Detect only persons (class_id == 0 for "person" in coco.names)
            if confidence > 0.1 and class_id == 0:  # Ensure we only detect persons
                # Object detected
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)

                # Coordinates for the bounding box
                x = int(center_x - w / 2)
                y = int(center_y - h / 2)

                boxes.append([x, y, w, h])
                confidences.append(float(confidence))
                class_ids.append(class_id)

    # Perform Non-Maximum Suppression to remove overlapping bounding boxes
    indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.3)

    # Draw bounding boxes and labels for "person"
    font = cv2.FONT_HERSHEY_PLAIN
    for i in range(len(boxes)):
        if i in indexes:
            x, y, w, h = boxes[i]
            label = str(classes[class_ids[i]])  # "person"
            confidence_label = f"{label} {confidences[i]:.2f}"
            color = (0, 255, 0)  # Green color for bounding box
            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 3)
            cv2.putText(frame, confidence_label, (x, y - 10), font, 1, color, 2)

    # Display the frame with bounding boxes
    cv2.imshow("FRAME", frame)

    # Exit on pressing 'Esc'
    if cv2.waitKey(1) & 0xFF == 27:
        break

stream.stop()
cv2.destroyAllWindows()
