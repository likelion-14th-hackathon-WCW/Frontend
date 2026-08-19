import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMyReservations, cancelReservation } from '../api/mypage.js';
import MyPageSidebar from '../components/MyPageSidebar.jsx';
import ReservationSummaryCard from '../components/ReservationSummaryCard.jsx';
import infoIcon from '../assets/info-icon.svg';
import './MyPageReservationCancel.css';

const CANCEL_REASONS = ['일정 변경', '매장 방문 불가', '단순 변심', '기타'];

function formatReservedAt(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const hour24 = date.getHours();
  const meridiem = hour24 < 12 ? '오전' : '오후';
  const hour12 = hour24 % 12 || 12;
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${meridiem} ${hour12}시 ${minute}분`;
}

export default function MyPageReservationCancel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReason, setSelectedReason] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservation = async () => {
      setLoading(true);
      try {
        const res = await getMyReservations();
        if (res?.success) {
          const list = res.data || [];
          const found = list.find((r) => String(r.id ?? r.reservation_id) === id);
          setReservation(found || null);
        }
      } catch (err) {
        console.error('예약 정보 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [id]);

  const handleSelectReason = (reason) => {
    setSelectedReason((prev) => (prev === reason ? null : reason));
  };

  const handleCancel = async () => {
    if (!selectedReason) return;
    setError('');
    try {
      const res = await cancelReservation(id);
      if (res?.success) {
        navigate('/mypage/reservations');
      } else {
        setError('예약 취소에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      console.error('예약 취소 실패:', err);
      setError('예약 취소에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="mypage-wrapper">
      <MyPageSidebar active="reservations" />
      <main className="mypage-content">
        <div className="content-header">
          <h2>예약 취소</h2>
        </div>

        {loading ? (
          <p className="cancel-empty">예약 정보를 불러오는 중입니다.</p>
        ) : !reservation ? (
          <p className="cancel-empty">예약 정보를 찾을 수 없습니다.</p>
        ) : (
          <ReservationSummaryCard
            heading="예약 정보"
            reservationNumber={reservation.reservation_number || `MCM-${reservation.id ?? reservation.reservation_id}`}
            storeName={reservation.store_name || reservation.store}
            dateLabel={formatReservedAt(reservation.reserved_at || reservation.reservation_date)}
          />
        )}

        <section className="cancel-reason-section">
          <div className="cancel-reason-heading">
            <h3>취소 사유를 선택해주세요</h3>
            <p className="cancel-reason-helper">※ 취소 사유 선택 후 예약 취소가 가능합니다.</p>
          </div>
          <div className="cancel-reason-grid">
            {CANCEL_REASONS.map((reason) => (
              <button
                type="button"
                key={reason}
                className={`cancel-reason-btn${selectedReason === reason ? ' cancel-reason-btn--active' : ''}`}
                onClick={() => handleSelectReason(reason)}
              >
                {reason}
              </button>
            ))}
          </div>
        </section>

        <div className="cancel-warning-box">
          <img src={infoIcon} alt="" className="cancel-warning-icon" />
          <div className="cancel-warning-text">
            <p className="cancel-warning-kr">
              취소 후에는 복구가 불가능하며, 동일한 시간에 재예약이 어려울 수 있습니다.
            </p>
            <p className="cancel-warning-en">
              Please note that cancellations cannot be undone, and rebooking at the same time may not be possible.
            </p>
          </div>
        </div>

        {error && <p className="cancel-error">{error}</p>}

        <div className="cancel-actions">
          <button
            type="button"
            className="cancel-btn-keep"
            onClick={() => navigate(`/mypage/reservations/${id}`)}
          >
            예약 유지하기
          </button>
          <button
            type="button"
            className="cancel-btn-confirm"
            disabled={!selectedReason}
            onClick={handleCancel}
          >
            예약 취소하기
          </button>
        </div>
      </main>
    </div>
  );
}
