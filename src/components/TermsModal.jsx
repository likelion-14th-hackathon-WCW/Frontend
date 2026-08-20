import { useEffect } from 'react'
import { TERMS_DATA } from '../data/termsData.js'
import closeIcon from '../assets/modal-close-icon.svg'
import './TermsModal.css'

export default function TermsModal({ isOpen, termsKey, onClose, onAgree }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen || !termsKey) return null

  const data = TERMS_DATA[termsKey] || {
    title: '약관 상세 내용',
    type: '안내',
    summary: '약관 내용을 확인해 주세요.',
    sections: [],
  }

  const handleAgreeAndClose = () => {
    if (onAgree) onAgree(termsKey)
    onClose()
  }

  return (
    <div className="terms-modal-overlay" onClick={onClose}>
      <div
        className="terms-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
      >
        <div className="terms-modal__header">
          <div className="terms-modal__header-left">
            <span className={`terms-modal__badge terms-modal__badge--${data.type === '필수' ? 'required' : 'optional'}`}>
              {data.type}
            </span>
            <h2 id="terms-modal-title" className="terms-modal__title">
              {data.title}
            </h2>
          </div>
          <button
            type="button"
            className="terms-modal__close"
            onClick={onClose}
            aria-label="닫기"
          >
            <img src={closeIcon} alt="" />
          </button>
        </div>

        {data.summary && (
          <div className="terms-modal__summary">
            <p>{data.summary}</p>
          </div>
        )}

        <div className="terms-modal__body">
          {data.sections &&
            data.sections.map((section, idx) => (
              <section key={idx} className="terms-modal__section">
                {section.heading && <h3 className="terms-modal__heading">{section.heading}</h3>}
                <p className="terms-modal__text">
                  {section.content.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </section>
            ))}
        </div>

        <div className="terms-modal__footer">
          <button type="button" className="terms-modal__btn terms-modal__btn--secondary" onClick={onClose}>
            닫기
          </button>
          <button type="button" className="terms-modal__btn terms-modal__btn--primary" onClick={handleAgreeAndClose}>
            동의하고 닫기
          </button>
        </div>
      </div>
    </div>
  )
}
