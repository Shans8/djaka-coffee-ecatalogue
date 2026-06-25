import { useEffect, useMemo, useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import ProductCard from '../../components/ProductCard.jsx';
import PackageCard from '../../components/PackageCard.jsx';
import PackageCompareTable from '../../components/PackageCompareTable.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { getProducts } from '../../services/productService.js';
import { recommendPackages } from '../../services/packageService.js';
import { rupiah } from '../../utils/format.js';

function BandingkanProduk() {
  const [tab, setTab] = useState('produk'); const [products, setProducts] = useState([]); const [selectedProducts, setSelectedProducts] = useState([]);
  const [need, setNeed] = useState({ jenis_acara: 'seminar', jumlah_peserta: 50, budget: 25000, catatan: 'Paket makanan untuk acara seminar' });
  const [packages, setPackages] = useState([]); const [chosenPackages, setChosenPackages] = useState([]);
  useEffect(() => { getProducts({ status: 'aktif' }).then(res => setProducts(res.data)); }, []);
  const toggleProduct = (product) => setSelectedProducts((prev) => prev.some(p => p.id_produk === product.id_produk) ? prev.filter(p => p.id_produk !== product.id_produk) : [...prev, product]);
  const totalProduk = useMemo(() => selectedProducts.reduce((sum, p) => sum + Number(p.harga || 0), 0), [selectedProducts]);
  const searchPackages = async (e) => { e?.preventDefault(); const res = await recommendPackages({ budget: need.budget, jenis_acara: need.jenis_acara }); setPackages(res.data); setChosenPackages(res.data); };
  useEffect(() => { searchPackages(); }, []);
  const choosePackageForOrder = (paket) => { localStorage.setItem('selectedPackageForOrder', JSON.stringify(paket)); alert(`${paket.nama_paket} dimasukkan ke halaman Buat Pesanan Cepat.`); };

  return <AppLayout role="sales" title="Bandingkan Produk / Rekomendasi Paket"><div className="tabs"><button className={tab === 'produk' ? 'active' : ''} onClick={() => setTab('produk')}>Perbandingan Produk Satuan</button><button className={tab === 'paket' ? 'active' : ''} onClick={() => setTab('paket')}>Rekomendasi Paket / Bundling</button></div>{tab === 'produk' ? <><div className="product-grid compact">{products.map(p => <ProductCard key={p.id_produk} product={p} selectable selected={selectedProducts.some(item => item.id_produk === p.id_produk)} onSelect={toggleProduct} />)}</div><div className="section-head"><div><p className="page-kicker">Perbandingan</p><h2>Produk Dipilih</h2></div><strong>Total: {rupiah(totalProduk)}</strong></div><div className="table-card"><div className="table-responsive"><table><thead><tr><th>Nama</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Spesifikasi</th><th>Promo</th><th>Status</th></tr></thead><tbody>{selectedProducts.map(p => <tr key={p.id_produk}><td><strong>{p.nama_produk}</strong></td><td>{p.nama_kategori}</td><td>{rupiah(p.harga)}</td><td>{p.stok}</td><td>{p.spesifikasi}</td><td>{p.diskon ? `${p.diskon}%` : '-'}</td><td><StatusBadge status={p.status} /></td></tr>)}</tbody></table></div></div></> : <><form className="panel form-grid" onSubmit={searchPackages}><p className="page-kicker">Kebutuhan Pelanggan</p><h2>Form Rekomendasi Paket</h2><select value={need.jenis_acara} onChange={(e) => setNeed({ ...need, jenis_acara: e.target.value })}>{['seminar','rapat','gathering','ulang tahun','meeting kantor'].map(v => <option key={v} value={v}>{v}</option>)}</select><input type="number" min="1" value={need.jumlah_peserta} onChange={(e) => setNeed({ ...need, jumlah_peserta: e.target.value })} placeholder="Jumlah peserta" /><input type="number" min="0" value={need.budget} onChange={(e) => setNeed({ ...need, budget: e.target.value })} placeholder="Budget per paket" /><textarea value={need.catatan} onChange={(e) => setNeed({ ...need, catatan: e.target.value })} placeholder="Catatan kebutuhan pelanggan" /><button className="btn btn-primary">Cari Rekomendasi</button></form><div className="product-grid">{packages.map(p => <PackageCard key={p.id_paket} paket={p} onChoose={choosePackageForOrder} selected={chosenPackages.some(c => c.id_paket === p.id_paket)} />)}</div><div className="section-head"><div><p className="page-kicker">Contoh kasus</p><h2>Perbandingan Paket Seminar Budget {rupiah(need.budget)}</h2></div></div><PackageCompareTable packages={chosenPackages} /></>}</AppLayout>;
}
export default BandingkanProduk;
