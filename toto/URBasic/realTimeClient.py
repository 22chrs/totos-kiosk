# realTimeClient.py

'''
Python 3.x library to control an UR robot through its TCP/IP interfaces
Copyright (C) 2017  Martin Huus Bjerge, Rope Robotics ApS, Denmark

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, 
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software 
is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies 
or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL "Rope Robotics ApS" BE LIABLE FOR ANY CLAIM, 
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Except as contained in this notice, the name of "Rope Robotics ApS" shall not be used 
in advertising or otherwise to promote the sale, use or other dealings in this Software 
without prior written authorization from "Rope Robotics ApS".
'''
__author__ = "Martin Huus Bjerge"
__copyright__ = "Copyright 2017, Rope Robotics ApS, Denmark"
__license__ = "MIT License"

import URBasic
import socket
import threading
import select
import re
import numpy as np
import time
import queue

DEFAULT_TIMEOUT = 1.0

class ConnectionState:
    ERROR = 0
    DISCONNECTED = 1
    CONNECTED = 2
    PAUSED = 3
    STARTED = 4

class RealTimeClient(object):
    '''
    Interface to UR robot Real Time Client interface.
    For more detailes see this site:
    http://www.universal-robots.com/how-tos-and-faqs/how-to/ur-how-tos/remote-control-via-tcpip-16496/
    
    The Real Time Client in this version is only used to send program and script commands 
    to the robot, not to read data from the robot, all data reading is done via the RTDE interface.
    
    The constructor takes a UR robot hostname as input, and a RTDE configuration file.

    Input parameters:
    host (string):  hostname or IP of UR Robot (RT CLient server)
    conf_filename (string):  Path to xml file describing what channels to activate
    logger (URBasis_DataLogging obj): A instance if a logger object if common logging is needed.

    
    Example:
    rob = URBasic.realTimeClient.RT_CLient('192.168.56.101')
    self.close_rtc()
    '''


    def __init__(self, robotModel):
        '''
        Constructor see class description for more info.
        '''
        if(False):
            assert isinstance(robotModel, URBasic.robotModel.RobotModel)  ### This line is to get code completion for RobotModel
        self.__robotModel = robotModel

        logger = URBasic.dataLogging.DataLogging()
        name = logger.AddEventLogging(__name__, log2Consol=False,level = URBasic.logging.WARNING)
        self.__logger = logger.__dict__[name]
        self.__robotModel.rtcConnectionState = ConnectionState.DISCONNECTED
        self.__reconnectTimeout = 60
        self.__sock = None
        self.__thread = None
        if self.__connect():
            self.__logger.info('RT_CLient constructor done')
        else:
            self.__logger.info('RT_CLient constructor done but not connected')

        #! Initialize the script queue and worker thread 
        self.__init_new_code()
        
    def __connect(self):
        '''
        Initialize RT Client connection to host .
        
        Return value:
        success (boolean)
        
        Example:
        rob = URBasic.realTimeClient.RT_CLient('192.168.56.101')
        rob.connect()
        '''       
        if self.__sock:
            return True

        t0 = time.time()
        while (time.time()-t0<self.__reconnectTimeout) and self.__robotModel.rtcConnectionState < ConnectionState.CONNECTED:
            try:
                self.__sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)            
                self.__sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)         
                self.__sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                self.__sock.settimeout(DEFAULT_TIMEOUT)
                self.__sock.connect((self.__robotModel.ipAddress, 30003))
                self.__robotModel.rtcConnectionState = ConnectionState.CONNECTED
                time.sleep(0.5)
                self.__logger.info('Connected')
                return True
            except (socket.timeout, socket.error):
                self.__sock = None
                self.__logger.error('RTC connecting')

        return False
                

    def Disconnect(self):
        '''
        Disconnect the RT Client connection.
        '''        
        if self.__sock:
            self.__sock.close()
            self.__sock = None
            self.__logger.info('Disconnected')
        self.__robotModel.rtcConnectionState = ConnectionState.DISCONNECTED
        return True


    def IsRtcConnected(self):
        '''
        Returns True if the connection is open.

        Return value:
        status (boolean): True if connected and False of not connected.

        Example:
        rob = URBasic.realTimeClient.RT_CLient('192.168.56.101')
        rob.connect()
        print(rob.is_connected())
        rob.disconnect()
        '''
        return self.__robotModel.rtcConnectionState > ConnectionState.DISCONNECTED
        
    def SendProgram(self,prg=''):
        '''
        Send a new command or program (string) to the UR controller. 
        The command or program will be executed as soon as it's received by the UR controller. 
        Sending a new command or program while stop and existing running command or program and start the new one.
        The program or command will also bee modified to include some control signals to be used
        for monitoring if a program execution is successful and finished.  

        Input parameters:
        prg (string): A string containing a single command or a whole program.

        Example:
        rob = URBasic.realTimeClient.RT_CLient('192.168.56.101',logger=logger)
        rob.connect()
        rob.send_srt('set_digital_out(0, True)')
        rob.disconnect()        
        '''
        if not self.IsRtcConnected():
            if not self.__connect():
                self.__logger.error('SendProgram: Not connected to robot')
 
        if self.__robotModel.stopRunningFlag:
            self.__logger.info('SendProgram: Send program aborted due to stopRunningFlag')
            return
 
        #Close down previous thread 
        if self.__thread is not None:
            if self.__robotModel.rtcProgramRunning:
                self.__robotModel.stopRunningFlag = True
                while self.__robotModel.rtcProgramRunning: time.sleep(0.1)
                self.__robotModel.stopRunningFlag = False
            self.__thread.join()
            
        
        #Rest status bits
        self.__robotModel.rtcProgramRunning = True
        self.__robotModel.rtcProgramExecutionError = False
        
        #Send and wait from program
        self.__sendPrg(self.__AddStatusBit2Prog(prg))        
        self.__thread = threading.Thread(target=self.__waitForProgram2Finish, kwargs={'prg': prg})
        self.__thread.start()
        #self.__waitForProgram2Finish(prg)
            
    def Send(self,prg=''):
        '''
        Send a new command (string) to the UR controller. 
        The command or program will be executed as soon as it's received by the UR controller. 
        Sending a new command or program while stop and existing running command or program and start the new one.
        The program or command will also bee modified to include some control signals to be used
        for monitoring if a program execution is successful and finished.  

        Input parameters:
        prg (string): A string containing a single command or a whole program.


        Example:
        rob = URBasic.realTimeClient.RT_CLient('192.168.56.101',logger=logger)
        rob.connect()
        rob.send_srt('set_digital_out(0, True)')
        rob.disconnect()        
        '''
        if not self.IsRtcConnected():
            if not self.__connect():
                self.__logger.error('SendProgram: Not connected to robot')
        if self.__robotModel.stopRunningFlag:
            self.__logger.info('SendProgram: Send command aborted due to stopRunningFlag')
            return
    
        #Rest status bits
        self.__robotModel.rtcProgramRunning = True
        self.__robotModel.rtcProgramExecutionError = False
        
        #Send
        self.__sendPrg(prg)      
        self.__robotModel.rtcProgramRunning = False

    def __AddStatusBit2Prog(self,prg):
        '''
        Modifying program to include status bit's in beginning and end of program
        '''
        def1 = prg.find('def ')
        if def1>=0:
            prglen = len(prg)
            prg = prg.replace('):\n', '):\n  write_output_boolean_register(0, True)\n',1)
            if len(prg) == prglen:
                self.__logger.warning('Send_program: Syntax error in program')
                return False
                
            if (len(re.findall('def ', prg)))>1:
                mainprg = prg[0:prg[def1+4:].find('def ')+def1+4]
                mainPrgEnd = (np.max([mainprg.rfind('end '), mainprg.rfind('end\n')]))
                prg = prg.replace(prg[0:mainPrgEnd], prg[0:mainPrgEnd] + '\n  write_output_boolean_register(1, True)\n',1)
            else:
                mainPrgEnd = prg.rfind('end')
                prg = prg.replace(prg[0:mainPrgEnd], prg[0:mainPrgEnd] + '\n  write_output_boolean_register(1, True)\n',1)
                
        else:
            prg = 'def script():\n  write_output_boolean_register(0, True)\n  ' + prg + '\n  write_output_boolean_register(1, True)\nend\n'
        return prg
        
    def __sendPrg(self,prg):
        '''
        Sending program str via socket
        '''
        programSend = False      
        self.__robotModel.forceRemoteActiveFlag = False
        while not self.__robotModel.stopRunningFlag and not programSend:
            try:
                (_, writable, _) = select.select([], [self.__sock], [], DEFAULT_TIMEOUT)
                if len(writable):
                    self.__sock.send(prg.encode())
                    self.__logger.info('Program send to Robot:\n' + prg)
                    programSend = True
            except:
                self.__sock = None
                self.__robotModel.rtcConnectionState = ConnectionState.ERROR
                self.__logger.warning('Could not send program!')
                self.__connect()                
        if not programSend:
            self.__robotModel.rtcProgramRunning = False
            self.__logger.error('Program re-sending timed out - Could not send program!')
        time.sleep(0.1)


    def __waitForProgram2Finish(self,prg):
        '''
        waiting for program to finish
        '''
        waitForProgramStart = len(prg)/50
        notrun = 0
        prgRest = 'def resetRegister():\n  write_output_boolean_register(0, False)\n  write_output_boolean_register(1, False)\nend\n'
        while not self.__robotModel.stopRunningFlag and self.__robotModel.rtcProgramRunning:            
            if self.__robotModel.SafetyStatus().StoppedDueToSafety:
                self.__robotModel.rtcProgramRunning = False
                self.__robotModel.rtcProgramExecutionError = True
                self.__logger.error('SendProgram: Safety Stop')
            elif self.__robotModel.OutputBitRegister()[0] == False:
                self.__logger.debug('sendProgram: Program not started')
                notrun += 1
                if notrun > waitForProgramStart:
                    self.__robotModel.rtcProgramRunning = False
                    self.__logger.error('sendProgram: Program not able to run')
            elif self.__robotModel.OutputBitRegister()[0] == True and self.__robotModel.OutputBitRegister()[1] == True:
                self.__robotModel.rtcProgramRunning = False
                self.__logger.info('sendProgram: Finished')
            elif self.__robotModel.OutputBitRegister()[0] == True:
                if self.__robotModel.RobotStatus().ProgramRunning:
                    self.__logger.debug('sendProgram: UR running')
                    notrun = 0
                else:
                    notrun += 1
                    if notrun>10:
                        self.__robotModel.rtcProgramRunning = False
                        self.__robotModel.rtcProgramExecutionError = True
                        self.__logger.error('SendProgram: Program Stopped but not finiched!!!')    
            else:
                self.__robotModel.rtcProgramRunning = False
                self.__logger.error('SendProgram: Unknown error')
            time.sleep(0.05)
        self.__sendPrg(prgRest)
        self.__robotModel.rtcProgramRunning = False
    

### NEW CODE HERE:

    def __init_new_code(self):
        """
        Initialize the script queue and start the worker thread.
        This method is called from the existing __init__ method.
        """
        self.__script_queue = queue.Queue()
        self.__script_worker = threading.Thread(target=self.__process_script_queue, daemon=True)
        self.__script_worker.start()
        self.__logger.info('Script queue and worker thread initialized.')

    def __process_script_queue(self):
        """
        Worker thread method that processes scripts from the queue sequentially.
        Each item in the queue is a tuple of (programName, event).
        """
        while True:
            item = self.__script_queue.get()
            if item is None:
                # None is the signal to terminate the worker thread
                self.__logger.info('Worker thread received shutdown signal.')
                self.__script_queue.task_done()
                break
            programName, event = item
            self.__logger.info(f"Processing script: {programName}")
            self.sendScript_blocking(programName)
            self.__logger.info(f"Finished processing script: {programName}")
            event.set()  # Signal that the script has been processed

            # Add a small delay before processing the next script
            small_delay = 0.05  # Delay time in seconds
            self.__logger.info(f"Waiting for {small_delay} seconds before processing the next script.")
            time.sleep(small_delay)

            self.__script_queue.task_done()

    def sendScriptwithLineup(self, programName):
        '''
        Enqueue a script to be sent to the robot. Scripts are executed in the order they are received.
        If a script is already running, the new script is queued and executed after the current one finishes.
        This function blocks until the script execution is completed and returns True.

        Input parameters:
        programName (string): The name of the script file (without extension).

        Example:
        rob.sendScriptwithLineup('move1')
        rob.sendScriptwithLineup('move2')
        '''
        event = threading.Event()
        self.__script_queue.put( (programName, event) )
        self.__logger.info(f"Script '{programName}' has been enqueued for execution.")
        event.wait()  # Wait until the script has been processed
        self.__logger.info(f"Script '{programName}' has been fully executed.")
        print("DONE!!!")
        return True

    def sendScript_blocking(self, programName):
        '''
        Load and send the script to the robot. This method blocks until the script execution is finished.

        Input parameters:
        programName (string): The name of the script file (without extension).

        Example:
        self.sendScript_blocking('move1')
        '''
        self.__logger.info(f"Loading script: {programName}")
        try:
            with open(f'./scripts/{programName}.script', 'r') as file:
                script = file.read()
        except FileNotFoundError:
            self.__logger.error(f"Script file '{programName}.script' not found.")
            return
        except Exception as e:
            self.__logger.error(f"Error reading script file '{programName}.script': {e}")
            return

        # Send the script
        self.SendProgram(script)
        self.__logger.info(f"Script '{programName}' sent to robot.")
        self.wait_for_program_finish()
        self.__logger.info(f"Script '{programName}' execution completed.")

    def sendScript(self, programName):
        '''
        Send a script to the robot asynchronously without queuing. If a script is already running,
        it will be stopped, and the new script will start immediately.

        Input parameters:
        programName (string): The name of the script file (without extension).

        Example:
        rob.sendScript('move1')
        '''
        script_thread = threading.Thread(target=self.sendScript_blocking, args=(programName,))
        script_thread.start()
        self.__logger.info(f"Script '{programName}' has been sent asynchronously.")

    def wait_for_program_finish(self):
        '''
        Wait for the current program to finish executing.
        '''
        if self.__thread is not None:
            self.__thread.join()

    def Disconnect(self):
        '''
        Disconnect the RT Client connection and gracefully shut down the script worker thread.
        '''
        if self.__sock:
            self.__sock.close()
            self.__sock = None
            self.__logger.info('Disconnected from robot.')
        self.__robotModel.rtcConnectionState = ConnectionState.DISCONNECTED

        # Signal the worker thread to exit by sending None
        self.__script_queue.put(None)
        self.__script_worker.join()
        self.__logger.info('Worker thread has been terminated.')
        return True

### END NEW CODE



# Example usage
# if __name__ == "__main__":
#     # Initialize your RobotModel appropriately
#     robot_model = URBasic.robotModel.RobotModel(ipAddress='192.168.56.101')  # Example IP
#     rob = RealTimeClient(robot_model)
    
#     # Connect to the robot
#     if rob.__connect():
#         rob.__logger.info("Connected to the robot.")
#     else:
#         rob.__logger.error("Failed to connect to the robot.")

#     # Enqueue multiple scripts
#     try:
#         success1 = rob.sendScriptwithLineup('move1')
#         print(f"Script 'move1' executed successfully: {success1}")

#         success2 = rob.sendScriptwithLineup('move2')
#         print(f"Script 'move2' executed successfully: {success2}")

#         success3 = rob.sendScriptwithLineup('move3')
#         print(f"Script 'move3' executed successfully: {success3}")
#     except Exception as e:
#         rob.__logger.error(f"An error occurred while executing scripts: {e}")

#     # Disconnect from the robot
#     rob.Disconnect()