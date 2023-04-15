import URBasic
import time
import threading

ROBOT_IP = "192.168.178.83"
ACCELERATION = 0.3  # Robot acceleration value
VELOCITY = 0.5  # Robot speed value

# Init URBasic
robotModel = URBasic.robotModel.RobotModel()
robot = URBasic.urScriptExt.UrScriptExt(host=ROBOT_IP, robotModel=robotModel)

# Create an instance of RealTimeClient
#robotModel.rt_interface = ROBOT_IP
#real_time_client = URBasic.realTimeClient.RealTimeClient(robotModel)


if __name__ == '__main__':
    robot.hello()
    #robot.sendScript('test')
