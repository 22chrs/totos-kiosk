# main.py (toto)
# ToDo: GCode senden, hier relative Korrekturkoordinaten senden können
# ToDo: Live Toto Programm starten -> Abbruch und ohne zu stoppen zu eine Stop Positionfahren und melden sobald Stillstans
# ToDo: wait (und report) wenn der Robo noch startet
# ToDo: Packete die noch gesendent werden verstehen
# ToDo: Facetracking mit Kamera statisch
# ToDo: Connection Close and reopen?
# ToDo: fixed IPAdresse am Router oder besser via Bonjour

from websocket.websocket import websocket_main, send_message
import asyncio
import math
import time
from URBasic import RoboClass

ROBOT_IP = '192.168.1.124'
# Fritz!box: 192.168.178.83
# MAC ADDRESS: 00:30:D6:21:C5:F4
ACCELERATION = 0.3  # Robot acceleration value
VELOCITY = 0.5  # Robot speed value

poseHome = (math.radians(0),
                    math.radians(-90),
                    math.radians(0),
                    math.radians(0),
                    math.radians(90),
                    math.radians(0))

pose2 = (math.radians(-218),
                    math.radians(-63),
                    math.radians(-93),
                    math.radians(-20),
                    math.radians(88),
                    math.radians(0))


# Entry point for the script
if __name__ == '__main__':
    # Create an instances of classes
    loop = asyncio.get_event_loop()
    
    toto = RoboClass(ip=ROBOT_IP, acceleration= ACCELERATION, velocity= VELOCITY)
    #toto.sendScript('test')
    #toto.movej(poseHome)
    #time.sleep(2)
    #toto.stopj(2)
    toto.powerOff()


    async def send_periodically():
        while True:
            await asyncio.sleep(5)
            #(poseHome)
            #await send_message("kiosk", "Hallo Kiosk! (by toto)")
            #await send_message("orchester", "Hallo Orchester! (by toto)")
 
    #loop.create_task(websocket_main())
    loop.create_task(send_periodically())
    loop.run_forever()
