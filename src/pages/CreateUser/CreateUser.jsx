import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import InputText from "../../components/InputText/InputText";
import Button from "../../components/Button/Button";
import "./CreateUser.css";
import Loading from "../../components/Loading/Loading.jsx";
import SnackBar from "../../components/SnackBar/SnackBar.jsx";
import { post } from "../../http/index.js";

const CreateUser = (props) => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");

    async function createUser(ev) {
        ev.preventDefault();
        setShowSnackBar(false);
        if (name && email && password) {
            try {
                setIsLoading(true);
                const data = {email, name, password}
                const response = await post("/create-user", JSON.stringify(data), false);
                if (!response.ok) {
                    throw new Error(`${await response.text()}`);
                }
                const responseJson = await response.json();
                clearInputs();
                setIsLoading(false);
                setSnackBarMessage("Account created successfully! You'll be redirected to login page!");
                setShowSnackBar(true);
                setTimeout(() => {
                    setShowSnackBar(false);
                    navigate("/login", {
                        replace: true
                    });
                }, 4500);
            } catch(error) {
                setIsLoading(false);
                setSnackBarMessage(JSON.parse(error.message).message);
                setShowSnackBar(true);
            }
        }
    }

    function removeSnackBar() {
        setShowSnackBar(false);
    }

    function clearInputs() {
        setName("");
        setEmail("");
        setPassword("");
    }

    return <div className="container">
        <h1>Create User</h1>
        <Form onSubmit={createUser} >
            <InputText id="name" label="Name" placeholder="Digite aqui" type="text" value={name} setValue={setName} />
            <InputText id="email" label="Email" placeholder="Digite aqui" type="email" value={email} setValue={setEmail} />
            <InputText id="password" hasIcon={true} label="Password" placeholder="Digite aqui" type="password" value={password} setValue={setPassword} />
            <Button type="submit">Create account</Button>
        </Form>
        {isLoading ? <Loading /> : null}
        {showSnackBar ? <SnackBar message={snackBarMessage} removeSnackBar={removeSnackBar}  /> : null}
    </div>;
}

export default CreateUser;