import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Craftsmanship from './pages/Craftsmanship.jsx'
import Terms from './pages/Terms.jsx'
import Home from './pages/Home.jsx'
import Reservation from './pages/Reservation.jsx'
import ReservationGuestInfo from './pages/ReservationGuestInfo.jsx'
import ReservationCompleteGuest from './pages/ReservationCompleteGuest.jsx'
import ReservationCompleteMember from './pages/ReservationCompleteMember.jsx'
import SignUp from './pages/SignUp.jsx'
import SignUpComplete from './pages/SignUpComplete.jsx'
import Login from './pages/Login.jsx'
import EditorPage from './pages/EditorPage.jsx'
import MyPage from './pages/MyPage.jsx'

const PAGES = {
  '/craftsmanship': Craftsmanship,
  '/terms': Terms,
}

function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'
  const Page = PAGES[path]

  return (
    <div>
      <Header />
      {Page && <Page />}
      {path === '/' && <Home />}
      {path === '/reservation' && <Reservation />}
      {path === '/reservation/guest-info' && <ReservationGuestInfo />}
      {path === '/reservation/complete-guest' && <ReservationCompleteGuest />}
      {path === '/reservation/complete-member' && <ReservationCompleteMember />}
      {path === '/signup' && <SignUp />}
      {path === '/signup/complete' && <SignUpComplete />}
      {path === '/login' && <Login />}
      {(path === '/editor' || path === '/make') && <EditorPage />}
      {path === '/mypage' && <MyPage />}
      <Footer />
    </div>
  )
}

export default App
