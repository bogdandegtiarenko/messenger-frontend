import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import style from './ContactList.css';
import ContactItem from '../ContactItem/ContactItem';
import { GlobalContext, ModalContext, SearchContext } from '../../../context';
import { isNullOrEmptyOrUndefined } from '../../../utils/string';
import { getLastMessageContactBlockDate } from '../../../utils/string';

const ContactList = () => {
    const {searchString, setSearchString} = useContext(SearchContext);
    const {setIsNetworkError} = useContext(ModalContext);
    const {
        chatLastMessage,
        setChatLastMessage,
        contactList, 
        setContactList
    } = useContext(GlobalContext);

    const displayedContacts = useMemo(() => {
        var dispContacts = contactList.filter(contact => contact.profile.nickname
            .toLowerCase()
            .includes(searchString.toLowerCase()));
        
        return dispContacts;
    }, [searchString, contactList]);

    useEffect(() => {
        try{
            if(chatLastMessage !== null){
                setContactList(contactList => {
                    contactList.forEach((element, index, array) => {        
                        if(element.profile.login === chatLastMessage.contactLogin){
                            array[index].messageInfo.lastMessage = chatLastMessage.text;
                            array[index].messageInfo.lastMessageDateTime = getLastMessageContactBlockDate(chatLastMessage.date);
                        }
                    });
                    return [...contactList];
    
                });
                setChatLastMessage(null);
            }
        }
        catch(ex){}
    }, [chatLastMessage]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/Contact/GetContactBlockInfos`,{
            withCredentials: 'true'
        }).then(response => {
            if(response.status == 200){
                const contactBlockInfos = response.data;
                        
                var resultContactBlocks = contactBlockInfos.map(c => {
                    if(c.messageInfo === null){
                        return {
                            ...c,
                            messageInfo: {
                                lastMessage: '',
                                lastMessageDateTime: '',
                                unreadMessageCount: 0
                            }
                        }
                    }
                    else{   
                        return {
                            ...c,
                            messageInfo: {
                                lastMessage: c.messageInfo.lastMessage,
                                lastMessageDateTime: getLastMessageContactBlockDate(new Date(c.messageInfo.lastMessageDateTime)),
                                unreadMessageCount: 0
                            }
                        }
                    }
                });
                setContactList(resultContactBlocks);
            }
        })
        .catch(ex => {
            if(ex.code === 'ERR_NETWORK'){
                setIsNetworkError(true);
            } 
        });
    }, []);

    return (
        <div className='chatlist'>
            {displayedContacts.map(c => 
                <ContactItem 
                    login={c.profile.login}
                    nick={c.profile.nickname}
                    avat={c.profile.avatar}
                    lastMes={c.messageInfo.lastMessage}
                    lastMesDateTime={c.messageInfo.lastMessageDateTime}
                    unreadMesCount={c.messageInfo.unreadMessageCount}
                    key={c.profile.login}
                />)
            }
        </div>
    );
};

export default ContactList;
