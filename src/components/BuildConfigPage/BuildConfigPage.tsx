import {RouteComponentProps} from "react-router-dom";
import {User} from "../../client/models/users";
import {
    ApiClient, Build,
    BuildConfig,
    BuildStep, BuildStepScript,
    CreateBuildConfigRequest,
    CreateBuildStepRequest,
    Project, UpdateBuildStepRequest
} from "../../client";
import React, {Component, PureComponent} from "react";

import styles from './BuildConfigPage.module.css'
import {SmallCombobox, SmallConfirmButton, SmallInput} from "../Common";
import {createDeflateRaw} from "zlib";

interface BuildConfigPageParams {
    projectId: string;
    buildConfigId: string;
}

interface BuildConfigPageProps extends RouteComponentProps<BuildConfigPageParams>{
    user: User;
    apiClient: ApiClient
}

interface BuildConfigPageState {
    project?: Project;
    buildSteps?: BuildStep[];
    buildConfig?: BuildConfig;
    currentBuild?: Build;

    isCreateBuildStepModalOpened: boolean;
}

export class BuildConfigPage extends PureComponent<BuildConfigPageProps, BuildConfigPageState> {

    constructor(props: BuildConfigPageProps) {
        super(props);
        this.state = {isCreateBuildStepModalOpened: false, project: undefined, buildSteps: undefined, buildConfig: undefined, currentBuild: undefined}
    }

    async componentDidMount() {
        await this.setProject();
        await this.setBuildSteps();
        await this.setBuildConfig();
    }

    async setProject() {
        this.setState({project: await this.props.apiClient.projects.getProject(this.props.match.params.projectId)})
    }

    async setBuildSteps() {
        this.setState({buildSteps: await this.props.apiClient.buildSteps.getAllBuildSteps(this.props.match.params.projectId, this.props.match.params.buildConfigId)})
    }

    async setBuildConfig() {
        this.setState({buildConfig: await this.props.apiClient.buildConfigs.getById(this.props.match.params.projectId, this.props.match.params.buildConfigId)})
    }

    render() {
        if (!this.state.project || !this.state.buildSteps || !this.state.buildConfig)
            return (
                <div className={styles.mainContainer}>
                    <div className={styles.infoContainer}>
                        <div className={styles.leftContainer}>
                            <div className={styles.nameContainer}>
                                Loading...
                            </div>
                        </div>
                    </div>
                </div>
            );

        const hasUserAdminAccess = this.state.project && this.props.user.projectAccesses.admin.includes(this.state.project.id);

        return (
        <div className={styles.mainContainer}>
            <div className={styles.infoContainer}>
                <div className={styles.leftContainer}>
                    <div className={styles.nameContainer}>
                        <a href={'/projects/' + this.state.project.id} className={styles.backToProjectLink}>{this.state.project.name}</a>
                        <div>- {this.state.buildConfig.name}</div>
                        <div onClick={this.runBuildConfig} className={styles.runButton}>Run</div>
                    </div>
                    <div className={styles.buildStepsContainer}>
                        {this.renderBuildSteps()}
                    </div>
                    {this.state.currentBuild ? <BuildComponent projectId={this.state.project.id} buildConfigId={this.state.buildConfig.id} apiClient={this.props.apiClient} build={this.state.currentBuild}/> : <div/>}
                </div>
                <div className={styles.adminPanelContainer}>{hasUserAdminAccess ? this.renderAdminPanel() : <div/>}</div>
            </div>
        </div>);
    }

    runBuildConfig = async () => {
        if (!this.state.buildConfig)
            return;
        const build = await this.props.apiClient.buildConfigs.runBuildConfig(this.props.match.params.projectId, this.state.buildConfig);
        this.setState({currentBuild: build});
    };

    renderBuildSteps() {
        if (!this.state.buildSteps || !this.state.project)
            return;

        const hasUserAdminAccess = this.props.user.projectAccesses.admin.includes(this.state.project.id);
        return this.state.buildSteps.map(x => {
            return <BuildStepComponent onUpdate={async () => {await this.setBuildSteps()}} apiClient={this.props.apiClient} projectId={this.state.project!.id} buildConfigId={this.props.match.params.buildConfigId} updateBuildStep={this.updateBuildStep} buildStep={x} hasUserAdminAccess={hasUserAdminAccess} />
        } )
    }

    createBuildStep = async (request: CreateBuildStepRequest) => {
        await this.props.apiClient.buildSteps.createBuildStep(this.props.match.params.projectId, request);
        await this.setBuildSteps();
    };

    updateBuildStep = async (buildStepId: string, request: UpdateBuildStepRequest) => {
        await this.props.apiClient.buildSteps.updateBuildStep(this.props.match.params.projectId, buildStepId, request);
        await this.setBuildSteps();
    };

    renderAdminPanel() {
        return <div>
            <div className={styles.adminPanelTitle}>Build config settings</div>
            <div className={styles.adminLinkContainer} onClick={this.changeModalOpenedState}>
                <div className={styles.adminLink}>Add build step</div>
                <div className={styles.downArrow}>˅</div>
            </div>
            <div style={{display: this.state.isCreateBuildStepModalOpened ? 'block' : 'none'}}>
                <AddBuildStepModal projectId={this.props.match.params.projectId} buildConfigId={this.props.match.params.buildConfigId} createBuildStep={this.createBuildStep}/>
            </div>
        </div>
    }

    changeModalOpenedState = () => {
        this.setState({isCreateBuildStepModalOpened: !this.state.isCreateBuildStepModalOpened});
    };
}

interface AddBuildStepModalProps {
    projectId: string;
    buildConfigId: string;
    createBuildStep: (createBuildStepRequest: CreateBuildStepRequest) => void;
}

interface AddBuildStepModalState {
    name: string;
    scriptCommand: string;
    scriptArguments: string;
}

class AddBuildStepModal extends PureComponent<AddBuildStepModalProps, AddBuildStepModalState> {
    constructor(props: AddBuildStepModalProps) {
        super(props);
        this.state = {name: '', scriptArguments: '', scriptCommand: ''}
    }

    handleNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({name: event.target.value});
    };

    handleCommandChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({scriptCommand: event.target.value});
    };

    handleArgumentsChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({scriptArguments: event.target.value});
    };

    confirm = () => {
        const createBuildStepRequest = new CreateBuildStepRequest(this.state.name, this.props.buildConfigId, new BuildStepScript(this.state.scriptCommand, this.state.scriptArguments));
        this.props.createBuildStep(createBuildStepRequest);
    };

    render() {
        return <div className={styles.modalContainer}>
            <SmallInput handleChange={this.handleNameChanged} title='Name'/>
            <SmallCombobox options={['', 'dotnet', 'npm']} handleChange={this.handleCommandChanged} title='Command'/>
            <SmallInput handleChange={this.handleArgumentsChanged} title='Arguments'/>
            <SmallConfirmButton isActive={this.isStateCorrect} onClick={this.confirm} text='Add'/>
        </div>;
    }

    isStateCorrect = () => {
        return  this.state.name !== '' && this.state.scriptCommand !== '';
    }
}

interface BuildStepComponentProps {
    buildConfigId: string;
    hasUserAdminAccess: boolean;
    buildStep: BuildStep;
    updateBuildStep: (buildStepId: string, request: UpdateBuildStepRequest) => void;
    projectId: string;
    apiClient: ApiClient;
    onUpdate: () => {};
}

interface BuildStepComponentState {
    name: string;
    scriptCommand: string;
    scriptArguments: string;

    isModalOpened: boolean;
    loading: boolean;
}

class BuildStepComponent extends Component<BuildStepComponentProps, BuildStepComponentState> {
    constructor(props: BuildStepComponentProps) {
        super(props);
        this.state = {
            isModalOpened: false,
            name: this.props.buildStep.name,
            scriptCommand: this.props.buildStep.buildStepScript.command,
            scriptArguments: this.props.buildStep.buildStepScript.arguments,
            loading: false
        };
    }

    handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({name: event.target.value})
    };

    handleChangeCommand = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({scriptCommand: event.target.value})
    };

    handleChangeArguments = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({scriptArguments: event.target.value})
    };

    render() {
        return <div className={styles.buildStepContainer}>
            <div className={styles.buildStepName}  onClick={this.changeModalState}>{this.props.buildStep.name}</div>
            <div className={styles.modalContainer} style={{display: this.state.isModalOpened ? 'block' : 'none'}}>
                <SmallInput handleChange={this.handleChangeName} title='Name' initialValue={this.state.name} disabled={!this.props.hasUserAdminAccess}/>
                <SmallCombobox options={['', 'dotnet', 'npm']} handleChange={this.handleChangeCommand} title='Command' initialValue={this.state.scriptCommand} disabled={!this.props.hasUserAdminAccess}/>
                <SmallInput handleChange={this.handleChangeArguments} title='Arguments' initialValue={this.state.scriptArguments} disabled={!this.props.hasUserAdminAccess}/>
                <SmallConfirmButton onClick={this.confirm} text={!this.state.loading ? "Save" : "Saving"} isActive={() => this.props.hasUserAdminAccess && !this.state.loading && this.isStateCorrect()}/>
            </div>
        </div>
    }

    isStateCorrect = () => {
        return this.state.name !== '' && this.state.scriptCommand !== '';
    };

    changeModalState = () => {
        this.setState({isModalOpened: !this.state.isModalOpened});
    };

    confirm = async () => {
        this.setState({loading: true});
        try {
            const updateBuildStepRequest = new UpdateBuildStepRequest(this.state.name, this.props.buildConfigId, new BuildStepScript(this.state.scriptCommand, this.state.scriptArguments));
            await this.props.apiClient.buildSteps.updateBuildStep(this.props.projectId, this.props.buildStep.id, updateBuildStepRequest);
        } finally {
            this.setState({loading: false, isModalOpened: false});
            this.props.onUpdate();
        }
    };
}

interface BuildComponentProps {
    build: Build;
    apiClient: ApiClient;
    projectId: string;
    buildConfigId: string;
}

interface BuildComponentState {
    build: Build;
}

class BuildComponent extends PureComponent<BuildComponentProps, BuildComponentState> {
    constructor(props: BuildComponentProps) {
        super(props);
        this.state = {build: props.build};
    }

    render() {
        return <div className={styles.buildInfoContainer}>
            <div className={styles.refreshButton} onClick={this.updateBuild}>Refresh</div>
            <div>Started by:{this.state.build.startedByUserId}</div>
            <div>Status: {this.mapBuildStatus(this.state.build.buildStatus)}</div>
            <div>Logs:</div>
            <div className={styles.logsContainer}>
                {this.state.build.logs ? this.renderLogs(this.state.build.logs) : <p/>}
            </div>
        </div>
    }

    renderLogs(logs: Array<string>) {
        return logs.map(log => <p>{log}</p>);
    }

    mapBuildStatus = (status: number) => {
        if (status === 0)
            return 'Waiting to get place in queue';
        else if (status === 1)
            return 'Waiting to start';
        else if (status === 2)
            return 'In progress';
        else if (status === 3)
            return 'Success';
        else if (status === 4)
            return 'Failed';
        else
            return 'Unknown status';
    }

    updateBuild = async () => {
        const build = await this.props.apiClient.builds.getById(this.props.projectId, this.props.buildConfigId, this.state.build.id);
        this.setState({build: build});
    }
}
