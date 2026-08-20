import SeasonBadge from './SeasonBadge.jsx'
import { isSeasonalNorigae } from '../utils/norigaeAssets.js'
import './NorigaePreview.css'

export default function NorigaePreview({
  imageSrc,
  norigaeData,
  showSeasonBadge = true,
  seasonLabel = '여름 시즌',
}) {
  const isSeasonal = showSeasonBadge && (norigaeData?.isSeasonal || isSeasonalNorigae(norigaeData))
  const badgeLabel = norigaeData?.seasonTag || seasonLabel || '여름 시즌'

  if (norigaeData?.knotImage) {
    return (
      <div className="norigae-preview">
        {isSeasonal && <SeasonBadge label={badgeLabel} className="norigae-preview__season-badge" />}
        <div className="norigae-preview__render">
          <img className="norigae-preview__knot" src={norigaeData.knotImage} alt="매듭" />
          <img className="norigae-preview__decoration" src={norigaeData.decorationImage} alt="장식" />
          <img
            className={`norigae-preview__tassel norigae-preview__tassel--count-${norigaeData.tasselCount ?? 1}`}
            src={norigaeData.tasselImage}
            alt="술"
          />
        </div>
      </div>
    )
  }

  if (imageSrc) {
    return (
      <div className="norigae-preview">
        {isSeasonal && <SeasonBadge label={badgeLabel} className="norigae-preview__season-badge" />}
        <img src={imageSrc} alt="노리개" className="norigae-preview__image" />
      </div>
    )
  }

  return null
}
