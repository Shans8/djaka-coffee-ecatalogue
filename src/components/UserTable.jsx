import StatusBadge from './StatusBadge.jsx';

function UserTable({ users, onEdit, onDelete, onStatus }) {
  return (
    <div className="table-card">
      <div className="table-responsive">
        <table>
          <thead><tr><th>Nama</th><th>Email</th><th>No HP</th><th>Alamat</th><th>Role</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id_user}>
                <td><strong>{user.nama}</strong></td>
                <td>{user.email}</td>
                <td>{user.no_hp || '-'}</td>
                <td>{user.alamat || '-'}</td>
                <td>{user.nama_role}</td>
                <td><StatusBadge status={user.status} /></td>
                <td className="actions">
                  <button className="btn btn-sm" onClick={() => onEdit(user)}>Edit</button>
                  <button className="btn btn-sm btn-outline" onClick={() => onStatus(user)}>{user.status === 'aktif' ? 'Nonaktif' : 'Aktif'}</button>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(user.id_user)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default UserTable;
