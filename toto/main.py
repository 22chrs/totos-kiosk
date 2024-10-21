# main.py

from websocket.websocket import websocket_main, send_message
from URBasic.roboClass import RoboClass
import asyncio

ROBOT_IP = '192.168.1.124'
ACCELERATION = 0.3  # Robot acceleration value
VELOCITY = 0.5  # Robot speed value

# Initialize the robot control
toto = RoboClass(ip=ROBOT_IP, acceleration=ACCELERATION, velocity=VELOCITY)

if __name__ == '__main__':
    toto.sendScript('01_move')
    toto.sendScript('02_move_back')

    #loop = asyncio.get_event_loop()
    #loop.create_task(websocket_main())
    #loop.run_forever()

