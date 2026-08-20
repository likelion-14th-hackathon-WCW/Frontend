import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LoginModal.css';
import loginmodalicon from '../assets/login-modal.svg'

export default function LoginModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-icon" onClick={onClose}>
          ✕
        </button>

        <div className="modal-icon-wrapper">
          <div className="lock-icon"><img src={loginmodalicon} alt="" /></div>
        </div>

        <h2 className="modal-title">로그인이 필요한 서비스입니다</h2>
        <p className="modal-description">
          나만의 노리개 디자인을 저장하려면<br />
          로그인 또는 회원가입을 진행해주세요.
        </p>

        <div className="modal-button-group">
          <button
            className="btn-login"
            onClick={() => navigate('/login', { state: { from: location.pathname } })}
          >
            로그인하기
          </button>
          <button
            className="btn-signup"
            onClick={() => navigate('/signup', { state: { from: location.pathname } })}
          >
            회원가입하기
          </button>
        </div>

        <button className="btn-text-close" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}