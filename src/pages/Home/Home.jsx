import "./Home.css";
import {get} from "../../http";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { logUser } from "../../store/reducers/user_reducer";
import { useNavigate } from "react-router-dom";
import SnackBar from "../../components/SnackBar/SnackBar";
import UserItem from "../../components/UserItem/UserItem";
import socket from "../../socket";
import Chat from "../Chat/Chat";
import UserIcon from "../../components/UserIcon/UserIcon.tsx";


const Home = (props) => {
    const userState = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [users, setUsers] = useState([]);
    const usersRef = useRef(users);
    const [chatSelected, setChatSelected] = useState(null);
    const chatSelectedRef = useRef(chatSelected);
    const [notifications, setNotifications] = useState([]);

    const loggedUserId = (JSON.parse(localStorage.getItem("user"))).id;
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    socket.emit("userConnected", loggedUserId);     

    useEffect(() => {
        async function startApp() {
            await createUserStore();
            await getUsers();
        }
        startApp();
    }, [])

    socket.on("message-received", (messageParam) => {
        if (!chatSelectedRef.current || chatSelectedRef.current.id != messageParam.senderId) {
            const latestUsers = usersRef.current;
            const senderUsername = latestUsers.find(user => {
                if (user.id == messageParam.senderId) {
                    return user;
                }
            });
            setSnackBarMessage(`${senderUsername.name} sent this message: ${messageParam.message}`);
            setShowSnackBar(true);
            setNotifications([...notifications, messageParam]);
        }
    })

    function removeSnackBar() {
        setShowSnackBar(false);
    }

    async function getUsers() {
        try {
            const loggedUser = JSON.parse(localStorage.getItem("user"));
            const usersSla = await get(`/get-users/${loggedUser.id}`);
            //if (JSON.parse(usersSla).error) {throw new Error(JSON.parse(usersSla).message);}
            const usersRes = (await usersSla.json()).response;
            setUsers(usersRes);
            usersRef.current = usersRes;
        } catch(error) {
            setSnackBarMessage(error.message);
            setShowSnackBar(true);
        }
    }

    //Called to recreate user in store when app is open
    async function createUserStore() {
        if (!userState.user) {
            const userLS = JSON.parse(localStorage.getItem("user"));
            const payload = {
                email: userLS.email,
                token: userLS.token,
                name: userLS.name,
                id: userLS.id
            };
            dispatch(logUser(payload));
        }
    }
    
    function logout() {
        localStorage.clear();
        navigate("/login", {replace: true});
    }

    function selectChat(item) {
        setChatSelected(item);
        chatSelectedRef.current = item;
        let newNotifications = notifications.reduce((prev, curr) => {
            if (curr.senderId != item.id) {
                prev.push(curr);
            }
            return prev;
        }, [])
        setNotifications(newNotifications);
    }

    return(
        <div style={{height: "100%"}}>
            <div className="header-home">
                <div className="ghost"></div>
                <div className="title">
                    <p>Home</p> 
                </div>
                <div className="ghost" style={{justifyContent: "end"}}>
                </div>
            </div>
            <div className="selection-container">
                <div className="user-selection">
                    {
                        users.map(user => <UserItem notifications={notifications} key={user.id} user={user} selectChat={selectChat} chatSelected={chatSelected} />)
                    }
                </div>
                <Chat id={loggedUserId} id2={chatSelectedRef?.current?.id} />
            </div>
            {showSnackBar ? <SnackBar message={snackBarMessage} removeSnackBar={removeSnackBar} /> : null}
        </div>
    );
}

export default Home;