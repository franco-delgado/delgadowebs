import './Badge.css';

const TONE_MAP = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
  neutral: 'neutral',
  primary: 'primary',
};

export default function Badge({ children, tone = 'neutral' }) {
  const cls = TONE_MAP[tone] || 'neutral';
  return <span className={`badge badge-${cls}`}>{children}</span>;
}
