// Page États Financiers
import { useState } from 'react';
import { Download, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Button } from '../components/ui';
import { useEtatsFinanciers } from '../hooks/useEtatsFinanciers';
import { useApp } from '../contexts/AppContext';
import { useTransactions } from '../hooks/useTransactions';
import { formatMontant } from '../utils/currency';
import { formatDate } from '../utils/date';
import { exportBilanToCSV, exportCompteResultatToCSV } from '../utils/export';

export function EtatsFinanciers() {
    const { bilan, compteResultat } = useEtatsFinanciers();
    const { exerciceCourant, entrepriseInfo } = useApp();
    const { transactions } = useTransactions();
    const [activeTab, setActiveTab] = useState<'bilan' | 'compte-resultat'>('bilan');

    const handleExportBilan = () => {
        const exercice = exerciceCourant?.annee || 'export';
        exportBilanToCSV(bilan, `bilan_${exercice}.csv`);
    };

    const handleExportCompteResultat = () => {
        const exercice = exerciceCourant?.annee || 'export';
        exportCompteResultatToCSV(compteResultat, `compte_resultat_${exercice}.csv`);
    };

    if (transactions.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">États Financiers</h2>
                    <p className="text-muted-foreground">
                        Bilan et compte de résultat conformes au PCG 2005
                    </p>
                </div>
                <div className="text-center py-12 border rounded-lg">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">
                        Aucune transaction enregistrée
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Enregistrez des transactions pour générer les états financiers
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">États Financiers</h2>
                    <p className="text-muted-foreground">
                        Bilan et compte de résultat conformes au PCG 2005
                    </p>
                </div>
            </div>

            {/* Informations de l'exercice */}
            {exerciceCourant && (
                <Card>
                    <CardHeader>
                        <CardTitle>Informations de l'exercice</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Exercice</p>
                                <p className="font-semibold">{exerciceCourant.annee}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Date d'établissement</p>
                                <p className="font-semibold">
                                    {formatDate(bilan.dateEtablissement)}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Entreprise</p>
                                <p className="font-semibold">{entrepriseInfo?.nom || 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Onglets */}
            <div className="border-b">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('bilan')}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeTab === 'bilan'
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Bilan Simplifié
                    </button>
                    <button
                        onClick={() => setActiveTab('compte-resultat')}
                        className={`px-4 py-2 font-medium transition-colors ${
                            activeTab === 'compte-resultat'
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Compte de Résultat
                    </button>
                </div>
            </div>

            {/* Bilan Simplifié */}
            {activeTab === 'bilan' && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Bilan Simplifié</CardTitle>
                            <Button
                                variant="outline"
                                onClick={handleExportBilan}
                                className="flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Exporter CSV
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ACTIF */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400">
                                    ACTIF
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Immobilisations</span>
                                        <span className="font-medium">
                                            {formatMontant(bilan.actif.immobilisations)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Stocks</span>
                                        <span className="font-medium">
                                            {formatMontant(bilan.actif.stocks)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Créances</span>
                                        <span className="font-medium">
                                            {formatMontant(bilan.actif.creances)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Trésorerie</span>
                                        <span className="font-medium">
                                            {formatMontant(bilan.actif.tresorerie)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-3 mt-4 pt-3 border-t-2 border-green-600 dark:border-green-400">
                                        <span className="font-semibold text-lg">TOTAL ACTIF</span>
                                        <span className="font-bold text-lg">
                                            {formatMontant(bilan.actif.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* PASSIF */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">
                                    PASSIF
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Capitaux propres</span>
                                        <span className="font-medium">
                                            {formatMontant(bilan.passif.capitaux)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Dettes</span>
                                        <span className="font-medium">
                                            {formatMontant(bilan.passif.dettes)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-3 mt-4 pt-3 border-t-2 border-red-600 dark:border-red-400">
                                        <span className="font-semibold text-lg">TOTAL PASSIF</span>
                                        <span className="font-bold text-lg">
                                            {formatMontant(bilan.passif.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vérification équilibre */}
                        <div className="mt-6 p-4 rounded-lg bg-muted">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    Équilibre Bilan (Actif - Passif)
                                </span>
                                <span
                                    className={`font-semibold ${
                                        Math.abs(bilan.actif.total - bilan.passif.total) < 0.01
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}
                                >
                                    {formatMontant(bilan.actif.total - bilan.passif.total)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Compte de Résultat */}
            {activeTab === 'compte-resultat' && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Compte de Résultat Simplifié</CardTitle>
                            <Button
                                variant="outline"
                                onClick={handleExportCompteResultat}
                                className="flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Exporter CSV
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* PRODUITS */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    PRODUITS
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">
                                            Ventes de produits et services
                                        </span>
                                        <span className="font-medium">
                                            {formatMontant(compteResultat.produits.ventesProduitsServices)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Autres produits</span>
                                        <span className="font-medium">
                                            {formatMontant(compteResultat.produits.autresProduits)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-3 mt-4 pt-3 border-t-2 border-green-600 dark:border-green-400">
                                        <span className="font-semibold text-lg">TOTAL PRODUITS</span>
                                        <span className="font-bold text-lg">
                                            {formatMontant(compteResultat.produits.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* CHARGES */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">
                                    CHARGES
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Achats</span>
                                        <span className="font-medium">
                                            {formatMontant(compteResultat.charges.achats)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">
                                            Charges de personnel
                                        </span>
                                        <span className="font-medium">
                                            {formatMontant(compteResultat.charges.chargesPersonnel)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Autres charges</span>
                                        <span className="font-medium">
                                            {formatMontant(compteResultat.charges.autresCharges)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-muted-foreground">Amortissements</span>
                                        <span className="font-medium">
                                            {formatMontant(compteResultat.charges.amortissements)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-3 mt-4 pt-3 border-t-2 border-red-600 dark:border-red-400">
                                        <span className="font-semibold text-lg">TOTAL CHARGES</span>
                                        <span className="font-bold text-lg">
                                            {formatMontant(compteResultat.charges.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* RÉSULTAT */}
                            <div className="p-4 rounded-lg bg-muted">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold">RÉSULTAT</span>
                                    <div className="text-right">
                                        <div
                                            className={`text-2xl font-bold ${
                                                compteResultat.resultat >= 0
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}
                                        >
                                            {compteResultat.resultat >= 0 ? '+' : ''}
                                            {formatMontant(compteResultat.resultat)}
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            {compteResultat.resultat >= 0 ? 'BÉNÉFICE' : 'PERTE'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
