from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import StreamingResponse
import cv2
from vidgear.gears import CamGear
from app.video_processing import load_yolo_model, count_people_in_frame
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# Load YOLO model in memory
net, output_layers, classes = load_yolo_model()

# In-memory storage for video URL
video_url_storage: Optional[str] = None

# Model to accept a video URL
class VideoURLRequest(BaseModel):
    url: str

@app.get("/")
async def root():
    return {"message": "Welcome to the HeadCount API!"}

@app.get("/health")
async def health():
    return {"status": "ok"}

# Endpoint 1: Return the video stream with people detection labels
@app.get("/videoFeed")
async def video_feed():
    if not video_url_storage:
        return {"error": "No video URL is stored. Please upload a video URL first."}
    
    # Use the stored video URL
    return StreamingResponse(generate_video_feed(), media_type="multipart/x-mixed-replace; boundary=frame")

# Endpoint 2: Accept video URL and store it for future use
@app.post("/processFeed")
async def process_feed(video_url_request: VideoURLRequest):
    global video_url_storage
    # Store the URL in memory
    video_url_storage = video_url_request.url
    return {"message": f"Video URL stored: {video_url_storage}"}

# Endpoint 3: Return the number of people detected in the video feed using the stored URL
@app.get("/countPeople")
async def count_people():
    if not video_url_storage:
        return {"error": "No video URL is stored. Please upload a video URL first."}

    # Use the stored video URL
    stream = CamGear(source=video_url_storage, stream_mode=True, logging=True).start()
    
    person_count = 0

    while True:
        frame = stream.read()
        if frame is None:
            break

        person_count = count_people_in_frame(frame, net, output_layers)

    stream.stop()

    return {"person_count": person_count}

# Generate the video feed with people detection labels
def generate_video_feed():
    stream = CamGear(source=video_url_storage, stream_mode=True, logging=True).start()

    while True:
        frame = stream.read()
        if frame is None:
            break
        
        # Detect people in the frame
        person_count = count_people_in_frame(frame, net, output_layers)

        # Add labels on the frame for visualization
        if person_count > 0:
            cv2.putText(frame, f"People Detected: {person_count}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

        # Convert frame to JPEG and yield for streaming
        _, jpeg = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')

    stream.stop()
