import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chat from './components/ChatSingle/Chat';
import Friend from './components/Friend/Friend';
import Login from './components/Login/Login';
import AdminLogin from './components/Login/AdminLogin';

import Register from './components/Register/Register';
import Register_Verifi from './components/Register/Register_Verifi';
import Register_Inf from './components/Register/Register_Inf';
import { useDispatch, useSelector } from 'react-redux';
import TabBar from './components/BottomTab/TabBar';
import Profile from './components/Profile/Profile';
import ChatWindow from './components/ChatSingle/ChatWindow';
import ChangePass from './components/Profile/ChangePass';
import ForgetPass from './components/Profile/ForgetPass';
import Information from './components/Profile/Information';
import React, { useEffect } from 'react';
import FriendsRequest from './components/Friend/FriendRequest';
import FriendsSearch from './components/Friend/FriendSearch';
import ChatGroup from './components/ChatGroup/Chat';
import { authenticateUser, logout } from './redux/authLogin';

import Admin from './components/Friend/Admin';

import StickerManage from './components/Sticker/StickerManage';
import OTPForgetPass from './components/Profile/OTPForgetPass';
import NewPass from './components/Profile/NewPass';
import Welcome from './components/Home/Home';
import Home from './components/Home/Home';

function App() {
  const token = useSelector((state) => state.authLogin.token);
  console.log("token: ", token);
  const dispatch = useDispatch();
  // const token = localStorage.getItem('accessToken');

  // useEffect(() => {
  //   const token = localStorage.getItem('accessToken');
  //   console.log("token: ", token);
  //   if (token) {
  //     dispatch(authenticateUser(token));
  //   }
  // }, [dispatch]);

  // dispatch(logout());

  return (
    <div>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registerverifi" element={<Register_Verifi />} />
        <Route path="/registerinf" element={<Register_Inf />} />
        <Route path='/forgotpassword' element={<ForgetPass />} />
        <Route path='/changepass' element={<ChangePass />} />
      
        <Route exact path="/adminlogin" element={<AdminLogin />} />
        <Route  path="/otppass" element={<OTPForgetPass />} />
        <Route  path="/newpass" element={<NewPass />} />




      </Routes>

      <Routes>
        <Route path='/chatWindow' element={<ChatWindow />} />

      </Routes>

      {token && <TabBar />} {/* Chỉ hiển thị TabBar khi đã đăng nhập */}

      <Routes>
        <Route path='/chatGroup' element={token ? <ChatGroup /> : <Login />} />
        <Route path='/friend' element={token ? <Friend /> : <Login />} />
        <Route path='/friendrequest' element={token ? <FriendsRequest /> : <Login />} />
        <Route path='/friendSearch' element={token ? <FriendsSearch /> : <Login />} />
        <Route path='/chat' element={token ? <Chat /> : <Login />} />
        <Route path='/profile' element={token ? <Profile /> : <Login />} />
        <Route path='/information' element={token ? <Information /> : <Login />} />
        <Route path='/adminma' element={token ? <Admin /> : <Login />} />
        <Route path='/sticker' element={token ? <StickerManage /> : <Login />} />


      </Routes>

      {/* {isLoggedIn && <TabBar />}

      <Routes>
        <Route path="/chatGroup" element={isLoggedIn ? <ChatGroup /> : <Login />} />
        <Route path="/friend" element={isLoggedIn ? <Friend /> : <Login />} />
        <Route path="/friendrequest" element={isLoggedIn ? <FriendsRequest /> : <Login />} />
        <Route path="/friendSearch" element={isLoggedIn ? <FriendsSearch /> : <Login />} />
        <Route path="/chat" element={isLoggedIn ? <Chat /> : <Login />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Login />} />
        <Route path="/information" element={isLoggedIn ? <Information /> : <Login />} />
      </Routes> */}

    </div>
  );
}

export default App;
