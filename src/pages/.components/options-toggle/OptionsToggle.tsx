import React from "react";
import "@pages/.components/options-toggle/OptionsToggle.scss"

type OptionsToggleType = {
    name: string,
    text: string,
    checked: boolean,
    onChange: React.ChangeEventHandler<HTMLInputElement>
}

export default function OptionsToggle(props: OptionsToggleType) {
    const name = props.name;
    const text = props.text;
    const checked = props.checked;
    const onChange = props.onChange

    return (
        <div>
            <label className="toggle">
                <input type="checkbox" name={name} id={`${name}-checkbox`} checked={checked} onChange={onChange} />
                <span className="slider">test</span>
                <label htmlFor={name}>{text}</label>
            </label>
        </div>
    )
}
