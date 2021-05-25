import {User, OperationResult} from '../models'
import {UserService} from "../../services";

export class UsersProvider {
    userService: UserService;
    apiUrl: string;

    constructor(userService: UserService, apiUrl: string) {
        this.userService = userService;
        this.apiUrl = apiUrl;
    }

    public async getCurrentUser(): Promise<User> {
        const url = this.apiUrl + '/users/me';
        const options: RequestInit = {
            method: "GET",
            headers: {
                'Accept': "application/json",
                'Authorization': "Bearer " + await this.userService.getToken()
            }
        };

        let operationResult: OperationResult<User>;

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

    public async register(): Promise<User> {
        const url = this.apiUrl + '/users/me/register';
        const options: RequestInit = {
            method: "POST",
            headers: {
                'Accept': "application/json",
                'Authorization': "Bearer " + await this.userService.getToken()
            }
        };

        let operationResult: OperationResult<User>;

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
