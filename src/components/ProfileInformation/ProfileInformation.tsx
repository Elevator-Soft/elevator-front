import React from "react";
import {AuthenticatedProfileInformation} from "./AuthenticatedProfileInformation/AuthenticatedProfileInformation";
import {User} from "../../client/models/users";

interface ProfileInformationProps {
    user?: User
}

export class ProfileInformation extends React.PureComponent<ProfileInformationProps> {
    render() {
        return (
            this.props.user ?
                <AuthenticatedProfileInformation user={this.props.user}/> :
                null
        )
    }
}
