from robot.robotControl import robotControl
from robot import URBasic


ROBOT_IP = '192.168.178.83'
ACCELERATION = 0.3  # Robot acceleration value
VELOCITY = 0.5  # Robot speed value
robot_startposition = [...]  # Define the start position

# Initialize RobotControl
robot_control = robotControl(ROBOT_IP, ACCELERATION, VELOCITY)

# Send script
if __name__ == '__main__':
    robot_control.send_script('test')