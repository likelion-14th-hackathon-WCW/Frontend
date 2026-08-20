import { useState } from 'react';
import { registerOwnership } from '../api/mypage.js';
import NorigaePreview from './NorigaePreview.jsx';
import { buildNorigaeData } from '../utils/norigaeAssets.js';
import './OwnershipApplicationForm.css';

const formatDate = (raw) => {
    if (!raw) return '-';
    const date = new Date(raw);
    if (isNaN(date.getTime())) return String(raw);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}.${month}.${day}`;
};

export default function OwnershipApplicationForm({ item, onCancel, onSuccess }) {
    const [serialNo, setSerialNo] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const designPreview = buildNorigaeData(item);

    // 사용자가 직접 설정한 이름을 최우선으로 탐색
    const itemTitle =
        item?.customName ||
        item?.norigaeName ||
        item?.title ||
        item?.product_name ||
        item?.name ||
        designPreview?.customName ||
        designPreview?.name ||
        '노리개 커스텀';

    const itemDate = item?.created_at;
    const uploadedPreview = imageFile ? URL.createObjectURL(imageFile) : '';
    const existingImageUrl = item?.image_url || item?.thumbnail || '';

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setImageFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!serialNo.trim()) {
            setError('제품 번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('serial_no', serialNo.trim());
        formData.append('item', item?.id || item?.item_id || '');
        if (imageFile) formData.append('product_image', imageFile);

        const result = await registerOwnership(formData);
        setIsLoading(false);

        if (result.success) {
            alert('소유권 신청이 접수되었습니다.');
            if (onSuccess) onSuccess();
        } else {
            setError(result.message || '신청 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="ownership-application-container">
            <button type="button" className="btn-back" onClick={onCancel}>
                &lt; 디지털 소유권 신청
            </button>
            <p className="ownership-application-desc">
                제작한 노리개의 디지털 소유권을 신청하고 디지털 자산으로서의 가치를 경험하세요.
            </p>

            <form onSubmit={handleSubmit} className="ownership-application-form">
                <div className="form-group">
                    <label>제품 번호</label>
                    <input
                        type="text"
                        placeholder="MCM-2026-1010"
                        value={serialNo}
                        onChange={(e) => {
                            setSerialNo(e.target.value);
                            setError('');
                        }}
                    />
                    <p className="hint">제품 내부 택 또는 보증서에 기재된 일련번호를 확인해주세요.</p>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>제작 일자</label>
                        <div className="readonly-field">{formatDate(itemDate)}</div>
                    </div>
                    <div className="form-group">
                        <label>제품명</label>
                        <div className="readonly-field">{itemTitle}</div>
                    </div>
                </div>

                <div className="form-group">
                    <label>제품 이미지</label>
                    <label className="image-upload-box">
                        {uploadedPreview ? (
                            <img src={uploadedPreview} alt="" />
                        ) : existingImageUrl ? (
                            <img src={existingImageUrl} alt="" />
                        ) : designPreview?.knotImage ? (
                            <NorigaePreview norigaeData={designPreview} showSeasonBadge={false} />
                        ) : (
                            <span className="img-placeholder">🖼️</span>
                        )}
                        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </label>
                </div>

                {error && <p className="form-error">{error}</p>}

                <button type="submit" className="btn-submit-application" disabled={isLoading}>
                    {isLoading ? '신청 중...' : '신청하기'}
                </button>
            </form>
        </div>
    );
}