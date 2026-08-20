import { useNavigate } from 'react-router-dom';
import NorigaePreview from '../components/NorigaePreview.jsx';
import { buildNorigaeData, getNorigaeComponentNames } from '../utils/norigaeAssets.js';
import shareIcon from '../assets/editor-share.svg';
import iconPlusCircle from '../assets/mypage/icon-plus-circle.svg';
import './SavedItemPage.css';

function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

export default function SavedItemPage({ items = [] }) {
  const navigate = useNavigate();

  const handleShare = async (item, e) => {
    e?.stopPropagation();
    const shareUrl = `${window.location.origin}/editor/share`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title || '나만의 노리개',
          text: item.symbol_reason || 'MCM Heritage 노리개 컬렉션',
          url: shareUrl,
        });
      } catch {
        // 무시
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('공유 링크가 클립보드에 복사되었습니다.');
    }
  };

  const handleReserve = (item, e) => {
    e?.stopPropagation();
    const norigaeData = buildNorigaeData(item);
    navigate('/reservation', { state: { norigaeData: { ...norigaeData, title: item.title } } });
  };

  return (
    <div className="saved-items-container">
      <div className="saved-items__header">
        <h2 className="saved-items__title">저장된 노리개 디자인</h2>
        <p className="saved-items__desc">에디터에서 직접 커스텀하고 저장한 나만의 노리개 컬렉션입니다.</p>
      </div>

      {items.length === 0 ? (
        <button type="button" className="saved-items__add-new" onClick={() => navigate('/editor')}>
          <img src={iconPlusCircle} alt="" className="saved-items__add-new-icon" />
          <span className="saved-items__add-new-text">
            <span className="saved-items__add-new-title">새로 만들기</span>
            <span className="saved-items__add-new-desc">나만의 노리개를 디자인하세요.</span>
          </span>
        </button>
      ) : (
        <div className="saved-items__list">
          {items.map((item) => {
            const norigaeData = buildNorigaeData(item);
            const { knotName, decoName, tasselName, colorName } = getNorigaeComponentNames(item);
            const itemId = item.id || item.item_id || 'norigae-saved';

            return (
              <article key={itemId} className="saved-item-card">
                <div className="saved-item-card__preview-box">
                  <NorigaePreview norigaeData={norigaeData} imageSrc={item.image_url} showSeasonBadge={false} />
                </div>

                <div className="saved-item-card__info-box">
                  <div className="saved-item-card__info-top">
                    <div className="saved-item-card__title-row">
                      <h3 className="saved-item-card__title">{item.title || '나만의 노리개'}</h3>
                      <span className="saved-item-card__date">{formatDate(item.created_at)}</span>
                    </div>

                    {item.wish_keyword && (
                      <div className="saved-item-card__keyword-row">
                        <span className="saved-item-card__keyword-label">소망 키워드</span>
                        <span className="saved-item-card__keyword-value">{item.wish_keyword}</span>
                      </div>
                    )}

                    <p className="saved-item-card__meaning">
                      {item.symbol_reason || '전통 매듭과 현대적 감각이 조화를 이룬 맞춤형 노리개 디자인입니다.'}
                    </p>

                    <div className="saved-item-card__specs">
                      <div className="saved-item-card__spec-item">
                        <span className="saved-item-card__spec-key">매듭</span>
                        <span className="saved-item-card__spec-val">{knotName}</span>
                      </div>
                      <div className="saved-item-card__spec-item">
                        <span className="saved-item-card__spec-key">메인 장식</span>
                        <span className="saved-item-card__spec-val">{decoName}</span>
                      </div>
                      <div className="saved-item-card__spec-item">
                        <span className="saved-item-card__spec-key">술</span>
                        <span className="saved-item-card__spec-val">{tasselName}</span>
                      </div>
                      <div className="saved-item-card__spec-item">
                        <span className="saved-item-card__spec-key">실 색상</span>
                        <span className="saved-item-card__spec-val">{colorName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="saved-item-card__actions">
                    <button
                      type="button"
                      className="saved-item-card__btn saved-item-card__btn--reserve"
                      onClick={(e) => handleReserve(item, e)}
                    >
                      매장 예약하기
                    </button>
                    <button
                      type="button"
                      className="saved-item-card__btn saved-item-card__btn--share"
                      onClick={(e) => handleShare(item, e)}
                    >
                      <img src={shareIcon} alt="" className="saved-item-card__btn-icon" />
                      공유하기
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