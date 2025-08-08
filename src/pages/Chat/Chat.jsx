import { useParams } from "react-router-dom";
import "./Chat.css";
import { get, post } from "../../http"
import { useEffect, useRef, useState } from "react";
import socket, { send } from "../../socket";
import SnackBar from "../../components/SnackBar/SnackBar";
import Message from "../../components/Message/Message";
import ReactModal from "react-modal";

const modalStyles = {
    content: {
        top:  '50%',
        left: '50%',
        transform: "translate(-50%, -50%)"
    }
};

const Chat = (props) => {
    let {id, id2} = props;
    const chatSpace = useRef();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const inputFile = useRef(null);
    const [fileBs64, setFileBs64] = useState(null);
    const fileRef = useRef(fileBs64);

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

        //for(let i = 0; i < responseObj.response.length; i++) {
        //    let messageItem = responseObj.response[i];
        //    if (messageItem.type == "blob") {
        //        console.log(messageItem.blob.data);
        //        let blob = new Blob(messageItem.blob.data, {type: "image/png"});
        //      
        //       let fileReader = new FileReader();
        //       fileReader.readAsDataURL(blob);
        //       fileReader.onloadend = (ev) => {
        //        console.log(ev);
        //           messageItem.blob = ev.target.result;
        //       }
        //    }
        //    
        //}
        setTimeout(() => {
            setMessages(responseObj.response);
        }, 300);
        if (responseObj.response.length > 0) {
            setTimeout(() => {
                scrollToLastMessage()
            }, 500);
        }
    }

    function scrollToLastMessage() {
        setTimeout(() => {
            chatSpace.current.lastElementChild.scrollIntoView({behavior: "smooth"});
        }, 50)
    }

    async function sendMessage(ev, isFile = false) {
        try {
            let messg = !isFile ? {
                message,
                senderId: id,
                receiverId: id2,
                type: 'text'
            } : {
                senderId: id,
                receiverId: id2,
                type: 'blob',
                blob: fileRef.current.fileBase64
            };

            const res = await post("/send-message", JSON.stringify(messg));
            const resJson = await res.json();
            if (isFile) {
                resJson.response.blob = fileRef.current.fileBase64;
            }
            setMessage("");
            setFileBs64(null);
            setIsModalOpen(false);
            setMessages([...messages, resJson.response]);
            scrollToLastMessage();
            messg.createdAt = resJson.response.createdAt;
            socket.emit("message-sent", messg);
        } catch(error) {

        }
    }
    
    function setFile() {
        if (inputFile) {
            //console.log(inputFile);
            let fileReader = new FileReader();
            let fileblb = new Blob([inputFile.current.files[0]]);
            fileReader.readAsDataURL(inputFile.current.files[0]);
            fileReader.onloadend = async (ev) => {
                //console.log(ev);
                //console.log(inputFile);
                const a = {
                    fileBase64: ev.target.result,
                    fileName: inputFile.current.files[0].name,
                    fileBlob: fileblb,
                };

                let formData = new FormData();
                formData.append("abc", fileblb);
                const res = await fetch("http://localhost:3001/teste-msg", {
                    method: "POST",
                    body: formData,
                });
                console.log(await res.text());
                setFileBs64(a);
                fileRef.current = a;
            }
            return;
        }
        console.error("No element found");
        return;
    }

    return <div className="chat-container" style={{flexGrow: id && id2 ? null : "0"}}>
        {
            !id2 ? null : <div className="chat-text-space" ref={chatSpace}>
                {
                    messages.map(message => {
                        return <Message message={message} id={message.id} key={message.id} />
                    })
                }
            </div>
        }
        {
            !id2 ? null : <div className="input-chat">
                <input className="chat-input-text" type="text" placeholder="Type your message here!" value={message} onChange={(ev) => {setMessage(ev.target.value)}} />
                <button className="send-button" onClick={sendMessage} disabled={message.length == 0}>Send</button>
                <button className="addFileButton" onClick={()=> {setIsModalOpen(true)}} ><img src="attach.svg" /></button>
            </div>
            
        }
        
        <ReactModal isOpen={isModalOpen} style={modalStyles} appElement={document.getElementById('root')}>
            <div style={{display:"flex", flexDirection:"column"}}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <h1>Add file</h1>
                    <button onClick={(ev)=>{setIsModalOpen(false)}}>X</button>
                </div>
                <div>
                    <label for="file" className="upload-button">Upload file</label>
                    <input type="file" id="file" name="file" accept=".jpg, .jpeg, .png" ref={inputFile} onChange={setFile} />
                    {
                        !fileBs64 ? null : <div>
                            <h6>{fileBs64.fileName}</h6>
                            <img src={fileBs64.fileBase64} />
                            <br/>
                            <button onClick={(ev) => {sendMessage(ev, true)}}>Send file</button>
                        </div> 
                    }
                </div>
            </div>
        </ReactModal>
    </div>
}


export default Chat;