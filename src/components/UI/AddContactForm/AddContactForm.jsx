import React, { useContext, useState } from 'react';
import style from './AddContactForm.css';
import { GlobalContext, ModalContext } from '../../../context';
import axios from 'axios';

const AddContactForm = ({setVisible}) => {
    const [newContactLogin, setNewContactLogin] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const {setIsAddContacMenutActive, setIsNetworkError} = useContext(ModalContext);
    const {contactList, setContactList} = useContext(GlobalContext);

    const addContact = async () => {
        try{
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/Contact/AddContact?contactLogin=${newContactLogin}`, 
                undefined, {
                withCredentials: true
            });

            if(response.status === 200){
                const contactProfile = await response.data;

                const contact = {
                    profile: {
                        login: contactProfile.login,
                        nickname: contactProfile.nickname,
                        avatar: contactProfile.avatar
                    },
                    messageInfo: {
                        lastMessage: '',
                        lastMessageDateTime: '',
                        unreadMessageCount: 0
                    }
                }

                setContactList([...contactList, contact])
                setStatusMessage("Контакт успешно добавлен");
            }
        }   
        catch(ex){
            if(ex.code === 'ERR_NETWORK'){
                setIsNetworkError(true);
                setIsAddContacMenutActive(false);
            }
            else{
                setStatusMessage("Ошибка добавления контакта");
            }
        }
    };


    return (
        <div className="addContactForm">
            <div className="addContactTitle">Добавление контакта</div>
            <input 
                type="text" 
                id="contactNameInput" 
                placeholder="Логин нового контакта"
                onChange={(e) => setNewContactLogin(e.target.value)}
            />
            <div className="buttonContainer">
                <button 
                    className="submit"
                    onClick={addContact}
                >
                    Добавить
                </button>
                
                <button 
                    className="back"
                    onClick={() => {
                        setStatusMessage('');
                        setIsAddContacMenutActive(false)
                    }}
                >
                    Назад
                </button>
            </div>
            <div className="statusMessage">{statusMessage}</div>

        </div>
    );
};

export default AddContactForm;