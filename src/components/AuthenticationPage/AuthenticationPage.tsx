import React from "react";
import {RouteComponentProps} from "react-router-dom";

import styles from './AuthenticationPage.module.css'
import {Profile} from "../../models/Profile/Profile";
import {User} from "../../client";

interface AuthenticationPageProps extends RouteComponentProps {
    user?: User
}

export class AuthenticationPage extends React.PureComponent<AuthenticationPageProps> {
    render() {
        if (this.props.user)
            this.props.history.push('/');

        return (
            <div className={styles.mainContainer}>
                <div className={styles.rowContainer}>
                    <div className={styles.authorizationContainer}>
                        <div className={styles.elevatorTitle}>
                            ELEVATOR CI
                        </div>
                        <div className={styles.delimiter}/>
                        <a href={"/sign-in/google"} className={styles.googleAuthorizationLink}>
                            <div>
                                Вход через Google
                            </div>
                        </a>
                        <a href={"/sign-in/google"} className={styles.googleAuthorizationLink}>
                            <div>
                                Еще раз через Google
                            </div>
                        </a>
                    </div>

                </div>
            </div>
        );
    }
}

