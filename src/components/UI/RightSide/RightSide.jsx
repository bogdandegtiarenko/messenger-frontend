import React from "react";
import style from './RightSide.css';

const RightSide = (props) => {
    return (
        <div class="rightSide">
            {props.children}
        </div>
    );
}

export default RightSide;