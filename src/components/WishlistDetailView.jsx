import React from 'react';
import NorigaePreview from './NorigaePreview.jsx';
import { buildNorigaeData } from '../utils/norigaeAssets.js';
import { deleteWishlist } from '../api/wishlist.js';

export function WishlistDetailView({ item, onBack, onNavigateReservation, onDeleteSuccess }) {
  if (!item) return null;

  // 파츠 데이터 및 메타 정보 파싱
  const previewData = buildNorigaeData({
    knot: item.knot || item.knot_id,
    tassel: item.tassel || item.tassel_id,
    decoration: item.decoration || item.decoration_id,
  });

  const title = item.title || (item.knot_name ? `${item.knot_name} 조합` : '클래식 비세토스 매듭');
  const creator = item.creator || item.user_nickname || 'gildong1';
  const keyword = item.keyword || item.wish_keyword || '일상';

  const mainDecorationName = item.decoration_name || item.decoration || '연꽃 옥';
  const knotName = item.knot_name || item.knot || '국화 매듭';
  const tasselName = item.tassel_name || item.tassel || 'MCM 모노그램 술';

  const description =
    item.description ||
    item.symbol_reason ||
    '고귀함과 순수함을 상징하는 연꽃 옥을 중심으로, MCM의 헤리티지 꼬냑 컬러 태슬을 조화롭게 배치했습니다. 장수와 평안을 의미하는 국화 매듭은 일상의 격을 높여줍니다.';

  const handleDelete = async () => {
    if (!window.confirm('관심 조합에서 삭제하시겠습니까?')) return;
    try {
      await deleteWishlist(item.id);
      if (onDeleteSuccess) onDeleteSuccess(item.id);
      onBack();
    } catch (error) {
      console.error('위시리스트 삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="wishlist-detail-view">
      {/* 상단 헤더 영역 */}
      <div className="wishlist-detail-header">
        <button type="button" className="btn-back" onClick={onBack} aria-label="뒤로가기">
          ‹
        </button>
        <div className="title-area">
          <h2>{title}</h2>
          <p className="creator-text">@{creator} 제작</p>
        </div>
      </div>

      {/* 본문 콘텐츠 (좌측 프레임 / 우측 카드들) */}
      <div className="wishlist-detail-body">
        {/* 좌측 프리뷰 및 안내문 */}
        <div className="detail-left-col">
          <div className="preview-container">
            {previewData ? (
              <NorigaePreview norigaeData={previewData} showSeasonBadge={false} />
            ) : (
              <div className="img-placeholder">🖼️</div>
            )}
          </div>
          <p className="notice-text">
            * 이 디자인은 매장 방문 시 장인의 수작업을 거쳐 실제 제품으로 제작될 수 있습니다.
          </p>
        </div>

        {/* 우측 정보 카드 목록 */}
        <div className="detail-right-col">
          {/* 키워드 */}
          <div className="keyword-row">
            <span className="icon-pencil">✏️</span>
            <span className="keyword-label">키워드</span>
            <span className="keyword-divider">|</span>
            <span className="keyword-val">{keyword}</span>
          </div>

          {/* 구성 조합 카드 */}
          <div className="info-box combo-box">
            <h3>구성 조합</h3>
            <div className="combo-item">
              <span className="combo-label">💎 메인 장식</span>
              <span className="combo-value">{mainDecorationName}</span>
            </div>
            <div className="combo-item">
              <span className="combo-label">🪢 매듭</span>
              <span className="combo-value">{knotName}</span>
            </div>
            <div className="combo-item">
              <span className="combo-label">🏺 술</span>
              <span className="combo-value">{tasselName}</span>
            </div>
          </div>

          {/* 상징적 의미 카드 */}
          <div className="info-box symbol-box">
            <h3>✨ 상징적 의미</h3>
            <p className="symbol-desc">{description}</p>
            <span className="ai-caption">* 해당 문구는 AI를 통해 제작된 문구입니다.</span>
          </div>
        </div>
      </div>

      {/* 하단 버튼 바 */}
      <div className="wishlist-detail-actions">
        <button type="button" className="btn-wish-active" onClick={handleDelete}>
          ❤️ 위시
        </button>
        <button type="button" className="btn-reservation" onClick={onNavigateReservation}>
          📍 매장 예약 하기
        </button>
      </div>
    </div>
  );
}

export default WishlistDetailView;