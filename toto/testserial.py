import serial
import serial.rs485
import time
import logging
import sys
import threading

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

# RS485 configuration
RS485_PORT = '/dev/tty.usbmodem586D0047721'  # Replace with your actual port
BAUD_RATE = 9600  # Ensure this matches your RS485 device's baud rate

def configure_rs485():
    try:
        # Initialize RS485 with appropriate settings
        ser = serial.rs485.RS485(
            port=RS485_PORT,
            baudrate=BAUD_RATE,
            bytesize=serial.EIGHTBITS,
            parity=serial.PARITY_NONE,
            stopbits=serial.STOPBITS_ONE,
            timeout=1,            # Timeout for read operations in seconds
            dsrdtr=False,         # Disable hardware flow control
            rtscts=False,         # Disable hardware flow control
            xonxoff=False         # Disable software flow control
        )

        # Configure RS485 mode
        ser.rs485_mode = serial.rs485.RS485Settings(
            rts_level_for_tx=True,    # RTS high for transmission
            rts_level_for_rx=False,   # RTS low for reception
            delay_before_tx=0,
            delay_before_rx=0
        )

        logging.info(f"Opened RS485 port: {RS485_PORT} at baud rate: {BAUD_RATE}")
        return ser

    except serial.SerialException as e:
        logging.error(f"SerialException during RS485 configuration: {e}")
        sys.exit(1)
    except Exception as e:
        logging.error(f"Unexpected error during RS485 configuration: {e}")
        sys.exit(1)

def listen_serial(ser):
    try:
        while True:
            if ser.in_waiting:
                data = ser.read(ser.in_waiting)
                try:
                    decoded_data = data.decode('utf-8')
                    logging.info(f"Received: {decoded_data}")
                except UnicodeDecodeError:
                    logging.warning(f"Received undecodable bytes: {data}")
            time.sleep(0.1)  # Adjust the sleep duration as needed
    except serial.SerialException as e:
        logging.error(f"SerialException during listening: {e}")
    except Exception as e:
        logging.error(f"Unexpected error during listening: {e}")

def send_message_periodically(ser, interval=5):
    try:
        while True:
            message = b'Hello RS485'
            try:
                decoded_message = message.decode('utf-8')
                logging.info(f"Sending message: {decoded_message}")
            except UnicodeDecodeError:
                logging.warning(f"Sending undecodable bytes: {message}")
            ser.write(message)
            time.sleep(interval)  # Send message every 'interval' seconds
    except serial.SerialException as e:
        logging.error(f"SerialException during sending: {e}")
    except Exception as e:
        logging.error(f"Unexpected error during sending: {e}")

def main():
    ser = configure_rs485()

    # Allow some time for the serial port to initialize
    time.sleep(2)

    # Start a thread to listen for incoming data
    listener_thread = threading.Thread(target=listen_serial, args=(ser,), daemon=True)
    listener_thread.start()
    logging.debug("Started listener thread.")

    # Start sending messages periodically in the main thread
    try:
        send_message_periodically(ser, interval=3)
    except KeyboardInterrupt:
        logging.info("Interrupted by user. Exiting...")
    finally:
        ser.close()
        logging.info("Serial connection closed.")

if __name__ == '__main__':
    main()