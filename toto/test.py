import URBasic
import time

ROBOT_IP = "192.168.8.124"
ACCELERATION = 0.3  # Robot acceleration value
VELOCITY = 0.5  # Robot speed value


# Init URBasic
robotModel = URBasic.robotModel.RobotModel()
robot = URBasic.urScriptExt.UrScriptExt(host=ROBOT_IP, robotModel=robotModel)

# Create an instance of RealTimeClient
robotModel.rt_interface = ROBOT_IP
real_time_client = URBasic.realTimeClient.RealTimeClient(robotModel)




def sendScript(programName):
    # Load the script file
    with open(f'./scripts/{programName}.script', 'r') as file:
        script = file.read()
    # Send the script
    real_time_client.SendProgram(script)
    print("script sent")


def stopScript():
    # Generate a script to stop the robot smoothly
    stop_script = "stopj({})".format(ACCELERATION)
    # Send the stop script
    real_time_client.SendProgram(stop_script)
    print("Stop script sent")


if __name__ == '__main__':
    sendScript('test')
    time.sleep(5)
    stopScript()