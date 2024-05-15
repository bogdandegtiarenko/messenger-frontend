import React, {useContext} from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';
import { AuthContext } from '../context';
import { privateRoutes, publicRoutes } from '../router/index.js'; 

const AppRouter = () => {
    const {isAuth, setIsAuth} = useContext(AuthContext);

    return (
        isAuth
        ?
        <Routes>
            {
                privateRoutes.map(route => 
                    <Route 
                        path={route.path} 
                        Component={route.component} 
                        key={route.path}
                    />
                )
            }
            <Route path="*" element={<Navigate to='/main'/>}/>
        </Routes>
        :
        <Routes>
            {
                publicRoutes.map(route => 
                    <Route 
                        path={route.path} 
                        Component={route.component} 
                        key={route.path}
                    />
                )
            }
            <Route path="*" element={<Navigate to='/login'/>}/>
        </Routes>
    );
}

export default AppRouter;