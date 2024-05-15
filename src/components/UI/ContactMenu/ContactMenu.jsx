import React from "react";
import style from './ContactMenu.css';
import img1 from '../../../pages/Main/pictures/img1.jpg';

const ContactMenu = ({
    login,
    nickname,
    avatar
}) => {
    return(
        <div className="contactMenuContainer">
            <div className="mainTitle">Информация о контакте</div>
            <div className="contactAvatar">
                <img src={avatar} className="img"/>
            </div>
            <div className="infoTitle">Логин:<div>{login}</div></div>
            <div className="infoTitle">Ник:<div>{nickname}</div></div>
        </div>
    )
};

export default ContactMenu;