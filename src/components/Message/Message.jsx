import "./Message.css";

const Message = (props) => {
    const {message, id} = props;
    const date = new Date(message.createdAt);
    const loggedUserSended = message.senderId == id;

    return <div key={message.id} className="message-container" style={{justifyContent: loggedUserSended ? "end" : "start"}}>
        <div className="message" 
        style={{backgroundColor: loggedUserSended ? "lightgreen" : "lightblue", 
        alignItems: loggedUserSended ? "end" : 'start', 
        borderRadius: loggedUserSended ? "10px 0px 10px 10px" : "0px 10px 10px 10px",
        paddingLeft: loggedUserSended ? "0px" : "10px"}}>
            {
                message.type == "text" ? <p>{message.text}</p> : <div>
                    <img height={100} width={100} src={message.blob} />
                </div>
            }
            <div style={{padding: loggedUserSended ? "0px 0px 0px 15px" : "0px 15px 0px 0px", width: "100%", display: "flex", justifyContent: loggedUserSended ? "start" : "end"}}>
                {date.getHours().toString().padStart(2, "0")}:{date.getMinutes().toString().padStart(2, "0")} {date.getDate().toString().padStart(2, "0")}/{(date.getMonth() + 1).toString().padStart(2, "0")}/{date.getFullYear()}
            </div>
        </div>
    </div>
}

export default Message;
