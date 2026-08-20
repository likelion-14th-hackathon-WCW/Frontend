import { useEffect } from 'react'
import './CombinationDetailModal.css'
import closeIcon from '../assets/modal-close-icon.svg'
import ornamentIcon from '../assets/component-ornament-icon.svg'
import knotIcon from '../assets/component-knot-icon.svg'
import tasselIcon from '../assets/component-tassel-icon.svg'
import heartIcon from '../assets/heart-icon.svg'
import heartIconFilled from '../assets/heart-icon-filled.svg'
import optionPlaceholderIcon from '../assets/option-placeholder-icon.svg'
import { getNorigaeComponentNames } from '../utils/norigaeAssets.js'

export default function CombinationDetailModal({ combination, liked, onToggleLike, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!combination) return null

  const { title, creator, description, image, decoration_name: decorationName, knot_name: knotName } = combination
  // 백엔드는 술 이름 문자열이 아니라 tassel_count(개수)만 내려줌
  const { tasselName } = getNorigaeComponentNames(combination)

  return (
    <div className="combination-modal-overlay" onClick={onClose}>
      <div className="combination-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="combination-modal__close" aria-label="닫기" onClick={onClose}>
          <img src={closeIcon} alt="" />
        </button>

        <div className="combination-modal__image">
          {image ? (
            <img
              src={image}
              alt={title}
              className={`combination-modal__image-photo combination-modal__image-photo--rank-${combination.rank}`}
            />
          ) : (
            <div className="combination-modal__image-placeholder">
              <img src={optionPlaceholderIcon} alt="" className="combination-modal__image-icon" />
            </div>
          )}
        </div>

        <div className="combination-modal__details">
          <div className="combination-modal__header">
            <h2 className="combination-modal__title">{title}</h2>
            <p className="combination-modal__author">@{creator} 님 제작</p>
          </div>

          <p className="combination-modal__description">{description}</p>

          <div className="combination-modal__components">
            <h3 className="combination-modal__components-title">구성 조합</h3>
            <ul className="combination-modal__components-list">
              <li>
                <img src={ornamentIcon} alt="" />
                <span className="combination-modal__component-label">메인 장식:</span>
                <span className="combination-modal__component-value">{decorationName}</span>
              </li>
              <li>
                <img src={knotIcon} alt="" />
                <span className="combination-modal__component-label">매듭:</span>
                <span className="combination-modal__component-value">{knotName}</span>
              </li>
              <li>
                <img src={tasselIcon} alt="" className="combination-modal__tassel-icon" />
                <span className="combination-modal__component-label">술:</span>
                <span className="combination-modal__component-value">{tasselName}</span>
              </li>
            </ul>
          </div>

          <div className="combination-modal__footer">
            <div className="combination-modal__actions">
              <button type="button" className="combination-modal__reserve">
                이 조합으로 매장 예약하기
              </button>
              <button
                type="button"
                className="combination-modal__wishlist"
                aria-pressed={liked}
                onClick={onToggleLike}
              >
                <img src={liked ? heartIconFilled : heartIcon} alt="" />
                위시리스트
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
