export class CreateBuildConfigRequest {
    name: string;
    projectId: string;

    constructor(name: string, projectId: string) {
        this.name = name;
        this.projectId = projectId;
    }

}
