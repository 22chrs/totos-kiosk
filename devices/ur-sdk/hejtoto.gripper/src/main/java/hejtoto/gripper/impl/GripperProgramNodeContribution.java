package hejtoto.gripper.impl;

package com.yourcompany.urcap.gripper.impl;

import com.ur.urcap.api.contribution.program.ProgramNodeContribution;
import com.ur.urcap.api.domain.data.DataModel;
import com.ur.urcap.api.domain.script.ScriptWriter;
import com.ur.urcap.api.ui.annotation.Input;
import com.ur.urcap.api.ui.component.InputTextField;
import com.ur.urcap.api.ui.component.CheckboxInput;

public class GripperProgramNodeContribution implements ProgramNodeContribution {

    private final DataModel model;

    @Input(id = "position")
    private InputTextField positionField;

    @Input(id = "isBlocking")
    private CheckboxInput blockingCheckbox;

    public GripperProgramNodeContribution(DataModel model) {
        this.model = model;
    }

    @Override
    public void openView() {
        positionField.setValue(model.get("position", 0));
        blockingCheckbox.setSelected(model.get("isBlocking", true));
    }

    @Override
    public void closeView() {
        model.set("position", positionField.getValue());
        model.set("isBlocking", blockingCheckbox.isSelected());
    }

    @Override
    public void generateScript(ScriptWriter writer) {
        int position = model.get("position", 0);
        boolean isBlocking = model.get("isBlocking", true);

        if (isBlocking) {
            writer.appendLine("send_gripper_position(" + position + ")");
            writer.appendLine("while not get_ack()");
            writer.appendLine("  sync()"); // Wait for the ACK
            writer.appendLine("end");
        } else {
            writer.appendLine("send_gripper_position(" + position + ")");
        }
    }

    // Networking methods to communicate with gripper via Ethernet
    private void sendGripperPosition(int position) {
        // send the position via Ethernet (use java.net.Socket for TCP communication)
    }

    private boolean getAck() {
        // listen for ACK from the gripper, return true if success
    }
}