from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import StreamingResponse
import cv2
from vidgear.gears import CamGear
from app.video_processing import load_yolo_model, count_people_in_frame
from pydantic import BaseModel


app = FastAPI()

# Load YOLO model in memory
net, output_layers, classes = load_yolo_model()

# Model to accept a video URL
class VideoURLRequest(BaseModel):
    url: str

@app.get("/")
async def root():
    return {"message": "Welcome to the HeadCount API!"}

@app.get("/health")
async def health():
    return {"status": "ok"}

# Endpoint 1: Return video stream
@app.get("/videoFeed")
async def video_feed():
    return StreamingResponse(generate_video_feed(), media_type="multipart/x-mixed-replace; boundary=frame")

# Endpoint 2: Process video from a URL
@app.post("/processFeed")
async def process_feed(video_url_request: VideoURLRequest):
    url = video_url_request.url
    
    # Start the video stream from the provided URL
    stream = CamGear(source=url, stream_mode=True, logging=True).start()
    
    person_count = 0
    
    while True:
        frame = stream.read()
        if frame is None:
            break
        
        # Process the frame and count people
        person_count += count_people_in_frame(frame, net, output_layers)

    # Stop the stream
    stream.stop()

    return {"person_count": person_count}

# Function to return the number of people detected in a video feed
@app.get("/countPeople")
async def count_people():
    stream = CamGear(source='https://www.youtube.com/watch?v=eCucedzZT1A', stream_mode=True, logging=True, ytdl_options={'format': 'worst'}).start()
    
    person_count = 0

    while True:
        frame = stream.read()
        if frame is None:
            break

        person_count += count_people_in_frame(frame, net, output_layers)

    stream.stop()

    return {"person_count": person_count}

def generate_video_feed():
    stream = CamGear(source='https://www.youtube.com/watch?v=eCucedzZT1A', stream_mode=True, logging=True, ytdl_options={'format': 'worst'}).start()

    while True:
        frame = stream.read()
        if frame is None:
            break
        _, jpeg = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')

    stream.stop()
