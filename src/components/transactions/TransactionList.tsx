// Liste des transactions avec tableau
import { useState } from 'react';
import { Pencil, Trash2, Search } from 'lucide-react';
import { Button, Input } from '../ui';
import type { Transaction } from '../../types';
import { formatMontant } from '../../utils/currency';
import { formatDate } from '../../utils/date';

interface TransactionListProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'recette' | 'depense'>('all');

    const filteredTransactions = transactions.filter((t) => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.categorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.fournisseurBeneficiaire?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = filterType === 'all' || t.type === filterType;

        return matchesSearch && matchesType;
    });

    const handleDelete = (id: string, description: string) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer cette transaction ?\n"${description}"`)) {
            onDelete(id);
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
                                filteredTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                                            {formatDate(transaction.date)}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <div className="font-medium">{transaction.description}</div>
                                            {transaction.fournisseurBeneficiaire && (
                                                <div className="text-xs text-gray-500">
                                                    {transaction.fournisseurBeneficiaire}
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
                                                <button
                                                    onClick={() => onEdit(transaction)}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                    title="Modifier"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(transaction.id, transaction.description)}
                                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
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
                                .filter((t) => t.type === 'recette')
                                .reduce((sum, t) => sum + t.montant, 0)
                        )}
                    </div>
                    <div className="text-red-600">
                        Total Dépenses: {formatMontant(
                            filteredTransactions
                                .filter((t) => t.type === 'depense')
                                .reduce((sum, t) => sum + t.montant, 0)
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
