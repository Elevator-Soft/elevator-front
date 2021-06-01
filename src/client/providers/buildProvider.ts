import {BaseProvider} from "./baseProvider";
import {Build} from "../models/build";

export class BuildProvider extends BaseProvider {
    public getById(projectId: string, buildConfigId: string, id: string) : Promise<Build> {
        const url = this.apiUrl + '/projects/' + projectId + '/buildConfigs/' + buildConfigId + '/builds/' + id;
        return this.get<Build>(url);
    }
}
