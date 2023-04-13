import urx
import time

ROBOT_IP = "192.168.178.83"  # Replace with the UR3e's IP address

def main():
    # Connect to the robot
    robot = urx.Robot(ROBOT_IP)

    # Add your robot control code here
    # Example: Move the robot
    target_pose = [0, 0, 0, 0, 0, 0]
    robot.movej(target_pose, 0.2, 0.2)

    #target_pose = [0, 0, , 0, 3.14, 0]
    #robot.movej(target_pose, 0.2, 0.2)

    # Close the connection
    robot.close()

if __name__ == '__main__':
    main()
