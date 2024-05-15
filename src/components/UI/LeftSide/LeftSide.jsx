import React, { Children, useState } from "react";
import style from './LeftSide.css';
import { SearchContext } from "../../../context";

const LeftSide = (props) => {
    const [searchString, setSearchString] = useState('');

    return (
        <SearchContext.Provider value={{
            searchString,
            setSearchString
        }}>
                <div className="leftSide">
                    {props.children}                
                </div>
        </SearchContext.Provider>
    );
}

export default LeftSide;

