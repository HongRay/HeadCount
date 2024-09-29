import cv2
import numpy as np

def load_yolo_model():
    net = cv2.dnn.readNet('yolo-files/yolov4.weights', 'yolo-files/yolov4.cfg')
    layer_names = net.getLayerNames()
    output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]

    with open('yolo-files/coco.names', 'r') as f:
        classes = [line.strip() for line in f.readlines()]

    return net, output_layers, classes

def bytes_to_frame(bytes_data):
    # Convert byte data from the request into an image frame
    np_arr = np.frombuffer(bytes_data, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return frame

def count_people_in_frame(frame, net, output_layers):
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
    person_count = sum(1 for i in indexes)  # Count number of persons detected
    return person_count