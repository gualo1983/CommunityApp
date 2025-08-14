import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthProvider';

// Definizione di un'interfaccia per il profilo utente esteso.
interface CustomUser {
  primo_login: boolean;
}

export const AuthRedirector = () => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const currentRouteGroup = segments[0];
        const isAuthGroup = currentRouteGroup === '(auth)';
        const isTabsGroup = currentRouteGroup === '(tabs)';

        // ==========================================================
        // Caso 1: L'utente è autenticato
        // ==========================================================
        if (isAuthenticated) {
            const fullUser = user as unknown as CustomUser;
            
            if (fullUser && fullUser.primo_login) {
                // L'utente si è autenticato per la prima volta.
                // Reindirizza a PersonalDataPage solo se non si trova già lì.
                if (currentRouteGroup !== 'PersonalDataPage') {
                    router.replace('/PersonalDataPage');
                }
            } else if (isAuthGroup) {
                // Utente autenticato, ma non è il primo accesso.
                // Lo reindirizza in homepage.
                router.replace('/(tabs)');
            }
        }
        // ==========================================================
        // Caso 2: L'utente non è autenticato (anonimo)
        // ==========================================================
        else {
            // Reindirizza l'utente anonimo al login se sta provando ad accedere a rotte private.
            if (!isAuthGroup && !isTabsGroup) {
                router.replace('/(auth)/login');
            }
        }
    }, [isAuthenticated, user, isLoading, segments, router]);

    return null;
};
