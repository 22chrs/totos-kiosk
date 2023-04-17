import URBasic
import threading
import time

class RoboClass():
    def __init__(self, ip, acceleration, velocity):
        # Initialisation of variables
        self.acceleration = acceleration
        self.velocity = velocity

        # Initialisation of Robot Model
        self.robotModel = URBasic.robotModel.RobotModel()
        self.robot = URBasic.urScriptExt.UrScriptExt(host=ip, robotModel=self.robotModel)

        self.robotDash = URBasic.dashboard.DashBoard(robotModel=self.robotModel)

        # Creating instance of RealTimeClient (for sending script files)
        self.robotModel.rt_interface = ip
        self.real_time_client = URBasic.realTimeClient.RealTimeClient(self.robotModel)
        
        # Power of robot and reset errors
        #self.robot.print_actual_tcp_pose
        self.robot.init_realtime_control()
        time.sleep(1)
        self.robot.reset_error()
        #self.robot.waitRobotIdleOrStopFlag()
        time.sleep(1)
        print("Init testClass done.")



    # def stopPose(self, pose):
    #     print("stopPose sent")
    #     self.robot.set_realtime_pose(pose)

    def movej(self, pose):
        print("movej sent")
        self.robot.movej(pose)

    def stopj(self, a):
        print("stopPose")
        self.robot.stopj(a)

    def _sendScript_notWaiting(self, programName):
        # Load the script file
        with open(f'./scripts/{programName}.script', 'r') as file:
            script = file.read()
        # Send the script
        self.real_time_client.SendProgram(script)
        print("script sent")

    def _sendScript_blocking(self, programName):
        self._sendScript_notWaiting(programName)
        self.real_time_client.wait_for_program_finish()
        print("script finished")

    def sendScript(self, programName):
        script_thread = threading.Thread(target=self._sendScript_blocking, args=(programName,))
        script_thread.start()

    def stopScript(self):
        # Generate a script to stop the robot smoothly
        stop_script = "stopj({})".format(self.acceleration)
        # Send the stop script
        self.real_time_client.SendProgram(stop_script)
        print("Stop script sent")

    def powerOn(self):
        self.robot.reset_error()
        time.sleep(1)
        print("Hej Toto!")

    def powerOff(self):
        self.robotDash.ur_shutdown()
        print("Sleep well.")