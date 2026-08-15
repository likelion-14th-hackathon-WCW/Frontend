import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Reservation from './pages/Reservation.jsx'
import ReservationGuestInfo from './pages/ReservationGuestInfo.jsx'
import ReservationCompleteGuest from './pages/ReservationCompleteGuest.jsx'
import ReservationCompleteMember from './pages/ReservationCompleteMember.jsx'

function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'

  return (
    <div>
      <Header />
      {path === '/' && <Home />}
      {path === '/reservation' && <Reservation />}
      {path === '/reservation/guest-info' && <ReservationGuestInfo />}
      {path === '/reservation/complete-guest' && <ReservationCompleteGuest />}
      {path === '/reservation/complete-member' && <ReservationCompleteMember />}
      <Footer />
    </div>
  )
}

export default App
