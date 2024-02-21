import "./UserIcon.css";
import React, { useState } from 'react'

const UserIcon = (props) => {

    const [showMenu, setShowMenu] = useState(false);

    return <div className="user-icon" onMouseEnter={() => {setShowMenu(true)}} onMouseLeave={() => {setShowMenu(false)}}>
        <img src="profile.png" />
        {
            !showMenu ? null : <div className="menu">adsasdas</div>
        }
    </div>
}

export default UserIcon;