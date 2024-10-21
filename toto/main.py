# main.py

import socket
from websocket.websocket import websocket_main, send_message
from URBasic.roboClass import RoboClass
import threading
import time

ROBOT_IP = '192.168.1.124'
ACCELERATION = 0.3  # Robot acceleration value
VELOCITY = 0.5      # Robot speed value

# Initialize the robot control
toto = RoboClass(ip=ROBOT_IP, acceleration=ACCELERATION, velocity=VELOCITY)

# RS485 communication settings
RS485_HOST = '192.168.1.124'  # Replace with your actual robot's IP address for RS485 communication
RS485_PORT = 54321             # Specified default port in URCaps code

def establish_connection():
    """Establishes a persistent socket connection."""
    try:
        print("Creating socket...")
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        print(f"Socket created. Attempting to connect to {RS485_HOST}:{RS485_PORT}...")
        s.connect((RS485_HOST, RS485_PORT))
        print(f"Successfully connected to {RS485_HOST}:{RS485_PORT}")
        return s
    except Exception as e:
        print(f"Error establishing RS485 connection: {e}")
        return None

def listen_rs485(s):
    """Continuously listens for incoming data and prints it."""
    try:
        while True:
            data = s.recv(1024)
            if not data:
                print("No data received. Connection might be closed.")
                break
            print(f"Received data: {data.decode('utf-8')}")
    except Exception as e:
        print(f"Error in listening thread: {e}")
    finally:
        s.close()
        print("Listening thread closed the socket.")

def send_rs485_periodically(s, interval=5):
    """Sends a message every 'interval' seconds."""
    try:
        while True:
            message = 'Hello rs485 port from ash'
            print(f"Sending message: {message}")
            s.sendall(message.encode('utf-8'))
            time.sleep(interval)
    except Exception as e:
        print(f"Error in sending thread: {e}")
    finally:
        s.close()
        print("Sending thread closed the socket.")

if __name__ == '__main__':
    print("Initializing scripts...")
    
    # Example of sending robot scripts (currently commented out)
    # success = toto.sendScript('01_move')
    # if success:
    #     print("Script '01_move' sent successfully.")
    # toto.sendScript('02_move_back')
    
    # Establish RS485 connection
    sock = establish_connection()
    if sock:
        # Start listener thread
        listener = threading.Thread(target=listen_rs485, args=(sock,), daemon=True)
        listener.start()
        print("Started listening thread.")
        
        # Start sender thread
        sender = threading.Thread(target=send_rs485_periodically, args=(sock, 5), daemon=True)
        sender.start()
        print("Started sending thread.")
        
        # Keep the main thread alive to let background threads run
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("Interrupted by user. Closing connections.")
            sock.close()