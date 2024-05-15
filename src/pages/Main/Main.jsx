import React, { useContext, useEffect, useState } from "react";
import style from './Main.css';
import tian from './pictures/tian.png';
import img1 from './pictures/img1.jpg';
import ContactItem from "../../components/UI/ContactItem/ContactItem.jsx";
import ContactList from "../../components/UI/ContactList/ContactList.jsx";
import Searcher from "../../components/UI/Searcher/Searcher";
import LeftSideHeader from "../../components/UI/LeftSideHeader/LeftSideHeader";
import LeftSide from "../../components/UI/LeftSide/LeftSide";
import { getCookie } from "../../utils/cookie";
import { ModalContext } from "../../context";
import Modal from "../../components/UI/Modal/Modal";
import AddContactForm from "../../components/UI/AddContactForm/AddContactForm";
import UserMenu from "../../components/UI/UserMenu/UserMenu";
import { GlobalContext } from "../../context";
import { useNavigate } from "react-router-dom";
import UserMessage from "../../components/UI/UserMessage/UserMessage";
import ContactMessage from "../../components/UI/ContactMessage/ContactMessage";
import ChatBox from "../../components/UI/ChatBox/ChatBox";
import ChatBoxInput from "../../components/UI/ChatBoxInput/ChatBoxInput";
import ContactBar from "../../components/UI/ContactBar/ContactBar";
import RightSideHeader from "../../components/UI/RightSideHeader/RightSideHeader";
import RightSide from "../../components/UI/RightSide/RightSide";
import { isNullOrEmptyOrUndefined } from "../../utils/string";
import {HubConnectionBuilder} from '@microsoft/signalr';
import axios from "axios";

const Main = () => {
    const [isAddContacMenuActive, setIsAddContacMenutActive] = useState(false);
    const [isUserMenuActive, setIsUserMenuActive] = useState(false);
    const [isNetworkError, setIsNetworkError] = useState(false);
    const [contactList, setContactList] = useState([]);
    const [selectedContact, setSelectedContact] = useState({
        login: null,
        nickname: null,
        avatar: null
    });
    const [userData, setUserData] = useState({
        login: null,
        nickname: null,
        avatar: null
    });
    const [contactChats, setContactChats] = useState(new Map());
    const [chatMessages, setChatMessages] = useState(null);
    const [chatLastMessage, setChatLastMessage] = useState({
        contactLogin: null,
        text: null,
        date: null
    });
    const [contactOnlineStatuses, setContactOnlineStatuses] = useState(new Map());

    const [hubConnection, setConnection] = useState(
        new HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_BACKEND_URL}/connection`)
            .build()
    );

    useEffect(() => {
        if(userData.login !== null){
            hubConnection.start()
            .then(() => {
                hubConnection.invoke("Connect", userData.login)
                .then(() => {
                    hubConnection.on("ReceiveOnlineStatus", (contactOnlineStatus) => {
                        setContactOnlineStatuses(contactOnlineStatuses => {
                            return new Map([...contactOnlineStatuses, 
                                [contactOnlineStatus.login, contactOnlineStatus.onlineStatus]
                            ])
                        });
                    })

                    hubConnection.on("ReceiveMessage", contactMessage => {
                        const contactLogin = (contactMessage.senderLogin === userData.login) 
                            ? contactMessage.recipientLogin : contactMessage.senderLogin;
                        
                        setContactChats(prevContactChats => {
                            if(prevContactChats.has(contactLogin)){
                                const newContactChats = prevContactChats.set(contactLogin, 
                                    [...(prevContactChats.get(contactLogin)), {
                                        senderLogin: contactMessage.senderLogin,
                                        recipientLogin: contactMessage.recipientLogin,
                                        id: contactMessage.id,
                                        text: contactMessage.text,
                                        lastModify: new Intl.DateTimeFormat("ru", {dateStyle: "short", timeStyle: "short"})
                                            .format(new Date(contactMessage.dateTime))
                                    }]);
    
                                return new Map(newContactChats);
                            }
                            else{
                                return prevContactChats
                            }
                        });

                        setChatLastMessage({
                            contactLogin: contactLogin,
                            text: contactMessage.text,
                            date: new Date(contactMessage.dateTime)
                        });
                    })

                    hubConnection.on("ReceiveContactNickChange", contactNickChangeData => {
                        const contactLogin = contactNickChangeData.contactLogin;
                        const newContactNickname = contactNickChangeData.newNickname;
                        
                        setSelectedContact(selectedContact => {
                            if(contactNickChangeData.contactLogin === selectedContact.login){
                                return {...selectedContact, nickname: newContactNickname};
                            }
                            else{
                                return selectedContact;
                            }
                        })

                        setContactList(contactList => {
                            contactList.forEach((element, index, array) => {
                                if(element.profile.login === contactLogin){
                                    array[index].profile.nickname = newContactNickname;
                                }
                            });
                            return [...contactList];
                        });

                    });

                    hubConnection.on("ReceiveNewContact", newContactProfile => {
                        setContactList(contactList => {
                            contactList.push({
                                profile: {
                                    login: newContactProfile.login,
                                    nickname: newContactProfile.nickname,
                                    avatar: newContactProfile.avatar
                                },
                                messageInfo: {
                                    lastMessage: '',
                                    lastMessageDateTime: '',
                                    unreadMessageCount: ''
                                }
                            });
                            return [...contactList];
                        })
                    });

                    hubConnection.on("ReceiveRemovedContact", data => {
                        const removedContactLogin = data.login;
                        setContactList(contactList => {
                            return contactList.filter(c => c.profile.login !== removedContactLogin);
                        });

                        setContactChats(contactChats => {
                            contactChats.delete(removedContactLogin);
                            return new Map(contactChats);
                        });

                        setSelectedContact(selectedContact => {
                            if(selectedContact.login === removedContactLogin){
                                return {
                                    login: null,
                                    nuckname: null,
                                    avatar: null
                                };
                            }
                            else{
                                return selectedContact;
                            }
                        });
                        
                    });
                })
                .catch((ex) => {
                });
            })
            .catch((ex) => {
            });
        }
    }, [userData.login]);

    return(
        <div>
            <GlobalContext.Provider value={{
                userData,
                setUserData,
                selectedContact,
                setSelectedContact,

                contactChats, 
                setContactChats,
                chatMessages, 
                setChatMessages,

                chatLastMessage,
                setChatLastMessage,

                hubConnection,

                contactOnlineStatuses,
                setContactOnlineStatuses,

                contactList,
                setContactList
            }}>
                <ModalContext.Provider value={{
                    isAddContacMenuActive,
                    setIsAddContacMenutActive,
                    isUserMenuActive,
                    setIsUserMenuActive,
                    isNetworkError,
                    setIsNetworkError
                }}>
                
                    <div className="container">
                        <Modal
                            visible={isNetworkError}
                            setVisible={setIsNetworkError}
                        >
                            {"Ошибка. Нет связи с сервером"}
                        </Modal>

                        <LeftSide>
                            <Modal 
                                visible={isUserMenuActive} 
                                setVisible={setIsUserMenuActive}
                            >
                                <UserMenu/>
                            </Modal>
                            
                            <Modal 
                                visible={isAddContacMenuActive} 
                                setVisible={setIsAddContacMenutActive}
                            >
                                <AddContactForm/>
                            </Modal>

                            <LeftSideHeader/>
                            <Searcher/>
                            <ContactList/>
                        </LeftSide> 


                        <RightSide>
                            <RightSideHeader/>
                            <ChatBox/>
                            {!isNullOrEmptyOrUndefined(selectedContact.login) &&
                                <ChatBoxInput/>
                            }
                        </RightSide>
                    </div>
                </ModalContext.Provider>
            </GlobalContext.Provider>
        </div>
        
    );
}

export default Main;