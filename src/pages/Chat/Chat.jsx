import { useParams } from "react-router-dom";
import "./Chat.css";
import { get, post } from "../../http"
import { useEffect, useRef, useState } from "react";
import socket from "../../socket";
import SnackBar from "../../components/SnackBar/SnackBar";
import Message from "../../components/Message/Message";

const Chat = (props) => {
    let {id, id2} = props;
    const chatSpace = useRef();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    socket.on("message-received-chat", (messageParam) => {
        if (messageParam.senderId == id2) {
            let msg = {
                text: messageParam.message,
                receiverId: messageParam.receiverId,
                senderId: messageParam.senderId,
                ...messageParam
            }
            setMessages([...messages, msg]);
            scrollToLastMessage();
        }
    })

    useEffect(() => {
        if (id2) {
            getMessages();
        }

        return () => {
            id2 = null;
            socket.off("message-received-chat")
        }
    }, [id2])

    async function getMessages() {
        const response = await get(`/get-messages/${id}/${id2}`);
        const responseObj = await response.json();
        setMessages(responseObj.response);
        if (responseObj.response.length > 0) {
            scrollToLastMessage()
        }
    }

    function scrollToLastMessage() {
        setTimeout(() => {
            chatSpace.current.lastElementChild.scrollIntoView({behavior: "smooth"});
        }, 50)
    }

    async function sendMessage(ev) {
        try {
            let messg = {
                message,
                senderId: id,
                receiverId: id2,
            }
            const res = await post("/send-message", JSON.stringify(messg));
            const resJson = await res.json();
            setMessage("");
            setMessages([...messages, resJson.response]);
            scrollToLastMessage();
            messg.createdAt = resJson.response.createdAt;
            socket.emit("message-sent", messg);
        } catch(error) {

        }
    }

    return <div className="chat-container" style={{flexGrow: id && id2 ? null : "0"}}>
        {
            !id2 ? null : <div className="chat-text-space" ref={chatSpace}>
                {
                    messages.map(message => {
                        return <Message message={message} id={id} />
                    })
                }
            </div>
        }
        {
            !id2 ? null : <div className="input-chat">
                <input className="chat-input-text" type="text" placeholder="Type your message here!" value={message} onChange={(ev) => {setMessage(ev.target.value)}} />
                <button className="send-button" onClick={sendMessage} disabled={message.length == 0}>Send</button>
            </div>
        }
    </div>
}


export default Chat;