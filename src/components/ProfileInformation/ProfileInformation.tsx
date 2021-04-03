import React from "react";
import {Profile} from "../../models/Profile/Profile";
import {AuthenticatedProfileInformation} from "./AuthenticatedProfileInformation/AuthenticatedProfileInformation";
import {NoProfileInformation} from "./NoProfileInformation/NoProfileInformation";

interface ProfileInformationProps {
    profile?: Profile
}

export class ProfileInformation extends React.PureComponent<ProfileInformationProps> {
    render() {
        return (
            this.props.profile ?
                <AuthenticatedProfileInformation profile={this.props.profile}/> :
                <NoProfileInformation/>
        )
    }
}
