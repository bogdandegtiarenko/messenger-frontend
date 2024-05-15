import React, { useState } from "react";
import style from './RightSideHeader.css';
import ContactBar from "../ContactBar/ContactBar";
import Modal from "../Modal/Modal";
import RemoveContactMenu from "../RemoveContactMenu/RemoveContactMenu";
import { useContext } from "react";
import { GlobalContext } from "../../../context";

const RightSideHeader = () => {
    const {
        selectedContact
    } = useContext(GlobalContext);

    const [isRemoveContactMenuActive, setIsRemoveContactMenuActive] = useState(false);

    return (
        <div class="header">
            <ContactBar/>
            <ul class="nav_icons">
                <Modal
                    visible={isRemoveContactMenuActive}
                    setVisible={setIsRemoveContactMenuActive}
                >
                    <RemoveContactMenu
                        setModalVisible={setIsRemoveContactMenuActive}
                    />
                </Modal>
                {selectedContact.login !== null &&
                    <li
                        onClick={() => {
                            setIsRemoveContactMenuActive(true);
                        }}
                    >
                        <ion-icon name="trash-outline"/>
                    </li>
                }
            </ul>
        </div>
    );
};

export default RightSideHeader;
