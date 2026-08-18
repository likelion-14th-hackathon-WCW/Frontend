import React, { useState } from 'react';
import { getAiRecommendation, saveNorigaeDesign } from '../api/norigaeApi';

export default function EditorPage() {
  const [keyword, setKeyword] = useState('행복');
  
  const [recommendation, setRecommendation] = useState(null);
  const [excludeCombinations, setExcludeCombinations] = useState([]);
  
  const [selectedKnot, setSelectedKnot] = useState(null);
  const [selectedDecoration, setSelectedDecoration] = useState(null);
  const [selectedTassel, setSelectedTassel] = useState(13);
  const [selectedColor, setSelectedColor] = useState('#D4AF37');
  const [title, setTitle] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGetRecommendation = async () => {
    if (excludeCombinations.length >= 3) {
      alert('추천은 최대 3번까지만 가능합니다.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const result = await getAiRecommendation(keyword, excludeCombinations);

    if (result.success) {
      const data = result.data;
      
      if (!recommendation) {
        setRecommendation(data); 
        setTitle(data.suggested_title);
      } else {
        setRecommendation((prev) => ({
          ...prev,
          knot: data.knot,
          decoration: data.decoration,
        }));
      }

      setSelectedKnot(data.knot);
      setSelectedDecoration(data.decoration);

      setExcludeCombinations((prev) => [
        ...prev,
        { knot: data.knot, decoration: data.decoration },
      ]);
    } else {
      if (result.status === 429) {
        alert(result.message || '추천은 최대 3번까지만 가능합니다.');
      } else if (result.status === 503) {
        setErrorMsg(result.message || '추천 생성에 실패했습니다. 다시 시도해주세요.');
      } else {
        setErrorMsg(result.message);
      }
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('제목을 입력해야 저장할 수 있습니다.');
      return;
    }

    const payload = {
      wish_keyword: keyword,
      symbol_reason: recommendation?.reason || '',
      knot: Number(selectedKnot),
      tassel: Number(selectedTassel),
      decoration: Number(selectedDecoration),
      color: selectedColor,
      title: title,
    };

    const result = await saveNorigaeDesign(payload);

    if (result.success) {
      alert('노리개 디자인이 성공적으로 저장되었습니다!');
    } else {
      if (result.status === 401) {
        alert('로그인이 필요한 서비스입니다.');
      } else if (result.status === 400) {
        // 서버 필드 에러 처리
        const errors = result.errors;
        if (errors.knot) alert(`매듭 오류: ${errors.knot[0]}`);
        else if (errors.title) alert(`제목 오류: ${errors.title[0]}`);
        else alert('입력값을 확인해 주세요.');
      } else {
        alert(result.message);
      }
    }
  };

  return (
    <div className="editor-container" style={{ padding: '20px' }}>
      <h2>🎨 노리개 커스텀 에디터</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="키워드 입력 (예: 행복, 번영)"
        />
        <button onClick={handleGetRecommendation} disabled={loading}>
          {excludeCombinations.length === 0 ? 'AI 조합 추천받기' : '추천 다시 받기'}
        </button>
        <span> ({excludeCombinations.length}/3회 사용)</span>
      </div>

      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      {recommendation && (
        <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4>💡 상징적 의미 (고정)</h4>
          <p>{recommendation.reason}</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <label>
          작품 제목:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </label>

        <label>
          매듭 ID (Knot):
          <input
            type="number"
            value={selectedKnot || ''}
            onChange={(e) => setSelectedKnot(e.target.value)}
          />
        </label>

        <label>
          장식 ID (Decoration):
          <input
            type="number"
            value={selectedDecoration || ''}
            onChange={(e) => setSelectedDecoration(e.target.value)}
          />
        </label>

        <button onClick={handleSave} style={{ marginTop: '15px', padding: '10px' }}>
          저장하기
        </button>
      </div>
    </div>
  );
}