# main.py

import URBasic
import time
import threading
import math

class robotControl:
    def __init__(self, ip, acceleration, velocity):
        self.robot_ip = ip
        self.acceleration = acceleration
        self.velocity = velocity
        self.robot_model = URBasic.robotModel.RobotModel()
        self.robot = URBasic.urScriptExt.UrScriptExt(host=self.robot_ip, robotModel=self.robot_model)
        self.robot_model.rt_interface = self.robot_ip
        self.real_time_client = URBasic.realTimeClient.RealTimeClient(self.robot_model)
        
    def reset_and_move_to_start(self, start_position):
        self.robot.reset_error()
        time.sleep(1)
        self.robot.movej(q=start_position, a=self.acceleration, v=self.velocity)
        
    def init_realtime_control(self):
        self.robot.init_realtime_control()
        time.sleep(1)

    def send_script_blocking(self, program_name):
        with open(f'./scripts/{program_name}.script', 'r') as file:
            script = file.read()
        self.real_time_client.SendProgram(script)
        print("script started")
        self.real_time_client.wait_for_program_finish()
        print("script finished")
        
    def send_script(self, program_name):
        script_thread = threading.Thread(target=self.send_script_blocking, args=(program_name,))
        script_thread.start()


