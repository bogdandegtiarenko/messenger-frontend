import React, { useContext } from 'react';
import style from './Searcher.css';
import { SearchContext } from '../../../context';

const Searcher = () => {
    const {searchString, setSearchString} = useContext(SearchContext);

    return (
        <div className='search_chat'>
            <div>
                <input 
                    onChange={(e) => {
                        setSearchString(e.target.value)
                    }} 
                    type="text" 
                    placeholder="Поиск контакта"/>
                
                <ion-icon name="search-outline"></ion-icon>
            </div>
        </div>
    );
}

export default Searcher;