import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';

import { Profile } from "../../../models/Profile/Profile";

import styles from "./AuthenticatedProfileInformation.module.css"

interface AuthenticatedProfileInformationProps {
    profile: Profile;
}


export class AuthenticatedProfileInformation extends React.PureComponent<AuthenticatedProfileInformationProps> {
    render() {
        return (
            <Dropdown className={styles.dropdown}>
                <Dropdown.Toggle className={styles.dropdownButton}>
                    {this.props.profile.name} ˅
                </Dropdown.Toggle>

                <Dropdown.Menu className={styles.dropdownMenu} align="right">
                    <Dropdown.Item href="/create-project" className={styles.dropdownItem}>Add project</Dropdown.Item>
                    <Dropdown.Item href="#/action-1" className={styles.dropdownItem}>Log out</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>);
    }
}
