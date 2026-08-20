import './SeasonBadge.css'

export default function SeasonBadge({ label = '여름 시즌', className = '' }) {
  return (
    <span className={`season-badge${className ? ` ${className}` : ''}`}>
      {label}
    </span>
  )
}
