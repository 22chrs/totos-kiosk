# RoboClass.py

import URBasic
import time

class RoboClass():
    def __init__(self, ip, acceleration, velocity):
        # Initialization of variables
        self.acceleration = acceleration
        self.velocity = velocity

        # Initialization of Robot Model
        self.robotModel = URBasic.robotModel.RobotModel()
        self.robot = URBasic.urScriptExt.UrScriptExt(host=ip, robotModel=self.robotModel)

        self.robotDash = URBasic.dashboard.DashBoard(robotModel=self.robotModel)

        # Creating instance of RealTimeClient (for sending script files)
        self.robotModel.rt_interface = ip
        self.real_time_client = URBasic.realTimeClient.RealTimeClient(self.robotModel)
        
        # Power on robot and reset errors
        self.robot.init_realtime_control()
        time.sleep(1)
        self.robot.reset_error()
        time.sleep(1)
        print("Initialization of RoboClass is complete.")

    def movej(self, pose):
        print("Executing movej command.")
        self.robot.movej(pose)

    def stopj(self, a):
        print("Executing stopj command.")
        self.robot.stopj(a)

    def sendScript(self, programName):
        '''
        Enqueue a script to be sent to the robot. Scripts are executed in the order they are received.
        If a script is already running, the new script is queued and executed after the current one finishes.
        This function blocks until the script execution is completed and returns True.
        '''
        print(f"Enqueuing script '{programName}' for execution.")
        success = self.real_time_client.sendScriptwithLineup(programName)
        if success:
            print(f"Script '{programName}' executed successfully.")
        else:
            print(f"Script '{programName}' failed to execute.")
        return success

    def stopScript(self):
        # Generate a script to stop the robot smoothly
        stop_script = "stopj({})".format(self.acceleration)
        # Send the stop script
        self.real_time_client.SendProgram(stop_script)
        print("Stop script sent to the robot.")

    def powerOn(self):
        self.robot.reset_error()
        time.sleep(1)
        print("Robot powered on and errors reset.")

    def powerOff(self):
        self.robotDash.ur_shutdown()
        print("Robot is shutting down.")
        # Gracefully disconnect
        self.real_time_client.Disconnect()
        print("Disconnected from the robot gracefully.")