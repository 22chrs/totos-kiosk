# example to send a basic ur script file

# UPDATE in realTimeClient.py 
# we added this function at the end of the realTimeClient.py
# def wait_for_program_finish(self):
#         if self.__thread is not None:
#             self.__thread.join()

import URBasic
import threading
import time


# Init URBasic
#robotModel = URBasic.robotModel.RobotModel()
#robot = URBasic.urScriptExt.UrScriptExt(host=ROBOT_IP, robotModel=robotModel)

# Create an instance of RealTimeClient
#robotModel.rt_interface = ROBOT_IP
#real_time_client = URBasic.realTimeClient.RealTimeClient(robotModel)

class ScriptFiles():
    def __init__(self, ip="ROBOT_IP", acceleration="ACCELERATION", velocity="VELOCITY", startpostion="STARTPOSITION"):
        # RobotModel
        robotModel = URBasic.robotModel.RobotModel()
        robotModel.rt_interface = ip

        # UrScriptExt
        #urScriptExt = URBasic.urScriptExt.UrScriptExt(host=ip, robotModel=robotModel)
        # Reset robot errors and move it to the start position
        #urScriptExt.reset_error()
        #time.sleep(1)
        #urScriptExt.movej(q=startpostion, a=acceleration, v=velocity)
        
        # RealTimeClient
        realTimeClient = URBasic.realTimeClient.RealTimeClient(robotModel)
        realTimeClient.init_realtime_control()
        time.sleep(1)
        
        print("Robot initialisation successful.")
    
    def send(self, program_name):
        with open(f'./scripts/{program_name}.script', 'r') as file:
            script = file.read()
        self.realTimeClient.SendProgram(script)
        print("script send")

    def sendScriptFile_blocking(self, program_name):
        with open(f'./scripts/{program_name}.script', 'r') as file:
            script = file.read()
        self.realTimeClient.SendProgram(script)
        print("script started")
        self.realTimeClient.wait_for_program_finish()
        print("script finished")
        
    def sendScriptFile(self, program_name):
        script_thread = threading.Thread(target=self.sendScriptFile_blocking, args=(program_name,))
        script_thread.start()

    def sendHello(self, program_name):
        script_thread = threading.Thread(target=self.hello, args=(program_name,))
        script_thread.start()
    
    def hello(self, program_name):
        print(f"script {program_name}")
