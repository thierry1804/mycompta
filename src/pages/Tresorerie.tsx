// Page Trésorerie (SMT - Système Minimal de Trésorerie)
import { useState, useMemo } from 'react';
import { Wallet, Building2, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { useTransactions } from '../hooks/useTransactions';
import { useApp } from '../contexts/AppContext';
import { formatMontant } from '../utils/currency';
import { formatDate } from '../utils/date';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export function Tresorerie() {
    const { transactions, getSoldeCaisse, getSoldeBanque } = useTransactions();
    const { exerciceCourant } = useApp();
    const [activeTab, setActiveTab] = useState<'caisse' | 'banque'>('caisse');

    // Transactions de caisse
    const transactionsCaisse = useMemo(() => {
        return transactions
            .filter((t) => t.moyenPaiement === 'especes')
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [transactions]);

    // Transactions de banque
    const transactionsBanque = useMemo(() => {
        return transactions
            .filter((t) => t.moyenPaiement === 'banque')
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [transactions]);

    // Calcul du solde cumulé pour la caisse
    const livreDecaisse = useMemo(() => {
        let solde = 0;
        return transactionsCaisse.map((t) => {
            if (t.type === 'recette') {
                solde += t.montant;
            } else {
                solde -= t.montant;
            }
            return {
                ...t,
                solde,
            };
        });
    }, [transactionsCaisse]);

    // Calcul du solde cumulé pour la banque
    const livreDeBanque = useMemo(() => {
        let solde = exerciceCourant?.soldeOuvertureBanque || 0;
        return transactionsBanque.map((t) => {
            if (t.type === 'recette') {
                solde += t.montant;
            } else {
                solde -= t.montant;
            }
            return {
                ...t,
                solde,
            };
        });
    }, [transactionsBanque, exerciceCourant]);

    // Données pour le graphique d'évolution (mois en cours)
    const evolutionData = useMemo(() => {
        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now);
        const days = eachDayOfInterval({ start, end });

        return days.map((day) => {
            const dayStr = day.toISOString().split('T')[0];

            // Transactions jusqu'à ce jour
            const transactionsJusquAuJour = activeTab === 'caisse'
                ? transactionsCaisse.filter((t) => t.date <= dayStr)
                : transactionsBanque.filter((t) => t.date <= dayStr);

            let solde = activeTab === 'banque' ? (exerciceCourant?.soldeOuvertureBanque || 0) : 0;
            transactionsJusquAuJour.forEach((t) => {
                if (t.type === 'recette') {
                    solde += t.montant;
                } else {
                    solde -= t.montant;
                }
            });

            return {
                date: formatDate(dayStr),
                solde,
            };
        });
    }, [activeTab, transactionsCaisse, transactionsBanque, exerciceCourant]);

    // Statistiques
    const stats = useMemo(() => {
        const trans = activeTab === 'caisse' ? transactionsCaisse : transactionsBanque;
        const recettes = trans.filter((t) => t.type === 'recette').reduce((sum, t) => sum + t.montant, 0);
        const depenses = trans.filter((t) => t.type === 'depense').reduce((sum, t) => sum + t.montant, 0);

        return {
            recettes,
            depenses,
            solde: activeTab === 'caisse' ? getSoldeCaisse() : getSoldeBanque(),
            nombreTransactions: trans.length,
        };
    }, [activeTab, transactionsCaisse, transactionsBanque, getSoldeCaisse, getSoldeBanque]);

    if (!exerciceCourant) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Aucun exercice comptable actif</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Trésorerie</h2>
                <p className="text-muted-foreground">
                    Système Minimal de Trésorerie (SMT) - Suivi des mouvements de caisse et banque
                </p>
            </div>

            {/* Onglets */}
            <div className="border-b">
                <nav className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('caisse')}
                        className={`pb-4 px-2 border-b-2 transition-colors ${activeTab === 'caisse'
                                ? 'border-primary text-primary font-medium'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Wallet className="w-4 h-4 inline mr-2" />
                        Livre de Caisse
                    </button>
                    <button
                        onClick={() => setActiveTab('banque')}
                        className={`pb-4 px-2 border-b-2 transition-colors ${activeTab === 'banque'
                                ? 'border-primary text-primary font-medium'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Building2 className="w-4 h-4 inline mr-2" />
                        Livre de Banque
                    </button>
                </nav>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Solde actuel</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${stats.solde >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatMontant(stats.solde)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {activeTab === 'caisse' ? 'Espèces' : 'Compte bancaire'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Recettes</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatMontant(stats.recettes)}</div>
                        <p className="text-xs text-muted-foreground">Entrées de fonds</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Dépenses</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatMontant(stats.depenses)}</div>
                        <p className="text-xs text-muted-foreground">Sorties de fonds</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.nombreTransactions}</div>
                        <p className="text-xs text-muted-foreground">Mouvements enregistrés</p>
                    </CardContent>
                </Card>
            </div>

            {/* Graphique d'évolution */}
            <Card>
                <CardHeader>
                    <CardTitle>Évolution du solde (Mois en cours)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={evolutionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatMontant(value as number)} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="solde"
                                stroke={activeTab === 'caisse' ? '#10b981' : '#3b82f6'}
                                name="Solde"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Livre (Tableau des mouvements) */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {activeTab === 'caisse' ? 'Livre de Caisse' : 'Livre de Banque'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Catégorie
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Recettes
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Dépenses
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Solde
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                    {activeTab === 'banque' && exerciceCourant.soldeOuvertureBanque > 0 && (
                                        <tr className="bg-blue-50 dark:bg-blue-950">
                                            <td className="px-4 py-3 text-sm">{formatDate(exerciceCourant.dateDebut)}</td>
                                            <td className="px-4 py-3 text-sm font-medium">Solde d'ouverture</td>
                                            <td className="px-4 py-3 text-sm">-</td>
                                            <td className="px-4 py-3 text-sm text-right">-</td>
                                            <td className="px-4 py-3 text-sm text-right">-</td>
                                            <td className="px-4 py-3 text-sm text-right font-bold">
                                                {formatMontant(exerciceCourant.soldeOuvertureBanque)}
                                            </td>
                                        </tr>
                                    )}
                                    {(activeTab === 'caisse' ? livreDecaisse : livreDeBanque).length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                                Aucune transaction enregistrée
                                            </td>
                                        </tr>
                                    ) : (
                                        (activeTab === 'caisse' ? livreDecaisse : livreDeBanque).map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="px-4 py-3 text-sm whitespace-nowrap">
                                                    {formatDate(item.date)}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="font-medium">{item.description}</div>
                                                    {item.fournisseurBeneficiaire && (
                                                        <div className="text-xs text-gray-500">{item.fournisseurBeneficiaire}</div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                    {item.categorie}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right text-green-600">
                                                    {item.type === 'recette' ? formatMontant(item.montant) : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right text-red-600">
                                                    {item.type === 'depense' ? formatMontant(item.montant) : '-'}
                                                </td>
                                                <td className={`px-4 py-3 text-sm text-right font-semibold ${item.solde >= 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {formatMontant(item.solde)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Note informative */}
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                        <strong>Note SMT:</strong> Le Système Minimal de Trésorerie permet de suivre chronologiquement
                        tous les mouvements de fonds (espèces et banque) avec calcul automatique des soldes cumulés.
                        Conforme aux exigences du PCG 2005 pour les micro et petites entreprises.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
