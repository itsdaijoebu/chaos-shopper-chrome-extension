import React from "react";
import "@pages/options/Options.css"

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
            <input type="checkbox" name={name} id={`${name}-checkbox`} checked={checked} onChange={onChange}/>
            <label htmlFor={name}>{text}</label>
        </div>
    )
}
