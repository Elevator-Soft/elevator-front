import React from "react";

import styles from "./NoProjectsPage.module.css"

export class NoProjectsPage extends React.Component {
    render() {
        return (
            <div className={styles.mainContainer}>
                <div className={styles.rowContainer}>
                    <div className={styles.title}>
                        No projects are available, you can create your own or ask for permission to existed projects.
                    </div>
                </div>
            </div>
        )
    }
}
