import Login from "../pages/Login/Login.jsx";
import Main from "../pages/Main/Main.jsx";
import Register from "../pages/Register/Register.jsx";

export const privateRoutes = [
    {path: '/main', component: Main}
];

export const publicRoutes = [
    {path: '/login', component: Login},
    {path: '/register', component: Register}
];

