import "./Button.css";

const Button = (props) => {
    return <div className="d-grid gap-2">
        <button className="btn btn-primary" type={props.type ? props.type : "button"} onClick={props.buttonClicked} >{props.children}</button>
    </div>
};

export default Button;