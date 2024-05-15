import {React, useContext, useEffect, useState} from "react";
import style from './ContactBar.css';
import { GlobalContext } from "../../../context";
import Modal from "../Modal/Modal";
import ContactMenu from "../ContactMenu/ContactMenu";
import {HubConnectionState} from '@microsoft/signalr';
import { isNullOrEmptyOrUndefined } from "../../../utils/string";


const ContactBar = () => {
    const [isContactMenuActive, setIsContactMenuActive] = useState(false);
    const [isContactOnline, setIsContactOnline] = useState(null);
    const {
        selectedContact,
        setSelectedContact,
        hubConnection,
        contactOnlineStatuses,
        setContactOnlineStatuses
    } = useContext(GlobalContext);
    
    useEffect(() => {
        setIsContactOnline(null);
        if(hubConnection.state === HubConnectionState.Connected){
            hubConnection.invoke("CheckOnlineStatus", selectedContact.login);
        }
    }, [selectedContact.login]);


    useEffect(() => {
        setTimeout(() => {
            var isContactOnline = contactOnlineStatuses.get(selectedContact.login);
            setIsContactOnline(isContactOnline);
        }, 500);
    }, [contactOnlineStatuses]);


    return (
        <div>
            {selectedContact.login !== null
            &&
            <div class="imgText">
                <Modal 
                    visible={isContactMenuActive}
                    setVisible={setIsContactMenuActive}
                >
                    <ContactMenu 
                        login={selectedContact.login}
                        nickname={selectedContact.nickname}
                        avatar={selectedContact.avatar}
                    />
                </Modal>
                
                <div class="userimg" onClick={() => setIsContactMenuActive(true)}>
                    <img src={selectedContact.avatar} class="cover"/>
                </div>
                <h4>
                    {selectedContact.nickname}<br/>
                    {isContactOnline === null || isContactOnline === undefined
                    ?
                    <span class="offlineContactStatus">Определяется...</span>
                    :
                    isContactOnline ?
                    <span class="onlineContactStatus">В сети</span>
                    :
                    <span class="offlineContactStatus">Не в сети</span>
                    }
                </h4>
            </div>
            }
        </div>
        
    );
};

export default ContactBar;