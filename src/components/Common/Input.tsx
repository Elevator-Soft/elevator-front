import React, {PureComponent} from "react";
import styles from "./Input.module.css";
interface InputProps {
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    title: string;
    initialValue?: string;
    disabled?: boolean;
}

export class SmallInput extends PureComponent<InputProps> {
    render() {
        return <div style={{}} className={styles.input}>
            <div className={styles.inputTitleSmall}>{this.props.title}</div>
            <input disabled={this.props.disabled} className={styles.inputValueSmall} type='text' defaultValue={this.props.initialValue ? this.props.initialValue : ''} onChange={this.props.handleChange}/>
        </div>
    }
}

export class MediumInput extends PureComponent<InputProps> {
    render() {
        return <div className={styles.input}>
            <div className={styles.inputTitleMedium}>{this.props.title}</div>
            <input className={styles.inputValueMedium} type='text' onChange={this.props.handleChange}/>
        </div>
    }
}

interface InputWithAutocompleteProps {
    options: Array<string>;
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    title: string;
    initialValue?: string;
    disabled?: boolean;
}

export class SmallCombobox extends PureComponent<InputWithAutocompleteProps> {

    render() {
        return <div className={styles.input}>
                <div className={styles.inputTitleSmall}>{this.props.title}</div>
            <select disabled={this.props.disabled} className={styles.comboboxValueSmall} onChange={this.props.handleChange}>
                {this.props.options.map(x => {
                    if (this.props.initialValue && this.props.initialValue === x)
                        return <option selected={true}>{x}</option>
                    return <option>{x}</option>
                })}
            </select>
            </div>
    }
}
