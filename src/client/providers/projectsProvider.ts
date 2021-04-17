import {Project, OperationResult} from "../models";
import {UserService} from "../../services";

export class ProjectsProvider {
    userService: UserService;
    apiUrl: string;

    constructor(userService: UserService, apiUrl: string) {
        this.userService = userService;
        this.apiUrl = apiUrl;
    }

    public async getAllProjects(): Promise<Project[]> {
        if (!this.userService.profile?.token)
            throw Error('User is not authenticated');
        const url = this.apiUrl + '/projects';
        const options: RequestInit = {
            method: "GET",
            headers: {
                'Accept': "application/json",
                'Authorization': "Bearer " + this.userService.profile.token
            }
        };

        let operationResult: OperationResult<Project[]>;

        const response = await fetch(url, options);
        if (response.status >= 200 && response.status < 300) {
            operationResult = await response.json();
        } else {
            throw response;
        }

        if (operationResult.isSuccessful)
            return operationResult.value!;
        throw Error(operationResult.error);
    }
}
