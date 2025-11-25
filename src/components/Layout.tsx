// Layout principal avec Sidebar
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Receipt,
    FileText,
    Settings,
    Menu,
    X,
    Sun,
    Moon,
    Building2,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui';
import { cn } from '../lib/utils';

interface NavItem {
    name: string;
    path: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    {
        name: 'Tableau de bord',
        path: '/',
        icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
        name: 'Transactions',
        path: '/transactions',
        icon: <Receipt className="w-5 h-5" />,
    },
    {
        name: 'États Financiers',
        path: '/etats-financiers',
        icon: <FileText className="w-5 h-5" />,
    },
    {
        name: 'Paramètres',
        path: '/parametres',
        icon: <Settings className="w-5 h-5" />,
    },
];

export function Layout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const { entrepriseInfo, exerciceCourant } = useApp();

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar Desktop */}
            <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-grow border-r border-border bg-card overflow-y-auto">
                    {/* Logo et nom de l'entreprise */}
                    <div className="flex items-center flex-shrink-0 px-4 py-6 border-b border-border">
                        <Building2 className="w-8 h-8 text-primary mr-3" />
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg font-bold text-foreground truncate">
                                {entrepriseInfo?.nom || 'Compta MPE'}
                            </h1>
                            {exerciceCourant && (
                                <p className="text-xs text-muted-foreground">
                                    Exercice {exerciceCourant.annee}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                                        isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                    )}
                                >
                                    {item.icon}
                                    <span className="ml-3">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Theme Toggle */}
                    <div className="flex-shrink-0 border-t border-border p-4">
                        <Button
                            variant="outline"
                            size="default"
                            onClick={toggleTheme}
                            className="w-full"
                        >
                            {theme === 'light' ? (
                                <>
                                    <Moon className="w-4 h-4 mr-2" />
                                    Mode sombre
                                </>
                            ) : (
                                <>
                                    <Sun className="w-4 h-4 mr-2" />
                                    Mode clair
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Sidebar Mobile */}
            {sidebarOpen && (
                <div className="md:hidden">
                    <div className="fixed inset-0 z-40 flex">
                        <div
                            className="fixed inset-0 bg-black/50"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card">
                            <div className="absolute top-0 right-0 -mr-12 pt-2">
                                <button
                                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <X className="h-6 w-6 text-white" />
                                </button>
                            </div>

                            <div className="flex items-center flex-shrink-0 px-4 py-6 border-b border-border">
                                <Building2 className="w-8 h-8 text-primary mr-3" />
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-lg font-bold text-foreground truncate">
                                        {entrepriseInfo?.nom || 'Compta MPE'}
                                    </h1>
                                    {exerciceCourant && (
                                        <p className="text-xs text-muted-foreground">
                                            Exercice {exerciceCourant.annee}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setSidebarOpen(false)}
                                            className={cn(
                                                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                                                isActive
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                            )}
                                        >
                                            {item.icon}
                                            <span className="ml-3">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="flex-shrink-0 border-t border-border p-4">
                                <Button
                                    variant="outline"
                                    size="default"
                                    onClick={toggleTheme}
                                    className="w-full"
                                >
                                    {theme === 'light' ? (
                                        <>
                                            <Moon className="w-4 h-4 mr-2" />
                                            Mode sombre
                                        </>
                                    ) : (
                                        <>
                                            <Sun className="w-4 h-4 mr-2" />
                                            Mode clair
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="md:pl-64 flex flex-col flex-1">
                {/* Mobile Header */}
                <div className="sticky top-0 z-10 md:hidden flex items-center justify-between bg-card border-b border-border px-4 py-3">
                    <button
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <h1 className="text-lg font-semibold text-foreground">
                        {entrepriseInfo?.nom || 'Compta MPE'}
                    </h1>
                    <div className="w-6" /> {/* Spacer for centering */}
                </div>

                {/* Page Content */}
                <main className="flex-1">
                    <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
