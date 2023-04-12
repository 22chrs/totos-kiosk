"""
Face_tracking01
Python program for realtime face tracking of a Universal Robot (tested with UR5cb)
Demonstration Video: https://youtu.be/HHb-5dZoPFQ
Explanation Video: https://www.youtube.com/watch?v=9XCNE0BmtUg

Created by Robin Godwyll
License: GPL v3 https://www.gnu.org/licenses/gpl-3.0.en.html

"""

import URBasic
import math
import numpy as np
import sys
import cv2
import time
import imutils
from imutils.video import VideoStream
import math3d as m3d

"""SETTINGS AND VARIABLES ________________________________________________________________"""


ROBOT_IP = '192.168.178.120'
ACCELERATION = 0.9  # Robot acceleration value
VELOCITY = 0.8  # Robot speed value

# The Joint position the robot starts at
robot_startposition = (math.radians(-218),
                    math.radians(-63),
                    math.radians(-93),
                    math.radians(-20),
                    math.radians(88),
                    math.radians(0))

# Path to the face-detection model:
pretrained_model = cv2.dnn.readNetFromCaffe("MODELS/deploy.prototxt.txt", "MODELS/res10_300x300_ssd_iter_140000.caffemodel")

video_resolution = (700, 400)  # resolution the video capture will be resized to, smaller sizes can speed up detection
video_midpoint = (int(video_resolution[0]/2),
                  int(video_resolution[1]/2))
video_asp_ratio  = video_resolution[0] / video_resolution[1]  # Aspect ration of each frame
video_viewangle_hor = math.radians(25)  # Camera FOV (field of fiew) angle in radians in horizontal direction

# Variable which scales the robot movement from pixels to meters.
m_per_pixel = 00.00009  

# Size of the robot view-window
# The robot will at most move this distance in each direction
max_x = 0.2
max_y = 0.2

# Maximum Rotation of the robot at the edge of the view window
hor_rot_max = math.radians(50)
vert_rot_max = math.radians(25)


vs = VideoStream(src= 0 ,
                 usePiCamera= False,
                 resolution=video_resolution,
                 framerate = 13,
                 meter_mode = "backlit",
                 exposure_mode ="auto",
                 shutter_speed = 8900,
                 exposure_compensation = 2,
                 rotation = 0).start()
time.sleep(0.2)



"""FUNCTIONS _____________________________________________________________________________"""


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

# Capture video using webcam or video file
cap = cv2.VideoCapture(0)  # Use 0 for webcam or replace with the path to a video file

while True:
    ret, frame = cap.read()
    if not ret:
        break

    face_centers, frame = find_faces_haar(frame, face_cascade, video_midpoint)
    cv2.imshow("Face Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()





def show_frame(frame):
    cv2.imshow('RobotCamera', frame)
    k = cv2.waitKey(6) & 0xff

def check_max_xy(xy_coord):
    """
    Checks if the face is outside of the predefined maximum values on the lookaraound plane

    Inputs:
        xy_coord: list of 2 values: x and y value of the face in the lookaround plane.
            These values will be evaluated against max_x and max_y

    Return Value:
        x_y: new x and y values
            if the values were within the maximum values (max_x and max_y) these are the same as the input.
            if one or both of the input values were over the maximum, the maximum will be returned instead
    """

    x_y = [0, 0]
    #print("xy before conversion: ", xy_coord)

    if -max_x <= xy_coord[0] <= max_x:
        # checks if the resulting position would be outside of max_x
        x_y[0] = xy_coord[0]
    elif -max_x > xy_coord[0]:
        x_y[0] = -max_x
    elif max_x < xy_coord[0]:
        x_y[0] = max_x
    else:
        raise Exception(" x is wrong somehow:", xy_coord[0], -max_x, max_x)

    if -max_y <= xy_coord[1] <= max_y:
        # checks if the resulting position would be outside of max_y
        x_y[1] = xy_coord[1]
    elif -max_y > xy_coord[1]:
        x_y[1] = -max_y
    elif max_y < xy_coord[1]:
        x_y[1] = max_y
    else:
        raise Exception(" y is wrong somehow", xy_coord[1], max_y)
    #print("xy after conversion: ", x_y)

    return x_y

def set_lookorigin():
    """
    Creates a new coordinate system at the current robot tcp position.
    This coordinate system is the basis of the face following.
    It describes the midpoint of the plane in which the robot follows faces.

    Return Value:
        orig: math3D Transform Object
            characterises location and rotation of the new coordinate system in reference to the base coordinate system

    """
    position = robot.get_actual_tcp_pose()
    orig = m3d.Transform(position)
    return orig

def move_to_face(list_of_facepos,robot_pos):
    """
    Function that moves the robot to the position of the face

    Inputs:
        list_of_facepos: a list of face positions captured by the camera, only the first face will be used
        robot_pos: position of the robot in 2D - coordinates

    Return Value:
        prev_robot_pos: 2D robot position the robot will move to. The basis for the next call to this funtion as robot_pos
    """


    face_from_center = list(list_of_facepos[0])  # TODO: find way of making the selected face persistent

    prev_robot_pos = robot_pos
    scaled_face_pos = [c * m_per_pixel for c in face_from_center]

    robot_target_xy = [a + b for a, b in zip(prev_robot_pos, scaled_face_pos)]
    # print("..", robot_target_xy)

    robot_target_xy = check_max_xy(robot_target_xy)
    prev_robot_pos = robot_target_xy

    x = robot_target_xy[0]
    y = robot_target_xy[1]
    z = 0
    xyz_coords = m3d.Vector(x, y, z)

    x_pos_perc = x / max_x
    y_pos_perc = y / max_y

    x_rot = x_pos_perc * hor_rot_max
    y_rot = y_pos_perc * vert_rot_max * -1

    tcp_rotation_rpy = [y_rot, x_rot, 0]
    # tcp_rotation_rvec = convert_rpy(tcp_rotation_rpy)
    tcp_orient = m3d.Orientation.new_euler(tcp_rotation_rpy, encoding='xyz')
    position_vec_coords = m3d.Transform(tcp_orient, xyz_coords)

    oriented_xyz = origin * position_vec_coords
    oriented_xyz_coord = oriented_xyz.get_pose_vector()

    coordinates = oriented_xyz_coord

    qnear = robot.get_actual_joint_positions()
    next_pose = coordinates
    robot.set_realtime_pose(next_pose)

    return prev_robot_pos

"""FACE TRACKING LOOP ____________________________________________________________________"""

# initialise robot with URBasic
print("initialising robot")
robotModel = URBasic.robotModel.RobotModel()
robot = URBasic.urScriptExt.UrScriptExt(host=ROBOT_IP,robotModel=robotModel)

robot.reset_error()
print("robot initialised")
time.sleep(1)

# Move Robot to the midpoint of the lookplane
robot.movej(q=robot_startposition, a= ACCELERATION, v= VELOCITY )

robot_position = [0,0]
origin = set_lookorigin()

robot.init_realtime_control()  # starts the realtime control loop on the Universal-Robot Controller
time.sleep(1) # just a short wait to make sure everything is initialised

try:
    print("starting loop")
    while True:

        frame = vs.read()
        face_positions, new_frame = find_faces_dnn(frame)
        show_frame(new_frame)
        if len(face_positions) > 0:
            robot_position = move_to_face(face_positions,robot_position)

    print("exiting loop")
except KeyboardInterrupt:
    print("closing robot connection")
    # Remember to always close the robot connection, otherwise it is not possible to reconnect
    robot.close()

except:
    robot.close()