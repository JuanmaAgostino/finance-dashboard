import { Search, Filter, Trash2, Plus, Pencil } from 'lucide-react';

export default function HistoryTab({ searchTerm, setSearchTerm, minAmount, setMinAmount, maxAmount, setMaxAmount, filteredTransactions, handleDeleteTransaction, handleEditTransaction, setShowForm, currency, isPrivacyMode }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Historial de Transacciones</h3>
          <button onClick={() => setShowForm(true)} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1">
            <Plus className="w-4 h-4" /> Nueva
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input type="text" placeholder="Buscar transacción..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500 hidden sm:block" />
            <input type="number" placeholder={`Min ${currency}`} value={minAmount} onChange={(e) => setMinAmount(e.target.value)} className="w-20 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent text-sm" />
            <span className="text-slate-400 dark:text-slate-500">-</span>
            <input type="number" placeholder={`Max ${currency}`} value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} className="w-20 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent text-sm" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
              <th className="pb-3 font-medium whitespace-nowrap">Fecha</th>
              <th className="pb-3 font-medium min-w-[200px]">Descripción</th>
              <th className="pb-3 font-medium">Categoría</th>
              <th className="pb-3 font-medium text-right">Monto</th>
              <th className="pb-3 font-medium text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredTransactions.length > 0 ? (
              [...filteredTransactions].reverse().map((tx, index) => (
                <tr key={index} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="py-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">{tx.date}</td>
                  <td className="py-4 font-medium text-slate-800 dark:text-slate-200">{tx.description}</td>
                  <td className="py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${tx.amount > 0 ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>{tx.category}</span></td>
                  <td className={`py-4 text-right font-bold whitespace-nowrap ${tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{tx.amount > 0 ? '+' : '-'}{isPrivacyMode ? '***.**' : `${currency}${Math.abs(tx.amount).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditTransaction(tx)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors" title="Editar"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteTransaction(tx)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-12 text-center">
                  <p className="text-slate-500 dark:text-slate-400 mb-4">No hay transacciones en este periodo.</p>
                  <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors font-medium">
                    <Plus className="w-4 h-4" /> Añadir tu primera transacción
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}