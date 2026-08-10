# Instructions pour Claude Code

- Ne jamais lancer le serveur/client (`npm run dev`, `npm start`, `npm run build` en watch, ou toute commande qui démarre un process qui reste actif) sauf demande explicite. L'utilisateur lance et teste lui-même l'UI dans son navigateur.
- Pour vérifier que le code compile, utiliser `npm run typecheck` et `npm run lint` plutôt que de démarrer le serveur.
