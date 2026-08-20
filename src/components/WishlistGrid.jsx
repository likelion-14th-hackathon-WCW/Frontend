import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyWishlist, deleteWishlist } from '../api/wishlist.js';
import { buildNorigaeData, getNorigaeComponentNames } from '../utils/norigaeAssets.js';
import { getWishSource } from '../utils/wishlistCache.js';
import NorigaePreview from './NorigaePreview.jsx';
import WishlistDesignDetail from './WishlistDesignDetail.jsx';
import heartIconFilled from '../assets/heart-icon-filled.svg';
import './WishlistGrid.css';

function formatWishlistDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return String(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export default function WishlistGrid() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await getMyWishlist();
      setWishlist(Array.isArray(res) ? res : res?.data || []);
    } catch (error) {
      console.error('위시리스트 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleUnwish = async (id) => {
    if (!window.confirm('관심 조합에서 삭제하시겠습니까?')) return;
    try {
      await deleteWishlist(id);
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('위시리스트 삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return <div className="wg-loading">위시리스트를 불러오는 중입니다...</div>;
  }

  const goToReservation = (item) => {
    const source = getWishSource(item);
    navigate('/reservation', {
      state: { norigaeData: { ...item, alreadySaved: true, image: source?.image || item.image, title: source?.title || item.title } },
    });
  };

  if (selectedItem) {
    return (
      <WishlistDesignDetail
        item={selectedItem}
        onBack={() => setSelectedItem(null)}
        onReserve={() => goToReservation(selectedItem)}
        onUnwished={(id) => {
          setWishlist((prev) => prev.filter((item) => item.id !== id));
          setSelectedItem(null);
        }}
      />
    );
  }

  return (
    <div className="wg-page">
      <div className="wg-header">
        <h2>위시리스트</h2>
        <p>관심있는 노리개 조합을 확인하세요.</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="wg-empty">
          <p>등록된 관심 노리개 조합이 없습니다.</p>
          <p className="wg-empty__hint">홈 화면의 인기 조합에서 하트를 눌러 담아보세요.</p>
        </div>
      ) : (
        <div className="wg-grid">
          {wishlist.map((item) => {
            const previewData = buildNorigaeData(item);
            const { knotName, decoName } = getNorigaeComponentNames(item);
            const source = getWishSource(item);
            const title = source?.title || item.title || `${knotName} 조합`;
            const description = `${knotName} ${decoName}으로 완성한 작품.`;
            const previewImage = source?.image || item.image;

            return (
              <article className="wg-card" key={item.id}>
                <div className="wg-card__image-area">
                  <div className="wg-card__image-frame">
                    {previewImage ? (
                      <img src={previewImage} alt={title} className="wg-card__image" />
                    ) : previewData ? (
                      <NorigaePreview norigaeData={previewData} showSeasonBadge={false} />
                    ) : (
                      <div className="wg-card__placeholder">🖼️</div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="wg-card__heart"
                    onClick={() => handleUnwish(item.id)}
                    aria-label="관심 등록 해제"
                  >
                    <img src={heartIconFilled} alt="" />
                  </button>
                </div>

                <div className="wg-card__divider" />

                <div className="wg-card__body">
                  <div className="wg-card__meta">
                    <div className="wg-card__title-row">
                      <h3 className="wg-card__title">{title}</h3>
                      <span className="wg-card__date">{formatWishlistDate(item.created_at)}</span>
                    </div>
                    <p className="wg-card__desc">{description}</p>
                  </div>

                  <div className="wg-card__actions">
                    <button type="button" className="wg-btn wg-btn--secondary" onClick={() => setSelectedItem(item)}>
                      상세보기
                    </button>
                    <button type="button" className="wg-btn wg-btn--primary" onClick={() => goToReservation(item)}>
                      매장 예약
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
