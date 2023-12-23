# main_zvt.py

from pynput.keyboard import Key, Listener
from payment.payment_lib import PaymentTerminal

import schedule
import time
import threading

# Create a PaymentTerminal instance with the IP address
paymentTerminalFront = PaymentTerminal("192.168.188.21")

def on_press(key):
    try:
        if key.char == '1':
            print("Initiating payment...")
            result = paymentTerminalFront.book_total("63", 1)
            print(f"Payment result: {result}")
        elif key.char == '2':
            print("Initiating payment reversal...")
            result = paymentTerminalFront.reservation_payment_debug(255)
            print(f"Payment reversal result: {result}")
        elif key.char == '3':
            print("Test ...")
            paymentTerminalFront.configuration()
        elif key.char == '4':
            print("Displaying 'Hej Toto' on terminal...")
            paymentTerminalFront.display_text(13, "Hej Toto")  # Display 'Hello World' for 3 seconds
    except AttributeError:
        pass

def on_release(key):
    if key == Key.esc:
        return False

def start_listener():
    with Listener(on_press=on_press, on_release=on_release) as listener:
        listener.join()

def job():
    paymentTerminalFront.endOfDay_uploadReceipts()

# Set up the scheduler job
schedule.every().day.at("23:59").do(job)

# Start the keyboard listener in a separate thread
listener_thread = threading.Thread(target=start_listener)
listener_thread.start()

# Run the scheduler in the main thread
while True:
    schedule.run_pending()
    time.sleep(1)



# cam
# feig
# feig
# robo
# pc

# internet