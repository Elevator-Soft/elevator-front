import {BuildConfig} from "../../client/models/buildConfigs";
import React, {PureComponent} from "react";

import styles from './BuildConfigComponent.module.css'
import {Project} from "../../client/models/projects";

interface BuildConfigProps {
    project: Project;
    buildConfig: BuildConfig;
}

export class BuildConfigComponent extends PureComponent<BuildConfigProps> {
    render() {
        return (<div className={styles.buildConfigContainer}>
            <a className={styles.buildConfigName} href={this.props.project.id + '/buildConfigs/' + this.props.buildConfig.id}>{this.props.buildConfig.name}</a>
        </div>);
    }
}
