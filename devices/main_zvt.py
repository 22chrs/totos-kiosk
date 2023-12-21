# main_zvt.py

from pynput.keyboard import Key, Listener
from payment.payment_lib import PaymentTerminal

# Create a PaymentTerminal instance with the IP address
paymentTerminalFront = PaymentTerminal("192.168.188.21")

def on_press(key):
    try:
        if key.char == '1':
            print("Initiating a 1 Euro payment...")
            result = paymentTerminalFront.auth_payment(255)
            print(f"Payment result: {result}")
    except AttributeError:
        pass

def on_release(key):
    if key == Key.esc:
        return False

print("Press '1' to initiate a 1 Euro payment, or 'esc' to exit.")
with Listener(on_press=on_press, on_release=on_release) as listener:
    listener.join()
