import {Build, BuildConfig, CreateBuildConfigRequest} from "../models";
import {BaseProvider} from "./baseProvider";


export class BuildConfigsProvider extends BaseProvider {
    public createBuildConfig(createBuildConfigRequest: CreateBuildConfigRequest): Promise<BuildConfig> {
        const url = this.apiUrl + '/projects/' + createBuildConfigRequest.projectId + '/buildConfigs';
        return this.post<BuildConfig>(url, JSON.stringify(createBuildConfigRequest));
    }

    public getAllBuildConfigs(projectId: string): Promise<BuildConfig[]> {
        const url = this.apiUrl + '/projects/' + projectId + '/buildConfigs';
        return this.get<BuildConfig[]>(url);
    }

    public getById(projectId: string, buildConfigId: string): Promise<BuildConfig> {
        const url = this.apiUrl  + '/projects/' + projectId + '/buildConfigs/' + buildConfigId;
        return this.get<BuildConfig>(url);
    }

    public runBuildConfig(projectId: string, buildConfig: BuildConfig): Promise<Build> {
        const url = this.apiUrl  + '/projects/' + projectId + '/buildConfigs/' + buildConfig.id + '/run';
        return this.post<Build>(url);
    }
}
