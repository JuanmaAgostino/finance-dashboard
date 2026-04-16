import { PiggyBank, Plus, Trash2, Trophy } from 'lucide-react';

export default function GoalsTab({ goals, setShowGoalForm, handleDeleteGoal, handleAddSavings, currency, isPrivacyMode }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <PiggyBank className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /> Mis Metas de Ahorro
        </h3>
        <button onClick={() => setShowGoalForm(true)} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1">
          <Plus className="w-4 h-4" /> Nueva Meta
        </button>
      </div>
      {goals.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4"><PiggyBank className="w-8 h-8" /></div>
          <p className="text-slate-500 dark:text-slate-400">No tienes metas de ahorro definidas. ¡Crea una para empezar!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map(goal => {
            const targetDateObj = new Date(goal.targetDate);
            const today = new Date();
            let monthsLeft = (targetDateObj.getFullYear() - today.getFullYear()) * 12 + (targetDateObj.getMonth() - today.getMonth());
            if (monthsLeft <= 0) monthsLeft = 1;
            
            const amountLeft = goal.targetAmount - goal.savedAmount;
            const monthlyRequired = amountLeft > 0 ? amountLeft / monthsLeft : 0;
            const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
            const isCompleted = progress >= 100;
            
            return (
              <div key={goal.id} className="relative group p-5 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-slate-200 dark:hover:border-slate-700 transition-colors bg-slate-50/50 dark:bg-slate-800/20">
                <button onClick={() => handleDeleteGoal(goal.id)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                <div className="pr-8 mb-4">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{goal.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">Para el {targetDateObj.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })} <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md text-xs font-bold ml-2">{monthsLeft} {monthsLeft === 1 ? 'mes' : 'meses'} restantes</span></p>
                </div>
                <div className="flex justify-between items-end mb-2">
                  <div><p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{isPrivacyMode ? '***.**' : `${currency}${goal.savedAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}</p><p className="text-xs font-medium text-slate-400 dark:text-slate-500">ahorrados de {isPrivacyMode ? '***.**' : `${currency}${goal.targetAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}</p></div>
                  <button onClick={() => handleAddSavings(goal.id)} className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors">+ Abonar</button>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden mb-3"><div className={`h-3 rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }}></div></div>
                {isCompleted ? <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Trophy className="w-4 h-4"/> ¡Felicidades!</p> : <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Guarda <strong className="text-slate-800 dark:text-slate-200">{isPrivacyMode ? '***.**' : `${currency}${monthlyRequired.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}/mes</strong></p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}