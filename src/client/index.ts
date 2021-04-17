import {
    ProjectsProvider
} from "./providers";

import { UserService } from '../services'

export * from './models';
export * from './providers';

export class ApiClient {
    projects: ProjectsProvider;

    constructor(userService: UserService, apiUrl: string) {
        this.projects = new ProjectsProvider(userService, apiUrl);
    }
}
