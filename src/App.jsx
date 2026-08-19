import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Craftsmanship from './pages/Craftsmanship.jsx'
import Terms from './pages/Terms.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import CustomerCenter from './pages/CustomerCenter.jsx'
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

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/craftsmanship" element={<Craftsmanship />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/support" element={<CustomerCenter />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/reservation/guest-info" element={<ReservationGuestInfo />} />
        <Route path="/reservation/complete-guest" element={<ReservationCompleteGuest />} />
        <Route path="/reservation/complete-member" element={<ReservationCompleteMember />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/complete" element={<SignUpComplete />} />
        <Route path="/login" element={<Login />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/make" element={<EditorPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App