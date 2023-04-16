import URBasic
import threading
import time

class TestClass():
    def __init__(self, ip, acceleration, velocity, startposition):
        # Set acceleration
        self.acceleration = acceleration
        self.velocity = velocity
        self.startposition = startposition

        # Init URBasic
        self.robotModel = URBasic.robotModel.RobotModel()
        self.robot = URBasic.urScriptExt.UrScriptExt(host=ip, robotModel=self.robotModel)

        # Create an instance of RealTimeClient
        self.robotModel.rt_interface = ip
        self.real_time_client = URBasic.realTimeClient.RealTimeClient(self.robotModel)
        
        print("Robot initialisation successful.")

        # RealTimeClient
        #realTimeClient = URBasic.realTimeClient.RealTimeClient(robotModel)
        time.sleep(1)
        
        print("Robot initialisation successful.")
    


    def sendScript(self, programName):
        # Load the script file
        with open(f'./scripts/{programName}.script', 'r') as file:
            script = file.read()
        # Send the script
        self.real_time_client.SendProgram(script)
        print("script sent")


    def stopScript(self):
        # Generate a script to stop the robot smoothly
        stop_script = "stopj({})".format(self.acceleration)
        # Send the stop script
        self.real_time_client.SendProgram(stop_script)
        print("Stop script sent")