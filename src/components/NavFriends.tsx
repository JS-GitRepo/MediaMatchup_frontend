import { FormEvent, useContext, useRef, useState } from "react";
import SocialContext from "../context/SocialContext";
import Friend from "../models/Friend";
import {
  addFriend,
  getUserByEmail,
  getUserById,
} from "../services/UserService";
import "./NavFriends.css";

const NavFriends = () => {
  const [friendEmail, setFriendEmail] = useState<string>();
  const [friends, setFriends] = useState<Friend[]>([]);
  const { user } = useContext(SocialContext);
  const formRef = useRef<HTMLFormElement>(null);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const friend = await getUserByEmail(friendEmail!);
    const userRecord = await getUserById(user?.uid!);
    if (friend) {
      let friendObj = {
        uid: friend.uid,
        name: friend.name,
      };
      console.log(friend);
      await addFriend(user?.uid!, friendObj);
      if (userRecord?.friends) {
        setFriends(userRecord?.friends);
      }
    } else {
      alert(`Sorry, no user found with the email '${friendEmail}'`);
    }
    formRef.current?.reset();
  };

  return (
    <div className="NavFriends">
      {user ? (
        <form
          ref={formRef}
          className="add-friend-form"
          onSubmit={(e) => submitHandler(e)}>
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
      ) : (
        <div></div>
      )}
      {friends.map((friend, i) => {
        return <p key={i}>{friend.name}</p>;
      })}
    </div>
  );
};

export default NavFriends;
