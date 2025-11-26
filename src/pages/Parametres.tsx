// Page Paramètres
import { useState } from 'react';
import { Building2, Calendar, Tag, Save } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select } from '../components/ui';
import { useApp } from '../contexts/AppContext';
import type { EntrepriseInfo, Exercice } from '../types';
import { formatDate } from '../utils/date';

export function Parametres() {
    const { entrepriseInfo, setEntrepriseInfo, exercices, setExercices, exerciceCourant, setExerciceCourant } = useApp();
    const [activeTab, setActiveTab] = useState<'entreprise' | 'exercices' | 'categories'>('entreprise');
    const [formData, setFormData] = useState<Partial<EntrepriseInfo>>(entrepriseInfo || {});
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'capitalInitial' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSaveEntreprise = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await setEntrepriseInfo(formData as EntrepriseInfo);
            alert('Informations enregistrées avec succès !');
        } catch (error) {
            console.error('Error saving entreprise info:', error);
            alert('Erreur lors de l\'enregistrement');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateExercice = async () => {
        const annee = new Date().getFullYear() + 1;
        const newExercice: Exercice = {
            id: `ex-${annee}`,
            annee,
            dateDebut: `${annee}-01-01`,
            dateFin: `${annee}-12-31`,
            cloture: false,
            soldeOuvertureCaisse: 0,
            soldeOuvertureBanque: 0,
        };

        const updated = [...exercices, newExercice];
        await setExercices(updated);
        alert(`Exercice ${annee} créé avec succès !`);
    };

    const handleClotureExercice = async (exerciceId: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir clôturer cet exercice ? Cette action est irréversible.')) {
            return;
        }

        const updated = exercices.map((ex) =>
            ex.id === exerciceId ? { ...ex, cloture: true } : ex
        );
        await setExercices(updated);
        alert('Exercice clôturé avec succès !');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
                <p className="text-muted-foreground">
                    Configuration de l'entreprise et de l'application
                </p>
            </div>

            {/* Onglets */}
            <div className="border-b">
                <nav className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('entreprise')}
                        className={`pb-4 px-2 border-b-2 transition-colors ${activeTab === 'entreprise'
                                ? 'border-primary text-primary font-medium'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Building2 className="w-4 h-4 inline mr-2" />
                        Entreprise
                    </button>
                    <button
                        onClick={() => setActiveTab('exercices')}
                        className={`pb-4 px-2 border-b-2 transition-colors ${activeTab === 'exercices'
                                ? 'border-primary text-primary font-medium'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Exercices
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`pb-4 px-2 border-b-2 transition-colors ${activeTab === 'categories'
                                ? 'border-primary text-primary font-medium'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Tag className="w-4 h-4 inline mr-2" />
                        Catégories
                    </button>
                </nav>
            </div>

            {/* Contenu des onglets */}
            {activeTab === 'entreprise' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Informations de l'entreprise</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSaveEntreprise} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nom">Nom de l'entreprise *</Label>
                                    <Input
                                        id="nom"
                                        name="nom"
                                        value={formData.nom || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="formeJuridique">Forme juridique *</Label>
                                    <Select
                                        id="formeJuridique"
                                        name="formeJuridique"
                                        value={formData.formeJuridique || ''}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Sélectionner...</option>
                                        <option value="SARL">SARL</option>
                                        <option value="SA">SA</option>
                                        <option value="EURL">EURL</option>
                                        <option value="Entreprise Individuelle">Entreprise Individuelle</option>
                                        <option value="Autre">Autre</option>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nif">NIF</Label>
                                    <Input
                                        id="nif"
                                        name="nif"
                                        value={formData.nif || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stat">STAT</Label>
                                    <Input
                                        id="stat"
                                        name="stat"
                                        value={formData.stat || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="adresse">Adresse</Label>
                                    <Input
                                        id="adresse"
                                        name="adresse"
                                        value={formData.adresse || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telephone">Téléphone</Label>
                                    <Input
                                        id="telephone"
                                        name="telephone"
                                        value={formData.telephone || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="capitalInitial">Capital initial (Ar)</Label>
                                    <Input
                                        id="capitalInitial"
                                        name="capitalInitial"
                                        type="number"
                                        value={formData.capitalInitial || 0}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSaving}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'exercices' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Exercices comptables</h3>
                        <Button onClick={handleCreateExercice}>
                            Créer un nouvel exercice
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {exercices.map((exercice) => (
                            <Card key={exercice.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-xl font-bold">Exercice {exercice.annee}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Du {formatDate(exercice.dateDebut)} au {formatDate(exercice.dateFin)}
                                            </p>
                                            <div className="mt-2 flex gap-4 text-sm">
                                                <span>Solde ouverture caisse: {exercice.soldeOuvertureCaisse} Ar</span>
                                                <span>Solde ouverture banque: {exercice.soldeOuvertureBanque} Ar</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {exercice.cloture ? (
                                                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                                                    Clôturé
                                                </span>
                                            ) : (
                                                <>
                                                    {exerciceCourant?.id === exercice.id && (
                                                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                                                            En cours
                                                        </span>
                                                    )}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setExerciceCourant(exercice)}
                                                        disabled={exerciceCourant?.id === exercice.id}
                                                    >
                                                        Activer
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleClotureExercice(exercice.id)}
                                                    >
                                                        Clôturer
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'categories' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Gestion des catégories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12 text-muted-foreground">
                            <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>La gestion des catégories personnalisées sera disponible prochainement.</p>
                            <p className="text-sm mt-2">Les catégories par défaut du PCG 2005 sont déjà disponibles.</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
