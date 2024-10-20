import cv2
import os
import platform
from flask import Flask, Response

# Detect the operating system
system_platform = platform.system()

# Set the camera device based on the operating system
if system_platform == 'Darwin':  # macOS
    device = 0  # HD USB CAMERA on macOS (index 0)
elif system_platform == 'Linux':
    device = os.getenv('DEVICE', '/dev/video0')  # Default to /dev/video0 on Linux
else:
    print("Unsupported operating system")
    exit(1)

resolution = os.getenv('RESOLUTION', '640x480').split('x')
frame_rate = int(os.getenv('FRAME_RATE', 30))
stream_port = int(os.getenv('STREAM_PORT', 8081))

print(f"Device: {device}")
print(f"Resolution: {resolution[0]}x{resolution[1]}")
print(f"Frame Rate: {frame_rate}")
print(f"Stream Port: {stream_port}")

app = Flask(__name__)

def gen_frames():
    # Open the camera stream
    cap = cv2.VideoCapture(device)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, int(resolution[0]))
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, int(resolution[1]))
    cap.set(cv2.CAP_PROP_FPS, frame_rate)

    if not cap.isOpened():
        print(f"Error: Could not open video device {device}")
        return

    # Load detection models
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    hog = cv2.HOGDescriptor()
    hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Warning: Failed to read frame from camera.")
                break

            # Convert to grayscale for face detection
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # Face detection
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

            # Draw rectangles around faces
            for (x, y, w, h) in faces:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

            # Human detection
            rects, weights = hog.detectMultiScale(frame, winStride=(8, 8), padding=(16, 16), scale=1.05)

            # Draw rectangles around humans
            for (x, y, w, h) in rects:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

            # Encode the processed frame
            ret, jpeg = cv2.imencode('.jpg', frame)
            if not ret:
                print("Warning: Failed to encode frame to JPEG.")
                continue

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')
    except GeneratorExit:
        print("Stream closed by client.")
    except Exception as e:
        print(f"Stream error: {e}")
    finally:
        cap.release()
        print("Camera released.")

@app.route('/')
def video_feed():
    print("Client connected to video feed.")
    return Response(gen_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    # Get the hostname or IP address
    host_ip = os.getenv('HOST_IP', 'localhost')
    print(f"Starting Flask app on port {stream_port}")
    print(f"Video stream URL: http://{host_ip}:{stream_port}/")
    app.run(host='0.0.0.0', port=stream_port, threaded=True)