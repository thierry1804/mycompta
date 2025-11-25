// Page Aide et Documentation
import { useState } from 'react';
import { HelpCircle, BookOpen, FileQuestion, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';

interface FAQItem {
    question: string;
    answer: string;
}

interface GlossaryItem {
    term: string;
    definition: string;
}

const faqs: FAQItem[] = [
    {
        question: "Comment ajouter une transaction ?",
        answer: "Allez dans la page 'Transactions', puis cliquez sur le bouton 'Recette' ou 'Dépense' selon le type de transaction. Remplissez le formulaire avec les informations requises (date, montant, description, catégorie) et cliquez sur 'Enregistrer'."
    },
    {
        question: "Comment consulter mes états financiers ?",
        answer: "Rendez-vous dans la page 'États Financiers'. Vous y trouverez le Bilan Simplifié et le Compte de Résultat conformes au PCG 2005. Vous pouvez basculer entre les deux onglets et exporter les données en CSV."
    },
    {
        question: "Comment créer un nouvel exercice comptable ?",
        answer: "Allez dans 'Paramètres', puis dans l'onglet 'Exercices'. Cliquez sur 'Créer un nouvel exercice'. L'exercice sera créé automatiquement pour l'année suivante."
    },
    {
        question: "Comment clôturer un exercice ?",
        answer: "Dans 'Paramètres' > 'Exercices', cliquez sur le bouton 'Clôturer' de l'exercice concerné. Attention : cette action est irréversible !"
    },
    {
        question: "Quelle est la différence entre Caisse et Banque ?",
        answer: "La Caisse représente les espèces (argent liquide) tandis que la Banque représente votre compte bancaire. Chaque transaction doit être associée à l'un ou l'autre moyen de paiement."
    },
    {
        question: "Comment exporter mes données ?",
        answer: "Vous pouvez exporter vos transactions en CSV depuis la page 'Transactions' en cliquant sur 'Export CSV'. Les états financiers peuvent également être exportés en CSV depuis la page 'États Financiers'."
    },
    {
        question: "Mes données sont-elles sauvegardées ?",
        answer: "Oui, toutes vos données sont automatiquement sauvegardées dans le stockage local de votre navigateur. Elles persistent même après fermeture du navigateur."
    },
    {
        question: "Qu'est-ce que le PCG 2005 ?",
        answer: "Le Plan Comptable Général 2005 est le référentiel comptable officiel à Madagascar. Cette application respecte ses normes pour les micro et petites entreprises."
    },
];

const glossary: GlossaryItem[] = [
    {
        term: "Actif",
        definition: "Ensemble des biens et créances que possède l'entreprise (immobilisations, stocks, créances, trésorerie)."
    },
    {
        term: "Passif",
        definition: "Ensemble des ressources de l'entreprise (capitaux propres, dettes)."
    },
    {
        term: "Bilan",
        definition: "Document comptable qui présente la situation patrimoniale de l'entreprise à une date donnée. Il se compose de l'actif et du passif."
    },
    {
        term: "Compte de Résultat",
        definition: "Document comptable qui présente les produits et les charges de l'exercice, permettant de déterminer le résultat (bénéfice ou perte)."
    },
    {
        term: "Exercice comptable",
        definition: "Période de 12 mois pour laquelle l'entreprise établit ses comptes. Généralement du 1er janvier au 31 décembre."
    },
    {
        term: "Recette",
        definition: "Entrée d'argent dans l'entreprise (ventes, prestations de services, etc.)."
    },
    {
        term: "Dépense",
        definition: "Sortie d'argent de l'entreprise (achats, charges, salaires, etc.)."
    },
    {
        term: "Trésorerie",
        definition: "Ensemble des disponibilités de l'entreprise (caisse + banque)."
    },
    {
        term: "Livre de Caisse",
        definition: "Registre qui enregistre chronologiquement tous les mouvements d'espèces."
    },
    {
        term: "Livre de Banque",
        definition: "Registre qui enregistre chronologiquement tous les mouvements bancaires."
    },
    {
        term: "SMT",
        definition: "Système Minimal de Trésorerie - Méthode simplifiée de suivi de la trésorerie pour les MPE."
    },
    {
        term: "NIF",
        definition: "Numéro d'Identification Fiscale - Identifiant fiscal unique de l'entreprise."
    },
    {
        term: "STAT",
        definition: "Numéro statistique délivré par l'INSTAT (Institut National de la Statistique)."
    },
    {
        term: "Capitaux propres",
        definition: "Ressources appartenant aux propriétaires de l'entreprise (capital + résultats)."
    },
    {
        term: "Amortissement",
        definition: "Constatation comptable de la dépréciation d'un bien immobilisé."
    },
];

function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="space-y-3">
            {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="font-medium">{faq.question}</span>
                        {openIndex === index ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                    </button>
                    {openIndex === index && (
                        <div className="px-4 pb-4 text-muted-foreground">
                            {faq.answer}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export function Aide() {
    const [activeTab, setActiveTab] = useState<'faq' | 'glossaire' | 'guide'>('faq');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Aide & Documentation</h2>
                <p className="text-muted-foreground">
                    Guide d'utilisation et glossaire comptable
                </p>
            </div>

            {/* Onglets */}
            <div className="border-b">
                <nav className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('faq')}
                        className={`pb-4 px-2 border-b-2 transition-colors ${activeTab === 'faq'
                                ? 'border-primary text-primary font-medium'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <HelpCircle className="w-4 h-4 inline mr-2" />
                        FAQ
                    </button>
                    <button
                        onClick={() => setActiveTab('glossaire')}
                        className={`pb-4 px-2 border-b-2 transition-colors ${activeTab === 'glossaire'
                                ? 'border-primary text-primary font-medium'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <BookOpen className="w-4 h-4 inline mr-2" />
                        Glossaire
                    </button>
                    <button
                        onClick={() => setActiveTab('guide')}
                        className={`pb-4 px-2 border-b-2 transition-colors ${activeTab === 'guide'
                                ? 'border-primary text-primary font-medium'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <FileQuestion className="w-4 h-4 inline mr-2" />
                        Guide
                    </button>
                </nav>
            </div>

            {/* FAQ */}
            {activeTab === 'faq' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Questions Fréquentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FAQSection />
                    </CardContent>
                </Card>
            )}

            {/* Glossaire */}
            {activeTab === 'glossaire' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Glossaire Comptable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {glossary.map((item, index) => (
                                <div key={index} className="border-l-4 border-primary pl-4">
                                    <h4 className="font-bold text-lg mb-1">{item.term}</h4>
                                    <p className="text-sm text-muted-foreground">{item.definition}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Guide d'utilisation */}
            {activeTab === 'guide' && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Démarrage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p><strong>Configuration initiale :</strong> Lors du premier lancement, remplissez les informations de votre entreprise (nom, forme juridique, NIF, STAT, etc.) et définissez le capital initial.</p>
                            <p><strong>Exercice comptable :</strong> Un premier exercice est automatiquement créé. Vous pouvez en créer d'autres depuis les Paramètres.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>2. Gestion des Transactions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p><strong>Ajouter une recette :</strong> Cliquez sur le bouton vert "Recette", remplissez le formulaire (date, montant, description, catégorie, moyen de paiement).</p>
                            <p><strong>Ajouter une dépense :</strong> Cliquez sur le bouton rouge "Dépense" et procédez de la même manière.</p>
                            <p><strong>Modifier/Supprimer :</strong> Utilisez les icônes dans le tableau des transactions.</p>
                            <p><strong>Filtrer :</strong> Utilisez la barre de recherche et les boutons de filtrage par type.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>3. Trésorerie (SMT)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p><strong>Livre de Caisse :</strong> Consultez tous les mouvements en espèces avec le solde cumulé.</p>
                            <p><strong>Livre de Banque :</strong> Consultez tous les mouvements bancaires avec le solde cumulé.</p>
                            <p><strong>Graphiques :</strong> Visualisez l'évolution de votre trésorerie sur le mois en cours.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>4. États Financiers</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p><strong>Bilan Simplifié :</strong> Consultez votre situation patrimoniale (Actif/Passif).</p>
                            <p><strong>Compte de Résultat :</strong> Consultez vos produits, charges et résultat.</p>
                            <p><strong>Conformité :</strong> Tous les états sont conformes au PCG 2005 Madagascar.</p>
                            <p><strong>Export :</strong> Exportez en CSV pour analyse externe.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>5. Paramètres</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p><strong>Entreprise :</strong> Modifiez les informations de votre entreprise à tout moment.</p>
                            <p><strong>Exercices :</strong> Créez de nouveaux exercices, activez ou clôturez des exercices.</p>
                            <p><strong>Important :</strong> La clôture d'un exercice est irréversible !</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                        <CardContent className="p-4">
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                                <strong>Conseil :</strong> Enregistrez vos transactions régulièrement pour un suivi optimal de votre comptabilité.
                                Pensez à exporter vos données périodiquement pour sauvegarder vos informations.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
