import { useContext } from "react";
import { Link } from "react-router-dom";
import SocialContext from "../context/SocialContext";
import { signInWithGoogle, signOut } from "../firebaseConfig";
import "./NavFooter.css";

interface Props {
  currentDisplay: string;
}

const NavFooter = ({ currentDisplay }: Props) => {
  const { user } = useContext(SocialContext);
  const leftNav = () => {
    if ((currentDisplay = "My Feed")) {
      return "/nav/community";
    } else if ((currentDisplay = "Friends")) {
      return "/nav/myfeed";
    } else {
      return "";
    }
  };
  const rightNav = () => {
    if ((currentDisplay = "My Feed")) {
      return "/nav/friends";
    } else if ((currentDisplay = "Community")) {
      return "/nav/myfeed";
    } else {
      return "";
    }
  };

  return (
    <div className="NavFooter">
      <div>
        <Link to="/">
          <button>Return to Matchups</button>
        </Link>

        <div className="nav-container">
          <Link className="left-nav" to={leftNav()}>
            <span className="material-icons">chevron_left</span>
          </Link>
          <p>{currentDisplay}</p>
          <Link className="right-nav" to={rightNav()}>
            <span className="material-icons">chevron_right</span>
          </Link>
        </div>

        {/* <p>{user.email}</p> */}
        <button onClick={signOut}>SignOut</button>
      </div>
    </div>
  );
};

export default NavFooter;
