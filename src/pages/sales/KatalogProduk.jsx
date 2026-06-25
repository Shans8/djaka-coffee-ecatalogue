import { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.jsx';
import ProductCard from '../../components/ProductCard.jsx';
import { getProducts } from '../../services/productService.js';
import { getCategories } from '../../services/categoryService.js';

function KatalogProduk() {
  const [products, setProducts] = useState([]); const [categories, setCategories] = useState([]); const [filters, setFilters] = useState({ search: '', kategori: '', harga_min: '', harga_max: '', status: 'aktif' });
  const load = async () => setProducts((await getProducts(filters)).data);
  useEffect(() => { getCategories().then(res => setCategories(res.data)); }, []);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [filters]);
  return <AppLayout role="sales" title="Katalog Produk"><div className="filter-bar"><input placeholder="Cari produk..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /><select value={filters.kategori} onChange={(e) => setFilters({ ...filters, kategori: e.target.value })}><option value="">Semua kategori</option>{categories.map(c => <option key={c.id_kategori} value={c.id_kategori}>{c.nama_kategori}</option>)}</select><input type="number" min="0" placeholder="Harga minimum" value={filters.harga_min} onChange={(e) => setFilters({ ...filters, harga_min: e.target.value })} /><input type="number" min="0" placeholder="Harga maksimum" value={filters.harga_max} onChange={(e) => setFilters({ ...filters, harga_max: e.target.value })} /><select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="aktif">Aktif</option><option value="">Semua status</option><option value="nonaktif">Nonaktif</option></select></div><div className="product-grid">{products.map(product => <ProductCard key={product.id_produk} product={product} />)}</div>{products.length === 0 && <div className="empty-state">Produk tidak ditemukan.</div>}</AppLayout>;
}
export default KatalogProduk;
