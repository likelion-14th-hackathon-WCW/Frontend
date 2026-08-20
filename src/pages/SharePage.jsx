import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import chevronLeftIcon from '../assets/chevron-left.svg';
import downloadIcon from '../assets/share-download.svg';
import instagramIcon from '../assets/share-instagram.svg';
import kakaoIcon from '../assets/share-kakao.svg';
import linkIcon from '../assets/share-link.svg';
import './SharePage.css';

const INSTAGRAM_SHARE_URL = 'https://www.instagram.com/';
const KAKAO_SHARE_URL = 'https://story.kakao.com/share';

export default function SharePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const norigaeData = location.state?.norigaeData;

  if (!norigaeData) {
    navigate('/editor', { replace: true });
    return null;
  }

  const tasselCountClass = `tassel-part--count-${norigaeData.tasselCount}`;
  const shareUrl = window.location.origin + '/editor/share';

  // ponytail: canvas composite approximates the CSS layer offsets in SharePage.css; good enough for a share image, not pixel-exact
  const handleDownload = async () => {
    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    const tasselWidth = { 1: 180, 2: 230, 3: 190 }[norigaeData.tasselCount] || 180;
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 420;
    const ctx = canvas.getContext('2d');

    try {
      const [knot, decoration, tassel] = await Promise.all([
        loadImage(norigaeData.knotImage),
        loadImage(norigaeData.decorationImage),
        loadImage(norigaeData.tasselImage),
      ]);

      ctx.drawImage(knot, (300 - 140) / 2, 20, 140, 140);
      ctx.drawImage(decoration, (300 - 96) / 2, 128, 96, 96);
      ctx.drawImage(tassel, (300 - tasselWidth) / 2, 214, tasselWidth, 186);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${norigaeData.title || '노리개'}.png`;
      link.click();
    } catch {
      alert('이미지 다운로드에 실패했습니다.');
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    alert('공유 링크가 클립보드에 복사되었습니다.');
  };

  return (
    <div className="share-page-container">
      <div className="share-top-row">
        <button className="share-back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <img src={chevronLeftIcon} alt="" />
        </button>
        <div className="share-heading">
          <h1 className="share-title">나만의 노리개 공유하기</h1>
          <p className="share-desc">완성된 디자인을 확인하고 친구들과 공유해보세요.</p>
        </div>
      </div>

      <div className="share-content-row">
        <div className="share-preview-section">
          <div className="share-preview-inner">
            <span className="share-corner share-corner-tl" />
            <span className="share-corner share-corner-tr" />
            <span className="share-corner share-corner-bl" />
            <span className="share-corner share-corner-br" />
            <div className="share-norigae-render">
              <img className="share-knot-part" src={norigaeData.knotImage} alt="매듭" />
              <img className="share-decoration-part" src={norigaeData.decorationImage} alt="장식" />
              <img
                className={`share-tassel-part ${tasselCountClass}`}
                src={norigaeData.tasselImage}
                alt="술"
              />
            </div>
          </div>
        </div>

        <div className="share-action-section">
          <h2 className="share-action-title">디자인 저장 및 공유</h2>

          <button className="share-download-btn" onClick={handleDownload}>
            <img src={downloadIcon} alt="" /> 이미지 다운로드
          </button>

          <div className="share-social-group">
            <p className="share-social-label">소셜 미디어 공유</p>
            <div className="share-social-icons">
              <a
                className="share-social-icon-btn"
                href={INSTAGRAM_SHARE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인스타그램 공유"
              >
                <img src={instagramIcon} alt="" />
              </a>
              <a
                className="share-social-icon-btn"
                href={KAKAO_SHARE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="카카오톡 공유"
              >
                <img src={kakaoIcon} alt="" />
              </a>
              <button className="share-social-icon-btn" onClick={handleCopyLink} aria-label="링크 복사">
                <img src={linkIcon} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
