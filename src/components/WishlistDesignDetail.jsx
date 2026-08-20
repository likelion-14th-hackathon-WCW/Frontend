import { useMemo } from 'react';
import NorigaePreview from './NorigaePreview.jsx';
import { buildNorigaeData, getNorigaeComponentNames } from '../utils/norigaeAssets.js';
import { getWishSource } from '../utils/wishlistCache.js';
import { deleteWishlist } from '../api/wishlist.js';
import chevronLeftIcon from '../assets/chevron-left.svg';
import ornamentIcon from '../assets/component-ornament-icon.svg';
import knotIcon from '../assets/component-knot-icon.svg';
import tasselIcon from '../assets/component-tassel-icon.svg';
import pencilIcon from '../assets/icon-pencil.png';
import meaningSparkleIcon from '../assets/meaning-sparkle-icon.svg';
import markerWhiteIcon from '../assets/icon-marker-white.svg';
import heartIconFilled from '../assets/heart-icon-filled.svg';
import './WishlistDesignDetail.css';

export default function WishlistDesignDetail({ item, onBack, onReserve, onUnwished }) {
  const previewData = useMemo(() => buildNorigaeData(item), [item]);
  const { knotName, decoName, tasselName } = useMemo(() => getNorigaeComponentNames(item), [item]);
  const source = useMemo(() => getWishSource(item), [item]);

  if (!item) return null;

  const title = source?.title || item.title || `${knotName} 조합`;
  const creator = source?.creator || item.creator || item.user_nickname || '나';
  const keyword = item.keyword || item.wish_keyword || '일상';
  const description = `${knotName} ${decoName}으로 완성한 작품.`;
  const previewImage = source?.image || item.image;

  const handleUnwish = async () => {
    if (!window.confirm('관심 조합에서 삭제하시겠습니까?')) return;
    try {
      await deleteWishlist(item.id);
      onUnwished?.(item.id);
    } catch (error) {
      console.error('위시리스트 삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="wd-detail">
      <header className="wd-detail__header">
        <button type="button" className="wd-detail__back" onClick={onBack} aria-label="뒤로가기">
          <img src={chevronLeftIcon} alt="" />
        </button>
        <h2 className="wd-detail__title">{title}</h2>
      </header>
      <p className="wd-detail__creator">@{creator} 님 제작</p>

      <div className="wd-detail__body">
        <div className="wd-detail__left">
          <div className="wd-detail__preview">
            {previewImage ? (
              <img src={previewImage} alt={title} className="wd-detail__preview-img" />
            ) : previewData ? (
              <NorigaePreview norigaeData={previewData} showSeasonBadge={false} />
            ) : (
              <div className="wd-detail__placeholder">🖼️</div>
            )}
          </div>
          <p className="wd-detail__notice">
            * 이 디자인은 매장 방문 시 장인의 수작업을 거쳐 실제 제품으로 제작될 수 있습니다.
          </p>
        </div>

        <div className="wd-detail__right">
          <div className="wd-detail__keyword">
            <span className="wd-icon"><img src={pencilIcon} alt="" /></span>
            <span>키워드</span>
            <span className="wd-detail__keyword-divider">|</span>
            <span>{keyword}</span>
          </div>

          <div className="wd-box">
            <h3>구성 조합</h3>
            <ul className="wd-combo-list">
              <li>
                <span className="wd-combo-list__label">
                  <span className="wd-icon"><img src={ornamentIcon} alt="" /></span> 메인 장식
                </span>
                <span className="wd-combo-list__value">{decoName}</span>
              </li>
              <li>
                <span className="wd-combo-list__label">
                  <span className="wd-icon"><img src={knotIcon} alt="" /></span> 매듭
                </span>
                <span className="wd-combo-list__value">{knotName}</span>
              </li>
              <li>
                <span className="wd-combo-list__label">
                  <span className="wd-icon wd-icon--rotate"><img src={tasselIcon} alt="" /></span> 술
                </span>
                <span className="wd-combo-list__value">{tasselName}</span>
              </li>
            </ul>
          </div>

          <div className="wd-box wd-box--meaning">
            <h3><span className="wd-icon wd-icon--lg"><img src={meaningSparkleIcon} alt="" /></span> 상징적 의미</h3>
            <p className="wd-box__desc">{description}</p>
            <span className="wd-box__caption">* 해당 문구는 AI를 통해 제작된 문구입니다.</span>
          </div>

          <div className="wd-detail__reserve-row">
            <button type="button" className="wd-btn wd-btn--reserve" onClick={onReserve}>
              <span className="wd-icon"><img src={markerWhiteIcon} alt="" /></span> 매장 예약 하기
            </button>
          </div>
        </div>
      </div>

      <div className="wd-detail__wish-row">
        <button type="button" className="wd-btn wd-btn--wish" onClick={handleUnwish}>
          <span className="wd-icon"><img src={heartIconFilled} alt="" /></span> 위시
        </button>
      </div>
    </div>
  );
}
