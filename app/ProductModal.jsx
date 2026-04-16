import { X, Plus, Trash2, DollarSign, Percent, ImageIcon, Wand2 } from 'lucide-react';
import { useMemo } from 'react';

export default function ProductModal({ showForm, closeForm, formData, setFormData, handleSubmit, isEditing, currency }) {
  if (!showForm) return null;

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, { name: '', cost: '' }] });
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    if (newIngredients.length === 0) {
        setFormData({ ...formData, ingredients: [{ name: '', cost: '' }] });
    } else {
        setFormData({ ...formData, ingredients: newIngredients });
    }
  };

  // Función mágica que comprime la imagen para no saturar la memoria
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300; // Tamaño pequeño para que no pese
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // 70% de calidad
        setFormData({ ...formData, image: compressedBase64 });
      };
    };
  };

  const totalCost = useMemo(() => {
    return formData.ingredients.reduce((sum, ing) => sum + (parseFloat(ing.cost) || 0), 0);
  }, [formData.ingredients]);

  const profit = useMemo(() => {
    return (parseFloat(formData.sellingPrice) || 0) - totalCost;
  }, [formData.sellingPrice, totalCost]);

  const margin = useMemo(() => {
    return totalCost > 0 ? (profit / totalCost) * 100 : 0;
  }, [profit, totalCost]);

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-lg p-6 border border-transparent dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button type="button" onClick={closeForm} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X className="w-5 h-5"/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Producto</label>
                <input type="text" required placeholder="Ej. Torta de Chocolate" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock Inicial</label>
                <input type="number" min="0" required placeholder="Ej. 10" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent" />
              </div>
            </div>
            <div className="w-24 md:w-32 shrink-0 flex flex-col">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 text-center">Foto</label>
              <label className="cursor-pointer w-full flex-1 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors overflow-hidden shadow-sm group">
                {formData.image ? 
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" /> : 
                  <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ingredientes / Costos de Materia Prima</label>
            {formData.ingredients.map((ing, index) => (
              <div key={index} className="flex items-center gap-2">
                <input type="text" required placeholder="Ej. Harina 1kg / Tela 1m" value={ing.name} onChange={e => handleIngredientChange(index, 'name', e.target.value)} className="flex-grow p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent text-sm" />
                <input type="number" step="0.01" min="0" required placeholder={`Costo (${currency})`} value={ing.cost} onChange={e => handleIngredientChange(index, 'cost', e.target.value)} className="w-32 p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent text-sm" />
                <button type="button" onClick={() => removeIngredient(index)} className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors" title="Eliminar Ingrediente/Material"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="w-full mt-2 p-2 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors text-sm flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Añadir Ingrediente/Material</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-4">
              <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                <label className="block text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-1.5"><Wand2 className="w-3.5 h-3.5" /> Auto-calcular Precio</label>
                <div className="relative">
                  <input type="number" min="0" placeholder="¿Qué % deseas ganar? Ej. 30" onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && totalCost > 0) {
                      setFormData({...formData, sellingPrice: (totalCost * (1 + val / 100)).toFixed(2)});
                    }
                  }} className="w-full pl-3 pr-8 py-2 border border-indigo-200 dark:border-indigo-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 text-sm transition-all" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Precio de Venta Final ({currency})</label>
                <input type="number" step="0.01" min="0" required placeholder="0.00" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-emerald-600 dark:text-emerald-400 font-bold bg-transparent transition-all" />
              </div>
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-5 flex flex-col justify-center space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-slate-200 dark:border-slate-700 pb-3">
                <span className="font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><DollarSign className="w-4 h-4"/>Costo Total</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-lg">{currency}{totalCost.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Percent className="w-4 h-4"/>Margen Real</span>
                <span className={`font-bold text-2xl ${profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>{margin.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm mt-4">{isEditing ? 'Guardar Cambios' : 'Crear Producto'}</button>
        </form>
      </div>
    </div>
  );
}