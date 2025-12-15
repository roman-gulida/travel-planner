import { useState, useEffect } from 'react';
import { ThemeContext, type Theme } from './ThemeContext';

const getInitialTheme = (): Theme => {
    const stored = localStorage.getItem('theme');
    return (stored as Theme) || 'light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        localStorage.setItem('theme', theme);

        // Update data-theme attribute for CSS variables
        document.documentElement.setAttribute('data-theme', theme);

        // Update class for Tailwind dark mode
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};