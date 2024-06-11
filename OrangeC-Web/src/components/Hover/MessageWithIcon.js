import React, { useState } from 'react';
import '../../css/chatWindow.css';
import { IoMdMore } from "react-icons/io";
import { TbMessageCircleX } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { RiShareForwardFill } from "react-icons/ri";

const MessageWithIcons = () => {
    const [showIcons, setShowIcons] = useState(false);

    const handleMouseEnter = () => {
        setShowIcons(true);
    };

    const handleMouseLeave = () => {
        setShowIcons(false);
    };

    return (
        <div className="message" id="message-1" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{display: 'flex'}}>
            <IoMdMore style={{fontSize: '20', color: '#F24E1E'}}/>
            <div className="icons" style={{ display: showIcons ? 'block' : 'none' }}>
            <TbMessageCircleX style={{fontSize: '20', color: '#F24E1E'}}/>
            <MdDelete style={{fontSize: '20', color: '#F24E1E'}}/>
            <RiShareForwardFill style={{fontSize: '20', color: '#F24E1E'}}/>
            </div>
        </div>
    );
};

export default MessageWithIcons;