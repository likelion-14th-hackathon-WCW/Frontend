import './NorigaePreview.css'
import optionPlaceholderIcon from '../assets/option-placeholder-icon.svg'

// ponytail: 실제 조합 이미지 생성기가 아직 없어서 자리만 만들어둠 —
// 준비되면 imageSrc로 실제 노리개 이미지 URL을 넘기면 됨
export default function NorigaePreview({ imageSrc }) {
  return (
    <div className="norigae-preview">
      {imageSrc ? (
        <img src={imageSrc} alt="예약할 노리개" className="norigae-preview__image" />
      ) : (
        <img src={optionPlaceholderIcon} alt="" className="norigae-preview__icon" />
      )}
    </div>
  )
}
