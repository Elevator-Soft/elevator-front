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
                <div className={styles.delimiter}/>
                {
                    this.props.profile
                        ? <div/>
                        : <div className={styles.profileInfo}> <a href="/sign-in/google">Авторизоваться через гугол</a> </div>
                }

                <div className={styles.profileInfo}>
                    <ProfileInformation profile={this.props.profile}/>
                </div>
            </div>
        )
    }
}
