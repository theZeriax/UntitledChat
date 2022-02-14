import { formatDistanceToNow } from "date-fns";
import Linkify from "linkify-react";
import { HiTrash } from "react-icons/hi";
import { doc, deleteDoc } from "firebase/firestore";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import { auth, db } from "../pages/Home";
import { strToNum } from "../strToNum";

const { twemojify } = require("react-twemojify");
const { createImgElement } = require("react-twemojify/lib/img");

function ChatMessage(props) {
  const { text, uid, characterName, createdAt, id, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  const result = twemojify(text, createImgElement, { size: 21 }) || "";

  const config = {
    dictionaries: [colors, adjectives, animals],
    style: "capital",
    seed: strToNum(uid),
  };

  const newName = uniqueNamesGenerator(config).replace(/_/g, "");
  const username = characterName === "" ? newName : characterName;

  let result2 =
    typeof result === "string"
      ? result
      : Array.isArray(result)
      ? result.map((r) => {
          if (typeof r === "string") {
            return r;
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
          <a href={`/user/${uid}`}>
            <img
              className="avatar"
              src={
                photoURL
                  ? photoURL
                  : "https://avatars.dicebear.com/api/identicon/" +
                    uid +
                    ".svg?scale=50"
              }
              alt={username === null ? "A" : username.charAt(0)}
            />
          </a>
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
          </p>
        </div>
        <p className="timestamp">
          {uid === auth.currentUser.uid ? (
            <>
              {createdAt
                ? formatDistanceToNow(new Date(createdAt.toMillis()), {
                    addSuffix: true,
                  })
                : "less than a minute ago"}{" "}
              • {username === null ? uid : username}
            </>
          ) : (
            <>
              {username === null ? uid : username} •{" "}
              {createdAt
                ? formatDistanceToNow(new Date(createdAt.toMillis()), {
                    addSuffix: true,
                  })
                : "less than a minute ago"}
            </>
          )}
        </p>
      </div>
    </>
  );
}

export default ChatMessage;
