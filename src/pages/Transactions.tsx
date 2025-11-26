// Page Transactions
import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from '../components/ui';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { TransactionList } from '../components/transactions/TransactionList';
import { useTransactions } from '../hooks/useTransactions';
import { useApp } from '../contexts/AppContext';
import type { Transaction } from '../types';
import { exportTransactionsToCSV } from '../utils/export';

export function Transactions() {
    const {
        transactions,
        isLoading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
    } = useTransactions();
    const { exerciceCourant } = useApp();

    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState<'recette' | 'depense'>('recette');
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const handleAddClick = (type: 'recette' | 'depense') => {
        setFormType(type);
        setEditingTransaction(null);
        setShowForm(true);
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setFormType(transaction.type);
        setShowForm(true);
    };

    const handleFormSubmit = async (transaction: Omit<Transaction, 'id'>) => {
        if (editingTransaction) {
            await updateTransaction(editingTransaction.id, transaction);
        } else {
            await addTransaction(transaction);
        }
        setShowForm(false);
        setEditingTransaction(null);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingTransaction(null);
    };

    const handleDelete = async (id: string) => {
        await deleteTransaction(id);
    };

    const handleExport = () => {
        if (transactions.length === 0) {
            alert('Aucune transaction à exporter');
            return;
        }
        const exercice = exerciceCourant?.annee || 'export';
        exportTransactionsToCSV(transactions, `transactions_${exercice}.csv`);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
                    <p className="text-muted-foreground">
                        Gérez vos recettes et dépenses
                    </p>
                </div>
                <div className="text-center py-12 text-muted-foreground">
                    Chargement...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
                    <p className="text-muted-foreground">
                        Gérez vos recettes et dépenses
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {transactions.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            className="flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Exporter </span>CSV
                        </Button>
                    )}
                    <Button
                        onClick={() => handleAddClick('recette')}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Plus className="w-4 h-4" />
                        Recette
                    </Button>
                    <Button
                        onClick={() => handleAddClick('depense')}
                        variant="destructive"
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Dépense
                    </Button>
                </div>
            </div>

            {transactions.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                    <p className="text-muted-foreground mb-4">
                        Aucune transaction enregistrée
                    </p>
                    <div className="flex gap-2 justify-center">
                        <Button
                            onClick={() => handleAddClick('recette')}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Plus className="w-4 h-4" />
                            Ajouter une recette
                        </Button>
                        <Button
                            onClick={() => handleAddClick('depense')}
                            variant="destructive"
                            className="flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Ajouter une dépense
                        </Button>
                    </div>
                </div>
            ) : (
                <TransactionList
                    transactions={transactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {showForm && (
                <TransactionForm
                    type={formType}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    initialData={editingTransaction || undefined}
                />
            )}
        </div>
    );
}
