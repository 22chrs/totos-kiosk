import cv2
import re

def find_camera_source(device_name_pattern):
    max_sources = 10
    device_name_regex = re.compile(device_name_pattern)

    for source in range(max_sources):
        cap = cv2.VideoCapture(source)
        if not cap.isOpened():
            continue

        # Try to get the device name
        device_name = cap.getBackendName()

        # Close the capture to release the resource
        cap.release()

        # Check if the device name matches the pattern
        if device_name_regex.search(device_name):
            print(f"Found camera at source: {source}")
            return source
        
    print("Camera not found")
    return None