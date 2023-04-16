# main.py (toto)

from websocket.websocket import websocket_main, send_message
import asyncio
from URBasic import ScriptFiles
import math
from URBasic import TestClass

ROBOT_IP = "192.168.8.124"
ACCELERATION = 0.3  # Robot acceleration value
VELOCITY = 0.5  # Robot speed value
STARTPOSITION = (math.radians(-218),
                    math.radians(-63),
                    math.radians(-93),
                    math.radians(-20),
                    math.radians(88),
                    math.radians(0))

# Entry point for the script
if __name__ == '__main__':
    # Create an instances of classes
    loop = asyncio.get_event_loop()
    toto = TestClass(ip=ROBOT_IP, acceleration= ACCELERATION, velocity= VELOCITY, startposition= STARTPOSITION)

    # toto.init()
    # toto.urScriptExt.movej(q=STARTPOSITION, a=ACCELERATION, v=VELOCITY)
    
    # # Call the sendHello method on the instance
    # toto.sendHello('Oooooooooooooooo')
    toto.sendScript('test')

    async def send_periodically():
        while True:
            await asyncio.sleep(25)
            #await send_message("kiosk", "Hallo Kiosk! (by toto)")
            #await send_message("orchester", "Hallo Orchester! (by toto)")
 
    #loop.create_task(websocket_main())
    loop.create_task(send_periodically())
    loop.run_forever()
