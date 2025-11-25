// Page Tableau de bord (Dashboard)
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';

export function Dashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
                <p className="text-muted-foreground">
                    Vue d'ensemble de votre activité comptable
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Solde Caisse</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0 Ar</div>
                        <p className="text-xs text-muted-foreground">Espèces disponibles</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Solde Banque</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0 Ar</div>
                        <p className="text-xs text-muted-foreground">Compte bancaire</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recettes du mois</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">0 Ar</div>
                        <p className="text-xs text-muted-foreground">Total des recettes</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dépenses du mois</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">0 Ar</div>
                        <p className="text-xs text-muted-foreground">Total des dépenses</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
