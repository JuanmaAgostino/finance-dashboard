import { X } from 'lucide-react';

export default function BudgetModal({ showBudgetForm, setShowBudgetForm, budgetFormData, setBudgetFormData, handleBudgetSubmit, transactions, currency }) {
  if (!showBudgetForm) return null;
  const uniqueCategories = Array.from(new Set(transactions.filter(t => t.amount < 0).map(t => t.category)));
  
  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-md p-6 border border-transparent dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Definir Presupuesto</h2>
          <button onClick={() => setShowBudgetForm(false)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X className="w-5 h-5"/></button>
        </div>
        <form onSubmit={handleBudgetSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
            <input type="text" required list="category-suggestions" placeholder="Ej. Alimentación" value={budgetFormData.category} onChange={e => setBudgetFormData({...budgetFormData, category: e.target.value})} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent" />
            <datalist id="category-suggestions">{uniqueCategories.map(cat => <option key={cat} value={cat} />)}</datalist>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Límite Mensual ({currency})</label>
            <input type="number" step="0.01" min="0.01" required placeholder="400.00" value={budgetFormData.limit} onChange={e => setBudgetFormData({...budgetFormData, limit: e.target.value})} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent" />
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm mt-4">Guardar Presupuesto</button>
        </form>
      </div>
    </div>
  );
}