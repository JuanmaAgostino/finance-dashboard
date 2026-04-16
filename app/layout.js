import "./globals.css";

export const metadata = {
  title: "Gastos App",
  description: "App Gastos por Juan Manuel Agostino Colombres",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased transition-colors duration-300"
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">{children}</body>
    </html>
  );
}
