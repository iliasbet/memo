import { MemoContext } from '@/types/index';

const STANDARD_RESPONSE_FORMAT = {
    BASIC: `FORMAT DE RÉPONSE:
Répondez uniquement avec un objet JSON valide contenant les champs suivants:
{
  "contenu": "votre réponse"
}`,
    WITH_TITLE: `FORMAT DE RÉPONSE:
Répondez uniquement avec un objet JSON valide contenant les champs suivants:
{
  "titre": "titre court",
  "contenu": "votre réponse"
}`,
    WITH_DURATION: `FORMAT DE RÉPONSE:
Répondez uniquement avec un objet JSON valide contenant les champs suivants:
{
  "titre": "titre court",
  "duree": "durée en minutes/heures",
  "contenu": "votre réponse"
}`
};

// Prompt système de base
export const systemBasePrompt = `Tu es un expert en pédagogie.

RÈGLES ABSOLUES ET NON NÉGOCIABLES :
1. CHAQUE RÉPONSE DOIT FAIRE STRICTEMENT MOINS DE 400 CARACTÈRES
2. PAS D'ÉNUMÉRATION NI DE LISTES
3. RÉPONDRE UNIQUEMENT AVEC UN OBJET JSON VALIDE
4. PAS DE CITATIONS NI DE RÉFÉRENCES ENTRE PARENTHÈSES
5. NE JAMAIS RÉPÉTER UN MOT-CLÉ PLUS DE DEUX FOIS
6. NE JAMAIS UTILISER LE MÊME TERME QUE DANS LES SECTIONS PRÉCÉDENTES
7. CHAQUE SECTION DOIT APPORTER UN ANGLE NOUVEAU

FORMAT DE RÉPONSE STRICT:
{
    "titre": "Titre optionnel de maximum 50 caractères",
    "contenu": "Contenu obligatoire de maximum 400 caractères",
    "duree": "Format optionnel: X min, X h ou X j"
}

CONTRAINTES TECHNIQUES:
- Répondre avec uniquement l'objet JSON
- Pas de backticks (\`\`\`) ou autres délimiteurs
- Pas de retours à la ligne dans le contenu
- Pas d'échappement de caractères inutile
- Pas de commentaires ou texte additionnel`;


// Objectif
export const objectifPrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Expert en pédagogie
Tâche: Rédiger une phrase d'objectif précise et mesurable pour le mémo

<règles_strictes>
1. OBLIGATION de cibler UNE SEULE compétence spécifique
2. INTERDICTION d'utiliser le pluriel pour la compétence ciblée
3. INTERDICTION d'utiliser "les principes", "les techniques", "les méthodes"
4. OBLIGATION d'utiliser "un principe", "une technique", "une méthode"
</règles_strictes>

<instructions>
- Commencer par un verbe à l'infinitif
- Cibler UNE SEULE compétence ou connaissance spécifique
- Utiliser une formulation mesurable et concrète
- MAXIMUM 220 CARACTÈRES
- Structure: [Verbe à l'infinitif] + [Objet spécifique]
</instructions>

<exemples>
MAUVAIS EXEMPLE:
"Maîtriser les principes fondamentaux de la mécanique quantique"
→ REJETÉ: utilise le pluriel, trop de principes

MAUVAIS EXEMPLE:
"Acquérir les techniques de prospection en vente B2B"
→ REJETÉ: utilise le pluriel, plusieurs techniques

BON EXEMPLE:
"Appliquer un principe fondamental de la mécanique quantique"
→ UN seul principe, singulier, spécifique

BON EXEMPLE:
"Maîtriser une technique de feedback constructif"
→ UNE seule technique, singulier, mesurable

BON EXEMPLE:

BON EXEMPLE:
"Utiliser la méthode Pomodoro pour mieux gérer son temps"
→ Cible une technique spécifique, mesurable et applicable

BON EXEMPLE:
"Rédiger un discours captivant pour une présentation"
→ Cible une compétence unique, mesurable et concrète

BON EXEMPLE:
"Utiliser le storytelling pour captiver un public"
→ Cible une compétence spécifique, mesurable et concrète
</exemples>

${STANDARD_RESPONSE_FORMAT.BASIC}`;

// Accroche
export const accrochePrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Copywriter d'accroches
Tâche: Rédiger une accroche percutante en lien indirect avec l'objectif

<contexte>
Objectif: ${context.objective}
</contexte>

<règles_strictes>
INTERDICTIONS ABSOLUES:
1. Ne jamais commencer par "Prêt à"
2. Ne jamais commencer par "Découvrez"
3. Ne jamais commencer par "Comment"
4. Ne jamais utiliser le mot "booster"
5. Ne jamais paraphraser l'objectif
6. Ne jamais utiliser de crochets [] ou de placeholders
7. Ne jamais copier les structures d'exemple telles quelles

STRUCTURE REQUISE:
- Maximum 50 caractères
- Doit être une question intriguante
- Doit créer une tension cognitive
</règles_strictes>

<référence_accroches>
Questions autorisées commencent par:
- "Et si..."
- "Pourquoi..."
- "Que se passe-t-il..."
- "Qu'est-ce qui..."

Exemples de structures validées:
1. "Et si [paradoxe] était [résolution inattendue] ?"
2. "Comment [action contre-intuitive] pour [résultat désiré] ?"
3. "Pourquoi [croyance commune] nous [limite/bloque] ?"
</référence_accroches>

<exemples_validés>
"Pourquoi la routine tue la créativité ?"
"Que se passe-t-il quand on arrête de planifier ?"
"Qu'est-ce qui rend le silence si puissant ?"
</exemples_validés>

<exemples_rejetés>
"Prêt à booster votre productivité ?" → REJETÉ: Commence par "Prêt à"
"Découvrez les secrets de l'agilité" → REJETÉ: Commence par "Découvrez"
"Comment [action] peut [résultat] ?" → REJETÉ: Utilise des placeholders
"Voulez-vous améliorer vos performances ?" → REJETÉ: Trop générique
</exemples_rejetés>

${STANDARD_RESPONSE_FORMAT.BASIC}`;

// Idée
export const ideePrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Philosophe pédagogique
Tâche: Identifier le principe fondamental et contre-intuitif qui transformera la compréhension du sujet

<contexte>
Objectif: ${context.objective}
Sujet: ${context.topic}
</contexte>

<critères_de_profondeur>
1. PARADOXE: Doit challenger une croyance commune établie
2. UNIVERSALITÉ: Doit être applicable au-delà du contexte initial
3. TRANSFORMATION: Doit provoquer un changement de perspective durable
4. SIMPLICITÉ: Doit être exprimable en une phrase simple
</critères_de_profondeur>

<instructions>
- Maximum 15 mots
- Formulation paradoxale préférée
- Doit créer un "aha moment"
- Doit ouvrir de nouvelles possibilités
</instructions>

<exemples>
BON EXEMPLE:
"La vraie expertise naît de l'acceptation constante de notre ignorance"
→ Paradoxal, universel, transformatif

MAUVAIS EXEMPLE:
"Il faut travailler dur pour réussir dans la vie"
→ Pas de paradoxe, trop évident, pas transformatif

BON EXEMPLE:
"Le silence est la forme la plus puissante de communication"
→ Contre-intuitif, applicable largement, change la perspective
</exemples>

${STANDARD_RESPONSE_FORMAT.BASIC}`;

// Concept
export const conceptPrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Expert pédagogique
Tâche: Expliquer un concept clé de manière simple et structurée

<contexte>
Objectif: ${context.objective}
Idée précédente: ${context.currentSections[context.currentSections.length - 1]?.contenu}
Titres déjà utilisés: ${context.currentSections.map(s => s.titre).filter(t => t).join(', ')}
</contexte>

<règles_strictes>
1. NE JAMAIS répéter les termes de l'idée précédente
2. NE JAMAIS utiliser le même angle d'approche
3. OBLIGATION d'apporter un concept nouveau et complémentaire
4. OBLIGATION d'écrire des phrases complètes avec sujet, verbe et complément
5. OBLIGATION d'utiliser des articles (le, la, les, un, une)
6. OBLIGATION d'utiliser au moins un connecteur logique (car, donc, ainsi)
</règles_strictes>

<instructions>
- Maximum 4 mots pour le titre
- Le titre doit être unique et différent des titres précédents
- Maximum 220 caractères pour le contenu
- Choisir un aspect technique ou méthodologique nouveau
- Enrichir la compréhension avec un angle différent
</instructions>

${STANDARD_RESPONSE_FORMAT.WITH_TITLE}`;

const STORY_STRUCTURE = {
    ACTS: 3,
    MAX_CHARS: 400,
    STRUCTURE: {
        SETUP: "Présentation et incident déclencheur",
        CONFRONTATION: "Obstacles et évolution",
        RESOLUTION: "Climax et conclusion"
    },
    REQUIREMENTS: {
        SETUP: "Personnage + Défi",
        CONFRONTATION: "Lutte + Évolution",
        RESOLUTION: "Solution + Apprentissage"
    }
} as const;

export const histoirePrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Narrateur pédagogique
Tâche: Raconter une histoire vraie et inspirante qui illustre un aspect clé du sujet

<contexte>
Objectif: ${context.objective}
Concepts précédents: ${context.currentSections.slice(-2).map(s => s.contenu).join(' | ')}
</contexte>

<règles_strictes>
1. OBLIGATION de raconter une histoire vraie et authentique
2. OBLIGATION d'avoir un personnage principal identifiable
3. OBLIGATION de montrer une transformation concrète
4. NE JAMAIS inventer des détails artificiels
</règles_strictes>

<instructions>
- Maximum 2 mots pour le titre
- Structure narrative : contexte > challenge > transformation > impact
- Inclure des détails spécifiques qui rendent l'histoire crédible
- Maximum ${STORY_STRUCTURE.MAX_CHARS} caractères
</instructions>

<exemples>
BON EXEMPLE:
TITRE: Échec Créatif
CONTENU: En 1968, Spencer Silver cherchait à créer une super-colle pour 3M. Son expérience échoue, produisant une colle qui adhère faiblement et se décolle facilement. Pendant 5 ans, il cherche en vain une application. C'est son collègue Art Fry qui, agacé par les marque-pages qui tombent de son livre de chants, réalise le potentiel : le Post-it était né.

MAUVAIS EXEMPLE:
TITRE: Histoire Inspirante
CONTENU: Un jour, quelqu'un a eu une idée et a travaillé dur pour la réaliser. Après beaucoup d'efforts, il a réussi et tout le monde était content.
→ Trop vague, pas de détails spécifiques, pas d'authenticité

BON EXEMPLE:
TITRE: Pivot Netflix
CONTENU: En 2007, Reed Hastings observe l'essor de YouTube. Malgré un business model rentable de location de DVDs, il prend la décision risquée de transformer Netflix en service de streaming. Son équipe pense qu'il est fou. Aujourd'hui, cette décision contre-intuitive a révolutionné l'industrie du divertissement.
</exemples>

${STANDARD_RESPONSE_FORMAT.WITH_TITLE}`;

// Résumé
export const resumePrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Synthétiseur
Tâche: Résumer les points clés en lien avec l'objectif

<contexte>
Objectif du mémo: ${context.objective}
Points principaux:
${context.currentSections
        .filter(s => s.type === 'idee')
        .map((s, i) => `- ${s.contenu}`)
        .join('\n')}
</contexte>

<instructions>
- Maximum 20 mots
- Reprendre uniquement les idées essentielles
- Utiliser des connecteurs logiques (donc, ainsi, car)
- Montrer la progression vers l'objectif
</instructions>

<exemples>
BON EXEMPLE:
"La productivité naît de la concentration, donc priorisez l'essentiel pour atteindre vos objectifs efficacement."
→ 13 mots, connecteur logique, progression claire vers l'objectif

MAUVAIS EXEMPLE:
"La productivité c'est important et il faut bien travailler et aussi être organisé et concentré pour réussir."
→ Trop de conjonctions "et", pas de progression logique, idées floues

BON EXEMPLE:
"En écoutant activement vos clients, vous transformez leurs objections en opportunités de vente."
→ 12 mots, cause-effet clair, lien direct avec l'objectif
</exemples>

${STANDARD_RESPONSE_FORMAT.BASIC}`;

// Acquis
export const acquisPrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Évaluateur pédagogique
Tâche: Reformuler l'objectif suivant en acquis

<contexte>
Objectif initial: ${context.objective}
</contexte>

<instructions>
- Commencer par "Vous"
- Utiliser le présent simple
- Garder la même compétence ciblée
- Maximum 20 mots
- Formulation positive et valorisante
</instructions>

<exemples>
BON EXEMPLE:
Objectif: "Maîtriser les techniques avancées de négociation commerciale"
Acquis: "Vous maîtrisez les techniques avancées de négociation commerciale"
→ Commence par "Vous", même compétence, formulation positive

BON EXEMPLE:
Objectif: "Développer une stratégie de growth hacking efficace"
Acquis: "Vous développez des stratégies de growth hacking efficaces"
→ Verbe au présent simple, compétence préservée, valorisant

MAUVAIS EXEMPLE:
Objectif: "Apprendre à gérer son temps"
Acquis: "Vous avez appris quelques techniques basiques de gestion du temps"
→ Passé composé au lieu du présent, minimise l'acquis
</exemples>

${STANDARD_RESPONSE_FORMAT.BASIC}`;

// Ouverture
export const ouverturePrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Guide pédagogique
Tâche: Proposer une perspective d'évolution

<contexte>
Objectif atteint: ${context.objective}
Acquis validé: ${context.currentSections.find(s => s.type === 'acquis')?.contenu}
</contexte>

<instructions>
- Maximum 20 mots
- Commencer par un verbe d'action
- Proposer une évolution concrète et réalisable
- Rester dans le même domaine de compétence
- Élever le niveau de maîtrise
</instructions>

<exemples>
BON EXEMPLE:
Objectif atteint: "Maîtriser les bases de la négociation commerciale"
Ouverture: "Appliquez vos techniques de négociation à des contrats internationaux pour élargir votre impact"
→ Verbe d'action, progression claire, même domaine

MAUVAIS EXEMPLE:
Objectif atteint: "Maîtriser les bases de la négociation commerciale"
Ouverture: "Vous pourriez peut-être essayer d'autres choses comme le marketing ou la finance"
→ Pas de verbe d'action, hors sujet, trop vague

BON EXEMPLE:
Objectif atteint: "Développer sa productivité personnelle"
Ouverture: "Transmettez vos méthodes de productivité en devenant mentor pour votre équipe"
→ Evolution logique, élévation du niveau, impact élargi
</exemples>

${STANDARD_RESPONSE_FORMAT.BASIC}`;

// Technique
export const techniquePrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Expert en modèles mentaux
Tâche: Proposer une recette intuitive et intelligente pour aborder le sujet

<contexte>
Idée à appliquer: ${context.currentSections[context.currentSections.length - 1]?.contenu}
</contexte>

<instructions>
- Maximum 3 mots pour le titre
- Maximum 300 caractères pour le contenu
- Structure en 3 temps : situation > approche > impact
- Formulation directe avec verbes d'action
- Durée d'application en minutes (5-30)
</instructions>

<exemples>
BON EXEMPLE:
TITRE: Règle des trois
DURÉE: 15 minutes
CONTENU: Face à une décision complexe (situation), identifiez seulement trois options possibles (approche). Cette contrainte force votre cerveau à prioriser et simplifie drastiquement votre choix final (impact).
→ Titre concis, structure claire, durée réaliste

MAUVAIS EXEMPLE:
TITRE: Processus décisionnel optimisé
DURÉE: 2 minutes
CONTENU: Utilisez cette approche révolutionnaire pour transformer votre vie.
→ Titre trop long, structure manquante, contenu vague, durée irréaliste

BON EXEMPLE:
TITRE: 5-4-3-2-1
DURÉE: 5 minutes
CONTENU: Quand vous procrastinez (situation), comptez à rebours de 5 à 1 puis agissez immédiatement (approche). Ce décompte court-circuite la paralysie par l'analyse et déclenche l'action (impact).
→ Titre mémorisable, mécanique simple, impact clair
</exemples>

${STANDARD_RESPONSE_FORMAT.WITH_DURATION}`;

// Atelier
export const atelierPrompt = (context: MemoContext) =>
    `${systemBasePrompt}

Rôle: Facilitateur d'atelier
Tâche: Proposer une consigne claire d'atelier pratique en groupe

<contexte>
Objectif du mémo: ${context.objective}
</contexte>

<instructions>
- Maximum 2 mots pour le titre
- Maximum 400 caractères pour le contenu
- Activité concrète et engageante
- Formulation avec verbes d'action (ex: "Lancez", "Définissez", "Créez")
- Durée estimée en heures (1-4)
- Structure : objectif > bénéfice > déroulé simplifié
</instructions>

<exemples>
BON EXEMPLE:
TITRE: Pitch Challenge
DURÉE: 2 heures
CONTENU: Objectif: Maîtriser l'art du pitch en situation réelle. Bénéfice: Gagner en assurance face à un public exigeant. Déroulé: Chaque participant prépare un pitch de 2 minutes, le présente au groupe, reçoit des retours constructifs, puis l'améliore en intégrant les feedbacks.
→ Titre concis, structure claire, activité concrète

MAUVAIS EXEMPLE:
TITRE: Communication Efficace Groupe
DURÉE: 30 minutes
CONTENU: On va faire des exercices de communication tous ensemble pour mieux communiquer et être plus efficace dans nos changes professionnels au quotidien.
→ Titre trop long, durée irréaliste, structure absente, pas de déroulé clair

BON EXEMPLE:
TITRE: Speed Feedback
DURÉE: 1 heure
CONTENU: Objectif: Développer l'art du feedback instantané. Bénéfice: Créer une culture de feedback positif dans l'équipe. Déroulé: En binômes rotatifs, chaque participant donne et reçoit un feedback en 3 minutes, puis change de partenaire toutes les 6 minutes.
→ Format dynamique, objectifs clairs, timing précis
</exemples>

${STANDARD_RESPONSE_FORMAT.WITH_DURATION}`; 