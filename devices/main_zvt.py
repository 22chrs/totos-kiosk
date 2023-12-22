# main_zvt.py

from pynput.keyboard import Key, Listener
from payment.payment_lib import PaymentTerminal

# Create a PaymentTerminal instance with the IP address
paymentTerminalFront = PaymentTerminal("192.168.188.21")

def on_press(key):
    try:
        if key.char == '1':
            print("Initiating payment...")
            result = paymentTerminalFront.auth_payment(111)
            print(f"Payment result: {result}")
        elif key.char == '2':
            print("Initiating payment reversal...")
            result = paymentTerminalFront.reversal_payment_debug("0056")
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

print("Press '1' to initiate a 1 Euro payment, '2' for payment reversal (Belegnummer 44), or 'esc' to exit.")
with Listener(on_press=on_press, on_release=on_release) as listener:
    listener.join()
