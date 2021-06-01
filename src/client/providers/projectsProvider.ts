import {Project, CreateProjectRequest, UpdateProjectRequest, GrantAccessRequest} from "../models";
import {BaseProvider} from "./baseProvider";

export class ProjectsProvider extends BaseProvider {
    public getAllProjects(): Promise<Project[]> {
        const url = this.apiUrl + '/projects';
        return this.get<Project[]>(url);
    }

    public createProject(createProjectRequest: CreateProjectRequest): Promise<Project> {
        const url = this.apiUrl + '/projects';
        return this.post<Project>(url, JSON.stringify(createProjectRequest));
    }

    public getProject(id: string): Promise<Project> {
        const url = this.apiUrl + '/projects/' + id;
        return this.get<Project>(url);
    }

    public updateProject(id: string, updateProjectRequest: UpdateProjectRequest): Promise<Project> {
        const url = this.apiUrl + '/projects/' + id;
        return this.put<Project>(url, JSON.stringify(updateProjectRequest));
    }

    public async grantAccess(grantAccessRequest: GrantAccessRequest) {
        const url = this.apiUrl + '/projects/' + grantAccessRequest.projectId + '/grantAccess';
        await this.post<any>(url, JSON.stringify(grantAccessRequest));
    }
}
