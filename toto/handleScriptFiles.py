# example to send a basic ur script file

# UPDATE in realTimeClient.py 
# we added this function at the end of the realTimeClient.py
# def wait_for_program_finish(self):
#         if self.__thread is not None:
#             self.__thread.join()


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
robotModel.rt_interface = ROBOT_IP
real_time_client = URBasic.realTimeClient.RealTimeClient(robotModel)


def sendScript_blocking(programName):
    # Load the script file
    with open(f'./scripts/{programName}.script', 'r') as file:
        script = file.read()
    # Send the script
    real_time_client.SendProgram(script)
    print("script started")
    real_time_client.wait_for_program_finish()
    print("script finished")

def sendScript(programName):
    script_thread = threading.Thread(target=sendScript_blocking, args=(programName,))
    script_thread.start()

if __name__ == '__main__':
    sendScript('test')
