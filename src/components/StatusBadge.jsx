function StatusBadge({ status }) {
  const normalized = String(status || 'aktif').toLowerCase().replaceAll(' ', '-');
  return <span className={`badge badge-${normalized}`}>{status || '-'}</span>;
}
export default StatusBadge;
