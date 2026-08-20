import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyWishlist, deleteWishlist } from '../api/wishlist.js';
import { buildNorigaeData } from '../utils/norigaeAssets.js';
import NorigaePreview from './NorigaePreview.jsx';
import WishlistDetailView from './WishlistDetailView.jsx';
import './WishlistTab.css';

function formatWishlistDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return String(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export function WishlistTab() {
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

  const handleDelete = async (id) => {
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
    return <div className="wishlist-loading">위시리스트를 불러오는 중입니다...</div>;
  }

  // 상세보기 클릭 시 피그마 상세 화면 표시
  if (selectedItem) {
    return (
      <WishlistDetailView
        item={selectedItem}
        onBack={() => setSelectedItem(null)}
        onNavigateReservation={() => navigate('/reservation')}
        onDeleteSuccess={(deletedId) => {
          setWishlist((prev) => prev.filter((item) => item.id !== deletedId));
          setSelectedItem(null);
        }}
      />
    );
  }

  return (
    <div className="tab-page wishlist-page">
      <div className="content-header">
        <h2>위시리스트</h2>
        <p>관심있는 노리개 조합을 확인하세요.</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <p>등록된 관심 노리개 조합이 없습니다.</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => {
            const previewData = buildNorigaeData({
              knot: item.knot || item.knot_id,
              tassel: item.tassel || item.tassel_id,
              decoration: item.decoration || item.decoration_id,
            });

            const title = item.title || (item.knot_name ? `${item.knot_name} 조합` : '클래식 비세토스 매듭');
            const description = item.description || item.symbol_reason || '전통 매듭과 현대적 감성을 조화롭게 조합한 노리개 디자인입니다.';

            return (
              <div className="wishlist-card" key={item.id}>
                <div className="wishlist-card__image-area">
                  <div className="wishlist-card__image-frame">
                    {previewData ? (
                      <NorigaePreview norigaeData={previewData} showSeasonBadge={false} />
                    ) : (
                      <div className="img-placeholder">🖼️</div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="wishlist-card__heart-btn"
                    onClick={() => handleDelete(item.id)}
                    title="관심 등록 해제"
                  >
                    ❤️
                  </button>
                </div>

                <div className="wishlist-card__divider" />

                <div className="wishlist-card__body">
                  <div className="wishlist-card__title-row">
                    <h3 className="wishlist-card__title">{title}</h3>
                    <span className="wishlist-card__date">{formatWishlistDate(item.created_at)}</span>
                  </div>
                  <p className="wishlist-card__desc">{description}</p>

                  <div className="wishlist-card__actions">
                    <button
                      type="button"
                      className="wishlist-btn wishlist-btn--secondary"
                      onClick={() => setSelectedItem(item)}
                    >
                      상세보기
                    </button>
                    <button
                      type="button"
                      className="wishlist-btn wishlist-btn--primary"
                      onClick={() => navigate('/reservation')}
                    >
                      매장 예약
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WishlistTab;