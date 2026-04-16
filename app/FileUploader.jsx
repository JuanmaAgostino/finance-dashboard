"use client";

import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { UploadCloud } from 'lucide-react';

export default function FileUploader({ onDataLoaded }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result);
      const workbook = XLSX.read(data, { type: 'array', cellDates: true, codepage: 65001 });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      // raw: false asegura que conservamos el formato de las fechas del Excel
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
      onDataLoaded(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all duration-200 ${
        isDragging ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-[1.02]' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500'
      }`}
    >
      <UploadCloud className={`w-14 h-14 mb-4 transition-colors ${isDragging ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Arrastra tu archivo Excel o CSV aquí</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-8">o haz clic para explorar en tu dispositivo</p>
      <label className="bg-indigo-600 text-white px-8 py-3 rounded-xl cursor-pointer hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md font-medium">
        Seleccionar Archivo
        <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleChange} />
      </label>
    </div>
  );
}