import { TrendingUp, TrendingDown, Wallet, Trophy, AlertCircle, Target, Plus, Trash2, Sparkles, Pencil } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';
import AIAnalysisCard from './AIAnalysisCard';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6'];

export default function SummaryTab({ totals, insights, chartReady, monthlyData, isDarkMode, categoryData, budgets, budgetProgress, setShowBudgetForm, handleDeleteBudget, handleAnalyze, isAnalyzing, aiAnalysis, currency, salesGoal, handleSetSalesGoal, isPrivacyMode }) {
  return (
    <>
      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex items-center space-x-5 transition-shadow hover:shadow-md">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Ingresos</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{isPrivacyMode ? '***.**' : `${currency}${totals.ingresos.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</h3>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex items-center space-x-5 transition-shadow hover:shadow-md">
          <div className="p-4 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl">
            <TrendingDown className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Gastos</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{isPrivacyMode ? '***.**' : `${currency}${totals.gastos.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</h3>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex items-center space-x-5 transition-shadow hover:shadow-md">
          <div className={`p-4 rounded-2xl ${totals.balance >= 0 ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
            <Wallet className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Balance Neto</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{isPrivacyMode ? '***.**' : `${currency}${totals.balance.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</h3>
          </div>
        </div>
      </div>

      {/* Meta de Ventas del Mes */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 relative group overflow-hidden">
        <button onClick={handleSetSalesGoal} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Editar Meta"><Pencil className="w-4 h-4" /></button>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"><Target className="w-6 h-6" /></div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Meta de Ventas de este mes</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {salesGoal > 0 ? `Llevas ${isPrivacyMode ? '***.**' : `${currency}${totals.ingresos.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`} de ${isPrivacyMode ? '***.**' : `${currency}${salesGoal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}` : 'Define cuánto quieres vender este mes'}
            </p>
          </div>
        </div>
        {salesGoal > 0 ? (
          <div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden mb-2">
              <div className={`h-full transition-all duration-1000 ${totals.ingresos >= salesGoal ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${Math.min((totals.ingresos / salesGoal) * 100, 100)}%` }}></div>
            </div>
            <p className="text-xs font-medium text-right text-slate-500 dark:text-slate-400">
              {totals.ingresos >= salesGoal ? '¡Meta superada! 🎉' : `Faltan ${isPrivacyMode ? '***.**' : `${currency}${(salesGoal - totals.ingresos).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`} para lograrlo`}
            </p>
          </div>
        ) : (
          <button onClick={handleSetSalesGoal} className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 rounded-xl transition-colors text-sm font-medium mt-2">Establecer mi primera meta</button>
        )}
      </div>

      {/* Botón y Tarjeta de Análisis IA */}
      <div className="flex flex-col gap-4">
        <button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full md:w-fit self-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <Sparkles className="w-5 h-5" />
          {isAnalyzing ? 'Analizando...' : 'Analizar mes con IA'}
        </button>
        <AIAnalysisCard analysis={aiAnalysis} isAnalyzing={isAnalyzing} />
      </div>

      {/* Métricas Clave / Insights */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-600 rounded-2xl shadow-sm p-6 text-white flex items-start space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-1">Gasto Más Grande</p>
              {insights.biggestExpense ? (
                <>
                <h3 className="text-xl font-bold">{isPrivacyMode ? '***.**' : `${currency}${Math.abs(insights.biggestExpense.amount).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}</h3>
                  <p className="text-indigo-200 text-xs mt-1 truncate max-w-[200px]">{insights.biggestExpense.description} ({insights.biggestExpense.category})</p>
                </>
              ) : (
                <p className="text-indigo-200 text-sm mt-1">Sin gastos registrados</p>
              )}
            </div>
          </div>

          <div className="bg-rose-600 rounded-2xl shadow-sm p-6 text-white flex items-start space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-rose-100 text-sm font-medium mb-1">Fuga de Capital</p>
              {insights.topCategory ? (
                <>
                <h3 className="text-xl font-bold">{isPrivacyMode ? '***.**' : `${currency}${insights.topCategory.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}</h3>
                  <p className="text-rose-200 text-xs mt-1">Gastado en {insights.topCategory.name}</p>
                </>
              ) : (
                <p className="text-rose-200 text-sm mt-1">Sin gastos registrados</p>
              )}
            </div>
          </div>

          <div className="bg-emerald-600 rounded-2xl shadow-sm p-6 text-white flex items-start space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">Tu Mayor Ahorro</p>
              {insights.bestSaver ? (
                <>
                <h3 className="text-xl font-bold">{isPrivacyMode ? '***.**' : `${currency}${insights.bestSaver.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}</h3>
                  <p className="text-emerald-200 text-xs mt-1">Ahorrado en {insights.bestSaver.name}</p>
                </>
              ) : (
                <p className="text-emerald-200 text-sm mt-1">Fija un presupuesto para calcular</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Ingresos vs Gastos por Mes</h3>
          <div className="h-[380px] w-full">
            {chartReady && (
              <ResponsiveContainer width="99%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 13 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 13 }} tickFormatter={(value) => isPrivacyMode ? '***' : `${currency}${value}`} />
                  <Tooltip cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }} contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', borderRadius: '0.75rem', border: isDarkMode ? '1px solid #1e293b' : '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }} formatter={(value) => [isPrivacyMode ? '***.**' : `${currency}${value.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`, undefined]} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="ingresos" name="Ingresos" fill={isDarkMode ? '#818cf8' : '#4f46e5'} radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="gastos" name="Gastos" fill={isDarkMode ? '#fb7185' : '#f43f5e'} radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Distribución de Gastos</h3>
          {categoryData.length > 0 ? (
            <div className="h-[380px] w-full">
              {chartReady && (
                <ResponsiveContainer width="99%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="45%" innerRadius={85} outerRadius={120} paddingAngle={5} dataKey="value" stroke="none" cornerRadius={8}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={isDarkMode ? '#0f172a' : '#ffffff'} strokeWidth={2} className="hover:opacity-80 transition-opacity duration-300 outline-none cursor-pointer" />
                      ))}
                      <Label value="Total Gastos" position="center" dy={-15} fill={isDarkMode ? '#94a3b8' : '#64748b'} fontSize={14} fontWeight={500} />
                      <Label value={isPrivacyMode ? '***.**' : `${currency}${totals.gastos.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`} position="center" dy={15} fill={isDarkMode ? '#f8fafc' : '#0f172a'} fontSize={24} fontWeight={700} />
                    </Pie>
                    <Tooltip formatter={(value) => isPrivacyMode ? '***.**' : `${currency}${value.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`} contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', borderRadius: '1rem', border: isDarkMode ? '1px solid #1e293b' : 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '12px 16px' }} itemStyle={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 700 }} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ marginTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          ) : (
            <div className="h-[380px] flex items-center justify-center text-slate-500">No hay gastos para mostrar</div>
          )}
        </div>
      </div>

      {/* Presupuestos */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Target className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /> Presupuestos Mensuales</h3>
          <button onClick={() => setShowBudgetForm(true)} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"><Plus className="w-4 h-4" /> Nuevo Límite</button>
        </div>
        {Object.keys(budgets).length === 0 ? (
          <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">No has definido ningún presupuesto aún. Define límites por categoría para controlar tus gastos.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(budgetProgress).map(([cat, data]) => {
              const percentage = Math.min((data.spent / data.limit) * 100, 100);
              const isOver = data.spent > data.limit;
              const isNear = percentage >= 80 && !isOver;
              return (
                <div key={cat} className="relative group p-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-slate-200 dark:hover:border-slate-700 transition-colors bg-slate-50/50 dark:bg-slate-800/20">
                  <button onClick={() => handleDeleteBudget(cat)} className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                  <div className="flex justify-between text-sm mb-2 pr-8">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{cat}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium"><span className={isOver ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-300'}>{isPrivacyMode ? '***.**' : `${currency}${data.spent.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}</span> / {isPrivacyMode ? '***.**' : `${currency}${data.limit.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                    <div className={`h-2.5 rounded-full transition-all duration-500 ${isOver ? 'bg-rose-500' : isNear ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${percentage}%` }}></div>
                  </div>
                  {isOver ? <p className="text-xs font-medium text-rose-500 mt-2">¡Te has pasado por {isPrivacyMode ? '***.**' : `${currency}${(data.spent - data.limit).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}!</p> : isNear ? <p className="text-xs font-medium text-amber-500 mt-2">¡Estás a {isPrivacyMode ? '***.**' : `${currency}${(data.limit - data.spent).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`} del límite!</p> : <p className="text-xs font-medium text-slate-400 mt-2">Quedan {isPrivacyMode ? '***.**' : `${currency}${(data.limit - data.spent).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`} disponibles.</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}