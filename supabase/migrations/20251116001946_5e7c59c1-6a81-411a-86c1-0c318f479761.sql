-- Ajouter les colonnes manquantes à la table motivation_messages
ALTER TABLE motivation_messages 
ADD COLUMN IF NOT EXISTS nom TEXT,
ADD COLUMN IF NOT EXISTS niveau TEXT CHECK (niveau IN ('Faible', 'Moyen', 'Élevé')),
ADD COLUMN IF NOT EXISTS objectif TEXT;

-- Renommer la colonne content en message pour plus de clarté
ALTER TABLE motivation_messages 
RENAME COLUMN content TO message;