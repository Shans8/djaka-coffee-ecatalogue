import { rupiah } from '../utils/format.js';
import StatusBadge from './StatusBadge.jsx';

function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="table-card">
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Nama Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Status</th><th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id_produk}>
                <td><strong>{item.nama_produk}</strong><br /><span className="muted">{item.spesifikasi}</span></td>
                <td>{item.nama_kategori || '-'}</td>
                <td>{rupiah(item.harga)}</td>
                <td>{item.stok}</td>
                <td><StatusBadge status={item.status} /></td>
                <td className="actions"><button className="btn btn-sm" onClick={() => onEdit(item)}>Edit</button><button className="btn btn-sm btn-danger" onClick={() => onDelete(item.id_produk)}>Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ProductTable;
