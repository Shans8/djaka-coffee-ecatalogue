import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../../components/AppLayout.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { SERVER_URL } from '../../services/api.js';
import { getProduct } from '../../services/productService.js';
import { rupiah } from '../../utils/format.js';

function DetailProduk() {
  const { id } = useParams(); const [product, setProduct] = useState(null);
  useEffect(() => { getProduct(id).then(res => setProduct(res.data)); }, [id]);
  if (!product) return <AppLayout role="sales" title="Detail Produk"><div className="empty-state">Memuat data...</div></AppLayout>;
  const imageUrl = product.gambar ? `${SERVER_URL}/${product.gambar}` : '';
  return <AppLayout role="sales" title="Detail Produk"><div className="detail-card"><div className="detail-image">{imageUrl ? <img src={imageUrl} alt={product.nama_produk} /> : <span>☕</span>}</div><div className="detail-info"><p className="page-kicker">{product.nama_kategori}</p><h2>{product.nama_produk}</h2><StatusBadge status={product.status} /><strong className="price large">{rupiah(product.harga)}</strong><p><strong>Stok:</strong> {product.stok}</p><p><strong>Deskripsi:</strong> {product.deskripsi}</p><p><strong>Spesifikasi:</strong> {product.spesifikasi}</p>{product.diskon ? <div className="alert success">Promo aktif: {product.nama_promo} diskon {product.diskon}% sampai {String(product.tanggal_selesai).slice(0,10)}</div> : <div className="alert">Belum ada promo aktif untuk produk ini.</div>}<Link className="btn btn-primary" to="/sales/pesanan">Buat Pesanan Cepat</Link></div></div></AppLayout>;
}
export default DetailProduk;
