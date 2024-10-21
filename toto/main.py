# main.py

import socket
from websocket.websocket import websocket_main, send_message
from URBasic.roboClass import RoboClass
import asyncio
import time

ROBOT_IP = '192.168.1.124'
ACCELERATION = 0.3  # Robot acceleration value
VELOCITY = 0.5  # Robot speed value

# Initialize the robot control
toto = RoboClass(ip=ROBOT_IP, acceleration=ACCELERATION, velocity=VELOCITY)

# RS485 communication settings
RS485_HOST = '192.168.1.124'  # Replace 'robot_ip' with your actual robot's IP address for RS485 communication
RS485_PORT = 54321  # Specified default port in URCaps code

def send_rs485_message():
    try:
        print("Creating socket...")
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        print(f"Socket created. Attempting to connect to {RS485_HOST}:{RS485_PORT}...")
        
        s.connect((RS485_HOST, RS485_PORT))
        print(f"Successfully connected to {RS485_HOST}:{RS485_PORT}")
        
        message = b'Hello rs485 port from ash'
        print(f"Sending message: {message}")
        s.sendall(message)
        
        print("Message sent. Waiting for response...")
        data = s.recv(1024)
        print(f"Received data: {repr(data)}")
        
        s.close()
        print("Socket closed.")
        
    except Exception as e:
        print(f"Error sending RS485 message: {e}")

if __name__ == '__main__':
    # time.sleep(2) 
    print("Sending scripts.")
    
    # success = toto.sendScript('01_move')
    # if success:  # Fixed the typo here
    #     print("123")
    
    # toto.sendScript('02_move_back')

    # Send RS485 message
    send_rs485_message()

    # Uncomment if you want to run websocket in the same script
    # loop = asyncio.get_event_loop()
    # loop.create_task(websocket_main())
    # loop.run_forever()