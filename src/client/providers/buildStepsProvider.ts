import {BaseProvider} from "./baseProvider";
import {BuildStep, CreateBuildStepRequest, UpdateBuildStepRequest} from "../models/buildSteps";

export class BuildStepsProvider extends BaseProvider {
    public getAllBuildSteps(projectId: string, buildConfigId: string): Promise<BuildStep[]> {
        const url = this.apiUrl + '/projects/' + projectId + '/buildConfigs/' + buildConfigId + '/buildSteps';
        return this.get<BuildStep[]>(url);
    }

    public createBuildStep(projectId: string, createBuildStepRequest: CreateBuildStepRequest): Promise<BuildStep> {
        const url = this.apiUrl + '/projects/' + projectId + '/buildConfigs/' + createBuildStepRequest.buildConfigId + '/buildSteps';
        return this.post<BuildStep>(url, JSON.stringify(createBuildStepRequest));
    }

   public updateBuildStep(projectId: string, buildStepId: string, updateProjectRequest: UpdateBuildStepRequest) {
       const url = this.apiUrl + '/projects/' + projectId + '/buildConfigs/' + updateProjectRequest.buildConfigId + '/buildSteps/' + buildStepId;
       return this.put<BuildStep>(url, JSON.stringify(updateProjectRequest));
   }
}
