import {React, useContext, useEffect, useState, useRef} from "react";
import style from './ChatBox.css';
import { GlobalContext, ModalContext } from "../../../context";
import UserMessage from "../UserMessage/UserMessage";
import ContactMessage from "../ContactMessage/ContactMessage";
import { isNullOrEmptyOrUndefined } from "../../../utils/string";
import axios from "axios";

const ChatBox = () => {
    const {
        userData,
        selectedContact,
        contactChats, 
        setContactChats,
        chatMessages, 
        setChatMessages
    } = useContext(GlobalContext);

    const {setIsNetworkError} = useContext(ModalContext);

    const scrollableBox = useRef(null);


    useEffect(() => {
        setChatMessages(contactChats.get(selectedContact.login));
    }, [contactChats]);
    
    useEffect(() => {
        if(scrollableBox.current){
            scrollableBox.current.scrollTop = scrollableBox.current.scrollHeight;
        }
    });

    useEffect(() => {
        if(isNullOrEmptyOrUndefined(selectedContact.login)){
            setChatMessages(null);
        }
        else{
            if(contactChats.has(selectedContact.login)){
                setChatMessages(contactChats.get(selectedContact.login));
            }
            else{
                axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/Message/GetChatMessages?contactLogin=${selectedContact.login}`, {
                    withCredentials: true
                }).then(response => {
                    if(response.status === 200){
                        const messageList = response.data;
                        messageList.forEach((element, index, array) => {
                            const date = new Date(element.lastModify);
                            const dateShortFormat = new Intl.DateTimeFormat("ru", {dateStyle: "short", timeStyle: "short"}).format(date);
                            array[index] = {...array[index], lastModify: dateShortFormat.toString()};
                        });

                        setContactChats(contactChats => {
                            return new Map(contactChats.set(selectedContact.login, messageList));
                        });
                    }
                }).catch(ex => {
                    if(ex.code === 'ERR_NETWORK'){
                        setIsNetworkError(true);
                    } 
                });                  
            }
        }
    }, [selectedContact.login])

    return (
        <div className="chatBox" ref={scrollableBox}>
            {!isNullOrEmptyOrUndefined(chatMessages) &&
                chatMessages.map(messageData => {
                    if(messageData.senderLogin === userData.login){
                        return (
                            <UserMessage 
                                text={messageData.text}
                                dateTime={messageData.lastModify}
                                key={messageData.id}
                                isSending={messageData.isSending}
                                isSent={messageData.isSent}
                            />
                        )
                    }
                    else if(messageData.senderLogin === selectedContact.login){
                        return (
                            <ContactMessage 
                                text={messageData.text}
                                dateTime={messageData.lastModify}
                                key={messageData.id}
                            />
                        )
                    }
                })
            }
        </div>
    );
};

export default ChatBox;