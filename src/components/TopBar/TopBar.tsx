import React from "react";
import styles from './TopBar.module.css'
import {ProfileInformation} from "../ProfileInformation/ProfileInformation";
import {User} from "../../client";

interface TopBarProps {
    goHome: () => void;
    user?: User
}

export class TopBar extends React.PureComponent<TopBarProps> {
    render() {
        return (
            <div className={styles.topbar}>
                <div className={styles.topbarItem}>
                    <div className={styles.elevatorTitle} onClick={this.props.goHome}>
                        ELEVATOR
                    </div>
                </div>
                <div className={styles.topbarItem}>
                    <div className={styles.profileInfo}>
                        <ProfileInformation user={this.props.user}/>
                    </div>
                </div>
            </div>
        )
    }
}
