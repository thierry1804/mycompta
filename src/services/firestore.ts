// Service Firestore pour remplacer le stockage local
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp,
    type DocumentData,
    type QuerySnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Transaction, EntrepriseInfo, Exercice, AppSettings } from '../types';

// Collection names
const COLLECTIONS = {
    ENTREPRISE: 'entreprise',
    EXERCICES: 'exercices',
    TRANSACTIONS: 'transactions',
    SETTINGS: 'settings',
} as const;

// Helper pour convertir les dates Firestore
function convertTimestamps(data: DocumentData): any {
    if (!data || typeof data !== 'object') return data;
    
    const converted = { ...data };
    for (const key in converted) {
        if (converted[key] instanceof Timestamp) {
            converted[key] = converted[key].toDate().toISOString();
        } else if (Array.isArray(converted[key])) {
            converted[key] = converted[key].map(convertTimestamps);
        } else if (typeof converted[key] === 'object' && converted[key] !== null) {
            converted[key] = convertTimestamps(converted[key]);
        }
    }
    return converted;
}

// Helper pour convertir les dates en Timestamp Firestore
function prepareDataForFirestore(data: any): any {
    if (!data || typeof data !== 'object') return data;
    
    const prepared = { ...data };
    for (const key in prepared) {
        if (typeof prepared[key] === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(prepared[key])) {
            // C'est une date ISO string, la convertir en Timestamp
            prepared[key] = Timestamp.fromDate(new Date(prepared[key]));
        } else if (Array.isArray(prepared[key])) {
            prepared[key] = prepared[key].map(prepareDataForFirestore);
        } else if (typeof prepared[key] === 'object' && prepared[key] !== null) {
            prepared[key] = prepareDataForFirestore(prepared[key]);
        }
    }
    return prepared;
}

// Service Firestore
class FirestoreService {
    // Entreprise Info
    async getEntrepriseInfo(): Promise<EntrepriseInfo | null> {
        try {
            const docRef = doc(db, COLLECTIONS.ENTREPRISE, 'info');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return convertTimestamps(docSnap.data()) as EntrepriseInfo;
            }
            return null;
        } catch (error) {
            console.error('Error getting entreprise info:', error);
            return null;
        }
    }

    async setEntrepriseInfo(info: EntrepriseInfo): Promise<void> {
        try {
            const docRef = doc(db, COLLECTIONS.ENTREPRISE, 'info');
            await setDoc(docRef, prepareDataForFirestore(info), { merge: true });
        } catch (error) {
            console.error('Error setting entreprise info:', error);
            throw error;
        }
    }

    // Exercices
    async getExercices(): Promise<Exercice[]> {
        try {
            const q = query(
                collection(db, COLLECTIONS.EXERCICES),
                orderBy('annee', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...convertTimestamps(doc.data()),
            })) as Exercice[];
        } catch (error) {
            console.error('Error getting exercices:', error);
            return [];
        }
    }

    async addExercice(exercice: Exercice): Promise<void> {
        try {
            const docRef = doc(db, COLLECTIONS.EXERCICES, exercice.id);
            await setDoc(docRef, prepareDataForFirestore(exercice));
        } catch (error) {
            console.error('Error adding exercice:', error);
            throw error;
        }
    }

    async updateExercice(exercice: Exercice): Promise<void> {
        try {
            const docRef = doc(db, COLLECTIONS.EXERCICES, exercice.id);
            await setDoc(docRef, prepareDataForFirestore(exercice), { merge: true });
        } catch (error) {
            console.error('Error updating exercice:', error);
            throw error;
        }
    }

    async deleteExercice(exerciceId: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTIONS.EXERCICES, exerciceId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting exercice:', error);
            throw error;
        }
    }

    // Transactions
    async getTransactions(exerciceId?: string): Promise<Transaction[]> {
        try {
            let q;
            if (exerciceId) {
                // Note: Cette requête nécessite un index composite dans Firestore
                // Firestore créera automatiquement un lien pour créer l'index si nécessaire
                q = query(
                    collection(db, COLLECTIONS.TRANSACTIONS),
                    where('exerciceId', '==', exerciceId),
                    orderBy('date', 'desc')
                );
            } else {
                q = query(
                    collection(db, COLLECTIONS.TRANSACTIONS),
                    orderBy('date', 'desc')
                );
            }
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...convertTimestamps(doc.data()),
            })) as Transaction[];
        } catch (error: any) {
            // Si l'erreur est liée à un index manquant, on peut essayer sans orderBy
            if (error?.code === 'failed-precondition') {
                console.warn('Index composite manquant. Tentative sans orderBy...');
                try {
                    let q2;
                    if (exerciceId) {
                        q2 = query(
                            collection(db, COLLECTIONS.TRANSACTIONS),
                            where('exerciceId', '==', exerciceId)
                        );
                    } else {
                        q2 = collection(db, COLLECTIONS.TRANSACTIONS);
                    }
                    const querySnapshot = await getDocs(q2);
                    const transactions = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...convertTimestamps(doc.data()),
                    })) as Transaction[];
                    // Trier manuellement par date
                    return transactions.sort((a, b) => 
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    );
                } catch (fallbackError) {
                    console.error('Error getting transactions (fallback):', fallbackError);
                    return [];
                }
            }
            console.error('Error getting transactions:', error);
            return [];
        }
    }

    async addTransaction(transaction: Transaction): Promise<void> {
        try {
            const docRef = doc(db, COLLECTIONS.TRANSACTIONS, transaction.id);
            await setDoc(docRef, prepareDataForFirestore(transaction));
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error;
        }
    }

    async updateTransaction(transactionId: string, updates: Partial<Transaction>): Promise<void> {
        try {
            const docRef = doc(db, COLLECTIONS.TRANSACTIONS, transactionId);
            await setDoc(docRef, prepareDataForFirestore(updates), { merge: true });
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    }

    async deleteTransaction(transactionId: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTIONS.TRANSACTIONS, transactionId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    }

    // Subscribe to transactions changes (real-time)
    subscribeToTransactions(
        exerciceId: string | undefined,
        callback: (transactions: Transaction[]) => void
    ): () => void {
        try {
            let q;
            if (exerciceId) {
                q = query(
                    collection(db, COLLECTIONS.TRANSACTIONS),
                    where('exerciceId', '==', exerciceId),
                    orderBy('date', 'desc')
                );
            } else {
                q = query(
                    collection(db, COLLECTIONS.TRANSACTIONS),
                    orderBy('date', 'desc')
                );
            }

            return onSnapshot(
                q,
                (snapshot: QuerySnapshot<DocumentData>) => {
                    const transactions = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...convertTimestamps(doc.data()),
                    })) as Transaction[];
                    callback(transactions);
                },
                (error: any) => {
                    // Si l'erreur est liée à un index manquant, utiliser une requête simplifiée
                    if (error?.code === 'failed-precondition') {
                        console.warn('Index composite manquant. Utilisation d\'une requête simplifiée...');
                        let q2;
                        if (exerciceId) {
                            q2 = query(
                                collection(db, COLLECTIONS.TRANSACTIONS),
                                where('exerciceId', '==', exerciceId)
                            );
                        } else {
                            q2 = collection(db, COLLECTIONS.TRANSACTIONS);
                        }
                        return onSnapshot(q2, (snapshot: QuerySnapshot<DocumentData>) => {
                            const transactions = snapshot.docs.map((doc) => ({
                                id: doc.id,
                                ...convertTimestamps(doc.data()),
                            })) as Transaction[];
                            // Trier manuellement par date
                            const sorted = transactions.sort((a, b) => 
                                new Date(b.date).getTime() - new Date(a.date).getTime()
                            );
                            callback(sorted);
                        });
                    }
                    console.error('Error subscribing to transactions:', error);
                }
            );
        } catch (error) {
            console.error('Error subscribing to transactions:', error);
            return () => {}; // Return empty unsubscribe function
        }
    }

    // Settings
    async getSettings(): Promise<AppSettings | null> {
        try {
            const docRef = doc(db, COLLECTIONS.SETTINGS, 'app');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return convertTimestamps(docSnap.data()) as AppSettings;
            }
            return null;
        } catch (error) {
            console.error('Error getting settings:', error);
            return null;
        }
    }

    async setSettings(settings: AppSettings): Promise<void> {
        try {
            const docRef = doc(db, COLLECTIONS.SETTINGS, 'app');
            await setDoc(docRef, prepareDataForFirestore(settings), { merge: true });
        } catch (error) {
            console.error('Error setting settings:', error);
            throw error;
        }
    }
}

// Instance singleton
export const firestoreService = new FirestoreService();

