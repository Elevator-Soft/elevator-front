export class CreateProjectRequest {
    name: string;
    gitUrl: string;
    gitToken: string;

    constructor(name: string, gitUrl: string, gitToken: string) {
        this.name = name;
        this.gitUrl = gitUrl;
        this.gitToken = gitToken;
    }
}

export class UpdateProjectRequest extends CreateProjectRequest {

}
