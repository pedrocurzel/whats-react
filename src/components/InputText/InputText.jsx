import { useState } from "react";
import "./InputText.css";

const InputText = (props) => {

    const [visibility, setVisibility] = useState(props.type);

    function changeVisibility() {
        if (visibility == "password") {
            setVisibility("text");
        } else {
            setVisibility("password");
        }
    }

    return <div className="form-floating mb-3">
        <input className="form-control" id={props.id} required type={visibility} placeholder={props.placeholder} value={props.value} onChange={(value) => props.setValue(value.target.value)}  />
        {
            props.type == "password" ? <img src={visibility == "password" ? "/eye.svg" : "eye-off.svg"} className="icon" onClick={changeVisibility} /> : null
        }
        <label htmlFor={props.id}>{props.label}</label>
    </div>;
}

export default InputText;