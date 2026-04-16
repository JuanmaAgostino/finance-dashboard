import { X } from 'lucide-react';

export default function TransactionModal({ showForm, closeForm, formData, setFormData, handleManualSubmit, isEditing, currency }) {
  if (!showForm) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-md p-6 border border-transparent dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{isEditing ? 'Editar Transacción' : 'Nueva Transacción'}</h2>
          <button type="button" onClick={closeForm} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X className="w-5 h-5"/></button>
        </div>
        <form onSubmit={handleManualSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setFormData({...formData, type: 'ingreso'})} className={`p-2 rounded-xl border text-sm font-medium transition-all ${formData.type === 'ingreso' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Ingreso</button>
              <button type="button" onClick={() => setFormData({...formData, type: 'gasto'})} className={`p-2 rounded-xl border text-sm font-medium transition-all ${formData.type === 'gasto' ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-500 text-rose-700 dark:text-rose-400 shadow-sm' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Gasto</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fecha</label>
            <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
            <input type="text" required placeholder={formData.type === 'ingreso' ? "Ej. Venta mueble o sueldo trabajo" : "Ej. Compra en supermercado"} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent" />
          </div>
          {formData.type === 'gasto' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
              <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent appearance-none">
                <option value="" disabled>Selecciona una categoría</option>
                <option value="Vivienda">🏠 Vivienda</option>
                <option value="Alimentación">🍔 Alimentación</option>
                <option value="Transporte">🚗 Transporte</option>
                <option value="Salud">💊 Salud</option>
                <option value="Ocio">🍿 Ocio</option>
                <option value="Educación">📚 Educación</option>
                <option value="Ropa">👕 Ropa</option>
                <option value="Servicios">💡 Servicios</option>
                <option value="Otros">📦 Otros</option>
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monto ({currency})</label>
            <input type="number" step="0.01" min="0" required placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent" />
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm mt-4">{isEditing ? 'Guardar Cambios' : 'Añadir Transacción'}</button>
        </form>
      </div>
    </div>
  );
}