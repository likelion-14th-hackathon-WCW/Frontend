import React, { useState } from 'react';
import NorigaePreview from './NorigaePreview.jsx';
import { buildNorigaeData, getNorigaeComponentNames } from '../utils/norigaeAssets.js';
import { apiClient } from '../api/client.js';
import './NorigaeDetailView.css';
import pencilIcon from '../assets/icon-pencil.png';
import ornamentIcon from '../assets/component-ornament-icon.svg';
import knotIcon from '../assets/component-knot-icon.svg';
import tasselPartIcon from '../assets/component-tassel-icon.svg';
import meaningSparkleIcon from '../assets/meaning-sparkle-icon.svg';
import markerWhiteIcon from '../assets/icon-marker-white.svg';
import awardIcon from '../assets/icon-award.svg';
import trashIcon from '../assets/icon-trash.svg';





function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return String(isoString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 제작`;
}

export default function NorigaeDetailView({ item, onBack, onDeleteSuccess, onGoToReservation, onGoToOwnership }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!item) return null;

  const preview = buildNorigaeData(item);
  const { knotName, decoName, tasselName } = getNorigaeComponentNames(item);

  const handleDelete = async () => {
    if (!window.confirm('정말 이 디자인을 삭제하시겠습니까?')) return;
    setIsDeleting(true);
    try {
      const id = item.id || item.item_id;
      await apiClient.delete(`/api/items/${id}/`);
      alert('디자인이 삭제되었습니다.');
      if (onDeleteSuccess) onDeleteSuccess(id);
      onBack(); // 목록으로 돌아가기
    } catch (error) {
      console.error('디자인 삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="norigae-detail-view">
      <header className="detail-header">
        <button type="button" className="btn-back-arrow" onClick={onBack} aria-label="뒤로가기">
          ‹
        </button>
        <h2 className="detail-title">{item.title || item.name || '클래식 비세토스 매듭'}</h2>
      </header>
      <p className="detail-created-date">{formatDate(item.created_at || item.created_at_date)}</p>

      <div className="detail-body-grid">
        <div className="detail-left-col">
          <div className="preview-box">
            {item.image_url || item.thumbnail ? (
              <img src={item.image_url || item.thumbnail} alt={item.title || ''} className="preview-img" />
            ) : preview?.knotImage ? (
              <NorigaePreview norigaeData={preview} showSeasonBadge={false} />
            ) : (
              <div className="img-placeholder-icon">🖼️</div>
            )}
          </div>
          <p className="craft-notice">
            * 이 디자인은 매장 방문 시 장인의 수작업을 거쳐 실제 제품으로 제작될 수 있습니다.
          </p>
        </div>

        <div className="detail-right-col">
          <div className="keyword-badge-row">
            <span className="icon-sm"><img src={pencilIcon} alt="키워드"/></span>
            <span className="keyword-label">키워드</span>
            <span className="keyword-divider">|</span>
            <span className="keyword-value">{item.wish_keyword || item.keyword || '일상'}</span>
          </div>

          <div className="info-box composition-box">
            <h3 className="box-title">구성 조합</h3>
            <ul className="parts-detail-list">
              <li>
                <span className="part-type">
                  <span className="icon-sm"><img src={ornamentIcon} alt="" /></span> 메인 장식
                </span>
                <span className="part-name">{decoName}</span>
              </li>
              <li>
                <span className="part-type">
                  <span className="icon-sm"><img src={knotIcon} alt="" /></span> 매듭
                </span>
                <span className="part-name">{knotName}</span>
              </li>
              <li>
                <span className="part-type">
                  <span className="icon-sm icon-rotate-180"><img src={tasselPartIcon} alt="" /></span> 술
                </span>
                <span className="part-name">{tasselName}</span>
              </li>
            </ul>
          </div>

          <div className="info-box meaning-box">
            <h3 className="box-title meaning-title">
              <span className="icon-sm"><img src={meaningSparkleIcon} alt="" /></span> 상징적 의미
            </h3>
            <p className="meaning-description">
              {item.symbol_reason ||
                item.description ||
                '고귀함과 순수함을 상징하는 연꽃 옥을 중심으로, MCM의 헤리티지 꼬냑 컬러 태슬을 조화롭게 배치했습니다. 장수와 평안을 의미하는 국화 매듭은 일상의 격을 높여줍니다.'}
            </p>
            <span className="ai-notice-tag">* 해당 문구는 AI를 통해 제작된 문구입니다.</span>
          </div>

          <button type="button" className="btn-store-reserve" onClick={onGoToReservation}>
            <span className="btn-icon"><img src={markerWhiteIcon} alt="" /></span> 매장 예약 하기
          </button>
        </div>
      </div>

      <footer className="detail-bottom-actions">
        <button type="button" className="btn-action-outline btn-ownership" onClick={onGoToOwnership}>
          <span className="btn-icon"><img src={awardIcon} alt="" /></span> 소유권 신청
        </button>
        <button type="button" className="btn-action-outline btn-delete" onClick={handleDelete} disabled={isDeleting}>
          <span className="btn-icon"><img src={trashIcon} alt="" /></span> 삭제하기
        </button>
      </footer>
    </div>
  );
}