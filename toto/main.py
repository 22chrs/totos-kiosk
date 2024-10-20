import URBasic
import threading
from websocket.websocket import websocket_main, send_message
import asyncio

ROBOT_IP = '192.168.1.124'
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
    #sendScript('01_move')
    sendScript('02_move_back')

    loop = asyncio.get_event_loop()
    loop.create_task(websocket_main())
    loop.run_forever()

