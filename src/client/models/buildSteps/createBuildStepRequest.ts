export class CreateBuildStepRequest {
    name: string;
    buildConfigId: string;
    buildStepScript: BuildStepScript;

    constructor(name: string, buildConfigId: string, buildStepScript: BuildStepScript) {
        this.name = name;
        this.buildConfigId = buildConfigId;
        this.buildStepScript = buildStepScript;
    }

}

export class BuildStepScript {
    command: string;
    arguments: string;

    constructor(command: string, args: string) {
        this.command = command;
        this.arguments = args;
    }

}

export class UpdateBuildStepRequest extends CreateBuildStepRequest { }
