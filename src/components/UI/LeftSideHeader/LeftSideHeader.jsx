import React, { useContext, useEffect, useState } from 'react';
import style from './LeftSideHeader.css';
import tian from '../../../pages/Main/pictures/tian.png';
import Modal from '../Modal/Modal';
import { GlobalContext, ModalContext } from '../../../context';
import axios from 'axios';

const LeftSideHeader = () => {
    const {
        isAddContacMenuActive,
        setIsAddContacMenutActive,
        isUserMenuActive,
        setIsUserMenuActive,
        setIsNetworkError
    } = useContext(ModalContext);

    const {
        userData,
        setUserData,
    } = useContext(GlobalContext);

    useEffect(() =>  {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/Account/GetOwnProfile`,{
            withCredentials: true
        }).then((response) => {
            if(response.status === 200){
                const responseUserData = response.data;
                setUserData(responseUserData);
            }
        }).catch(err => {
            if(err.code === 'ERR_NETWORK'){
                setIsNetworkError(true);
            } 
        })
    }, []);

    


    return (
        <div className="header">
            <div className="userimg" onClick={() => setIsUserMenuActive(true)}>
                <img src={userData.avatar} className="cover"/>
            </div>
            <ul className="nav_icons">
                <li><div onClick={() => setIsAddContacMenutActive(true)} id="add_new_contact"><ion-icon name="add-circle-outline"></ion-icon></div></li>
            </ul>
        </div>
    );
}

export default LeftSideHeader;