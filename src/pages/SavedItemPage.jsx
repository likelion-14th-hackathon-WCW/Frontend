import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shareIcon from '../assets/editor-share.svg';

export default function SavedItemsPage({ items = [] }) {
  const navigate = useNavigate();

  const handleShare = async (item) => {
    const shareUrl = `${window.location.origin}/share/${item.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.symbol_reason,
          url: shareUrl,
        });
      } catch (err) {
        // 공유 취소 시 예외 처리
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('공유 링크가 클립보드에 복사되었습니다.');
    }
  };

  const handleDetail = (id) => {
    navigate(`/norigae/${id}`);
  };

  return (
    <div className="tab-page">
      <div className="content-header">
        <h2>저장 작품 & 타임라인</h2>
        <p>나만의 MCM Heritage 노리개 컬렉션을 확인하고 공유하세요.</p>
      </div>

      {items.length === 0 ? (
        <div className="mypage-empty">저장된 노리개 작품이 없습니다.</div>
      ) : (
        <div className="saved-card-grid">
          {items.map((item) => (
            <div key={item.id} className="saved-card">
              {/* 이미지 및 미리보기 영역 */}
              <div className="card-preview-box">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="timeline-image" />
                ) : (
                  <div className="norigae-preview">
                    <img
                      src={item.knot_image || `/assets/knots/knot_${item.knot || 1}.svg`}
                      alt="매듭"
                      className="preview-knot"
                      style={{ color: item.color }}
                    />
                    <img
                      src={item.decoration_image || `/assets/decorations/deco_${item.decoration || 7}.svg`}
                      alt="장식"
                      className="preview-deco"
                    />
                    <img
                      src={item.tassel_image || `/assets/tassels/tassel_${item.tassel || 13}.svg`}
                      alt="술"
                      className="preview-tassel"
                      style={{ color: item.color }}
                    />
                  </div>
                )}
              </div>

              {/* 작품 정보 영역 */}
              <div className="card-content">
                <div className="card-title-row">
                  <h3 className="card-title">{item.title}</h3>
                  <span className="card-date">{item.created_at || item.created_at_date}</span>
                </div>
                <p className="card-desc">{item.symbol_reason}</p>

                {/* 하단 버튼 그룹 */}
                <div className="card-btn-group">
                  <button className="btn-detail" onClick={() => handleDetail(item.id)}>
                    상세보기
                  </button>
                  <button className="btn-card-share" onClick={() => handleShare(item)}>
                    <img src={shareIcon} alt="" className="btn-icon" /> 공유하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}