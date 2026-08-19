import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyReservations } from '../api/mypage.js';
import MyPageSidebar from '../components/MyPageSidebar.jsx';
import chevronLeft from '../assets/chevron-left.svg';
import chevronRight from '../assets/chevron-right.svg';
import iconCalendar from '../assets/mypage/icon-reservations.svg';
import './MyPageReservations.css';

const PAGE_SIZE = 3;

// 완료/취소된 예약만 흐리게 표시, 그 외(확정/변경 등)는 강조 태그
const isSettledStatus = (status) => status === '완료됨' || status === '완료' || status === '취소';

function formatReservedAt(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const hour24 = date.getHours();
  const meridiem = hour24 < 12 ? '오전' : '오후';
  const hour12 = hour24 % 12 || 12;
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 • ${meridiem} ${hour12}:${minute}`;
}

export default function MyPageReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await getMyReservations();
        if (res?.success) setReservations(res.data || []);
      } catch (error) {
        console.error('예약 내역 조회 실패:', error);
      }
    };
    fetchReservations();
  }, []);

  const totalPages = Math.max(1, Math.ceil(reservations.length / PAGE_SIZE));
  const pageItems = reservations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mypage-wrapper">
      <MyPageSidebar active="reservations" />
      <main className="mypage-content">
        <div className="content-header">
          <h2>예약 내역</h2>
          <p>고객님의 방문 및 행사 예약 내역을 확인하실 수 있습니다.</p>
        </div>

        {reservations.length === 0 ? (
          <p className="reservation-empty">예약 내역이 존재하지 않습니다.</p>
        ) : (
          <>
            <div className="reservation-cards">
              {pageItems.map((res) => {
                const id = res.id ?? res.reservation_id;
                const settled = isSettledStatus(res.status);
                return (
                  <div
                    className={`reservation-card${settled ? ' reservation-card--settled' : ''}`}
                    key={id}
                    onClick={() => navigate(`/mypage/reservations/${id}`)}
                  >
                    <div className="reservation-card__body">
                      <div className="reservation-card__top">
                        <span className={`reservation-card__tag${settled ? ' reservation-card__tag--muted' : ''}`}>
                          {res.status || '확정'}
                        </span>
                      </div>
                      <h3 className="reservation-card__store">{res.store_name || res.store || '체험 공방'}</h3>
                      <div className="reservation-card__meta">
                        <span className="reservation-card__meta-item">
                          <img src={iconCalendar} alt="" className="reservation-card__meta-icon" />
                          {formatReservedAt(res.reserved_at || res.reservation_date)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="reservation-card__detail"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/mypage/reservations/${id}`);
                      }}
                    >
                      예약 상세 보기
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="reservation-pagination">
              <button
                type="button"
                className="reservation-pagination__btn"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <img src={chevronLeft} alt="이전" />
              </button>
              <span className="reservation-pagination__current">{page}</span>
              <button
                type="button"
                className="reservation-pagination__btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <img src={chevronRight} alt="다음" />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
