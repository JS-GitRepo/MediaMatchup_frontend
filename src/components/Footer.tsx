import { useContext } from "react";
import { Link } from "react-router-dom";
import SocialContext from "../context/SocialContext";
import { signInWithGoogle, signOut } from "../firebaseConfig";
import "./Footer.css";

const Footer = () => {
  const { user } = useContext(SocialContext);

  return (
    <div className="Footer">
      {user ? (
        <div>
          <Link to="/nav">
            <button>Navigate</button>
          </Link>
          <p>{user.email}</p>
          <button onClick={signOut}>SignOut</button>
        </div>
      ) : (
        <button className="sign-in-btn" onClick={signInWithGoogle}>
          Sign In With Google
        </button>
      )}
    </div>
  );
};

export default Footer;
