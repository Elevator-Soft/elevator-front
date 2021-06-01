import React, {PureComponent} from "react";
import {RouteComponentProps} from "react-router-dom";
import {GrantAccessRequest, Project} from "../../client/models/projects";
import {BuildConfig, CreateBuildConfigRequest} from "../../client/models/buildConfigs";
import {ApiClient, User} from "../../client";
import styles from './ProjectPage.module.css';
import {BuildConfigComponent} from "../BuildConfigComponent/BuildConfigComponent";
import {SmallConfirmButton, SmallInput, SmallCombobox} from "../Common";

interface ProjectPageParams {
    id: string;
}

interface ProjectPageProps extends RouteComponentProps<ProjectPageParams>{
    user: User;
    apiClient: ApiClient
}

interface ProjectPageState {
    project?: Project
    buildConfigs?: BuildConfig[]
    modals: Modals;
    userIds: Array<string>;
}

interface Modals {
    addBuildConfig: boolean;
    accessControl: boolean;
    generalSettings: boolean;
}

export class ProjectPage extends React.PureComponent<ProjectPageProps, ProjectPageState> {
    constructor(props: ProjectPageProps) {
        super(props);
        this.state = {project: undefined, buildConfigs: undefined, modals: {addBuildConfig: false, accessControl: false, generalSettings: false}, userIds: []};
    }

    async componentDidMount() {
        await this.setProject();
        await this.setBuildConfigs();
        await this.setUserIds();
    }

    async setProject() {
        this.setState({project: await this.props.apiClient.projects.getProject(this.props.match.params.id)})
    }

    async setBuildConfigs() {
        this.setState({buildConfigs: await this.props.apiClient.buildConfigs.getAllBuildConfigs(this.props.match.params.id)})
    }

    async setUserIds() {
         this.setState({userIds: await this.props.apiClient.users.getAllIds()});
    }

    render() {
        const projectName = this.state.project ? this.state.project.name : 'Loading...';
        const hasUserAdminAccess = this.state.project && this.props.user.projectAccesses.admin.includes(this.state.project.id);

        return <div className={styles.mainContainer}>
            <div className={styles.infoContainer}>
                <div className={styles.leftContainer}>
                    <div className={styles.nameContainer}>{projectName}</div>
                    {this.state.buildConfigs ? <div className={styles.buildConfigsContainer}>{this.renderBuildConfigs()}</div> : <div className={styles.buildConfigsContainer}>Loading...</div>}
                </div>
                <div className={styles.adminPanelContainer}>{hasUserAdminAccess ? this.renderAdminPanel() : <div></div>}</div>
            </div>


        </div>
    }

    renderAdminPanel() {
        if (!this.state.project)
            return;

        return <div>
            <div className={styles.adminPanelTitle}>Project settings</div>
            <div className={styles.adminLinkContainer} onClick={this.showGeneralSettingsModal}>
                <div className={styles.adminLink}>General settings</div>
                <div className={styles.downArrow}>˅</div>
            </div>
            <div style={{display: this.state.modals.generalSettings ? 'block' : 'none'}}>
                <div className={styles.adminPanelTitle}>Will be available in future!</div>
            </div>
            <div className={styles.adminLinkContainer} onClick={this.showAddBuildConfigModal}>
                <div className={styles.adminLink}>Add build config</div>
                <div className={styles.downArrow}>˅</div>
            </div>
            <div style={{display: this.state.modals.addBuildConfig ? 'block' : 'none'}}>
                <AddBuildConfigModal projectId={this.props.match.params.id} createBuildConfig={this.createBuildConfig}/>
            </div>
            <div className={styles.adminLinkContainer} onClick={this.showAccessControlModal}>
                <div className={styles.adminLink}>Access control</div>
                <div className={styles.downArrow}>˅</div>
            </div>
            <div style={{display: this.state.modals.accessControl ? 'block' : 'none'}}>
                <AccessControlModal projectId={this.props.match.params.id} userIds={['', ...this.state.userIds]} roles={['', 'user', 'admin']} grantAccess={this.grantAccess} />
            </div>
        </div>
    }

    showAddBuildConfigModal = () => {
        const isOpenedNow = this.state.modals.addBuildConfig;
        this.setState({modals: {...this.state.modals, addBuildConfig: !isOpenedNow}})
    };

    showAccessControlModal = () => {
        const isOpenedNow = this.state.modals.accessControl;
        this.setState({modals: {...this.state.modals, accessControl: !isOpenedNow}});
    };

    showGeneralSettingsModal = () => {
        const isOpenedNow = this.state.modals.generalSettings;
        this.setState({modals: {...this.state.modals, generalSettings: !isOpenedNow}});
    };

    renderBuildConfigs() {
        if (!this.state.buildConfigs || !this.state.project)
            return;

        if (this.state.buildConfigs.length === 0)
            return <div>
                <div>There are no any build configs</div>
            </div>;

        const project = this.state.project;

        return this.state.buildConfigs.map(bc => {
            return <BuildConfigComponent project={project} buildConfig={bc}/>
        })
    }

    createBuildConfig = async (createBuildConfigRequest: CreateBuildConfigRequest) => {
        await this.props.apiClient.buildConfigs.createBuildConfig(createBuildConfigRequest);
        await this.setProject();
        await this.setBuildConfigs();
    };

    grantAccess = async (grantAccessRequest: GrantAccessRequest) => {
        await this.props.apiClient.projects.grantAccess(grantAccessRequest);
        await this.setProject();
        console.log(this.state.project);
    };
}

interface AddBuildConfigModalProps {
    projectId: string;
    createBuildConfig: (createBuildConfigRequest: CreateBuildConfigRequest) => void;
}

interface AddBuildConfigModalState {
    name: string;
}

class AddBuildConfigModal extends PureComponent<AddBuildConfigModalProps, AddBuildConfigModalState> {
    constructor(props: AddBuildConfigModalProps) {
        super(props);
        this.state = {name: ''}
    }

    handleNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({name: event.target.value});
    };

    confirm = () => {
        const createBuildConfigRequest = new CreateBuildConfigRequest(this.state.name, this.props.projectId);
        this.props.createBuildConfig(createBuildConfigRequest);
    };

    render() {
        return <div className={styles.modalContainer}>
            <SmallInput handleChange={this.handleNameChanged} title='Name'/>
            <SmallConfirmButton isActive={() => this.state.name !== ''} onClick={this.confirm} text='Add'/>
        </div>;
    }
}

interface AccessControlModalProps {
    projectId: string;
    userIds: Array<string>;
    roles: Array<string>;
    grantAccess: (grantAccessRequest: GrantAccessRequest) => void;
}

interface AccessControlModalState {
    id: string;
    role: string;
}

class AccessControlModal extends PureComponent<AccessControlModalProps, AccessControlModalState> {
    constructor(props: AccessControlModalProps) {
        super(props);
        this.state = {id: '', role: ''}
    }

    handleIdChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
      this.setState({id: event.target.value});
    };

    handleRoleChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({role: event.target.value});
    };

    render() {
        return <div className={styles.modalContainer}>
            <SmallCombobox options={this.props.userIds} handleChange={this.handleIdChanged} title='User'/>
            <SmallCombobox options={this.props.roles} handleChange={this.handleRoleChanged} title='Role'/>
            <SmallConfirmButton isActive={() => this.state.id !== '' && this.state.role !== ''} onClick={this.confirm} text='Grant'/>
        </div>;
    }

    confirm = () => {
        const grantAccessRequest = new GrantAccessRequest(this.props.projectId, this.state.id, this.state.role);
        if (grantAccessRequest.accessType === '' || grantAccessRequest.userId === '')
            console.log('You should choose access type and user');
        this.props.grantAccess(grantAccessRequest);
    }
}

