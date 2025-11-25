// Page Onboarding (Configuration initiale)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select } from '../components/ui';
import { useApp } from '../contexts/AppContext';
import type { EntrepriseInfo, Exercice } from '../types';
import { getCurrentDateISO } from '../utils/date';

export function Onboarding() {
    const navigate = useNavigate();
    const { setEntrepriseInfo, setExercices, setExerciceCourant, setFirstLaunch } = useApp();
    const [formData, setFormData] = useState<Partial<EntrepriseInfo>>({
        nom: '',
        formeJuridique: '',
        nif: '',
        stat: '',
        adresse: '',
        telephone: '',
        email: '',
        dateDebutExercice: getCurrentDateISO(),
        capitalInitial: 0,
        devise: 'Ar',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'capitalInitial' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Créer l'entreprise
        const entreprise: EntrepriseInfo = formData as EntrepriseInfo;
        await setEntrepriseInfo(entreprise);

        // Créer le premier exercice
        const annee = new Date(formData.dateDebutExercice!).getFullYear();
        const exercice: Exercice = {
            id: `ex-${annee}`,
            annee,
            dateDebut: formData.dateDebutExercice!,
            dateFin: `${annee}-12-31`,
            cloture: false,
            soldeOuvertureCaisse: 0,
            soldeOuvertureBanque: formData.capitalInitial || 0,
        };
        await setExercices([exercice]);
        await setExerciceCourant(exercice);
        await setFirstLaunch(false);

        // Rediriger vers le dashboard
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Building2 className="w-16 h-16 text-primary" />
                    </div>
                    <CardTitle className="text-3xl">Bienvenue dans Compta MPE</CardTitle>
                    <p className="text-muted-foreground mt-2">
                        Configurons votre entreprise pour commencer
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="nom">Nom de l'entreprise *</Label>
                                <Input
                                    id="nom"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: SARL FITIAVANA"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="formeJuridique">Forme juridique *</Label>
                                <Select
                                    id="formeJuridique"
                                    name="formeJuridique"
                                    value={formData.formeJuridique}
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
                                    value={formData.nif}
                                    onChange={handleChange}
                                    placeholder="Ex: 1234567890"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stat">STAT</Label>
                                <Input
                                    id="stat"
                                    name="stat"
                                    value={formData.stat}
                                    onChange={handleChange}
                                    placeholder="Ex: 12345678901234"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="adresse">Adresse</Label>
                                <Input
                                    id="adresse"
                                    name="adresse"
                                    value={formData.adresse}
                                    onChange={handleChange}
                                    placeholder="Ex: Lot II A 123 Antananarivo"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telephone">Téléphone</Label>
                                <Input
                                    id="telephone"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    placeholder="Ex: 034 12 345 67"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Ex: contact@entreprise.mg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dateDebutExercice">Date de début d'exercice *</Label>
                                <Input
                                    id="dateDebutExercice"
                                    name="dateDebutExercice"
                                    type="date"
                                    value={formData.dateDebutExercice}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="capitalInitial">Capital initial (Ar)</Label>
                                <Input
                                    id="capitalInitial"
                                    name="capitalInitial"
                                    type="number"
                                    value={formData.capitalInitial}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="submit" size="lg">
                                Commencer
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
