import { X } from 'lucide-react';

export default function GoalModal({ showGoalForm, setShowGoalForm, goalFormData, setGoalFormData, handleGoalSubmit, currency }) {
  if (!showGoalForm) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-md p-6 border border-transparent dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Nueva Meta de Ahorro</h2>
          <button onClick={() => setShowGoalForm(false)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X className="w-5 h-5"/></button>
        </div>
        <form onSubmit={handleGoalSubmit} className="space-y-4 text-left">
          <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre de la Meta</label><input type="text" required placeholder="Ej. Viaje a Japón, Auto Nuevo" value={goalFormData.title} onChange={e => setGoalFormData({...goalFormData, title: e.target.value})} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent" /></div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monto a Ahorrar ({currency})</label>
            <input type="number" step="0.01" min="1" required placeholder="5000.00" value={goalFormData.targetAmount} onChange={e => setGoalFormData({...goalFormData, targetAmount: e.target.value})} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fecha Límite</label>
            <input type="date" required value={goalFormData.targetDate} onChange={e => setGoalFormData({...goalFormData, targetDate: e.target.value})} className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent" />
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm mt-4">Guardar Meta</button>
        </form>
      </div>
    </div>
  );
}