"use client";

import { useState } from 'react';
import { Plus, Trash2, Pencil, DollarSign, BarChart2, Percent, FileText, LoaderCircle, ShoppingCart } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

const ProductCard = ({ product, onEdit, onDelete, onSell, currency, isPrivacyMode }) => {
  const totalCost = product.ingredients.reduce((sum, ing) => sum + (parseFloat(ing.cost) || 0), 0);
  const profit = product.sellingPrice - totalCost;
  const margin = totalCost > 0 ? (profit / totalCost) * 100 : 0;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="relative group bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 transition-all hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 flex flex-col">
      <div className="absolute top-6 right-6 flex gap-2 z-10">
        <button onClick={() => onEdit(product)} className="p-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all" title="Editar Producto"><Pencil className="w-4 h-4" /></button>
        <button onClick={() => onDelete(product.id)} className="p-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700 transition-all" title="Eliminar Producto"><Trash2 className="w-4 h-4" /></button>
      </div>

      <div className="absolute top-6 left-6 z-10">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm border ${isOutOfStock ? 'bg-rose-50 text-rose-600 border-rose-200' : product.stock <= 5 ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
          {isOutOfStock ? 'Agotado' : `${product.stock} en stock`}
        </span>
      </div>
      
      {product.image && (
        <div className="w-full h-32 mb-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
      )}
      
      <h4 className={`font-bold text-slate-800 dark:text-slate-200 text-lg pr-16 ${!product.image ? 'mb-0' : ''}`}>{product.name}</h4>
      
      <div className="mt-4 space-y-3 text-sm mt-auto">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><DollarSign className="w-4 h-4 text-rose-500"/> Costo Total</span>
          <span className="font-bold text-rose-600 dark:text-rose-400">{isPrivacyMode ? '***.**' : `${currency}${totalCost.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-emerald-500"/> Precio de Venta</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{isPrivacyMode ? '***.**' : `${currency}${product.sellingPrice.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><Percent className="w-4 h-4 text-indigo-500"/> Margen Ganancia</span>
          <span className={`font-bold text-lg ${profit >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-500'}`}>{isPrivacyMode ? '***.**' : `${margin.toFixed(1)}%`}</span>
        </div>
      </div>
      <button onClick={() => onSell(product)} disabled={isOutOfStock} className={`mt-5 w-full py-2.5 rounded-xl transition-colors font-medium flex items-center justify-center gap-2 shadow-sm ${isOutOfStock ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
        <ShoppingCart className="w-4 h-4" /> {isOutOfStock ? 'Sin Stock' : '¡Vender!'}
      </button>
    </div>
  );
};

export default function CostingTab({ products, setShowProductForm, handleEditProduct, handleDeleteProduct, handleSellProduct, currency, showDialog, isPrivacyMode }) {
  const [isExporting, setIsExporting] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [themeColor, setThemeColor] = useState('blanco');

  const themes = {
    blanco: { bg: 'bg-white', bgHex: '#ffffff', title: 'text-slate-800 font-extrabold', subtitle: 'text-slate-500', divider: 'border-slate-200', card: 'bg-slate-50 border-slate-100 shadow-sm rounded-2xl', align: 'items-center text-center', cardTitle: 'text-slate-800 text-xl font-bold', price: 'text-emerald-600 text-2xl font-extrabold', imgWrapper: 'rounded-xl border-slate-100', imgPlaceholderBg: 'bg-slate-200 border-slate-300 text-slate-400' },
    negro: { bg: 'bg-slate-900', bgHex: '#0f172a', title: 'text-white font-light tracking-widest uppercase', subtitle: 'text-slate-400', divider: 'border-slate-700', card: 'bg-slate-800 border-slate-700 shadow-none rounded-none border-b-4 border-b-emerald-500', align: 'items-start text-left', cardTitle: 'text-white text-xl font-medium', price: 'text-emerald-400 text-2xl font-light', imgWrapper: 'rounded-none border-slate-700', imgPlaceholderBg: 'bg-slate-700 border-slate-600 text-slate-500' },
    rosa: { bg: 'bg-pink-50', bgHex: '#fdf2f8', title: 'text-pink-900 font-serif font-bold italic', subtitle: 'text-pink-600 font-serif', divider: 'border-pink-200 border-dashed', card: 'bg-white border-pink-100 shadow-md rounded-[2rem]', align: 'items-center text-center', cardTitle: 'text-pink-900 text-xl font-serif font-bold', price: 'text-pink-600 text-2xl font-bold', imgWrapper: 'rounded-[1.5rem] border-pink-50', imgPlaceholderBg: 'bg-pink-100 border-pink-200 text-pink-300' },
    azul: { bg: 'bg-blue-50', bgHex: '#eff6ff', title: 'text-blue-900 font-black uppercase', subtitle: 'text-blue-600', divider: 'border-blue-200 border-b-4', card: 'bg-white border-blue-50 shadow-xl rounded-xl', align: 'items-center text-center', cardTitle: 'text-blue-900 text-xl font-black uppercase', price: 'text-blue-600 text-2xl font-black', imgWrapper: 'rounded-lg border-blue-50', imgPlaceholderBg: 'bg-blue-100 border-blue-200 text-blue-300' },
    verde: { bg: 'bg-emerald-50', bgHex: '#ecfdf5', title: 'text-emerald-900 font-bold', subtitle: 'text-emerald-600', divider: 'border-emerald-200', card: 'bg-white border-emerald-200 shadow-sm rounded-xl border-l-4 border-l-emerald-500', align: 'items-start text-left', cardTitle: 'text-emerald-900 text-xl font-bold', price: 'text-emerald-700 text-2xl font-bold', imgWrapper: 'rounded-lg border-emerald-100', imgPlaceholderBg: 'bg-emerald-100 border-emerald-200 text-emerald-300' },
  };
  const currentTheme = themes[themeColor];

  const exportCatalogToPDF = async () => {
    if (products.length === 0) return;
    setIsExporting(true);
    
    try {
      const element = document.getElementById('catalog-export-view');
      const imgData = await toPng(element, { backgroundColor: currentTheme.bgHex, pixelRatio: 2 });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Catalogo_${businessName.replace(/\s+/g, '_') || 'Productos'}.pdf`);
    } catch (err) {
      console.error('Error al generar catálogo PDF', err);
      if (showDialog) showDialog('alert', 'Error', 'Hubo un error al generar el catálogo.');
      else alert('Hubo un error al generar el catálogo.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Calculadora de Costos y Precios</h3>
        <div className="flex gap-2">
          {products.length > 0 && (
            <button onClick={exportCatalogToPDF} disabled={isExporting} className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50">
              {isExporting ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {isExporting ? 'Generando...' : 'Exportar Catálogo'}
            </button>
          )}
          <button onClick={() => setShowProductForm(true)} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1">
            <Plus className="w-4 h-4" /> Nuevo Producto
          </button>
        </div>
      </div>

    {products.length > 0 && (
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-end md:items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex-1 w-full">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Nombre de tu Emprendimiento</label>
          <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ej. Dulces Momentos" className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 text-sm" />
        </div>
        <div className="w-full md:w-auto">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Color del Catálogo PDF</label>
          <select value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-full md:w-48 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 text-sm">
            <option value="blanco">⚪ Blanco (Clásico)</option>
            <option value="negro">⚫ Negro (Elegante)</option>
            <option value="rosa">🌸 Rosa (Dulce)</option>
            <option value="azul">💧 Azul (Fresco)</option>
            <option value="verde">🌿 Verde (Natural)</option>
          </select>
        </div>
      </div>
    )}

      {products.length === 0 ? (
        <div className="text-center py-12"><p className="text-slate-500 dark:text-slate-400 mb-4">Aún no has añadido ningún producto.</p><button onClick={() => setShowProductForm(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors font-medium"><Plus className="w-4 h-4" /> Crear tu primer producto</button></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{products.map(product => (<ProductCard key={product.id} product={product} onEdit={handleEditProduct} onDelete={handleDeleteProduct} onSell={handleSellProduct} currency={currency} isPrivacyMode={isPrivacyMode} />))}</div>
      )}

      {/* Plantilla oculta para el PDF del Catálogo */}
      <div className="fixed top-[10000px] left-[10000px] pointer-events-none">
      <div id="catalog-export-view" className={`w-[800px] p-12 font-sans ${currentTheme.bg}`}>
        <div className={`text-center mb-10 border-b pb-6 ${currentTheme.divider}`}>
          <h1 className={`text-4xl ${currentTheme.title}`}>{businessName || 'Catálogo de Productos'}</h1>
          <p className={`mt-2 text-lg ${currentTheme.subtitle}`}>Descubre nuestra selección de productos</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {products.map(p => (
            <div key={p.id} className={`border p-5 flex flex-col ${currentTheme.align} ${currentTheme.card}`}>
                {p.image ? (
                <div className={`w-full h-40 mb-4 overflow-hidden bg-white border flex-shrink-0 ${currentTheme.imgWrapper}`}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                <div className={`w-full h-40 mb-4 border flex items-center justify-center flex-shrink-0 ${currentTheme.imgWrapper} ${currentTheme.imgPlaceholderBg}`}>
                    <span className="text-4xl">📸</span>
                  </div>
                )}
              <h2 className={`mb-2 leading-tight ${currentTheme.cardTitle}`}>{p.name}</h2>
              <p className={`mt-auto ${currentTheme.price}`}>{currency}{p.sellingPrice.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}