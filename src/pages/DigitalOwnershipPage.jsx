import React, { useState } from 'react';
import './DigitalOwnershipPage.css';
import diaIcon from '../assets/ownership-1.png';
import checkIcon from '../assets/ownership-check.png';
import InfoIcon from '../assets/ownership-info.png';
import NorigaePreview from '../components/NorigaePreview.jsx';
import { buildNorigaeData } from '../utils/norigaeAssets.js';
import { findDesignForOwnership } from '../utils/ownership.js';
import { getOwnershipDesign } from '../utils/ownershipDesignCache.js';

const DigitalOwnership = ({ ownerships = [], items = [], onRegisterSuccess, onViewApplication }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0].replace(/-/g, '.');
  };

  // 소유권 등록 처리 API
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!productId || !serialNo) {
      alert('상품 ID와 시리얼 번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ownerships/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          product: parseInt(productId, 10),
          serial_no: serialNo,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        alert('시리얼 번호가 성공적으로 등록되었습니다.');
        setIsModalOpen(false);
        setProductId('');
        setSerialNo('');
        if (onRegisterSuccess) onRegisterSuccess(); // 목록 새로고침 콜백
      } else if (response.status === 400) {
        const errorMsg = data.serial_no ? data.serial_no[0] : '유효하지 않은 입력입니다.';
        alert(errorMsg);
      } else {
        alert('등록 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('서버와의 통신에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="digital-ownership-container">
      {/* 타이틀 및 등록 버튼 상단 헤더 */}
      <div className="ownership-header">
        <div>
          <h2>디지털 소유권 및 권리</h2>
          <p>보유하고 있는 노리개 커스텀 디자인의 디지털 인증서를 확인하세요.</p>
        </div>
        <button className="btn-open-modal" onClick={() => setIsModalOpen(true)}>
          + 시리얼 번호 등록
        </button>
      </div>

      {/* 요약 통계 카드 */}
      <div className="ownership-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-bg diamond-bg"><img src={diaIcon} alt="" /></div>
          <div className="stat-info">
            <span className="stat-label">총 보유 자산</span>
            <span className="stat-value">{ownerships.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-bg check-bg"><img src={checkIcon} alt=''/></div>
          <div className="stat-info">
            <span className="stat-label">인증 완료</span>
            <span className="stat-value">
              {ownerships.filter((o) => o.has_production_right).length}
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-bg info-bg"><img src={InfoIcon}/></div>
          <div className="stat-info">
            <span className="stat-label">진행 중</span>
            <span className="stat-value">
              {ownerships.filter((o) => !o.has_production_right).length}
            </span>
          </div>
        </div>
      </div>

      {/* 소유권 상품 카드 리스트 */}
      <div className="ownership-list">
        {ownerships.length === 0 ? (
          <div className="empty-ownership">등록된 디지털 소유권이 없습니다.</div>
        ) : (
          ownerships.map((item) => {
            const isCertified = item.has_production_right;
            const cachedDesign = getOwnershipDesign(item.id);
            const designItem = cachedDesign || findDesignForOwnership(items, item);
            const preview = designItem ? buildNorigaeData(designItem) : null;
            const title = designItem?.title || item.product_name || '노리개 커스텀';

            return (
              <div className="ownership-item-card" key={item.id || item.serial_no}>
                <div className="ownership-thumb-box">
                  {designItem?.image_url || designItem?.thumbnail || designItem?.image ? (
                    <img src={designItem.image_url || designItem.thumbnail || designItem.image} alt={title} />
                  ) : preview?.knotImage ? (
                    <NorigaePreview norigaeData={preview} showSeasonBadge={false} />
                  ) : (
                    <div className="img-placeholder" />
                  )}
                </div>

                <div className="ownership-details">
                  <div className="ownership-title-row">
                    <div className="ownership-title-col">
                      <h3 className="ownership-item-title">{title}</h3>
                      <p className="ownership-date">
                        {isCertified ? '등록일' : '신청일'}: {formatDate(item.created_at)}
                      </p>
                    </div>
                    <span className={`ownership-badge ${isCertified ? 'badge-completed' : 'badge-pending'}`}>
                      {isCertified ? '인증 완료' : '심사 중'}
                    </span>
                  </div>

                  <div className="ownership-info-box">
                    <div className="info-grid">
                      <div className="info-col">
                        <span className="info-label">시리얼 넘버</span>
                        <span className="info-val">{item.serial_no}</span>
                      </div>
                      <div className="info-col">
                        <span className="info-label">제작 정보</span>
                        <span className="info-val">
                          {item.production_count ?? 0}회 제작
                        </span>
                      </div>
                    </div>

                    <div className="info-col full-width">
                      <span className="info-label">등록 인증 코드</span>
                      <span className="info-val code-val">
                        {item.auth_code || '0x71C...9731'}
                      </span>
                    </div>
                  </div>

                  <div className="ownership-actions">
                    <button
                      className="btn-application-view"
                      onClick={() => onViewApplication && onViewApplication(item)}
                    >
                      {isCertified ? '증명서 보기' : '신청서 보기'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 시리얼 번호 등록 모달 팝업 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>시리얼 번호 등록</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleRegister} className="modal-form">
              <div className="form-group">
                <label>상품 ID (Product ID)</label>
                <input
                  type="number"
                  placeholder="예: 2"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>시리얼 번호 (Serial No)</label>
                <input
                  type="text"
                  placeholder="예: MCM-2026-1010"
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  취소
                </button>
                <button type="submit" className="btn-submit" disabled={isLoading}>
                  {isLoading ? '등록 중...' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalOwnership;