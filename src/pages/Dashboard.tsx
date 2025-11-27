// Page Tableau de bord (Dashboard)
import { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { useTransactions } from '../hooks/useTransactions';
import { formatMontant } from '../utils/currency';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { startOfMonth, endOfMonth, format, eachMonthOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export function Dashboard() {
    const {
        transactions,
        isLoading,
        getSoldeCaisse,
        getSoldeBanque,
        isTransactionCancelled,
    } = useTransactions();

    // Calculs pour le mois en cours
    const currentMonthData = useMemo(() => {
        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now);

        const monthTransactions = transactions.filter((t) => {
            const date = new Date(t.date);
            return date >= start && date <= end;
        });

        const recettes = monthTransactions
            .filter((t) => t.type === 'recette' && !t.estStorno && !isTransactionCancelled(t.id))
            .reduce((sum, t) => sum + t.montant, 0);

        const depenses = monthTransactions
            .filter((t) => t.type === 'depense' && !t.estStorno && !isTransactionCancelled(t.id))
            .reduce((sum, t) => sum + t.montant, 0);

        return { recettes, depenses, resultat: recettes - depenses };
    }, [transactions, isTransactionCancelled]);

    // Données pour le graphique mensuel (6 derniers mois)
    const monthlyData = useMemo(() => {
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });

        return months.map((month) => {
            const start = startOfMonth(month);
            const end = endOfMonth(month);

            const monthTransactions = transactions.filter((t) => {
                const date = new Date(t.date);
                return date >= start && date <= end;
            });

            const recettes = monthTransactions
                .filter((t) => t.type === 'recette' && !t.estStorno && !isTransactionCancelled(t.id))
                .reduce((sum, t) => sum + t.montant, 0);

            const depenses = monthTransactions
                .filter((t) => t.type === 'depense' && !t.estStorno && !isTransactionCancelled(t.id))
                .reduce((sum, t) => sum + t.montant, 0);

            return {
                mois: format(month, 'MMM yyyy', { locale: fr }),
                recettes,
                depenses,
            };
        });
    }, [transactions, isTransactionCancelled]);

    // Données pour le graphique des dépenses par catégorie
    const depensesByCategory = useMemo(() => {
        const categoryMap = new Map<string, number>();

        transactions
            .filter((t) => t.type === 'depense' && !t.estStorno && !isTransactionCancelled(t.id))
            .forEach((t) => {
                const current = categoryMap.get(t.categorie) || 0;
                categoryMap.set(t.categorie, current + t.montant);
            });

        return Array.from(categoryMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8); // Top 8 catégories
    }, [transactions, isTransactionCancelled]);

    // Top 5 des dépenses
    const topDepenses = useMemo(() => {
        return transactions
            .filter((t) => t.type === 'depense' && !t.estStorno && !isTransactionCancelled(t.id))
            .sort((a, b) => b.montant - a.montant)
            .slice(0, 5);
    }, [transactions, isTransactionCancelled]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
                <p className="text-muted-foreground">
                    Vue d'ensemble de votre activité comptable
                </p>
            </div>

            {/* Cartes KPI */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Solde Caisse</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatMontant(getSoldeCaisse())}</div>
                        <p className="text-xs text-muted-foreground">Espèces disponibles</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Solde Banque</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatMontant(getSoldeBanque())}</div>
                        <p className="text-xs text-muted-foreground">Compte bancaire</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recettes du mois</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatMontant(currentMonthData.recettes)}</div>
                        <p className="text-xs text-muted-foreground">Total des recettes</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dépenses du mois</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatMontant(currentMonthData.depenses)}</div>
                        <p className="text-xs text-muted-foreground">Total des dépenses</p>
                    </CardContent>
                </Card>
            </div>

            {/* Résultat du mois */}
            <Card>
                <CardHeader>
                    <CardTitle>Résultat du mois</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={`text-3xl font-bold ${currentMonthData.resultat >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatMontant(currentMonthData.resultat)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        {currentMonthData.resultat >= 0 ? 'Bénéfice' : 'Perte'} pour le mois en cours
                    </p>
                </CardContent>
            </Card>

            {/* Graphiques */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Évolution mensuelle */}
                <Card>
                    <CardHeader>
                        <CardTitle>Évolution mensuelle</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mois" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatMontant(value as number)} />
                                <Legend />
                                <Line type="monotone" dataKey="recettes" stroke="#10b981" name="Recettes" strokeWidth={2} />
                                <Line type="monotone" dataKey="depenses" stroke="#ef4444" name="Dépenses" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Dépenses par catégorie */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dépenses par catégorie</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {depensesByCategory.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={depensesByCategory}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }: { name?: string; percent?: number }) => name ? `${name}: ${((percent || 0) * 100).toFixed(0)}%` : ''}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {depensesByCategory.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatMontant(value as number)} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                Aucune dépense enregistrée
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Top 5 des dépenses */}
            <Card>
                <CardHeader>
                    <CardTitle>Top 5 des dépenses</CardTitle>
                </CardHeader>
                <CardContent>
                    {topDepenses.length > 0 ? (
                        <div className="space-y-4">
                            {topDepenses.map((transaction, index) => (
                                <div key={transaction.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 font-semibold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="font-medium">{transaction.description}</div>
                                            <div className="text-sm text-muted-foreground">{transaction.categorie}</div>
                                        </div>
                                    </div>
                                    <div className="text-lg font-semibold text-red-600">
                                        {formatMontant(transaction.montant)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            Aucune dépense enregistrée
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
