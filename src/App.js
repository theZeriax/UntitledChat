import React, { useEffect, useRef, useState } from "react";
import "./appDark.css";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  GoogleAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  where,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

import { useAuthState } from "react-firehooks/auth";
import { useCollection } from "react-firehooks/firestore";

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
  starWars,
  languages,
} from "unique-names-generator";

import { strToNum } from "./strToNum";
import { formatDistanceToNow } from "date-fns";
import Linkify from "linkify-react";
import "linkify-plugin-mention";
import "linkify-plugin-hashtag";
import { FiSend } from "react-icons/fi";
import { FaSignOutAlt, FaGoogle } from "react-icons/fa";
import { AiOutlineGithub, AiOutlineTwitter } from "react-icons/ai";
import { HiTrash, HiMenu } from "react-icons/hi";
import { compiler } from "markdown-to-jsx";
import { useLocation, useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { compiler } from "markdown-to-jsx";
// import Markdown from "markdown-to-jsx";
// import { render } from "react-dom";

const { twemojify } = require("react-twemojify");
const { createImgElement } = require("react-twemojify/lib/img");

// if (
//   window.location.hostname !== "untitledchat.com" &&
//   window.location.hostname !== "localhost"
// ) {
//   window.location = "https://untitledchat.com";
// }

initializeApp({
  apiKey: process.env.REACT_APP_APIKEY_FIREBASE,
  authDomain: "untitledchat2021.firebaseapp.com",
  projectId: "untitledchat2021",
  storageBucket: "untitledchat2021.appspot.com",
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
});

export const auth = getAuth();
const db = getFirestore();

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
              onClick={
                // Twitter Share
                () => {
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
                }
              }
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

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider);
  };

  const signInWithTwitter = () => {
    const provider = new TwitterAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider);
  };

  const signInWithGithub = () => {
    const provider = new GithubAuthProvider();
    const auth = getAuth();
    signInWithRedirect(auth, provider);
  };

  // const anonymousSignIn = () => {
  //   const auth = getAuth();
  //   signInAnonymously(auth);
  // };

  return (
    <>
      <button onClick={signInWithGoogle} className="sign-in-google">
        Sign In with Google <FaGoogle />
      </button>
      <button onClick={signInWithTwitter} className="sign-in-twitter">
        Sign In with Twitter <AiOutlineTwitter />
      </button>
      <button onClick={signInWithGithub} className="sign-in-github">
        Sign In with GitHub <AiOutlineGithub />
      </button>
      {/* <button onClick={anonymousSignIn} className="sign-in-anon">
        Sign In Anonymously (You will lose data!)
      </button> */}
      <a href="/privacypolicy.html" id="helpLink">
        Get help!
      </a>
    </>
  );
}

// function SignOut() {
//   return (
//     auth.currentUser && (
//       <button className="sign-out" onClick={() => auth.signOut()}>
//         Sign Out <FaSignOutAlt />
//       </button>
//     )
//   );
// }

const defaultRoomId = "help";

function ChatRoom({ roomId, setRoomId }) {
  const scrollMarkerRef = useRef();
  const [formValue, setFormValue] = useState("");
  const [maxLimitClass, setMaxLimitClass] = useState("");
  const [formDisabled, setFormDisabled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [messagesSnapshot, loading, error] = useCollection(
    query(
      collection(db, "messages"),
      where("roomId", "==", roomId),
      orderBy("createdAt", "asc"),
      limit(300)
    )
  );

  const messages = messagesSnapshot?.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  console.info("Messages room", roomId, " loading", loading, "error", error);

  const sendMessage = async (e, formValue) => {
    if (e) {
      e.preventDefault();
    }

    const { uid } = auth.currentUser;

    if (formValue.startsWith("/")) {
      const [cmd, ...args] = formValue.toLowerCase().split(" ");
      console.info("Got command:", cmd, "args:", args);

      // Commands
      if (cmd === "/room" && args[0]) {
        setRoomId(args[0]);
        setFormValue("");
        navigate("/#room:" + args[0]);
      }

      if (cmd === "/yt") {
        if (!args[1]) {
          window.open("https://youtube.com/watch?v=dQw4w9WgXcQ");
        } else {
          window.open(
            `https://www.youtube.com/results?search_query=${args.join("+")}`
          );
        }
        setFormValue("");
      }

      if (cmd === "/alert") {
        alert(args.join(" "));
      }

      if (cmd === "/tableflip") {
        setFormValue("(╯°□°）╯︵ ┻━┻");
      }

      if (cmd === "/bearhug") {
        setFormValue("ʕっ•ᴥ•ʔっ");
      }

      if (cmd === "/lenny") {
        setFormValue("( ͡° ͜ʖ ͡°)");
      }

      if (cmd === "/help") {
        sendMessage(null, "WIP Command!");
      }
      return;
    }

    const config = {
      dictionaries: [colors, adjectives, animals],
      style: "capital",
      seed: strToNum(uid),
    };

    const characterName = uniqueNamesGenerator(config).replace(/_/g, "");
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        createdAt: serverTimestamp(),
        text: formValue,
        uid,
        characterName,
        roomId,
      });
      console.log(`Message written with ID: ${docRef.id}`);
    } catch (e) {
      console.warn("Failed to add to usernames", e);
    }

    setFormValue("");
    scrollMarkerRef.current.scrollIntoView({ behavior: "smooth" });

    try {
      const usernameRef = doc(collection(db, "usernames"), uid);
      await setDoc(
        usernameRef,
        {
          uid,
          characterName,
          lastMessage: serverTimestamp(),
          lastRoomId: roomId,
        },
        { merge: true }
      );
      console.log(`User updated or added with id: ${usernameRef.id}`);
    } catch (e) {
      console.warn("Failed to update usernames", e);
    }
  };

  useEffect(() => {
    if (location.hash.startsWith("#room:")) {
      const room = location.hash.split(":")[1];
      if (room !== setRoomId) {
        setRoomId(room);
      }
    }
  }, [location.hash, setRoomId]);

  useEffect(() => {
    scrollMarkerRef.current.scrollIntoView({ behavior: "smooth" });
  }, [scrollMarkerRef, messages]);

  useEffect(() => {
    if (formValue.length >= 1000) {
      setMaxLimitClass("limitReached");
    } else {
      setMaxLimitClass("");
    }
  }, [formValue]);

  useEffect(() => {
    if (roomId === "help") {
      setFormDisabled(true);
    } else {
      setFormDisabled(false);
    }
  }, [roomId, setFormDisabled]);

  return (
    <>
      <main>
        {messages &&
          messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}

        <div ref={scrollMarkerRef}></div>
      </main>
      <form onSubmit={(e) => sendMessage(e, formValue)}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          contentEditable={!formDisabled}
          placeholder="Start typing!"
          maxLength="1000"
          className={"textInput " + maxLimitClass}
          disabled={formDisabled}
          id="textInput"
        />
        <button
          type="submit"
          disabled={!formValue}
          className="submit-button"
          onClick={(e) => {
            sendMessage(e, formValue);
            setFormValue("");
          }}
        >
          <FiSend />
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, characterName, createdAt, id } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  const result = twemojify(text, createImgElement, { size: 21 }) || "";

  const result2 =
    typeof result === "string"
      ? compiler(result)
      : Array.isArray(result)
      ? result.map((r) => {
          if (typeof r === "string") {
            return compiler(r);
          } else {
            return r;
          }
        })
      : result;

  return (
    <>
      <div className={`messageAll ${messageClass}`}>
        <div className={`message ${messageClass}`}>
          <button
            type="button"
            className="deleteBtn"
            onClick={(e) => {
              deleteDoc(doc(db, "messages", id));
            }}
          >
            <HiTrash />
          </button>
          <img
            className="avatar"
            src={
              "https://avatars.dicebear.com/api/identicon/" +
              uid +
              ".svg?scale=50"
            }
            alt="Avatar"
          />
          <p className="messageText">
            {
              <Linkify
                tagName="a"
                className="msgLink"
                options={{
                  formatHref: {
                    hashtag: (href) => "#room:" + href.substr(1),
                  },
                }}
              >
                {result2}
              </Linkify>
            }
            {/* {JSON.stringify(props.message)} */}
          </p>
        </div>
        <p className="timestamp">
          {characterName} •{" "}
          {createdAt
            ? formatDistanceToNow(new Date(createdAt.toMillis()), {
                addSuffix: true,
              })
            : "less than a minute ago"}
        </p>
      </div>
    </>
  );
}

export default App;
