import { useState } from "react";
import "./UserItem.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UserItem = (props) => {
    const {user} = props;
    const [itemClasses, setItemClasses] = useState(["item"]);
    const navigate = useNavigate();
    const userSlice = useSelector(state => state.user);

    function animationUp() {
        setItemClasses([itemClasses[0], "itemAnimation"]);
    }

    function animationDown() {
        setItemClasses([itemClasses[0], "itemAnimationBackward"]);
    }

    function startChat() {
        props.selectChat(user);
        return;
        navigate(`/chat/${userSlice.user.payload.id}/${user.id}`);
    }

    return <div className={itemClasses.join(" ")} onMouseEnter={animationUp} onMouseLeave={animationDown} onClick={startChat} style={{
        border: props.chatSelected?.id == user.id ? "2px solid red" : ""
    }}>
        <div style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        }}>
            <img className="user-img" src="profile.png" />
            <p>{user.name}</p>
            <div className="notification-counter-container">
                {
                    (props.notifications.filter(not => not.senderId == user.id)).length > 0 ? <div className="notification-counter">
                        {(props.notifications.filter(not => not.senderId == user.id)).length}
                    </div> : null
                }
            </div>
        </div>
        <img src="chevron-forward-outline.svg" style={{
            height: "45px",
            width: "45px",
            filter: "invert(50%) brightness(119%) contrast(119%)"
        }} />
    </div>
}

export default UserItem;