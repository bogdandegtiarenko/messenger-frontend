import React from "react";
import style from './ContactMessage.css';

const ContactMessage = ({text, dateTime, isMessageRead, key}) => {
    return (
        <div class="message frnd_message">
            <p>{text}<br/><span>{dateTime}</span></p>
        </div>
    );
}

export default ContactMessage;