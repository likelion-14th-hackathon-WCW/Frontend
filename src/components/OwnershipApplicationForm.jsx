import { useMemo, useState } from 'react';
import { registerOwnership } from '../api/mypage.js';
import NorigaePreview from './NorigaePreview.jsx';
import { buildNorigaeData } from '../utils/norigaeAssets.js';
import awardIcon from '../assets/ownership-application/icon-award-03.svg';
import fileCheckIcon from '../assets/ownership-application/icon-file-check-02.svg';
import tagIcon from '../assets/ownership-application/icon-tag-01.svg';
import careServiceIcon from '../assets/ownership-application/icon-care-service.svg';
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const designPreview = buildNorigaeData(item);

    // 제품 번호는 사용자가 임의로 입력하는 값이 아니라, 디자인이 저장될 때
    // 이미 확정된 값이다. 백엔드가 내려주는 값이 있으면 그대로 쓰고,
    // 없으면 아이템 id 기준으로 고정된 형식(MCM-연도-번호)을 생성해 표시한다.
    const serialNo = useMemo(() => {
        if (item?.serial_no) return item.serial_no;
        const idPart = String(item?.id ?? item?.item_id ?? '').padStart(4, '0');
        const year = item?.created_at ? new Date(item.created_at).getFullYear() : new Date().getFullYear();
        return `MCM-${year}-${idPart}`;
    }, [item]);

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
    const existingImageUrl = item?.image_url || item?.thumbnail || '';

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setError('');

        const result = await registerOwnership({
            product: item?.product ?? item?.product_id,
            serial_no: serialNo,
        });
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

            <div className="ownership-application-layout">
                <form onSubmit={handleSubmit} className="ownership-application-form">
                    <div className="form-group">
                        <label>제품 번호</label>
                        <div className="readonly-field">{serialNo}</div>
                        <p className="hint">제품 내부 택 또는 보증서에 기재된 일련번호입니다.</p>
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
                        {existingImageUrl ? (
                            <div className="image-preview-box">
                                <img src={existingImageUrl} alt="" />
                            </div>
                        ) : designPreview?.knotImage ? (
                            <NorigaePreview norigaeData={designPreview} showSeasonBadge={false} />
                        ) : (
                            <div className="image-preview-box" />
                        )}
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <button type="submit" className="btn-submit-application" disabled={isLoading}>
                        {isLoading ? '신청 중...' : '신청하기'}
                    </button>
                </form>

                <aside className="ownership-benefits-sidebar">
                    <h3 className="benefits-heading">
                        <img src={awardIcon} alt="" /> 인증 혜택
                    </h3>
                    <ul className="benefits-list">
                        <li>
                            <img src={fileCheckIcon} alt="" />
                            <div>
                                <p className="benefit-title">디지털 인증서 발급</p>
                                <p className="benefit-desc">블록체인 기반의 위변조 불가능한 디지털 소유권 증명을 제공합니다.</p>
                            </div>
                        </li>
                        <li>
                            <img src={tagIcon} alt="" />
                            <div>
                                <p className="benefit-title">Exclusive Rewards</p>
                                <p className="benefit-desc">인증 고객 전용 프라이빗 이벤트 초대 및 한정 리워드를 제공합니다.</p>
                            </div>
                        </li>
                        <li>
                            <img src={careServiceIcon} alt="" />
                            <div>
                                <p className="benefit-title">프리미엄 케어 서비스</p>
                                <p className="benefit-desc">제품 수선 및 관리 시 우선적인 서비스를 받으실 수 있습니다.</p>
                            </div>
                        </li>
                    </ul>
                </aside>
            </div>
        </div>
    );
}
