import { FormEvent, useContext, useState } from "react";
import SocialContext from "../context/SocialContext";
import { getUserById } from "../services/UserService";
import "./NavFriends.css";

const NavFriends = () => {
  const [friendEmail, setFriendEmail] = useState<string>();
  const { user } = useContext(SocialContext);

  const submitHandler = (e: FormEvent): void => {
    e.preventDefault();
    getUserById;
  };

  return (
    <div className="NavFriends">
      <form className="add-friend-form">
        <label htmlFor="addFriend"></label>
        <input
          type="email"
          name="addFriend"
          id="addFriend"
          placeholder="yourfriend@email.com"
          onChange={(e) => setFriendEmail(e.target.value)}
        />
        <button>Add Friend</button>
      </form>
    </div>
  );
};

export default NavFriends;
