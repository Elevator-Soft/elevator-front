import {RouteComponentProps} from "react-router-dom";
import {ApiClient, UpdateProjectRequest} from "../../client";
import React from "react";
import {Modal} from '@material-ui/core'

import styles from './EditProjectModal.module.css'

interface UpdateProjectModalParams {
    id: string;
}

interface UpdateProjectModalProps extends RouteComponentProps<UpdateProjectModalParams> {
    client: ApiClient;
}

interface UpdateProjectModalState {
    name: string;
    gitUrl: string;
    gitToken: string;
    loading: boolean;
}

export class EditProjectModal extends React.PureComponent<UpdateProjectModalProps, UpdateProjectModalState> {

    constructor(props: UpdateProjectModalProps) {
        super(props);

        this.state = {name: '', gitUrl: '', gitToken: '', loading: false};
    }

    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({name: event.target.value});
    };

    handleGitUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({gitUrl: event.target.value});
    };

    handleGitTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({gitToken: event.target.value});
    };

    render() {
        return (<Modal className={styles.modal} open={true} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            <div className={styles.modalContent}>
                <div className={styles.title}>
                    Edit project
                </div>
                <div className={styles.inputs}>
                    <div className={styles.input}>
                        <div className={styles.inputTitle}>
                            <p>Name</p>
                        </div>
                        <input className={styles.inputValue} onChange={this.handleNameChange} type="text"/>
                    </div><div className={styles.input}>
                        <div className={styles.inputTitle}>
                            <p>Git url</p>
                        </div>
                        <input className={styles.inputValue} onChange={this.handleGitUrlChange} type="text"/>
                    </div><div className={styles.input}>
                        <div className={styles.inputTitle}>
                            <p>Git token</p>
                        </div>
                        <input className={styles.inputValue} onChange={this.handleGitTokenChange} type="text"/>
                    </div>
                </div>
                <div className={styles.buttons}>
                    <button className={styles.saveButton} disabled={this.state.loading} onClick={this.updateProject}>Save</button>
                    <button className={styles.cancelButton} disabled={this.state.loading} onClick={this.cancel}>Cancel</button>
                </div>
            </div>
        </Modal>)
    }

    updateProject = () => {
        const updateProjectRequest = new UpdateProjectRequest(this.state.name, this.state.gitUrl, this.state.gitToken);
        this.setState({loading: true});
        this.props.client.projects.updateProject(this.props.match.params.id, updateProjectRequest).then(project => {
            this.setState({loading: false});
            this.props.history.push('/projects/' + project.id);
            }
        ).catch((error) => {
            this.setState({loading: false});
            console.log(error);
            this.props.history.push('/');
        })
    };

    cancel = () => {
        this.props.history.push('/projects/' + this.props.match.params.id);
    }
}
