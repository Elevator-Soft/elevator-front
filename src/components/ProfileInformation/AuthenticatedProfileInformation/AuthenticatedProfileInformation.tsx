import React from "react";

import { Profile } from "../../../models/Profile/Profile";

interface AuthenticatedProfileInformationProps {
    profile: Profile
}

export class AuthenticatedProfileInformation extends React.PureComponent<AuthenticatedProfileInformationProps> {
    render() {
        return this.props.profile.name;
    }
}
