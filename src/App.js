import React, {useState, useEffect} from 'react';
import { getCookie } from './utils/cookie';
import { AuthContext } from './context';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';


const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if(getCookie('Auth') !== undefined){
      setIsAuth(true);
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuth,
      setIsAuth
    }}>
      <BrowserRouter>
        <AppRouter/>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
export default App;