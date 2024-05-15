import React, { useContext, useEffect, useState } from "react";
import classes from './Register.module.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context";
import { doesCookieExist } from "../../utils/cookie";
import { isNullOrEmptyOrUndefined } from "../../utils/string";
const Register = () => 
{
    const authCookieName = "Auth";

    const [login, setLogin] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const {isAuth, setIsAuth} = useContext(AuthContext);
    const navigate = useNavigate();

    const register = async () => {

        if(isNullOrEmptyOrUndefined(login)){
            setErrorMessage("Логин не должен быть пустым");
            return;
        }

        if(isNullOrEmptyOrUndefined(password)){
            setErrorMessage("Пароль не должен быть пустым");
            return;
        }

        if(password !== passwordRepeat){
            setErrorMessage("Повторный пароль не совпадает");
            return;
        }

        if(isNullOrEmptyOrUndefined(email)){
            setErrorMessage("Email не должен быть пустым");
            return;
        }

        if(isNullOrEmptyOrUndefined(nickname)){
            setErrorMessage("Ник не должен быть пустым");
            return;
        }

        if(isNullOrEmptyOrUndefined(avatar)){
            setErrorMessage("Вы должны выбрать аватар");
            return;
        }

        const registerDto = {
            login: login,
            password: password,
            email: email,
            nickname: nickname,
            avatar: avatar
        };

        
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/Account/Register`, registerDto, {
            withCredentials: true
        })
        .then(response => {
            if(response.status == 200 && doesCookieExist(authCookieName)){
                setIsAuth(true);
            };
        })
        .catch(async err => {
            if(err.code === "ERR_NETWORK"){
                setErrorMessage('Ошибка подключения. Попробуй зайти позже.');
            }
            else{
                const responseMessage = await err.response.data;
                if(responseMessage === 'The user with the current login already exists'){
                    setErrorMessage("Логин занят другим пользователем");
                }
                else if(responseMessage === 'The user with the current email already exists'){
                    setErrorMessage('Email занят другим пользователем');
                }
            }
        });
        
    };

    useEffect(() => {
        setTimeout(() => {
            setErrorMessage('');
        }, 4000);
    }, [errorMessage])

    const uploadAvatar = (e) => {
        try{
            const _avatarFile = e.target.files[0]; 
            const fileReader = new FileReader();    
            fileReader.onload = (event) => {
                const avatarData = event.target.result;
                console.log('avatarData: ', avatarData);
                setAvatar(avatarData);
            };
    
            fileReader.readAsDataURL(_avatarFile);
        }
        catch(ex){
            console.log('[App]: Avatar upload exception');
        }
    }

    return (
        <div>
            <div className={classes.registrationContainer}>
                <div className={classes.registrationTitle}>Регистрация</div>
                <div className={classes.inputContainer}>
                    <label className={classes.inputLabel}>Логин:</label>
                    <input 
                        className={classes.inputField} 
                        type="input" 
                        placeholder="Введите логин" 
                        required
                        onChange={(event) => setLogin(event.target.value)}
                    />
                </div>
                
                <div className={classes.inputContainer}>
                    <label className={classes.inputLabel}>Никнейм:</label>
                    <input 
                        className={classes.inputField} 
                        type="input"
                        placeholder="Введите никнейм" 
                        required
                        onChange={(event) => setNickname(event.target.value)} 
                    />
                </div>
                <div className={classes.inputContainer}>
                    <label className={classes.inputLabel}>Email:</label>
                    <input className={classes.inputField} 
                        type="email" 
                        placeholder="Введите email" 
                        required
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className={classes.avatarUpload}>
                    <label 
                        className={classes.avatarLabel}
                        style={{
                            marginRight: '5px'
                        }}
                    >
                        Загрузите аватарку:
                    </label>
                    <input className={classes.avatarInput} 
                        type="file" 
                        id="avatar" 
                        name="avatar" 
                        accept=".png, .jpg, .jpeg"
                        onChange={uploadAvatar}
                    />
                </div>
                {avatar && <div className={classes.avatar}>
                    <img src={avatar} className={classes.img}/>
                </div>}
                
                <div className={classes.passwordContainer}>
                    <label className={classes.passwordLabel}>Пароль:</label>
                    <input className={classes.passwordField} 
                        type="password" 
                        placeholder="Введите пароль" 
                        required
                        onChange={(event) => {
                            setPassword(event.target.value)
                        }}
                    />

                    <label className={classes.passwordLabel}>Повторите пароль:</label>
                    <input className={classes.passwordField} 
                        type="password" 
                        placeholder="Повторите пароль" 
                        required
                        onChange={(event) => {
                            setPasswordRepeat(event.target.value)
                        }}
                    />
                </div>
                <div 
                    style={{
                        color: 'red',
                        display: 'flex',
                        justifyContent: 'center',
                        paddingBottom: '15px'   
                    }}
                >
                    {errorMessage}
                </div>
                

                <div className={classes.buttonContainer}>
                    <button 
                        className={classes.registerButton} 
                        onClick={register}
                    >
                        Зарегистрироваться
                    </button>
                    
                    <button 
                        className={classes.backButton} 
                        onClick={() => {navigate('/login')}
                    }>
                        Назад
                    </button>
                </div>
            </div>
        </div>
        
    );
}

export default Register;