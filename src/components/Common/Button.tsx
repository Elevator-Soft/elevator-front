import React, {Component, PureComponent} from "react";
import styles from "./Button.module.css";

interface ButtonProps {
    onClick: () => void;
    text: string;
    isActive: () => boolean;
}

export class SmallConfirmButton extends Component<ButtonProps> {
    render() {
        return <div className={this.props.isActive() ? styles.smallConfirmButton : styles.smallConfirmButtonDisabled} onClick={this.props.isActive() ? this.props.onClick : undefined}>{this.props.text}</div>
    }
}

export class MediumConfirmButton extends PureComponent<ButtonProps> {
    render() {
        return <div className={styles.smallConfirmButton} onClick={this.props.onClick}>{this.props.text}</div>
    }
}
