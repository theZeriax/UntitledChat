import { useState } from "react";
import { FaLinux } from "react-icons/fa";
import "../appDark.css";

const PageNotFound = () => {
  const [tux, setTux] = useState(true);
  const [counter, setCounter] = useState(0);

  const handleClick = () => {
    setCounter(counter + 1);
  };

  return (
    <div className="center">
      <div className="title-card">
        <code>
          <button
            style={{ padding: "0%" }}
            onClick={() => {
              handleClick();
              console.log(counter);
              if (counter >= 42) {
                setTux(false);
              } else {
                setTux(true);
              }
            }}
          >
            <h1>400</h1>
          </button>
        </code>
        <div className="line">|</div>
        <p className="small-text">
          Looking for something?
          <br />
          Visit <a href="https://github.com/zeriaxdev/UntitledChat">GitHub</a>.
        </p>
      </div>
      <FaLinux className={`center secret-img${tux ? " tux" : ""}`} />
    </div>
  );
};

export default PageNotFound;
