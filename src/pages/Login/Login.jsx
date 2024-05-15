import React, { useContext, useEffect, useState } from "react";
import classes from './Login.module.css';
import axios, { Axios } from 'axios';
import { getCookie, doesCookieExist } from "../../utils/cookie";
import { AuthContext } from "../../context";
import { useNavigate } from "react-router-dom";
import { HubConnectionBuilder } from '@microsoft/signalr';


const Login = () => {
    const authCookieName = "Auth";

    const {isAuth, setIsAuth} = useContext(AuthContext);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const signIn = async () => {
        const loginDto = {
            login: login,
            password: password
        };

        axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/Account/Login`, loginDto, {
            withCredentials: true
        }).then(response => {
            if(response.status === 200 && doesCookieExist(authCookieName)){
                setIsAuth(true);
            }
        })
        .catch(err => {
            if(err.code === "ERR_NETWORK"){
                setErrorMessage('Ошибка подключения. Попробуй зайти позже.');
            }
            else{
                setErrorMessage("Неверный логин или пароль");
            }
        });
    }

    useEffect(() => {
        setTimeout(() => {
            setErrorMessage('');
        }, 3000);
    }, [errorMessage])

    return(
        <div>
            <div className={classes.loginContainer}>
                <div className={classes.loginTitle}>Авторизация</div>
                <div className={classes.inputContainer}>
                    <label className={classes.inputLabel}>Логин:</label>
                    <input 
                        className={classes.inputField} 
                        onChange={(event) => setLogin(event.target.value)}
                        type="input"
                        placeholder="Введите логин" 
                        required
                    />
                </div>
                <div className={classes.inputContainer}>
                    <label className={classes.inputLabel}>Пароль:</label>
                    <input 
                        className={classes.inputField} 
                        onChange={(event) => setPassword(event.target.value)}
                        type="password" 
                        placeholder="Введите пароль" 
                        required/>
                </div>
                <div 
                    style={{
                        color: 'red',
                        display: 'flex',
                        justifyContent: 'center',
                        paddingBottom: '15px'   
                    }}>
                    {errorMessage}
                </div>
                <div className={classes.buttonContainer}>
                    <button 
                        className={classes.loginButton} 
                        onClick={signIn}
                    >
                        Войти
                    </button>

                    <button 
                        className={classes.registerButton}
                        onClick={() => navigate('/register')}
                    >
                        Регистрация
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;