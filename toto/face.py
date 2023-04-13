# 192.168.178.83


import cv2
import imutils
import urx
import math
import time
import numpy as np

def find_faces_haar(image, face_cascade, video_midpoint):
    # Resize the input image
    frame = image
    frame = imutils.resize(frame, width=video_resolution[0])
    (h, w) = frame.shape[:2]

    # Convert the frame to grayscale for the Haar cascade classifier
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Perform face detection using the Haar cascade classifier
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30), flags=cv2.CASCADE_SCALE_IMAGE)

    face_centers = []
    # Iterate through the detected faces
    for (x, y, w, h) in faces:
        startX, startY, endX, endY = x, y, x + w, y + h

        # Calculate the center of the face
        face_center = (int(startX + w / 2), int(startY + h / 2))

        # Calculate the position of the face center relative to the video midpoint
        position_from_center = (face_center[0] - video_midpoint[0], face_center[1] - video_midpoint[1])

        # Add the position to the list of face centers
        face_centers.append(position_from_center)

        # Draw a rectangle around the face
        cv2.rectangle(frame, (startX, startY), (endX, endY), (0, 0, 255), 2)

        # Draw the text "Face" above the rectangle
        cv2.putText(frame, "Face", (startX, y - 10 if startY - 10 > 10 else startY + 10), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)

        # Draw a line from the video midpoint to the face center
        cv2.line(frame, video_midpoint, face_center, (0, 200, 0), 5)

        # Draw a circle at the face center
        cv2.circle(frame, face_center, 4, (0, 200, 0), 3)

    return face_centers, frame

# Load the Haar cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

# Set the video resolution and midpoint
video_resolution = (640, 480)  # Example value, adjust according to your video resolution
video_midpoint = (320, 240)  # Example value, adjust according to your video resolution

# Connect to the UR3e robot
ROBOT_IP = "192.168.178.83"  # Replace with the UR3e's IP address
robot = urx.Robot(ROBOT_IP, use_rt=True)

# Initialize the camera
cap = cv2.VideoCapture(0)  # Change the camera index if needed
cap.set(cv2.CAP_PROP_FRAME_WIDTH, video_resolution[0])
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, video_resolution[1])

def face_to_robot_coordinates(face_position, scale_factor=0.01):
    return -face_position[0] * scale_factor, -face_position[1] * scale_factor

try:
    while True:
        # Capture video frame
        ret, frame = cap.read()
        if not ret:
            break

        # Detect face centers
        face_centers, frame_with_faces = find_faces_haar(frame, face_cascade, video_midpoint)

        if len(face_centers) > 0:
            # For simplicity, consider only the first detected face
            face_position = face_centers[0]

            # Convert face position to robot coordinates
            x, y = face_to_robot_coordinates(face_position)

            # Define a safe height (in meters) for the robot's head to move near the face
            z = 0.2

            # Set target pose for the robot
            target_pose = [x, y, z, 0, 3.14, 0]

            # Move the robot to the target pose (with small speed and acceleration)
            robot.movel(target_pose, 0.1, 0.1, wait=False)

        # Display the frame with detected faces
        cv2.imshow('Face Tracking', frame_with_faces)

        # Exit the loop if the 'q' key is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
finally:
    # Release the camera and close the robot connection
    cap.release()
    robot.close()
    cv2.destroyAllWindows()
