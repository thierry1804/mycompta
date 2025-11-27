// Liste des transactions avec tableau
import { useState, useMemo } from 'react';
import { Pencil, XCircle, Search } from 'lucide-react';
import { Button, Input, ConfirmDialog, AlertDialog } from '../ui';
import type { Transaction } from '../../types';
import { formatMontant } from '../../utils/currency';
import { formatDate } from '../../utils/date';

interface TransactionListProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onStorno: (id: string) => Promise<void>;
}

export function TransactionList({ transactions, onEdit, onStorno }: TransactionListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'recette' | 'depense'>('all');
    const [stornoDialog, setStornoDialog] = useState<{ isOpen: boolean; transaction: Transaction | null; isLoading: boolean }>({
        isOpen: false,
        transaction: null,
        isLoading: false,
    });
    const [alertDialog, setAlertDialog] = useState<{ isOpen: boolean; title: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
    });

    // Créer un map pour vérifier rapidement si une transaction a été annulée
    const transactionsAnnulees = useMemo(() => {
        const annulees = new Set<string>();
        transactions.forEach(t => {
            if (t.estStorno && t.transactionIdOrigine) {
                annulees.add(t.transactionIdOrigine);
            }
        });
        return annulees;
    }, [transactions]);

    const filteredTransactions = transactions.filter((t) => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.categorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.fournisseurBeneficiaire?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = filterType === 'all' || t.type === filterType;

        return matchesSearch && matchesType;
    });

    const handleStornoClick = (transaction: Transaction) => {
        // Vérifier si la transaction peut être annulée
        if (transaction.estStorno) {
            setAlertDialog({
                isOpen: true,
                title: 'Action impossible',
                message: 'Impossible d\'annuler une transaction STORNO.',
                type: 'warning',
            });
            return;
        }

        if (transactionsAnnulees.has(transaction.id)) {
            setAlertDialog({
                isOpen: true,
                title: 'Transaction déjà annulée',
                message: 'Cette transaction a déjà été annulée par un STORNO.',
                type: 'info',
            });
            return;
        }

        setStornoDialog({
            isOpen: true,
            transaction,
            isLoading: false,
        });
    };

    const handleStornoConfirm = async () => {
        if (stornoDialog.transaction) {
            setStornoDialog(prev => ({ ...prev, isLoading: true }));
            try {
                await onStorno(stornoDialog.transaction.id);
                // Le dialog sera fermé après le succès dans la page parent
                // On attend un peu pour que l'utilisateur voie le feedback
                setTimeout(() => {
                    setStornoDialog({ isOpen: false, transaction: null, isLoading: false });
                }, 500);
            } catch (error) {
                setStornoDialog(prev => ({ ...prev, isLoading: false }));
                // L'erreur sera gérée par la page parent
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={filterType === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilterType('all')}
                        size="sm"
                    >
                        Toutes
                    </Button>
                    <Button
                        variant={filterType === 'recette' ? 'default' : 'outline'}
                        onClick={() => setFilterType('recette')}
                        size="sm"
                    >
                        Recettes
                    </Button>
                    <Button
                        variant={filterType === 'depense' ? 'default' : 'outline'}
                        onClick={() => setFilterType('depense')}
                        size="sm"
                    >
                        Dépenses
                    </Button>
                </div>
            </div>

            {/* Tableau */}
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
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Montant
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Paiement
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                        Aucune transaction trouvée
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((transaction) => {
                                    const estAnnulee = transactionsAnnulees.has(transaction.id);
                                    const estStorno = transaction.estStorno;
                                    const peutEtreAnnulee = !estStorno && !estAnnulee;

                                    return (
                                        <tr 
                                            key={transaction.id} 
                                            className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                                estStorno ? 'opacity-60 bg-gray-50 dark:bg-gray-800' : ''
                                            } ${estAnnulee ? 'line-through opacity-50' : ''}`}
                                        >
                                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                                                {formatDate(transaction.date)}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <div className={`font-medium ${estStorno ? 'text-orange-600 dark:text-orange-400' : ''}`}>
                                                    {transaction.description}
                                                    {estStorno && (
                                                        <span className="ml-2 text-xs text-orange-600 dark:text-orange-400 font-semibold">
                                                            (STORNO)
                                                        </span>
                                                    )}
                                                </div>
                                                {transaction.fournisseurBeneficiaire && (
                                                    <div className="text-xs text-gray-500">
                                                        {transaction.fournisseurBeneficiaire}
                                                    </div>
                                                )}
                                                {estAnnulee && !estStorno && (
                                                    <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                        ⚠ Annulée par STORNO
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {transaction.categorie}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${transaction.type === 'recette'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                        }`}
                                                >
                                                    {transaction.type === 'recette' ? 'Recette' : 'Dépense'}
                                                </span>
                                            </td>
                                            <td className={`px-4 py-3 text-sm font-medium text-right ${transaction.type === 'recette' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {transaction.type === 'recette' ? '+' : '-'} {formatMontant(transaction.montant)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center">
                                                <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
                                                    {transaction.moyenPaiement === 'especes' ? 'Espèces' : 'Banque'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                                                <div className="flex justify-end gap-2">
                                                    {!estStorno && (
                                                        <button
                                                            onClick={() => onEdit(transaction)}
                                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                            title="Modifier"
                                                            disabled={estAnnulee}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {peutEtreAnnulee && (
                                                        <button
                                                            onClick={() => handleStornoClick(transaction)}
                                                            className="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300"
                                                            title="Annuler (STORNO)"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Résumé */}
            {filteredTransactions.length > 0 && (
                <div className="flex justify-end gap-8 text-sm font-medium">
                    <div className="text-green-600">
                        Total Recettes: {formatMontant(
                            filteredTransactions
                                .filter((t) => t.type === 'recette' && !t.estStorno)
                                .reduce((sum, t) => sum + t.montant, 0)
                        )}
                    </div>
                    <div className="text-red-600">
                        Total Dépenses: {formatMontant(
                            filteredTransactions
                                .filter((t) => t.type === 'depense' && !t.estStorno)
                                .reduce((sum, t) => sum + t.montant, 0)
                        )}
                    </div>
                </div>
            )}

            {/* Dialog de confirmation STORNO */}
            {stornoDialog.transaction && (
                <ConfirmDialog
                    isOpen={stornoDialog.isOpen}
                    onClose={() => !stornoDialog.isLoading && setStornoDialog({ isOpen: false, transaction: null, isLoading: false })}
                    onConfirm={handleStornoConfirm}
                    title="Annuler la transaction (STORNO)"
                    message="Êtes-vous sûr de vouloir annuler cette transaction ?"
                    variant="warning"
                    confirmText="Confirmer l'annulation"
                    cancelText="Annuler"
                    isLoading={stornoDialog.isLoading}
                    details={
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Description :</span>
                                <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                                    "{stornoDialog.transaction.description}"
                                </p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Montant :</span>
                                <p className={`text-lg font-bold mt-1 ${
                                    stornoDialog.transaction.type === 'recette' 
                                        ? 'text-green-600 dark:text-green-400' 
                                        : 'text-red-600 dark:text-red-400'
                                }`}>
                                    {stornoDialog.transaction.type === 'recette' ? '+' : '-'} {formatMontant(stornoDialog.transaction.montant)}
                                </p>
                            </div>
                            {stornoDialog.transaction.categorie && (
                                <div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Catégorie :</span>
                                    <p className="text-base text-gray-900 dark:text-gray-100 mt-1">
                                        {stornoDialog.transaction.categorie}
                                    </p>
                                </div>
                            )}
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                    ℹ️ Une écriture inverse sera créée pour annuler cette transaction conformément aux principes comptables.
                                </p>
                            </div>
                        </div>
                    }
                />
            )}

            {/* Dialog d'alerte */}
            <AlertDialog
                isOpen={alertDialog.isOpen}
                onClose={() => setAlertDialog({ isOpen: false, title: '', message: '', type: 'info' })}
                title={alertDialog.title}
                message={alertDialog.message}
                type={alertDialog.type}
            />
        </div>
    );
}
