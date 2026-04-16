import { useState, useMemo, useEffect, useCallback } from 'react';
import FileUploader from './FileUploader';
import { processTransactions, getMonthlyData, getCategoryData, getTransactionMonth } from './dataProcessor';
import { Wallet, Plus, Download, Trash2, FileText, Sun, Moon, LayoutDashboard, List, PiggyBank, Pencil, Calculator, Eye, EyeOff } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import TransactionModal from './TransactionModal';
import BudgetModal from './BudgetModal';
import GoalModal from './GoalModal';
import ProductModal from './ProductModal';
import SummaryTab from './SummaryTab';
import HistoryTab from './HistoryTab';
import GoalsTab from './GoalsTab';
import CostingTab from './CostingTab';

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [goals, setGoals] = useState([]);
  const [salesGoal, setSalesGoal] = useState(0);
  const [products, setProducts] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('resumen');
  const [showForm, setShowForm] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ date: '', description: '', category: '', amount: '', type: 'gasto' });
  const [budgetFormData, setBudgetFormData] = useState({ category: '', limit: '' });
  const [goalFormData, setGoalFormData] = useState({ title: '', targetAmount: '', targetDate: '' });
  const [productFormData, setProductFormData] = useState({ name: '', ingredients: [{ name: '', cost: '' }], sellingPrice: '', image: '', stock: '' });
  const [selectedMonth, setSelectedMonth] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [chartReady, setChartReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [currency, setCurrency] = useState('$');
  const [dialogConfig, setDialogConfig] = useState({ isOpen: false, type: 'alert', title: '', message: '', inputValue: '', onConfirm: null, onCancel: null });

  const showDialog = useCallback((type, title, message, defaultValue = '') => {
    return new Promise((resolve) => {
      setDialogConfig({
        isOpen: true,
        type,
        title,
        message,
        inputValue: defaultValue,
        onConfirm: (val) => {
          setDialogConfig(prev => ({ ...prev, isOpen: false }));
          resolve(val);
        },
        onCancel: () => {
          setDialogConfig(prev => ({ ...prev, isOpen: false }));
          resolve(type === 'prompt' ? null : false);
        }
      });
    });
  }, []);

  // Cargar datos guardados al iniciar la app
  useEffect(() => {
    setIsMounted(true);
    
    const savedMode = localStorage.getItem('gastos_app_dark_mode');
    if (savedMode === 'true' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      const savedSalesGoal = localStorage.getItem('gastos_app_sales_goal');
      if (savedSalesGoal) setSalesGoal(parseFloat(savedSalesGoal));
    } catch (error) {}

    try {
      const savedData = localStorage.getItem('gastos_app_data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed)) setTransactions(parsed);
      }
    } catch (error) { console.error("Error leyendo transacciones", error); }

    try {
      const savedBudgets = localStorage.getItem('gastos_app_budgets');
      if (savedBudgets) {
        const parsed = JSON.parse(savedBudgets);
        if (typeof parsed === 'object' && parsed !== null) setBudgets(parsed);
      }
    } catch (error) { console.error("Error leyendo presupuestos", error); }

    try {
      const savedGoals = localStorage.getItem('gastos_app_goals');
      if (savedGoals) {
        const parsed = JSON.parse(savedGoals);
        if (Array.isArray(parsed)) setGoals(parsed);
      }
    } catch (error) { console.error("Error leyendo metas", error); }

    try {
      const savedProducts = localStorage.getItem('gastos_app_products');
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed)) setProducts(parsed);
      }
    } catch (error) { console.error("Error leyendo productos", error); }

    try {
      const savedCurrency = localStorage.getItem('gastos_app_currency');
      if (savedCurrency) setCurrency(savedCurrency);
    } catch (error) {}

    // Registrar el Service Worker para la PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.error('Error al registrar SW:', err));
    }
  }, []);

  // Guardar datos automáticamente cada vez que cambian
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('gastos_app_data', JSON.stringify(transactions));
      localStorage.setItem('gastos_app_budgets', JSON.stringify(budgets));
      localStorage.setItem('gastos_app_goals', JSON.stringify(goals));
      localStorage.setItem('gastos_app_products', JSON.stringify(products));
      localStorage.setItem('gastos_app_sales_goal', salesGoal);
      localStorage.setItem('gastos_app_currency', currency);
    }
    if (transactions.length === 0) setSelectedMonth('Todos');
  }, [transactions, budgets, goals, products, salesGoal, currency, isMounted]);

  // Solución agresiva y definitiva para el warning de Recharts
  useEffect(() => {
    setChartReady(false);
    const timer = setTimeout(() => setChartReady(true), 50); // Le damos 50ms al CSS para acomodarse
    return () => clearTimeout(timer);
  }, [transactions, selectedMonth, activeTab]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('gastos_app_dark_mode', newMode);
      if (newMode) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return newMode;
    });
  };

  const handleDataLoaded = (rawData) => {
    const processed = processTransactions(rawData);
    setTransactions(processed);
  };

  const availableMonths = useMemo(() => {
    const months = new Set(transactions.map(t => getTransactionMonth(t.date)));
    return ['Todos', ...Array.from(months)];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let result = transactions;
    if (selectedMonth !== 'Todos') {
      result = result.filter(t => getTransactionMonth(t.date) === selectedMonth);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(t => t.description.toLowerCase().includes(lower) || t.category.toLowerCase().includes(lower));
    }
    if (minAmount !== '') {
      result = result.filter(t => Math.abs(t.amount) >= parseFloat(minAmount));
    }
    if (maxAmount !== '') {
      result = result.filter(t => Math.abs(t.amount) <= parseFloat(maxAmount));
    }
    return result;
  }, [transactions, selectedMonth, searchTerm, minAmount, maxAmount]);

  const monthlyData = useMemo(() => getMonthlyData(filteredTransactions), [filteredTransactions]);
  const categoryData = useMemo(() => getCategoryData(filteredTransactions), [filteredTransactions]);

  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, curr) => {
        if (curr.amount > 0) acc.ingresos += curr.amount;
        else acc.gastos += Math.abs(curr.amount);
        acc.balance += curr.amount;
        return acc;
      },
      { ingresos: 0, gastos: 0, balance: 0 }
    );
  }, [filteredTransactions]);

  // Calcular progreso de presupuestos
  const budgetProgress = useMemo(() => {
    const progress = {};
    Object.keys(budgets).forEach(cat => {
      progress[cat] = { limit: budgets[cat], spent: 0 };
    });
    filteredTransactions.forEach(tx => {
      if (tx.amount < 0 && budgets[tx.category]) {
        progress[tx.category].spent += Math.abs(tx.amount);
      }
    });
    return progress;
  }, [filteredTransactions, budgets]);

  // Calcular Métricas Clave (Insights)
  const insights = useMemo(() => {
    if (filteredTransactions.length === 0) return null;

    const gastos = filteredTransactions.filter(t => t.amount < 0);
    
    // 1. Gasto individual más grande
    let biggestExpense = null;
    if (gastos.length > 0) {
      biggestExpense = gastos.reduce((prev, curr) => (curr.amount < prev.amount ? curr : prev));
    }

    // 2. Categoría con más gastos
    const categoryDataMap = {};
    gastos.forEach(t => {
      categoryDataMap[t.category] = (categoryDataMap[t.category] || 0) + Math.abs(t.amount);
    });
    let topCategory = null;
    let topCategoryAmount = 0;
    Object.entries(categoryDataMap).forEach(([cat, amount]) => {
      if (amount > topCategoryAmount) {
        topCategory = cat;
        topCategoryAmount = amount;
      }
    });

    // 3. Mayor ahorro en presupuesto
    let bestSaverCategory = null;
    let bestSaverAmount = 0;
    Object.entries(budgetProgress).forEach(([cat, data]) => {
      const saved = data.limit - data.spent;
      if (saved > bestSaverAmount) {
        bestSaverAmount = saved;
        bestSaverCategory = cat;
      }
    });

    return {
      biggestExpense,
      topCategory: topCategory ? { name: topCategory, amount: topCategoryAmount } : null,
      bestSaver: bestSaverCategory ? { name: bestSaverCategory, amount: bestSaverAmount } : null
    };
  }, [filteredTransactions, budgetProgress]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(formData.amount);
    const newTx = {
      date: formData.date,
      description: formData.description,
      category: formData.type === 'gasto' ? (formData.category || 'Otros') : 'Ingreso',
      amount: formData.type === 'gasto' ? -Math.abs(amountNum) : Math.abs(amountNum)
    };
    if (editingTx) {
      setTransactions(prev => prev.map(t => t === editingTx ? newTx : t));
    } else {
      setTransactions(prev => [...prev, newTx]);
    }
    closeTransactionForm();
  };

  const handleSellProduct = async (product) => {
    if (product.stock <= 0) {
      await showDialog('alert', 'Stock Agotado', `No te quedan unidades de ${product.name} en inventario.`);
      return;
    }

    const totalCost = product.ingredients.reduce((sum, ing) => sum + (parseFloat(ing.cost) || 0), 0);
    const dateStr = new Date().toISOString().split('T')[0];

    const incomeTx = {
      date: dateStr,
      description: `Venta: ${product.name}`,
      category: 'Ingreso',
      amount: parseFloat(product.sellingPrice)
    };

    const expenseTx = {
      date: dateStr,
      description: `Costo Producción: ${product.name}`,
      category: 'Materiales/Costos',
      amount: -totalCost
    };

    setTransactions(prev => [...prev, incomeTx, expenseTx]);
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: p.stock - 1 } : p));
    await showDialog('alert', '¡Venta Registrada!', `Se añadieron +${currency}${product.sellingPrice} en ingresos y -${currency}${totalCost} en costos. Stock restante: ${product.stock - 1}`);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const finalProduct = {
      ...productFormData,
      ingredients: productFormData.ingredients.filter(ing => ing.name && ing.cost),
      sellingPrice: parseFloat(productFormData.sellingPrice) || 0,
      stock: parseInt(productFormData.stock) || 0
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...finalProduct, id: editingProduct.id } : p));
    } else {
      setProducts(prev => [...prev, { ...finalProduct, id: Date.now() }]);
    }
    closeProductForm();
  };

  const handleEditProduct = (product) => {
    setProductFormData({
        name: product.name,
        ingredients: product.ingredients.length > 0 ? product.ingredients : [{ name: '', cost: '' }],
        sellingPrice: product.sellingPrice,
        image: product.image || '',
        stock: product.stock || 0
    });
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    const confirmed = await showDialog('confirm', 'Eliminar Producto', '¿Seguro que deseas eliminar este producto y sus costos?');
    if (confirmed) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const closeProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setProductFormData({ name: '', ingredients: [{ name: '', cost: '' }], sellingPrice: '', image: '', stock: '' });
  };

  const handleEditTransaction = (tx) => {
    setFormData({ 
      date: tx.date, 
      description: tx.description, 
      category: tx.category, 
      amount: Math.abs(tx.amount), 
      type: tx.amount > 0 ? 'ingreso' : 'gasto' 
    });
    setEditingTx(tx);
    setShowForm(true);
  };

  const closeTransactionForm = () => {
    setShowForm(false);
    setEditingTx(null);
    setFormData({ date: '', description: '', category: '', amount: '', type: 'gasto' });
  };

  const exportToCSV = () => {
    const headers = ['Fecha', 'Descripción', 'Categoría', 'Monto'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => `${t.date},${t.description},${t.category},${t.amount}`)
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'mis_gastos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = async () => {
    const element = document.getElementById('dashboard-report');
    if (!element) return;
    
    try {
      const imgData = await toPng(element, { backgroundColor: '#f8fafc', pixelRatio: 2 });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Reporte_Financiero_${selectedMonth.replace(' ', '_')}.pdf`);
    } catch (err) {
      console.error('Error al generar PDF', err);
      await showDialog('alert', 'Error', 'Hubo un error al generar el PDF.');
    }
  };

  const handleDeleteTransaction = async (txToDelete) => {
    const confirmed = await showDialog('confirm', 'Eliminar Transacción', '¿Seguro que deseas eliminar esta transacción?');
    if (confirmed) {
      setTransactions(prev => prev.filter(t => t !== txToDelete));
    }
  };

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    const limitNum = parseFloat(budgetFormData.limit);
    if (!isNaN(limitNum) && limitNum > 0) {
      setBudgets(prev => ({
        ...prev,
        [budgetFormData.category]: limitNum
      }));
    }
    setBudgetFormData({ category: '', limit: '' });
    setShowBudgetForm(false);
  };

  const handleDeleteBudget = async (category) => {
    const confirmed = await showDialog('confirm', 'Eliminar Presupuesto', `¿Seguro que deseas eliminar el presupuesto de ${category}?`);
    if (confirmed) {
      setBudgets(prev => {
        const newBudgets = { ...prev };
        delete newBudgets[category];
        return newBudgets;
      });
    }
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    const targetNum = parseFloat(goalFormData.targetAmount);
    if (!isNaN(targetNum) && targetNum > 0 && goalFormData.title && goalFormData.targetDate) {
      const newGoal = {
        id: Date.now(),
        title: goalFormData.title,
        targetAmount: targetNum,
        targetDate: goalFormData.targetDate,
        savedAmount: 0
      };
      setGoals(prev => [...prev, newGoal]);
      setGoalFormData({ title: '', targetAmount: '', targetDate: '' });
      setShowGoalForm(false);
    }
  };

  const handleDeleteGoal = async (id) => {
    const confirmed = await showDialog('confirm', 'Eliminar Meta', '¿Seguro que deseas eliminar esta meta?');
    if (confirmed) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  const handleAddSavings = async (id) => {
    const amountStr = await showDialog('prompt', 'Abonar a Meta', '¿Cuánto dinero deseas abonar a esta meta hoy? (Ej. 100)');
    if (amountStr) {
      const amount = parseFloat(amountStr.replace(',', '.'));
      if (!isNaN(amount) && amount > 0) {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, savedAmount: g.savedAmount + amount } : g));
      } else {
        await showDialog('alert', 'Error', 'Monto inválido. Ingresa solo números mayores a cero.'); 
      }
    }
  };

  const handleSetSalesGoal = async () => {
    const amountStr = await showDialog('prompt', 'Meta de Ventas', '¿Cuál es tu meta de ingresos para este mes? (Ej. 2000)');
    if (amountStr) {
      const amount = parseFloat(amountStr.replace(',', '.'));
      if (!isNaN(amount) && amount >= 0) {
        setSalesGoal(amount);
      } else {
        await showDialog('alert', 'Error', 'Monto inválido. Usa solo números.');
      }
    }
  };

  const handleAnalyze = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setAiAnalysis('');
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: filteredTransactions }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`El servidor devolvió una respuesta vacía o no válida (Código ${response.status}). ¿Se borró el archivo de la API?`);
      }

      if (!response.ok) {
        throw new Error(data.error || `Error: ${response.statusText}`);
      }
      
      setAiAnalysis(data.analysis);
    } catch (error) {
      console.error('Error al analizar con IA:', error);
      setAiAnalysis(`Hubo un error al contactar al asistente de IA: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getTabClass = (tabName, currentTab) => {
    const base = "px-4 py-2.5 text-sm font-bold rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ";
    const active = "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm";
    const inactive = "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800";
    
    if (currentTab === tabName) {
      return base + active;
    }
    return base + inactive;
  };

  // Prevenir errores de hidratación en Next.js
  if (!isMounted) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        </div>
      </main>
    );
  }

  if (transactions.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 font-sans transition-colors duration-300">
        <div className="max-w-2xl w-full bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gastos App!</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-base">Sube tu archivo de transacciones para comenzar el análisis</p>
          </div>
          <FileUploader onDataLoaded={handleDataLoaded} />
          <div className="mt-8 text-center relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500">O ingresa sin archivo</span></div>
          </div>
          <button onClick={() => setShowForm(true)} className="w-full mt-6 p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all font-medium flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Añadir datos manualmente
          </button>
        </div>
        <BudgetModal showBudgetForm={showBudgetForm} setShowBudgetForm={setShowBudgetForm} budgetFormData={budgetFormData} setBudgetFormData={setBudgetFormData} handleBudgetSubmit={handleBudgetSubmit} transactions={transactions} />
        <TransactionModal showForm={showForm} closeForm={closeTransactionForm} formData={formData} setFormData={setFormData} handleManualSubmit={handleManualSubmit} isEditing={!!editingTx} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Resumen Financiero</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Análisis detallado de ingresos y gastos</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => setIsPrivacyMode(!isPrivacyMode)} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm" title={isPrivacyMode ? "Mostrar montos" : "Ocultar montos (Modo Privacidad)"}>
              {isPrivacyMode ? <EyeOff className="w-4 h-4 text-indigo-500" /> : <Eye className="w-4 h-4" />}
            </button>
            <button onClick={toggleDarkMode} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm" title="Alternar Tema">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {availableMonths.length > 1 && (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-medium cursor-pointer"
              >
                {availableMonths.map(month => (
                  <option key={month} value={month}>{month === 'Todos' ? 'Todos los meses' : month}</option>
                ))}
              </select>
            )}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm font-bold cursor-pointer"
              title="Moneda"
            >
              <option value="$">$</option>
              <option value="€">€</option>
              <option value="£">£</option>
              <option value="S/">S/</option>
              <option value="R$">R$</option>
              <option value="Bs">Bs</option>
            </select>
            <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm font-medium flex items-center gap-2">
              <Plus className="w-4 h-4" /> Añadir
            </button>
            <button onClick={exportToPDF} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" /> Reporte PDF
            </button>
            <button onClick={exportToCSV} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm font-medium flex items-center gap-2">
              <Download className="w-4 h-4" /> Exportar
            </button>
            <button onClick={async () => { if(await showDialog('confirm', 'Borrar Datos', '¿Seguro que deseas borrar todos los datos? Esto no se puede deshacer.')) setTransactions([]) }} className="px-4 py-2 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors shadow-sm font-medium flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Borrar
            </button>
          </div>
        </header>

        <div className="flex space-x-2 bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-2xl w-full md:w-fit overflow-x-auto">
          <button 
            onClick={() => setActiveTab('resumen')} 
            className={getTabClass('resumen', activeTab)}
          >
            <LayoutDashboard className="w-4 h-4" /> Resumen
          </button>
          <button 
            onClick={() => setActiveTab('historial')} 
            className={getTabClass('historial', activeTab)}
          >
            <List className="w-4 h-4" /> Historial de Transacciones
          </button>
          <button 
            onClick={() => setActiveTab('metas')} 
            className={getTabClass('metas', activeTab)}
          >
            <PiggyBank className="w-4 h-4" /> Metas de Ahorro
          </button>
          <button 
            onClick={() => setActiveTab('costos')} 
            className={getTabClass('costos', activeTab)}
          >
            <Calculator className="w-4 h-4" /> Costos y Precios
          </button>
        </div>

        <div id="dashboard-report" className="space-y-8">
          {/* --- PESTAÑA: RESUMEN --- */}
          {activeTab === 'resumen' && (
            <SummaryTab totals={totals} insights={insights} chartReady={chartReady} monthlyData={monthlyData} isDarkMode={isDarkMode} categoryData={categoryData} budgets={budgets} budgetProgress={budgetProgress} setShowBudgetForm={setShowBudgetForm} handleDeleteBudget={handleDeleteBudget} handleAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} aiAnalysis={aiAnalysis} currency={currency} salesGoal={salesGoal} handleSetSalesGoal={handleSetSalesGoal} isPrivacyMode={isPrivacyMode} />
      )}

          {/* --- PESTAÑA: HISTORIAL --- */}
          {activeTab === 'historial' && (
            <HistoryTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} minAmount={minAmount} setMinAmount={setMinAmount} maxAmount={maxAmount} setMaxAmount={setMaxAmount} filteredTransactions={filteredTransactions} handleDeleteTransaction={handleDeleteTransaction} handleEditTransaction={handleEditTransaction} setShowForm={setShowForm} currency={currency} isPrivacyMode={isPrivacyMode} />
          )}

          {/* --- PESTAÑA: METAS DE AHORRO --- */}
          {activeTab === 'metas' && (
            <GoalsTab goals={goals} setShowGoalForm={setShowGoalForm} handleDeleteGoal={handleDeleteGoal} handleAddSavings={handleAddSavings} currency={currency} isPrivacyMode={isPrivacyMode} />
          )}

          {/* --- PESTAÑA: COSTOS Y PRECIOS --- */}
          {activeTab === 'costos' && (
            <CostingTab 
              products={products}
              setShowProductForm={setShowProductForm}
              handleEditProduct={handleEditProduct}
              handleDeleteProduct={handleDeleteProduct}
              handleSellProduct={handleSellProduct}
              currency={currency}
              isPrivacyMode={isPrivacyMode}
              showDialog={showDialog}
            />
          )}
        </div>
      </div>
        <BudgetModal showBudgetForm={showBudgetForm} setShowBudgetForm={setShowBudgetForm} budgetFormData={budgetFormData} setBudgetFormData={setBudgetFormData} handleBudgetSubmit={handleBudgetSubmit} transactions={transactions} currency={currency} />
        <GoalModal showGoalForm={showGoalForm} setShowGoalForm={setShowGoalForm} goalFormData={goalFormData} setGoalFormData={setGoalFormData} handleGoalSubmit={handleGoalSubmit} currency={currency} />
        <TransactionModal showForm={showForm} closeForm={closeTransactionForm} formData={formData} setFormData={setFormData} handleManualSubmit={handleManualSubmit} isEditing={!!editingTx} currency={currency} />
        <ProductModal 
          showForm={showProductForm}
          closeForm={closeProductForm}
          formData={productFormData}
          setFormData={setProductFormData}
          handleSubmit={handleProductSubmit}
          isEditing={!!editingProduct}
          currency={currency}
        />
        
        {dialogConfig.isOpen && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[100] backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm p-6 border border-slate-100 dark:border-slate-800 transform scale-100 transition-transform">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{dialogConfig.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">{dialogConfig.message}</p>
              
              {dialogConfig.type === 'prompt' && (
                <input 
                  type="text" 
                  autoFocus
                  className="w-full mb-6 p-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200 bg-transparent"
                  value={dialogConfig.inputValue} 
                  onChange={(e) => setDialogConfig({...dialogConfig, inputValue: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && dialogConfig.onConfirm(dialogConfig.inputValue)}
                />
              )}

              <div className="flex justify-end gap-3 mt-2">
                {dialogConfig.type !== 'alert' && (
                  <button 
                    onClick={dialogConfig.onCancel}
                    className="px-4 py-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                )}
                <button 
                  onClick={() => dialogConfig.onConfirm(dialogConfig.type === 'prompt' ? dialogConfig.inputValue : true)}
                  className={`px-4 py-2.5 text-white rounded-xl font-medium transition-colors shadow-sm ${(dialogConfig.title.toLowerCase().includes('eliminar') || dialogConfig.title.toLowerCase().includes('borrar')) ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  {dialogConfig.type === 'confirm' ? 'Confirmar' : dialogConfig.type === 'prompt' ? 'Aceptar' : 'Entendido'}
                </button>
              </div>
            </div>
          </div>
        )}
    </main>
  );
}