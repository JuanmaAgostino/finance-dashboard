export const processTransactions = (rawData) => {
  return rawData.map(row => {
    // Limpia textos de caracteres extraños
    const cleanString = (s) => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

    const getCol = (validNames) => {
      const key = Object.keys(row).find(k => validNames.includes(cleanString(k)));
      let value = key ? row[key] : undefined;
      return typeof value === 'string' ? value.trim() : value;
    };

    const amountNames = ['monto', 'amount', 'valor', 'precio', 'total', 'importe', 'costo', 'cargo'];
    const dateNames = ['fecha', 'date', 'dia', 'fechadeoperacion', 'fechavalor'];
    const descNames = ['descripcion', 'description', 'detalle', 'concepto', 'nombre', 'movimiento', 'referencia'];
    const catNames = ['categoria', 'category', 'rubro', 'tipo', 'clasificacion', 'grupo', 'clase', 'etiqueta', 'tag', 'cat'];

    let rawAmount = getCol(amountNames);
    let amount = 0;
    if (typeof rawAmount === 'number') amount = rawAmount;
    else if (typeof rawAmount === 'string') {
      amount = parseFloat(rawAmount.replace(/[^\d.-]/g, ''));
    }

    let date = getCol(dateNames) || '';
    let description = getCol(descNames) || '';
    let category = getCol(catNames);

    // DETECTOR INTELIGENTE: Si no encuentra la columna "Categoría", busca cualquier columna sobrante que tenga texto.
    if (!category || category === '') {
      const usedKeys = Object.keys(row).filter(k => {
        const ck = cleanString(k);
        return amountNames.includes(ck) || dateNames.includes(ck) || descNames.includes(ck);
      });
      
      const remainingKeys = Object.keys(row).filter(k => !usedKeys.includes(k));
      for (let k of remainingKeys) {
        if (row[k] && typeof row[k] === 'string' && isNaN(Number(row[k]))) {
          category = row[k].trim();
          break;
        }
      }
    }

    return {
      date: date,
      description: description,
      category: category || 'Otros',
      amount: isNaN(amount) ? 0 : amount,
    };
  });
};

export const getTransactionMonth = (dateStr) => {
  if (!dateStr) return 'Desconocido';
  const monthMatch = String(dateStr).match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
  let monthKey = 'Desconocido';

  if (monthMatch) {
    const [, dd, mm, yyyy] = monthMatch;
    const dateObj = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    monthKey = dateObj.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  } else {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      monthKey = d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    } else {
      monthKey = String(dateStr).substring(0, 10);
    }
  }
  return monthKey.charAt(0).toUpperCase() + monthKey.slice(1);
};

export const getMonthlyData = (transactions) => {
  const grouped = {};

  transactions.forEach(t => {
    const monthKey = getTransactionMonth(t.date);

    if (!grouped[monthKey]) {
      grouped[monthKey] = { month: monthKey, ingresos: 0, gastos: 0 };
    }

    if (t.amount > 0) grouped[monthKey].ingresos += t.amount;
    else grouped[monthKey].gastos += Math.abs(t.amount);
  });

  return Object.values(grouped);
};

export const getCategoryData = (transactions) => {
  const grouped = {};

  transactions.forEach(t => {
    if (t.amount < 0) {
      grouped[t.category] = (grouped[t.category] || 0) + Math.abs(t.amount);
    }
  });

  return Object.keys(grouped)
    .map(key => ({ name: key, value: grouped[key] }))
    .sort((a, b) => b.value - a.value);
};