import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";
import Home from './pages/Home/Home';
import Contacts from './pages/Contacts/Contacts';
import Login from './pages/Login/Login';
import CreateUser from './pages/CreateUser/CreateUser';
import { Provider, useDispatch } from 'react-redux';
import store from './store/store.js';
import { get } from './http/index.js';
import Chat from './pages/Chat/Chat.jsx';

async function checkUser() {
  
  let user = localStorage.getItem("user");
  if (user) {
    try {
      user = JSON.parse(user);
      const response = await get("/validate-token");
      const responseJSON = await response.json();
      if (!responseJSON.valid) {
        localStorage.clear();
        return false;
      }
      return true;
    } catch(error) {
      console.error(error);
      return false;
    }
  }
  return false;
}

const router = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/contacts",
    element: <Contacts />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-user",
    element: <CreateUser />
  },
  {
    path: "/chat/:id/:id2",
    element: <Chat />
  },
  {
    path: "/",
    element: await checkUser() ? <Home /> : <Login />
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
