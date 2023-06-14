import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useState } from "react";
import UserContext from "../contexts/UserContext";

import 'bootstrap/dist/css/bootstrap.min.css'; // npm install bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap 5
import './App.css';

import HomeLayout from './layouts/HomeLayout';
import AccountLayout from "./layouts/AccountLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";

import Home from './home/Home';
import Login from './login/Login';
import Signup from './signup/Signup';
import Feed from './feed/Feed';
import Profile from './profile/Profile';
import NoMatch from './NoMatch';
import Providers from './providers/Providers';
import Username from './username/Username';
import Personal from "./personal/Personal";
import Search from './search/Search';
import Settings from './settings/Settings';
import About from "./about/About";
import Chats from "./chat/full-screen/Chats";

//MetaMask: 'ethereum.enable()' is deprecated and may be removed in the future. 
// Please use the 'eth_requestAccounts' RPC method instead.

function App() {

  const [username, setUsername] = useState("");
  const value = { username, setUsername };

  return (
    <UserContext.Provider value = {value}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedLayout/>}>
              <Route path="login" element={<Login/>}/>
              <Route path="signup" element={<Signup/>}/>
              <Route path="account/providers" element={<Providers/>}/>
              <Route path="account/username" element={<Username/>}/>
              <Route path="account/personal" element={<Personal/>}/>
            </Route>
            <Route path="/account" element={<AccountLayout/>}>
              <Route index element={<NoMatch/>}/>
              <Route path="feed" element={<Feed/>}/>
              <Route path="search" element={<Search/>}/>
              <Route path="chat" element={<Chats/>}/>
              <Route path="profile" element={<Profile/>}/>
              <Route path="settings" element={<Settings/>}/>
              <Route path=":address" element={<Profile/>}/>
            </Route>
            <Route path="/" element={<HomeLayout/>}>
              <Route index element={<Home/>}/>
              <Route path="about" element={<About/>}/> 
              <Route path="*" element={<NoMatch/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;