interface ArchimonsterUpdatedByProps {
  pseudo: string | null;
  className?: string;
}

// Pseudo de l'auteur de la dernière mise à jour, mis en couleur pour le
// repérer d'un coup d'œil dans les cartes/le détail.
export function ArchimonsterUpdatedBy({ pseudo, className }: ArchimonsterUpdatedByProps) {
  if (!pseudo) return null;

  return (
    <span className={`font-medium text-violet-600 dark:text-violet-400 ${className ?? ""}`}>
      {pseudo}
    </span>
  );
}
