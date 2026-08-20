import './NorigaePreview.css'

export default function NorigaePreview({ imageSrc, norigaeData }) {
  if (norigaeData?.knotImage) {
    return (
      <div className="norigae-preview">
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
        <img src={imageSrc} alt="노리개" className="norigae-preview__image" />
      </div>
    )
  }

  return null
}
