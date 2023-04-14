import subprocess

def list_camera_devices():
    try:
        output = subprocess.check_output(["v4l2-ctl", "--list-devices"]).decode()
        devices = [line.split(":")[0].strip() for line in output.split("\n") if "dev" in line]
        return devices
    except subprocess.CalledProcessError:
        print("Error: v4l2-ctl command not found. Please install v4l-utils.")
        return []

print("Camera devices:")
for device in list_camera_devices():
    print(f"  {device}")
