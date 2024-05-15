import React, { useContext, useState } from "react";
import style from './UserMenu.css'
import { AuthContext, GlobalContext, ModalContext } from "../../../context";
import {  } from "../../../context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isNullOrEmptyOrUndefined } from "../../../utils/string";
import tian from '../../../pages/Main/pictures/tian.png';


const UserMenu = () => {
    const [isChangeNicknameActive, setIsChangeNicknameActive] = useState(false);
    const [isChangeEmailActive, setIsChangeEmailActive] = useState(false);
    const [isChangePasswordActive, setIsChangePasswordActive] = useState(false);

    const [newNickname, setNewNickname] = useState('');
    const [newLogin, setNewLogin] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRepeat, setNewPasswordRepeat] = useState(''); 

    const [statusMessage, setStatusMessage] = useState('');

    const {setIsUserMenuActive, setIsNetworkError} = useContext(ModalContext);
    const {
        userData, 
        setUserData, 
        hubConnection
    } = useContext(GlobalContext);
    const {isAuth, setIsAuth} = useContext(AuthContext);
    const navigate = useNavigate();

    const resetStatusMessage = () => {
        setTimeout(() => {
            setStatusMessage('');
        }, 4000);
    }

    const logout = async () => {
        try{
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/Account/Logout`, {
                withCredentials: true
            });

            if(isAuth){
                setIsAuth(false);
                hubConnection.stop();
            }

            navigate('/');
        }
        catch(ex){
            if(ex.code === 'ERR_NETWORK'){
                setIsNetworkError(true);
                setIsUserMenuActive(false);
            }
        }
    }

    const submitNewNickname = async () => {
        if(isNullOrEmptyOrUndefined(newNickname)){
            setStatusMessage('Некорректный никнейм');
        }
        else{
            try{
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/Account/ChangeNickname?newNickname=${newNickname}`,null,{
                    withCredentials: true
                });
                if(response.status === 200){
                    setUserData({...userData, nickname: newNickname});
                    setStatusMessage('Никнейм успешно изменен');
                }
            }
            catch(ex){
                if(ex.code === 'ERR_NETWORK'){
                    setIsNetworkError(true);
                    setIsUserMenuActive(false);
                } 
                else{
                    setStatusMessage('Ошибка изменения никнейна');
                }
            }
            finally {
                resetStatusMessage();
            }
        }
    };

    const submitNewEmail = async () => {

        try{
            if(isNullOrEmptyOrUndefined(newEmail)){
                setStatusMessage('Некорректный email');
            }
            else{
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/Account/ChangeEmail?newEmail=${newEmail}`,null,{
                    withCredentials: true
                });
                if(response.status === 200){
                    setStatusMessage('Email успешно изменен');
                }
            }
        }
        catch(ex){
            if(ex.code === 'ERR_NETWORK'){
                setIsNetworkError(true);
                setIsUserMenuActive(false);
            }
            else{
                setStatusMessage('Ошибка изменения email');
            }
        }
        finally{
            resetStatusMessage();
        }        
    };

    const submitNewPassword = async () => {
        try{
            if(isNullOrEmptyOrUndefined(newPassword)){
                setStatusMessage('Ошибка. Пароль не может быть пустым');
            }
            else if(newPassword !== newPasswordRepeat){
                setStatusMessage('Ошибка. Повторный пароль не совпадает');
            }
            else{
                const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/Account/ChangePassword`,{
                    login: userData.login,
                    currentPassword: currentPassword,
                    newPassword: newPassword
                },{
                    withCredentials: true
                });
                if(response.status === 200){
                    setStatusMessage('Пароль успешно изменен');
                }
            }
        }
        catch(ex){
            if(ex.code === 'ERR_NETWORK'){
                setIsNetworkError(true);
                setIsUserMenuActive(false);
            }
            else{
                setStatusMessage('Ошибка изменения пароля');
            }
        }
        finally{
            resetStatusMessage();
        }        
    };

    return (
        <div className="userMenuContainet">
            <div className="userMenuTitle">Меню пользователя</div>

            <div className="dataContainer">
                <div className="avatar">
                    <img src={userData.avatar} className="img"/>
                </div>
                <div className="title" id="loginNameTitle">Логин: <div className="login">{userData.login}</div></div>
                <div className="title" id="nickNameTitle">Ник: <div className="nickname">{userData.nickname}</div></div>
            </div>
                        
            <div className="changeDataContainer">
                <div>
                    {isChangeNicknameActive 
                    ?
                    <div>
                        <input placeholder="Введите новый никнейм" onChange={(e) => setNewNickname(e.target.value)}/>
                        <div className="buttonContainer">
                            <button className="confirmButton" onClick={submitNewNickname}>Подтвердить</button>
                            <button className="backButton" onClick={() => setIsChangeNicknameActive(false)}>Назад</button>
                        </div>
                    </div>
                    :
                    <button className="changeNickButton" onClick={() => setIsChangeNicknameActive(true)}>Изменить ник</button>
                    }
                </div>

                <div>
                    {isChangeEmailActive 
                    ?
                    <div>
                        <input placeholder="Введите новый email" onChange={(e) => setNewEmail(e.target.value)}/>
                        <div className="buttonContainer">
                            <button className="confirmButton" onClick={submitNewEmail}>Подтвердить</button>
                            <button className="backButton" onClick={() => setIsChangeEmailActive(false)}>Назад</button>
                        </div>
                    </div>
                    :
                    <button className="changeEmailButton" onClick={() => setIsChangeEmailActive(true)}>Изменить email</button>
                    }
                </div>

                <div>
                    {isChangePasswordActive 
                    ?
                    <div>
                        <input placeholder="Введите текущий пароль" type="password" onChange={(e) => setCurrentPassword(e.target.value)}/>
                        <input placeholder="Введите новый пароль" type="password" onChange={(e) => setNewPassword(e.target.value)}/>
                        <input placeholder="Повторите новый пароль" type="password" onChange={(e) => setNewPasswordRepeat(e.target.value)}/>
                        
                        <div className="buttonContainer">
                            <button className="confirmButton" onClick={submitNewPassword}>Подтвердить</button>
                            <button className="backButton" onClick={() => setIsChangePasswordActive(false)}>Назад</button>
                        </div>
                    </div>
                    :
                    <button className="changePasswordButton" onClick={() => setIsChangePasswordActive(true)}>Изменить пароль</button>
                    }
                </div>

                <div className="statusMessage">
                    {statusMessage}
                </div>
            </div>

            <div className="otherButtonContainer">
                <div><button className="logoutButton" onClick={logout}>
                    Выйти из аккаунта
                </button></div>
                
                <div><button className="backButton" onClick={() => {
                    setStatusMessage('');
                    setIsUserMenuActive(false);
                }}>
                    Назад
                </button></div>
            </div>
        </div>
    );
}

export default UserMenu;