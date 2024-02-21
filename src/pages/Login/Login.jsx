import { useEffect, useState } from "react";
import InputText from "../../components/InputText/InputText";
import Form from "../../components/Form/Form.jsx";
import Button from "../../components/Button/Button.jsx";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logUser } from "../../store/reducers/user_reducer.js";
import SnackBar from "../../components/SnackBar/SnackBar.jsx";
import { post } from "../../http/index.js";

const Login = (props) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");

    async function finalizarLogin(ev) {
        ev.preventDefault();
        if (email && password) {
            try {
                const user = {email, password};
                const response = await post("/login", JSON.stringify(user), false);
                if (!response.ok) {throw new Error(await response.text());}
                const responseData = await response.json();
                const payload = {
                    email: user.email,
                    token: responseData.token,
                    name: responseData.name,
                    id: responseData.id
                };
                localStorage.setItem("user", JSON.stringify(payload));
                dispatch(logUser(payload));
                navigate("/home", {replace: true});
            } catch(error) {
                console.log(error);
                setSnackBarMessage(JSON.parse(error.message).message);
                setShowSnackBar(true);
                setTimeout(() => {
                    setShowSnackBar(false);
                }, 4200);
            }
        }
    }

    function buttonClick(ev) {
        navigate("/create-user")
    }

    return (
        <div>
            <div className="login-container">
                <h1>Login</h1>
                <Form onSubmit={finalizarLogin} >
                    <InputText id="email" label="Email" placeholder="Digite aqui" type="text" value={email} setValue={setEmail} />
                    <InputText id="password" hasIcon={true} label="Password" placeholder="Digite aqui" type="password" value={password} setValue={setPassword} />
                    <Button type="submit">Login</Button>
                    <div className="criar-conta-div">
                        <Button buttonClicked={buttonClick}>Create account</Button>
                    </div>
                </Form>
                {showSnackBar ? <SnackBar message={snackBarMessage} /> : null}
            </div>
        </div>
    )
}

export default Login;