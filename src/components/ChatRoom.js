import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  where,
  setDoc,
  doc,
} from "firebase/firestore";

import { useCollection } from "react-firehooks/firestore";

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import { strToNum } from "../strToNum";
import "linkify-plugin-mention";
import "linkify-plugin-hashtag";
import { FiSend } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router";
import "react-toastify/dist/ReactToastify.css";

import { auth, db } from "../pages/Home";
import ChatMessage from "./ChatMessage.js";

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

  console.info("Room: #", roomId, "\nLoading: ", loading, "\nError: ", error);

  const sendMessage = async (e, formValue) => {
    if (e) {
      e.preventDefault();
    }

    const { uid } = auth.currentUser;
    const { photoURL } = auth.currentUser;

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
        if (!args) {
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
        sendMessage(null, "Help command!");
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
        characterName:
          auth.currentUser.displayName !== ""
            ? auth.currentUser.displayName
            : characterName,
        roomId,
        photoURL,
      });
      console.log(`Message written with ID: ${docRef.id}`);
    } catch (e) {
      console.warn("Failed to add usernames: ", e);
    }

    setFormValue("");
    scrollMarkerRef.current.scrollIntoView({ behavior: "smooth" });

    try {
      const usernameRef = doc(collection(db, "usernames"), uid);
      await setDoc(
        usernameRef,
        {
          uid,
          characterName:
            auth.currentUser.displayName !== ""
              ? auth.currentUser.displayName
              : characterName,
          lastMessage: serverTimestamp(),
          lastRoomId: roomId,
        },
        { merge: true }
      );
      console.log(`User updated or added with id: ${usernameRef.id}`);
    } catch (e) {
      console.warn("Failed to update usernames: ", e);
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
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

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

export default ChatRoom;
