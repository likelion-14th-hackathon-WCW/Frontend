import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Reservation from './pages/Reservation.jsx'

function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'

  return (
    <div>
      <Header />
      {path === '/' && <Home />}
      {path === '/reservation' && <Reservation />}
      <Footer />
    </div>
  )
}

export default App
