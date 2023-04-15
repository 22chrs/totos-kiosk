"""
Created by Robin Godwyll
License: GPL v3 https://www.gnu.org/licenses/gpl-3.0.en.html
"""

# Import necessary libraries
import URBasic
import math
import numpy as np
import os
os.environ["QT_QPA_PLATFORM_PLUGIN_PATH"] = "/usr/local/lib/python3.11/site-packages/cv2/qt/plugins"
import cv2
import time
import imutils
from imutils.video import VideoStream
import math3d as m3d

# Set constants for robot connection, speed, acceleration, and start position
ROBOT_IP = '192.168.178.83'
ACCELERATION = 0.3  # Robot acceleration value
VELOCITY = 0.5  # Robot speed value
robot_startposition = (math.radians(-218),
                    math.radians(-63),
                    math.radians(-93),
                    math.radians(-20),
                    math.radians(88),
                    math.radians(0))

# Load pre-trained face detection model
pretrained_model = cv2.dnn.readNetFromCaffe("facetracking/deploy.prototxt.txt", "facetracking/res10_300x300_ssd_iter_140000.caffemodel")

# Set video stream resolution and related constants
video_resolution = (700, 400)
video_midpoint = (int(video_resolution[0]/2),
                  int(video_resolution[1]/2))
video_asp_ratio  = video_resolution[0] / video_resolution[1]
video_viewangle_hor = math.radians(25)

# Set scaling factor for robot movement
m_per_pixel = 00.00001

# Set size of the robot view-window
max_x = 0.05
max_y = 0.05

# Set maximum rotation of the robot at the edge of the view window
hor_rot_max = math.radians(20)
vert_rot_max = math.radians(25)

# Initialize video stream
vs = VideoStream(src= 0,
                 usePiCamera= False,
                 resolution=video_resolution,
                 framerate = 13,
                 meter_mode = "backlit",
                 exposure_mode ="auto",
                 shutter_speed = 8900,
                 exposure_compensation = 2,
                 rotation = 0).start()
time.sleep(0.2)

# Function to find faces in an image using the pre-trained model
def find_faces_dnn(image):
    frame = image
    frame = imutils.resize(frame, width= video_resolution[0])

    # grab the frame dimensions and convert it to a blob
    (h, w) = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0,
                                 (300, 300), (104.0, 177.0, 123.0))

    # pass the blob through the network and obtain the detections and predictions
    pretrained_model.setInput(blob)

    # the following line handles the actual face detection
    # it is the most computationally intensive part of the entire program
    # TODO: find a quicker face detection model
    detections = pretrained_model.forward()
    face_centers = []
    # loop over the detections
    for i in range(0, detections.shape[2]):
        # extract the confidence (i.e., probability) associated with the prediction
        confidence = detections[0, 0, i, 2]

        # filter out weak detections by ensuring the `confidence` is
        # greater than the minimum confidence
        if confidence < 0.4:
            continue

        # compute the (x, y)-coordinates of the bounding box for the object
        box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
        (startX, startY, endX, endY) = box.astype("int")


        # draw the bounding box of the face along with the associated probability
        text = "{:.2f}%".format(confidence * 100)
        y = startY - 10 if startY - 10 > 10 else startY + 10

        face_center = (int(startX + (endX - startX) / 2), int(startY + (endY - startY) / 2))
        position_from_center = (face_center[0] - video_midpoint[0], face_center[1] - video_midpoint[1])
        face_centers.append(position_from_center)

        cv2.rectangle(frame, (startX, startY), (endX, endY),
                      (0, 0, 255), 2)
        cv2.putText(frame, text, (startX, y),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)
        #cv2.putText(frame, str(position_from_center), face_center, 0, 1, (0, 200, 0))
        cv2.line(frame, video_midpoint, face_center, (0, 200, 0), 5)
        cv2.circle(frame, face_center, 4, (0, 200, 0), 3)

    return face_centers, frame

# Function to display the frame with detected faces
def show_frame(frame):
    cv2.imshow('RobotCamera', frame)
    k = cv2.waitKey(6) & 0xff

# Function to check if the robot movement is within the max_x and max_y limits
def check_max_xy(xy_coord):
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

# Function to set the origin of the robot's lookplane
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

# Function to move the robot to the position of the detected face
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



# initialise robot with URBasic
print("initialising robot")
robotModel = URBasic.robotModel.RobotModel()
robot = URBasic.urScriptExt.UrScriptExt(host=ROBOT_IP,robotModel=robotModel)

# Reset robot errors and move it to the start position
robot.reset_error()
time.sleep(1)
robot.movej(q=robot_startposition, a= ACCELERATION, v= VELOCITY )

# Set robot's position and lookplane origin
robot_position = [0,0]
origin = set_lookorigin()

# Start robot's realtime control
robot.init_realtime_control()
time.sleep(1)

# Main face tracking loop
try:
    while True:
        frame = vs.read()
        face_positions, new_frame = find_faces_dnn(frame)
        show_frame(new_frame)

        # If faces are detected, move the robot towards the detected face
        if len(face_positions) > 0:
            robot_position = move_to_face(face_positions, robot_position)

    print("exiting loop")

# If the user presses Ctrl+C, close the robot connection
except KeyboardInterrupt:
    print("closing robot connection")
    robot.close()

# If any other exception occurs, close the robot connection
except:
    robot.close()
