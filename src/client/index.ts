import {
    ProjectsProvider, UsersProvider
} from "./providers";

import { UserService } from '../services'
import {BuildConfigsProvider} from "./providers/buildConfigsProvider";
import {BuildStepsProvider} from "./providers/buildStepsProvider";
import {BuildProvider} from "./providers/buildProvider";

export * from './models';
export * from './providers';

export class ApiClient {
    projects: ProjectsProvider;
    users: UsersProvider;
    buildConfigs: BuildConfigsProvider;
    buildSteps: BuildStepsProvider;
    builds: BuildProvider;

    constructor(userService: UserService, apiUrl: string) {
        this.projects = new ProjectsProvider(userService, apiUrl);
        this.users = new UsersProvider(userService, apiUrl);
        this.buildConfigs = new BuildConfigsProvider(userService, apiUrl);
        this.buildSteps = new BuildStepsProvider(userService, apiUrl);
        this.builds = new BuildProvider(userService, apiUrl);
    }
}
