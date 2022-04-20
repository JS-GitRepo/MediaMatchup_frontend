import "./NavCommunity.css";

const NavCommunity = () => {
  let bgImgURL =
    "https://upload.wikimedia.org/wikipedia/en/a/a3/Kanyewest_collegedropout.jpg";

  return (
    <div className="NavCommunity">
      <img
        className="bg-img"
        src={bgImgURL}
        alt="Winner: GKMC by Kendrick Lamar"
      />
      <div className="daily-stats">
        <ul>
          <li>
            <p>Today's Winner:</p>
            <img
              src="https://upload.wikimedia.org/wikipedia/en/a/a3/Kanyewest_collegedropout.jpg"
              alt=""
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavCommunity;
