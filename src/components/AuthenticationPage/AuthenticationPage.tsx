import React from "react";
import {RouteComponentProps} from "react-router-dom";

import styles from './AuthenticationPage.module.css'

interface AuthenticationPageProps extends RouteComponentProps {

}

export class AuthenticationPage extends React.Component<AuthenticationPageProps> {
    render = () => {
        return (
            <div className={styles.container}>
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
                        <a href={"/sign-in/github"} className={styles.googleAuthorizationLink}>
                            <div>
                                Вход через Github
                            </div>
                        </a>
                    </div>

                </div>
            </div>
        );
    }
}

