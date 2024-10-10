import cv2
import os
from flask import Flask, Response

# Read settings from environment variables
device = os.getenv('DEVICE', '/dev/video0')
resolution = os.getenv('RESOLUTION', '640x480').split('x')
frame_rate = int(os.getenv('FRAME_RATE', 30))
stream_port = int(os.getenv('STREAM_PORT', 8081))

print(f"Device: {device}")
print(f"Resolution: {resolution[0]}x{resolution[1]}")
print(f"Frame Rate: {frame_rate}")
print(f"Stream Port: {stream_port}")

# Open the camera stream
cap = cv2.VideoCapture(device)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, int(resolution[0]))
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, int(resolution[1]))
cap.set(cv2.CAP_PROP_FPS, frame_rate)

if not cap.isOpened():
    print(f"Error: Could not open video device {device}")
    exit(1)
else:
    print(f"Successfully opened video device {device}")

# Provide MJPEG stream
def stream():
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Warning: Failed to read frame from camera.")
                continue
            ret, jpeg = cv2.imencode('.jpg', frame)
            if not ret:
                print("Warning: Failed to encode frame to JPEG.")
                continue
            # Uncomment the next line to log every frame being streamed (may produce a lot of output)
            # print("Streaming frame...")
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')
    except GeneratorExit:
        print("Stream closed by client, releasing camera.")
        cap.release()
    except Exception as e:
        print(f"Stream error: {e}")
        cap.release()

app = Flask(__name__)

@app.route('/')
def video_feed():
    print("Client connected to video feed.")
    return Response(stream(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    # Get the hostname or IP address
    host_ip = os.getenv('HOST_IP', 'localhost')
    print(f"Starting Flask app on port {stream_port}")
    print(f"Video stream URL: http://{host_ip}:{stream_port}/")
    app.run(host='0.0.0.0', port=stream_port, threaded=True)