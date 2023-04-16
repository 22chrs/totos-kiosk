import URBasic
import time

# ROBOT_IP = "192.168.8.124"
# ACCELERATION = 0.3  # Robot acceleration value
# VELOCITY = 0.5  # Robot speed value




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