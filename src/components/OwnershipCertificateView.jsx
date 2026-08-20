import React, { useState, useEffect } from 'react';
import './OwnershipCertificationView.css';

export default function OwnershipCertificateView({ item, onBack }) {
  const [certData, setCertData] = useState(item || null);
  const [loading, setLoading] = useState(!item);

  // API 연동: item 객체만 넘어온 경우 상세 데이터 API Fetching (필요시)
  useEffect(() => {
    if (item && item.id) {
      fetchCertificateDetail(item.id);
    }
  }, [item]);

  const fetchCertificateDetail = async (id) => {
    try {
      const response = await fetch(`/api/ownerships/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCertData(data);
      }
    } catch (error) {
      console.error('소유권 증서 상세 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 날짜 포맷팅 함수 (예: AUG 15, 2026)
  const formatDate = (dateString) => {
    if (!dateString) return 'AUG 15, 2026';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).toUpperCase();
  };

  // 클립보드 복사
  const handleCopyContract = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert('스마트 컨트랙트 주소가 복사되었습니다.');
  };

  // PDF 다운로드 (브라우저 인쇄 기능 활용)
  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) {
    return <div className="cert-loading">증서 정보를 불러오는 중입니다...</div>;
  }

  const data = certData || item || {};

  return (
    <div className="cert-view-wrapper">
      {/* 상단 타이틀 및 액션 버튼 */}
      <div className="cert-top-header">
        <div className="cert-title-area">
          <button type="button" className="btn-back-arrow" onClick={onBack}>
            ‹
          </button>
          <div>
            <h1 className="cert-main-title">
              {data.product_name || data.title || '클래식 비세토스 매듭'}
            </h1>
            <p className="cert-sub-title">디지털 소유권 증명서</p>
          </div>
        </div>

        <div className="cert-action-buttons">
          <button type="button" className="btn-share">
            <span className="icon">🔗</span> 공유하기
          </button>
          <button type="button" className="btn-pdf-download" onClick={handleDownloadPDF}>
            <span className="icon">📥</span> PDF 다운로드
          </button>
        </div>
      </div>

      {/* 증서 테두리 카드 */}
      <div className="cert-card-frame">
        <div className="cert-header-badge">
          <h2>디지털 정품 인증서</h2>
          <span className="badge-nft">
            <span className="check-icon">✓</span> NFT 인증 완료
          </span>
        </div>

        {/* 중앙 컨텐츠 영역 */}
        <div className="cert-content-grid">
          {/* 좌측 이미지 */}
          <div className="cert-image-container">
            {data.image_url ? (
              <img src={data.image_url} alt={data.product_name} />
            ) : (
              <div className="image-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
          </div>

          {/* 우측 정보 리스트 */}
          <div className="cert-info-list">
            <h3 className="item-name">
              {data.product_name || data.title || '클래식 비세토스 매듭'}
            </h3>

            <div className="info-row">
              <span className="info-label">에디션 번호</span>
              <span className="info-value text-bold">
                {data.serial_no || 'MCM-2026-1010'}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">토큰 ID</span>
              <span className="info-value token-id-bg">
                #{data.token_id || data.id || '829104'}
              </span>
            </div>

            <div className="info-row vertical">
              <span className="info-label">스마트 컨트랙트</span>
              <div className="contract-box">
                <span>{data.auth_code || '0x71C...9731'}</span>
                <button
                  type="button"
                  className="btn-copy"
                  onClick={() => handleCopyContract(data.auth_code || '0x71C...9731')}
                >
                  📋
                </button>
              </div>
            </div>

            <div className="info-row">
              <span className="info-label">발행 일자</span>
              <span className="info-value text-bold">
                {formatDate(data.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* 하단 디자인 스토리 */}
        <div className="cert-story-section">
          <h4>디자인 스토리</h4>
          <p>
            MCM의 헤리티지와 한국의 전통 장신구인 노리개가 만나 탄생한 한정판 에디션입니다.
            코낙 비세토스 패턴의 모던함과 실크 술의 우아함이 결합되어, 과거와 현재를 잇는 독보적인 럭셔리 아이덴티티를 완성했습니다.
            본 디지털 인증서는 해당 제품의 고유성과 소유권을 블록체인 상에서 영구적으로 증명합니다.
          </p>
        </div>
      </div>

      {/* 최하단 안내 박스 */}
      <div className="cert-notice-box">
        <div className="notice-icon">i</div>
        <div className="notice-content">
          <h5>디지털 소유권 안내</h5>
          <p>
            이 디지털 인증서는 블록체인 상에 안전하게 저장되어, 귀하의 MCM 헤리티지 제품에 대한 소유권과 정품 여부를 영구적으로 증명합니다. 복제나 위조가 불가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}