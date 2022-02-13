import React, { useEffect, useState } from "react";
import "./appDark.css";
import "./index.css";
import dotenv from "dotenv";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore, collection, doc, getDoc } from "firebase/firestore";

import { useAuthState } from "react-firehooks/auth";

import {
  uniqueNamesGenerator,
  starWars,
  languages,
} from "unique-names-generator";

import "linkify-plugin-mention";
import "linkify-plugin-hashtag";
import { FaSignOutAlt } from "react-icons/fa";
import { AiOutlineTwitter } from "react-icons/ai";
import { HiMenu } from "react-icons/hi";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ChatRoom from "./components/ChatRoom";
import SignIn from "./components/SignIn";

dotenv.config();

// if (
//   window.location.hostname !== "untitledchat.com" &&
//   window.location.hostname !== "chat.zeriax.com" &&
//   window.location.hostname !== "untitledchat.zeriax.com" &&
//   window.location.hostname !== "localhost"
// ) {
//   window.location = "https://untitledchat.com";
// }
const appConfig = {
  apiKey: process.env.REACT_APP_APIKEY_FIREBASE,
  authDomain: "untitledchat2021.firebaseapp.com",
  projectId: "untitledchat2021",
  storageBucket: "untitledchat2021.appspot.com",
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};
export const app = initializeApp(appConfig);

export const auth = getAuth();
export const db = getFirestore();

function App() {
  const [user, authLoading] = useAuthState(auth);
  const [roomId, setRoomId] = useState(defaultRoomId);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.info("User", user.uid);
      const usernameRef = doc(collection(db, "usernames"), user.uid);
      getDoc(usernameRef).then((u) => {
        console.info("user", u, "data", u.data);
        if (u) {
          const data = u.data();
          if (data?.lastRoomId) {
            setRoomId(data.lastRoomId);
          }
        }
      });
    }
  }, [user, authLoading]);

  return (
    <div className="App">
      <header>
        <div className="roomTitle">
          <h1 id="title">UntitledChat</h1>
          <p id="roomId">#{roomId}</p>
        </div>
        <div className="menu">
          <button className="settings">
            <HiMenu />
          </button>
          <div className="menu-content">
            <button className="menuBtn" onClick={() => auth.signOut()}>
              <FaSignOutAlt /> Sign Out
            </button>
            <button
              className="menuBtn"
              onClick={() => {
                setRoomId(defaultRoomId);
                navigate(`#room:${defaultRoomId}`);
              }}
            >
              Reset Room
            </button>
            <button
              className="menuBtn"
              onClick={() => {
                const newRoomId = uniqueNamesGenerator({
                  dictionaries: [languages, starWars],
                  style: "capital",
                })
                  .replace(/_/g, "")
                  .replace(/ /g, "");
                setRoomId(newRoomId);
                navigate(`#room:${newRoomId}`);
              }}
            >
              Generate New Room
            </button>
            <button
              className="menuBtn"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://untitledchat.com/#room:${roomId}`
                );

                toast.info("📃 Copied to clipboard!", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }}
            >
              Copy Room ID
            </button>
            <button
              onClick={() => {
                const url = `https://untitledchat.com/#room:${roomId} \n\n`;
                const text = `Check out this new Chat Room: `;
                const hashtags = "UntitledChat";
                const via = "untitledchat";
                const urlEncoded = encodeURIComponent(url);
                const textEncoded = encodeURIComponent(text);
                const hashtagsEncoded = encodeURIComponent(hashtags);
                const viaEncoded = encodeURIComponent(via);
                const twitterUrl = `https://twitter.com/intent/tweet?text=${textEncoded}&url=${urlEncoded}&hashtags=${hashtagsEncoded}&via=${viaEncoded}`;
                window.open(twitterUrl);
              }}
            >
              <AiOutlineTwitter /> Share
            </button>
          </div>
        </div>
      </header>
      <section>
        {authLoading ? null : user ? (
          <ChatRoom roomId={roomId} setRoomId={setRoomId} />
        ) : (
          <SignIn />
        )}
      </section>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export const defaultRoomId = "help";

export default App;
