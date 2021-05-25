import {
    ProjectsProvider, UsersProvider
} from "./providers";

import { UserService } from '../services'

export * from './models';
export * from './providers';

export class ApiClient {
    projects: ProjectsProvider;
    users: UsersProvider;

    constructor(userService: UserService, apiUrl: string) {
        this.projects = new ProjectsProvider(userService, apiUrl);
        this.users = new UsersProvider(userService, apiUrl);
    }
}
