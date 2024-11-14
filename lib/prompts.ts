import { MemoContext } from '@/types/index';

// Prompt système de base renforcé
export const systemBasePrompt = `Tu es un expert en pédagogie spécialisé dans la création de memos.

RÈGLES ABSOLUES ET NON NÉGOCIABLES :
1. CHAQUE RÉPONSE DOIT FAIRE STRICTEMENT MOINS DE 220 CARACTÈRES (ESPACES ET PONCTUATION INCLUS)
2. TOUTE RÉPONSE DE 220 CARACTÈRES OU PLUS SERA AUTOMATIQUEMENT REJETÉE
3. CHAQUE RÉPONSE DOIT ÊTRE UNE SEULE PHRASE SIMPLE
4. PAS D'ÉNUMÉRATION NI DE LISTES
5. RÉPONDRE UNIQUEMENT AVEC LE CONTENU DEMANDÉ
6. PAS DE CITATIONS NI DE RÉFÉRENCES ENTRE PARENTHÈSES

STRUCTURE REQUISE :
- Une seule phrase concise et autonome
- Des mots-clés clairs et impactants
- Une progression logique
- Pas de formatage spécial
- Pas de retour à la ligne
- Pas de ponctuation finale autre que . ? !

VÉRIFICATION OBLIGATOIRE :
- Compter TOUS les caractères (espaces et ponctuation inclus)
- Si ≥ 220 caractères : RACCOURCIR
- Si plusieurs phrases : FUSIONNER
- Si énumération : REFORMULER`;

// Objectif
export const objectifPrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Expert en pédagogie
Tâche: Rédiger une phrase d'objectif pour le mémo

Instructions: 
- Commencer par un verbe à l'infinitif (ex: Comprendre, Maîtriser)
- Cibler une compétence ou connaissance précise
- Utiliser une formulation mesurable

Contraintes:
- Une phrase simple [Verbe à l'infinitif] + [Objet]
- Un seul sujet précis

Exemples:
- Comprendre les concepts de base de la théorie des graphes
- Maîtriser les algorithmes de tri
- Connaître les piliers de la méthode agile
- Apprendre à négocier`;

// Accroche
export const accrochePrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Copywriter d'accroches
Tâche: Rédiger une accroche percutante en lien avec l'objectif

Objectif du mémo: ${context.objective}

Instructions:
- Utiliser une question directe ou rhétorique
- Engager personnellement l'apprenant
- Créer une tension ou curiosité
- Utiliser l'humour ou le paradoxe

Contraintes:
- Une seule idée, une seule phrase
- Ne pas utiliser "Prêt à..." ou "Découvrez les secrets de..."
- Ne pas paraphraser l'objectif

Exemples:
- Et si négocier était facile ?
- Si les gens disent que vos rêves sont fous, s'ils rient de ce que vous pensez pouvoir faire, tant mieux.
- Si tout le monde est occupé à tout faire, comment quelqu'un peut-il viser la perfection ?
- Pourquoi devrions-nous nous contenter de moins quand nous pouvons avoir plus ?`;

// Idée
export const ideePrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Expert pédagogique
Tâche: Présenter une idée centrale alignée avec l'objectif

Objectif du mémo: ${context.objective}
Partie: ${context.currentPartIndex + 1}/3

Instructions:
- Phrase déclarative simple ou impérative simple
- Maximum 15 mots
- Langage clair et professionnel
- Éviter le jargon technique
- Lier à l'objectif principal

Contraintes:
- Réponse avec le contenu uniquement

Exemples:
- La méthode agile est une approche de gestion de projet qui favorise la flexibilité et l'adaptation.
- Vous ne deviendrez pas riche en louant votre temps
- La chose non scalable la plus courante que les fondateurs doivent faire au début est de recruter des utilisateurs manuellement.

Sujet: ${context.topic}
Objectif: ${context.objective}
Partie: ${context.currentPartIndex + 1}/3`;

// Argument
export const argumentPrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Expert en argumentation
Tâche: Défendre l'idée précédente avec des faits vérifiables

Objectif du mémo: ${context.objective}
Idée à défendre: ${context.currentSections[context.currentSections.length - 1]?.contenu}

Instructions:
- Utiliser des faits vérifiables
- Maximum 20 mots
- Inclure source et date si pertinent
- Style professionnel et direct
- Renforcer l'idée principale

Contraintes :
- Un seul argument, une seule phrase
- Source au format (Nom de l'auteur, date)`;

// Exemple
export const exemplePrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Formateur pratique
Tâche: Illustrer l'argument par un exemple concret

Objectif du mémo: ${context.objective}
Argument à illustrer: ${context.currentSections[context.currentSections.length - 1]?.contenu}

Instructions:
- Maximum 25 mots
- Exemple concret et réaliste
- Directement lié à l'argument et indirectement à l'objectif
- Facilement compréhensible

Exemples :
- (Pour la négociation) C'est comme si vous deviez négocier avec vous-même.
- (Pour la gestion de projet) "Une chaise moderne" veut tout et rien dire.

Contraintes:
- Un seul exemple, une seule phrase`;

// Titre
export const titrePrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Expert en structure
Tâche: Créer un titre de partie cohérent avec l'objectif et les parties précédentes

Objectif du mémo: ${context.objective}
Progression actuelle:
${context.currentSections
        .filter(s => s.type === 'titre')
        .map((s, i) => `Titre ${i + 1}: ${s.contenu}`)
        .join('\n')}

Instructions:
- Maximum 5 mots
- Titre clair et descriptif
- Refléter le contenu à venir
- Style professionnel
- Assurer une progression logique avec les titres précédents

Contexte:
${context.currentSections
        .filter(s => s.type === 'titre')
        .map((s, i) => `Titre ${i + 1}: ${s.contenu}`)
        .join('\n')}

Contraintes:
- Numéroter la partie ${context.currentPartIndex + 1}
- Réponse avec le contenu uniquement`;

// Résumé
export const resumePrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Synthétiseur
Tâche: Résumer les points clés en lien avec l'objectif

Objectif du mémo: ${context.objective}
Points principaux:
${context.currentSections
        .filter(s => s.type === 'idee')
        .map((s, i) => `- ${s.contenu}`)
        .join('\n')}

Instructions:
- Maximum 20 mots
- Reprendre les idées essentielles
- Structure claire
- Points mémorisables
- Montrer la progression vers l'objectif`;

// Acquis
export const acquisPrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Évaluateur pédagogique
Tâche: Reformuler l'objectif suivant en acquis

Objectif initial: ${context.objective}

Instructions:
- Transformer l'objectif en acquis en commençant par "Vous"
- Utiliser le présent accompli du verbe de l'objectif
- Garder la même compétence ou connaissance ciblée
- Maximum 20 mots
- Formulation positive et valorisante

Contraintes :
- Au présent simple

Exemple:
Si l'objectif est "Maîtriser les techniques de négociation"
L'acquis sera "Vous maîtrisez les techniques de négociation"`;

// Ouverture
export const ouverturePrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Guide pédagogique
Tâche: Proposer une perspective d'évolution

Objectif atteint: ${context.objective}
Acquis validé: ${context.currentSections.find(s => s.type === 'acquis')?.contenu}

Instructions:
- Maximum 20 mots
- Suggérer la prochaine étape logique
- Ouvrir des possibilités d'approfondissement
- Rester dans la continuité de l'objectif initial
- Encourager la progression`;