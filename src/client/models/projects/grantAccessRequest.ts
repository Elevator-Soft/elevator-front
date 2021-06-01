export class GrantAccessRequest {
    projectId: string;
    userId: string;
    accessType: string;

    constructor(projectId: string, userId: string, accessType: string) {
        this.projectId = projectId;
        this.userId = userId;
        this.accessType = accessType;
    }
}
