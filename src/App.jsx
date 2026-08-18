import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Craftsmanship from './pages/Craftsmanship.jsx'

const PAGES = {
  '/craftsmanship': Craftsmanship,
}

function App() {
  const Page = PAGES[window.location.pathname]

  return (
    <div>
      <Header />
      {Page && <Page />}
      <Footer />
    </div>
  )
}

export default App
