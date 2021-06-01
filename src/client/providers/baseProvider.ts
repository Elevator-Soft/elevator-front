import {UserService} from "../../services";
import {OperationResult, VoidOperationResult} from "../models";

export class BaseProvider {
    userService: UserService;
    apiUrl: string;

    constructor(userService: UserService, apiUrl: string) {
        this.userService = userService;
        this.apiUrl = apiUrl;
    }

    protected async get<T>(url: string): Promise<T> {
        const options: RequestInit = {
            method: "GET",
            headers: {
                'Accept': "application/json",
                'Authorization': "Bearer " + await this.userService.getToken()
            }
        };

        return await BaseProvider.send<T>(url, options)
    }

    protected async put<T>(url: string, bodyContent?: string): Promise<T> {
        const options: RequestInit = {
            method: "PUT",
            headers: {
                'Accept': "application/json",
                'Authorization': "Bearer " + await this.userService.getToken()
            }
        };

        if (bodyContent) {
            options.body = bodyContent;
            options.headers =  {
                'Accept': "application/json",
                'Authorization': "Bearer " + await this.userService.getToken(),
                'Content-Type': "application/json"
            }
        }


        return await BaseProvider.send<T>(url, options)
    }

    protected async post<T>(url: string, bodyContent?: string): Promise<T> {
        const options: RequestInit = {
            method: "POST",
            headers: {
                'Accept': "application/json",
                'Authorization': "Bearer " + await this.userService.getToken()
            }
        };

        if (bodyContent) {
            options.body = bodyContent;
            options.headers =  {
                'Accept': "application/json",
                'Authorization': "Bearer " + await this.userService.getToken(),
                'Content-Type': "application/json"
            }
        }


        return await BaseProvider.send<T>(url, options)
    }

    protected async postWithVoidResult<T>(url: string, bodyContent?: string): Promise<T> {
        const options: RequestInit = {
            method: "POST",
            headers: {
                'Accept': "application/json",
                'Authorization': "Bearer " + await this.userService.getToken()
            }
        };

        if (bodyContent) {
            options.body = bodyContent;
            options.headers =  {
                'Accept': "application/json",
                'Authorization': "Bearer " + await this.userService.getToken(),
                'Content-Type': "application/json"
            }
        }

        return await BaseProvider.send<T>(url, options)
    }

    private static async send<T>(url: string, options: RequestInit) {
        let operationResult: OperationResult<T>;

        const response = await fetch(url, options);
        if (response.status >= 200 && response.status < 300) {
            operationResult = await response.json();
        } else {
            throw response;
        }

        if (operationResult.isSuccessful)
            return operationResult.value!;
        console.log(operationResult);
        throw Error(operationResult.error);
    }
}
