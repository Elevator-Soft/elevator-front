import {RouteComponentProps} from "react-router-dom";
import {ApiClient, CreateProjectRequest} from "../../client";
import React, {ChangeEvent} from "react";
import {Modal} from '@material-ui/core'

import styles from './CreateProjectModal.module.css'

interface CreateProjectModalProps extends RouteComponentProps {
    client: ApiClient;
}

interface CreateProjectModalState {
    name: string;
    gitUrl: string;
    gitToken: string;
    loading: boolean;
}

export class CreateProjectModal extends React.PureComponent<CreateProjectModalProps, CreateProjectModalState> {

    constructor(props: CreateProjectModalProps) {
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
                    Add a new project
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
                    <button className={styles.saveButton} disabled={this.state.loading} onClick={this.saveProject}>Save</button>
                    <button className={styles.cancelButton} disabled={this.state.loading} onClick={this.cancel}>Cancel</button>
                </div>
            </div>
        </Modal>)
    }

    saveProject = () => {
        const createProjectRequest = new CreateProjectRequest(this.state.name, this.state.gitUrl, this.state.gitToken);
        this.setState({loading: true});
        this.props.client.projects.createProject(createProjectRequest).then(() => {
            this.setState({loading: false});
            this.props.history.push('/');
            }
        ).catch((error) => {
            this.setState({loading: false});
            console.log(error);
        })
    };

    cancel = () => {
        this.props.history.push('/');
    }
}
