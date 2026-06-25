import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';
import { SERVER_URL } from '../services/api.js';
import { rupiah } from '../utils/format.js';

function ProductCard({ product, selectable = false, selected = false, onSelect }) {
  const imageUrl = product.gambar ? `${SERVER_URL}/${product.gambar}` : '';

  return (
    <article className={`product-card ${selected ? 'selected' : ''}`}>
      <div className="product-image-wrapper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.nama_produk}
            className="product-img"
          />
        ) : (
          <div className="product-image-placeholder">☕</div>
        )}

        <div className="product-status">
          <StatusBadge status={product.status} />
        </div>
      </div>

      <div className="product-body">
        <div className="product-info">
          <h3 className="product-title">{product.nama_produk}</h3>
          <p className="product-category">
            {product.nama_kategori || 'Tanpa kategori'}
          </p>

          <div className="product-price-row">
            <strong className="product-price">{rupiah(product.harga)}</strong>
          </div>

          <div className="product-meta">
            <span>Stok: {product.stok}</span>
            {product.diskon ? (
              <span className="badge badge-promo">Diskon {product.diskon}%</span>
            ) : null}
          </div>
        </div>

        <div className="product-actions">
          {selectable ? (
            <button
              type="button"
              className={selected ? 'btn btn-danger full' : 'btn btn-primary full'}
              onClick={() => onSelect(product)}
            >
              {selected ? 'Batalkan' : 'Pilih Produk'}
            </button>
          ) : (
            <Link
              className="btn btn-primary full"
              to={`/sales/produk/${product.id_produk}`}
            >
              Detail
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;