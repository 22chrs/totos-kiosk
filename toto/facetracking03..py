"""
Face_tracking01
Python program for realtime face tracking of a Universal Robot (tested with UR5cb)

Created by Robin Godwyll
License: GPL v3 https://www.gnu.org/licenses/gpl-3.0.en.html
"""

import URBasic
import math
import numpy as np
import cv2
import time
import math3d as m3d

"""SETTINGS AND VARIABLES ________________________________________________________________"""

ROBOT_IP = '192.168.1.124'
ACCELERATION = 0.4  # Robot acceleration value
VELOCITY = 0.3  # Robot speed value

# The Joint position the robot starts at
robot_startposition = (math.radians(-218),
                    math.radians(-63),
                    math.radians(-93),
                    math.radians(-20),
                    math.radians(88),
                    math.radians(0))

# Use OpenCV's built-in DNN face detector model
face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

video_resolution = (320, 240)  # resolution the video capture will be resized to, smaller sizes can speed up detection
video_midpoint = (int(video_resolution[0]/2), int(video_resolution[1]/2))
video_viewangle_hor = math.radians(30)  # Camera FOV (field of view) angle in radians in the horizontal direction

# Variable which scales the robot movement from pixels to meters.
m_per_pixel = 0.00001  

# Size of the robot view-window
max_x = 0.2
max_y = 0.2

# Maximum Rotation of the robot at the edge of the view window
hor_rot_max = math.radians(20)
vert_rot_max = math.radians(20)

# Video stream URL
stream_url = 'http://192.168.1.158:81/stream'

"""FUNCTIONS _____________________________________________________________________________"""

def find_faces(image):
    """
    Finds human faces in the frame captured by the camera and returns the positions
    uses the pretrained model located at pretrained_model

    Input:
        image: frame captured by the camera

    Return Values:
        face_centers: list of center positions of all detected faces
            list of lists with 2 values (x and y)
        frame: new frame resized with boxes drawn around all faces
    """
    frame = cv2.resize(image, video_resolution)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    face_centers = []
    for (x, y, w, h) in faces:
        face_center = (int(x + w / 2), int(y + h / 2))
        position_from_center = (face_center[0] - video_midpoint[0], face_center[1] - video_midpoint[1])
        face_centers.append(position_from_center)
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.line(frame, video_midpoint, face_center, (0, 200, 0), 2)
        cv2.circle(frame, face_center, 4, (0, 200, 0), -1)
    return face_centers, frame

def show_frame(frame):
    cv2.imshow('RobotCamera', frame)
    cv2.waitKey(6)

def check_max_xy(xy_coord):
    """
    Checks if the face is outside of the predefined maximum values on the lookaround plane

    Inputs:
        xy_coord: list of 2 values: x and y value of the face in the lookaround plane.
            These values will be evaluated against max_x and max_y

    Return Value:
        x_y: new x and y values
            if the values were within the maximum values (max_x and max_y) these are the same as the input.
            if one or both of the input values were over the maximum, the maximum will be returned instead
    """
    x_y = [0, 0]
    x_y[0] = max(min(xy_coord[0], max_x), -max_x)
    x_y[1] = max(min(xy_coord[1], max_y), -max_y)
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

def move_to_face(list_of_facepos, robot_pos):
    """
    Function that moves the robot to the position of the face

    Inputs:
        list_of_facepos: a list of face positions captured by the camera, only the first face will be used
        robot_pos: position of the robot in 2D - coordinates

    Return Value:
        prev_robot_pos: 2D robot position the robot will move to. The basis for the next call to this function as robot_pos
    """
    face_from_center = list(list_of_facepos[0])
    prev_robot_pos = robot_pos
    scaled_face_pos = [-face_from_center[0] * m_per_pixel, face_from_center[1] * m_per_pixel]
    robot_target_xy = [a + b for a, b in zip(prev_robot_pos, scaled_face_pos)]
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
robot = URBasic.urScriptExt.UrScriptExt(host=ROBOT_IP, robotModel=robotModel)

robot.reset_error()
print("robot initialised")
time.sleep(1)

# Move Robot to the midpoint of the lookplane
robot.movej(q=robot_startposition, a=ACCELERATION, v=VELOCITY)

robot_position = [0, 0]
origin = set_lookorigin()

robot.init_realtime_control()  # starts the realtime control loop on the Universal-Robot Controller
time.sleep(1)  # just a short wait to make sure everything is initialised

try:
    print("starting loop")
    cap = cv2.VideoCapture(stream_url)
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            break

        face_positions, new_frame = find_faces(frame)
        show_frame(new_frame)
        if len(face_positions) > 0:
            robot_position = move_to_face(face_positions, robot_position)

except KeyboardInterrupt:
    print("closing robot connection")
    robot.close()

finally:
    cap.release()
    cv2.destroyAllWindows()
    robot.close()
