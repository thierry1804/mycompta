// Composant pour ajouter une transaction (Recette ou Dépense)
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button, Input, Label, Select } from '../ui';
import type { Transaction } from '../../types';
import { CATEGORIES_RECETTES_DEFAULT, CATEGORIES_DEPENSES_DEFAULT } from '../../utils/categories';
import { getCurrentDateISO } from '../../utils/date';
import { useApp } from '../../contexts/AppContext';

interface TransactionFormProps {
    type: 'recette' | 'depense';
    onSubmit: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
    onCancel: () => void;
    initialData?: Partial<Transaction>;
}

export function TransactionForm({ type, onSubmit, onCancel, initialData }: TransactionFormProps) {
    const { exerciceCourant } = useApp();
    const [formData, setFormData] = useState({
        date: initialData?.date || getCurrentDateISO(),
        description: initialData?.description || '',
        montant: initialData?.montant || 0,
        categorie: initialData?.categorie || '',
        moyenPaiement: initialData?.moyenPaiement || 'especes' as 'especes' | 'banque',
        fournisseurBeneficiaire: initialData?.fournisseurBeneficiaire || '',
        numeroPiece: initialData?.numeroPiece || '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = type === 'recette'
        ? CATEGORIES_RECETTES_DEFAULT
        : CATEGORIES_DEPENSES_DEFAULT;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'montant' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!exerciceCourant) {
            alert('Aucun exercice comptable actif');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                ...formData,
                type,
                exerciceId: exerciceCourant.id,
            });
            onCancel();
        } catch (error) {
            console.error('Error submitting transaction:', error);
            alert('Erreur lors de l\'enregistrement de la transaction');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold">
                        {type === 'recette' ? 'Nouvelle Recette' : 'Nouvelle Dépense'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date *</Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="montant">Montant (Ar) *</Label>
                            <Input
                                id="montant"
                                name="montant"
                                type="number"
                                value={formData.montant}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description *</Label>
                            <Input
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder={type === 'recette' ? 'Ex: Vente de produits' : 'Ex: Achat de fournitures'}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categorie">Catégorie *</Label>
                            <Select
                                id="categorie"
                                name="categorie"
                                value={formData.categorie}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Sélectionner...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.nom}>
                                        {cat.nom}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="moyenPaiement">Moyen de paiement *</Label>
                            <Select
                                id="moyenPaiement"
                                name="moyenPaiement"
                                value={formData.moyenPaiement}
                                onChange={handleChange}
                                required
                            >
                                <option value="especes">Espèces</option>
                                <option value="banque">Banque</option>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fournisseurBeneficiaire">
                                {type === 'recette' ? 'Client' : 'Fournisseur'}
                            </Label>
                            <Input
                                id="fournisseurBeneficiaire"
                                name="fournisseurBeneficiaire"
                                value={formData.fournisseurBeneficiaire}
                                onChange={handleChange}
                                placeholder={type === 'recette' ? 'Nom du client' : 'Nom du fournisseur'}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="numeroPiece">N° Pièce justificative</Label>
                            <Input
                                id="numeroPiece"
                                name="numeroPiece"
                                value={formData.numeroPiece}
                                onChange={handleChange}
                                placeholder="Ex: FAC-001"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
