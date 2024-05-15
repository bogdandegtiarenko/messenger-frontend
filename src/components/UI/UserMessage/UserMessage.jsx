import React, { useEffect } from "react";
import style from './UserMessage.css';


const UserMessage = ({text, dateTime, isSending = false, isSent = true}) => {
    var backgroundColor = '';
    if(isSending){
        backgroundColor = '#bdb7b7';
    }
    else{
        if(isSent){
            backgroundColor = 'rgb(186 255 133)';
        }
        else{
            backgroundColor = 'rgb(255 171 171)';
        }
    }

    return (
        <div class="message my_message" >
            <p style={{
                background: backgroundColor
            }}>
                {text}<br/>
                <span>{dateTime}</span>
            </p>
        </div>
    );
}

export default UserMessage;