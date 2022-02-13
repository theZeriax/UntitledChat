import {
  getAuth,
  signInWithRedirect,
  GoogleAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import { AiOutlineGithub, AiOutlineTwitter } from "react-icons/ai";

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
      <a href="/privacypolicy.html" id="helpLink">
        Get help!
      </a>
    </>
  );
}

export default SignIn;
