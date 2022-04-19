import Footer from './Footer';
import MatchupFeed from './MatchupFeed';
import './NavPage.css'

const NavPage = () => {
  return (
    <div className='NavPage'>
      <MatchupFeed />
      <Footer />
    </div>
  )
};

export default NavPage;
