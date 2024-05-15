import React, { useEffect, useState, useContext } from 'react';
import style from './Contact.css';
import { removeSubstring } from '../../../utils/string.js';
import { GlobalContext } from '../../../context';

const ContactItem = ({
    login, 
    nick, 
    avat, 
    lastMes, 
    lastMesDateTime, 
    unreadMesCount
}) => {
    const {
        selectedContact,
        setSelectedContact
    } = useContext(GlobalContext);

    const contactLogin = login;
    const [nickname, setNickname] = useState(nick);
    const [lastMessage, setLastMessage] = useState(lastMes);
    const [lastMessageDateTime, setLastMessageDateTime] = useState(lastMesDateTime);
    const [unreadMessageCount, setUnreadMessageCount] = useState(unreadMesCount);
    const [avatar, setAvatar] = useState(avat);
    const [styleClass, setStyleClass] = useState('block');

    useEffect(() => {
        setNickname(nick);
        setAvatar(avat);
        setLastMessage(lastMes);
        setLastMessageDateTime(lastMesDateTime);
        setUnreadMessageCount(unreadMesCount);
    }, [nick, avat, lastMes, lastMesDateTime, unreadMesCount]);


    useEffect(() => {
        if(unreadMessageCount > 0){
            setStyleClass((prevStyleClass) => {
                return prevStyleClass + " unread";
            });
        }
        else{
            setStyleClass((prevStyleClass) => {
                return removeSubstring(prevStyleClass, " unread");
            });
        }
    }, [unreadMessageCount]);

    useEffect(() => {
        if(selectedContact.login === contactLogin){
            setStyleClass((prevStyleClass) => {
                return prevStyleClass + " active";
            });
        }
        else{
            setStyleClass((prevStyleClass) => {
                return removeSubstring(prevStyleClass, " active");
            });
        }
    }, [selectedContact.login]);

    const leftMouseClick = () => {
        setSelectedContact({
            login: contactLogin,
            nickname: nickname,
            avatar: avatar
        })
    }
    const rightMouseClick = (e) => {
        e.preventDefault();
        console.log(login);
    }

    return (
        <div 
            className={styleClass} 
            onClick={leftMouseClick}
            onContextMenu={rightMouseClick}
        >
            <div className="imgbx">
                <img src={avatar} className="cover"/>
            </div>
            <div className="details">
                <div className="listHead">
                    <h4>{nickname}</h4>
                    <p class="time">{lastMesDateTime}</p>
                </div>
                <div class="message_p">
                    <p>{lastMessage}</p>
                    {unreadMessageCount > 0 &&
                        <b>{unreadMessageCount}</b>
                    }
                </div>
            </div>
        </div>
    );
};

export default ContactItem;