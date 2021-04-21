import React from "react";
import {Profile} from "../../models/Profile/Profile";
import styles from './TopBar.module.css'
import {ProfileInformation} from "../ProfileInformation/ProfileInformation";

interface TopBarProps {
    profile?: Profile
}

export class TopBar extends React.PureComponent<TopBarProps> {
    render() {
        return (
            <div className={styles.topbar}>
                <div className={styles.topbarItem}>
                    <div className={styles.elevatorTitle}>
                        ELEVATOR
                    </div>
                </div>
                <div className={styles.topbarItem}>
                    <div className={styles.profileInfo}>
                        <ProfileInformation profile={this.props.profile}/>
                    </div>
                </div>
            </div>
        )
    }
}
