import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-linear-bg-light dark:bg-linear-bg-dark text-linear-text-light dark:text-linear-text-dark transition-colors duration-200">
        <Header />
        <main className="flex-1">
          <HomePage />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
