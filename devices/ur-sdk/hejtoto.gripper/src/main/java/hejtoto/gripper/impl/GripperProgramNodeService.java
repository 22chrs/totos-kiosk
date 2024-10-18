package hejtoto.gripper.impl;

import com.ur.urcap.api.contribution.program.ProgramNodeService;
import com.ur.urcap.api.contribution.program.ProgramNodeContribution;
import com.ur.urcap.api.domain.URCapAPI;
import com.ur.urcap.api.domain.data.DataModel;
import com.ur.urcap.api.ui.component.ComponentFactory;
import com.ur.urcap.api.ui.component.ProgramNodeView;

public class GripperProgramNodeService implements ProgramNodeService {

    @Override
    public String getId() {
        return "GripperProgramNode";
    }

    @Override
    public String getTitle() {
        return "Gripper Control";
    }

    @Override
    public ProgramNodeView createView(ComponentFactory componentFactory) {
        return new GripperProgramNodeView(componentFactory);
    }

    @Override
    public ProgramNodeContribution createNode(URCapAPI api, DataModel model) {
        return new GripperProgramNodeContribution(model);
    }
}