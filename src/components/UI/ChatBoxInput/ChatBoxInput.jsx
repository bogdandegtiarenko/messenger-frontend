import {React, useContext, useRef, useState} from "react";
import style from './ChatBoxInput.css';
import { GlobalContext, ModalContext } from "../../../context";
import { isNullOrEmptyOrUndefined } from "../../../utils/string";
import axios from "axios";
import { Guid } from 'js-guid';
import { getLastMessageContactBlockDate } from "../../../utils/string";
import signalR from '@microsoft/signalr';

const ChatBoxInput = () => {
    const [text, setText] = useState('');
    const textInputRef = useRef(null);
    const {
        userData,
        selectedContact,
        contactChats, 
        setContactChats,

        chatLastMessage,
        setChatLastMessage,

        hubConnection,        
    } = useContext(GlobalContext)
    
    const {setIsNetworkError} = useContext(ModalContext);

    const sendMessage = async (tempId, recipientLogin, text) => {

        setTimeout(async () => {
            try{
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/Message/AddMessage`, {
                    senderLogin: userData.login,
                    recipientLogin: recipientLogin,
                    text: text,
                    senderConnectionId: hubConnection.connectionId
                },{ withCredentials: true });
    
                if(response.status === 200){
                    const newMessageData = response.data;
                    const date = new Date(newMessageData.operationDate);

                    setContactChats(contactChats => {
                        const messages = contactChats.get(recipientLogin);
                        messages.forEach((element, index, array) => {
                            if(element.id === tempId){
                                array[index] = {
                                    ...array[index], 
                                    id: newMessageData.id, 
                                    lastModify: new Intl.DateTimeFormat("ru", {dateStyle: "short", timeStyle: "short"}).format(date),
                                    isSending: false,
                                    isSent: true
                                }
                            }
                        });
    
                        contactChats.set(recipientLogin, messages);
                        return new Map(contactChats);
                    })

                    setChatLastMessage({
                        contactLogin: recipientLogin,
                        text: text,
                        date: date
                    });
                }
    
            }
            catch(ex){
                if(ex.code === 'ERR_NETWORK'){
                    setIsNetworkError(true);
                }
                
                setContactChats(contactChats => {
                    const messages = contactChats.get(recipientLogin);
                    messages.forEach((element, index, array) => {
                        if(element.id === tempId){
                            array[index] = {
                                ...array[index], 
                                isSending: false,
                                isSent: false
                            }
                        }
                    });
    
                    contactChats.set(recipientLogin, messages);
                    return new Map(contactChats);
                })
                
            }
        }, 350);
        
    };

    const addMessage = async () => {
        if(isNullOrEmptyOrUndefined(text)){
            return;
        }
        const tempId = Guid.newGuid().StringGuid;
        const newMessage = {
            id: tempId,
            senderLogin: userData.login,
            recipientLogin: selectedContact.login,
            text: text,
            lastModify: new Intl.DateTimeFormat("ru", {dateStyle: "short", timeStyle: "short"}).format(new Date()),
            isSending: true,
            isSent: false
        };
        
        setContactChats(contactChats => {
            contactChats.set(newMessage.recipientLogin, [
                ...(contactChats.get(newMessage.recipientLogin)),
                newMessage
            ]);
            return new Map(contactChats);
        });

        sendMessage(tempId, selectedContact.login, text);

        setText('');
        textInputRef.current.value = '';
    }
    
    return (
        <div class="chatBox_input">
            <input 
                type="text" 
                placeholder="Напиши сообщение" 
                ref={textInputRef}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if(e.key === 'Enter'){
                        addMessage();
                    }
                }}
            />
            <div onClick={addMessage}>
                <ion-icon name="chevron-back-circle-outline"/>
            </div>
        </div>
    );
};

export default ChatBoxInput;