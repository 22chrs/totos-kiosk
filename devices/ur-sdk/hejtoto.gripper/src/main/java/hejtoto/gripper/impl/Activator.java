package hejtoto.gripper.impl;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;

public class Activator implements BundleActivator {
    @Override
    public void start(BundleContext bundleContext) throws Exception {
        System.out.println("Activator says Hello World!");
        bundleContext.registerService(ProgramNodeService.class, new GripperProgramNodeService(), null);
    }

    @Override
    public void stop(BundleContext bundleContext) throws Exception {
        System.out.println("Activator says Goodbye World!");
    }
}