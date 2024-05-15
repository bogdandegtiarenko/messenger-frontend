import React from "react";
import style from './RemoveContactMenu.css';
import { useContext } from "react";
import { GlobalContext, ModalContext } from "../../../context";
import axios from "axios";

const RemoveContactMenu = ({setModalVisible}) => {
    const {
        userData,
        setUserData,
        selectedContact,
        setSelectedContact,
        contactList,
        setContactList,
        contactChat,
        setContactChats
    } = useContext(GlobalContext);
    
    const {setIsNetworkError} = useContext(ModalContext);

    const removeContact = async () => {
        try{
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/Contact/RemoveContact?contactLogin=${selectedContact.login}`,{
                withCredentials: true
            });

            if(response.status === 200){
                const newContactList = contactList.filter((c) => c.profile.login !== selectedContact.login);                
                setContactList(newContactList);
                
                setContactChats(contactChats => {
                    contactChats.delete(selectedContact.login);
                    return new Map(contactChats);
                });
                
                setSelectedContact({
                    login: null,
                    nuckname: null,
                    avatar: null
                });
                setModalVisible(false);
            }
            
        }
        catch(ex){
            if(ex.code === 'ERR_NETWORK'){
                setModalVisible(false);
                setIsNetworkError(true);
            }
        }
    }

    return (
        <div>
            <div id="removeContactTitle">Удаление контакта</div>
            <div id="removeContactQuestion">Пользователя под ником: <div id="contactNick">{selectedContact.nickname}</div></div>
            <div className="buttonContainer">
                <button
                    className="removeContactButton"
                    id="remove"
                    onClick={removeContact}
                >
                    Удалить
                </button>
                <button
                    className="removeContactButton"
                    id="back"
                    onClick={() => setModalVisible(false)}
                >
                    Назад
                </button>
            </div>
        </div>
    );
};

export default RemoveContactMenu;