import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DigitalOwnershipPage.css';

// 테스트용 가짜 백엔드 제출 함수
const mockSubmitOwnershipApi = (payload) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('서버로 전달된 더미 데이터:', payload);
      resolve({ success: true, status: 200, message: '신청이 완료되었습니다.' });
    }, 1000);
  });
};

export default function DigitalOwnershipPage() {
  const navigate = useNavigate();

  // 더미 데이터 초기값 세팅
  const [productCode, setProductCode] = useState('MCM-2026-1010');
  const [createdDate, setCreatedDate] = useState('2026.08.13');
  const [productName, setProductName] = useState('클래식 비세토스 매듭');

  // 더미 이미지 (SVG Placehold)
  const dummyImage =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='220' viewBox='0 0 400 220'><rect width='100%' height='100%' fill='%23e5e5e5'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23888888'>노리개 이미지 미리보기 (더미)</text></svg>";

  const [imagePreview, setImagePreview] = useState(dummyImage);
  const [loading, setLoading] = useState(false);

  // 뒤로가기
  const handleBack = () => {
    navigate(-1);
  };

  // 이미지 변경 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productCode.trim() || !productName.trim()) {
      alert('제품 번호와 제품명을 확인해 주세요.');
      return;
    }

    setLoading(true);

    const payload = {
      product_code: productCode,
      created_at: createdDate,
      product_name: productName,
      image: imagePreview,
    };

    const res = await mockSubmitOwnershipApi(payload);

    if (res.success) {
      alert('🎉 디지털 소유권 신청이 성공적으로 완료되었습니다!');
    } else {
      alert('신청 실패: ' + res.message);
    }

    setLoading(false);
  };

  return (
    <div className="ownership-page-container">
      {/* 헤더 영역 */}
      <div className="ownership-header">
        <button className="btn-back" onClick={handleBack} aria-label="뒤로가기">
          &lt;
        </button>
        <h1 className="ownership-title">디지털 소유권 신청</h1>
      </div>
      <p className="ownership-subtitle">
        제작한 노리개의 디지털 소유권을 신청하고 디지털 자산으로서의 가치를 경험하세요.
      </p>

      <div className="ownership-grid">
        {/* 왼쪽: 신청 폼 영역 */}
        <form className="ownership-form-card" onSubmit={handleSubmit}>
          {/* 제품 번호 */}
          <div className="form-group full-width">
            <label className="form-label" htmlFor="productCode">
              제품 번호
            </label>
            <input
              id="productCode"
              type="text"
              className="form-input"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              placeholder="예: MCM-2026-1010"
            />
            <span className="input-helper">
              제품 내부 택 또는 보증서에 기재된 일련번호를 확인해주세요.
            </span>
          </div>

          {/* 제작 일자 & 제품명 */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="createdDate">
                제작 일자
              </label>
              <input
                id="createdDate"
                type="text"
                className="form-input"
                value={createdDate}
                onChange={(e) => setCreatedDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="productName">
                제품명
              </label>
              <input
                id="productName"
                type="text"
                className="form-input"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
          </div>

          {/* 제품 이미지 */}
          <div className="form-group full-width">
            <label className="form-label">제품 이미지</label>
            <div className="image-upload-box">
              <input
                type="file"
                accept="image/*"
                id="image-upload-input"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload-input" className="image-upload-label">
                {imagePreview ? (
                  <img src={imagePreview} alt="제품 미리보기" className="image-preview" />
                ) : (
                  <span style={{ color: '#888' }}>이미지를 클릭하여 변경</span>
                )}
              </label>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? '신청 처리 중...' : '신청하기'}
          </button>
        </form>

        {/* 오른쪽: 인증 혜택 안내 영역 */}
        <div className="benefit-info-card">
          <div className="benefit-header">
            <span className="benefit-icon">🎖️</span>
            <h2>인증 혜택</h2>
          </div>

          <div className="benefit-list">
            <div className="benefit-item">
              <span className="benefit-item-icon">📋</span>
              <div>
                <h3>디지털 인증서 발급</h3>
                <p>블록체인 기반의 위변조 불가능한 디지털 소유권 증명을 제공합니다.</p>
              </div>
            </div>

            <div className="benefit-item">
              <span className="benefit-item-icon">🏷️</span>
              <div>
                <h3>Exclusive Rewards</h3>
                <p>인증 고객 전용 프라이빗 이벤트 초대 및 한정 리워드를 제공합니다.</p>
              </div>
            </div>

            <div className="benefit-item">
              <span className="benefit-item-icon">🎧</span>
              <div>
                <h3>프리미엄 케어 서비스</h3>
                <p>제품 수선 및 관리 시 우선적인 서비스를 받으실 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}