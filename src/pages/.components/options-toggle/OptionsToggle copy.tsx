import React, { useEffect, useState } from "react";
import "@pages/.components/options-toggle/OptionsToggle.scss"

type OptionsToggleType = {
    name: string,
    text: string,
    checked: boolean,
    onChange: React.ChangeEventHandler<HTMLInputElement>,
    isLoaded: boolean;
}

export default function OptionsToggle(props: OptionsToggleType) {
    const name = props.name;
    const text = props.text;
    const checked = props.checked;
    const onChange = props.onChange;
    const isLoaded = props.isLoaded;

    return (
        <label className={`toggle ${isLoaded ? '' : 'preload'}`} htmlFor={name}>
            <input type="checkbox" className="toggle__input " id={name} checked={checked} onChange={onChange} />
            <span className="toggle-track">
                <span className="toggle-indicator">
                    <span className="checkmark">
                        <svg viewBox="0 0 24 24" id="ghq-svg-check" role="presentation" aria-hidden="true">
                            <path d="M9.86 18a1 1 0 01-.73-.32l-4.86-5.17a1.001 1.001 0 011.46-1.37l4.12 4.39 8.41-9.2a1 1 0 111.48 1.34l-9.14 10a1 1 0 01-.73.33h-.01z"></path>
                        </svg>
                    </span>
                </span>
            </span>
            {text}
        </label>
    )
}
