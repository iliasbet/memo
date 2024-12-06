import { MemoContext } from '@/types';
import {
    BASE_SYSTEM_PROMPT,
    STANDARD_RESPONSE_FORMAT,
    CONTENT_CONSTRAINTS,
    createContextualPrompt
} from './config';

/**
 * Generates a prompt for extracting the subject from the objective
 */
export function sujetPrompt(context: MemoContext): string {
    return createContextualPrompt(
        `${BASE_SYSTEM_PROMPT}

Rôle: Analyste linguistique
Tâche: Extraire le concept fondamental de l'objectif

<règles>
- UNIQUEMENT LE CONCEPT CENTRAL
- Maximum 2 mots représentant le concept
- Noms communs génériques uniquement
- Pas de verbes ni d'articles
- Privilégier les concepts universels
- Si les mots clés de la requête sont justes en terme de choix de titre, alors le prompt doit se contenter de les garder
- Si possible garder un seul mot
</règles>

<exemples>
{
  "Préparer un rapport de réunion": {"sujet": "communication écrite"},
  "Optimiser la gestion du temps": {"sujet": "gestion temps"},
  "Développer une stratégie marketing": {"sujet": "stratégie commerciale"},
  "Améliorer ses techniques de vente": {"sujet": "persuasion"},
  "Créer un plan de formation": {"sujet": "ingénierie pédagogique"},
  "Formation à la gestion du stress": {"sujet": "stress management"},
  "memo sur le management": {"sujet": "management"}
}
</exemples>

${STANDARD_RESPONSE_FORMAT.WITH_SUBJECT}`,
        context
    );
}

/**
 * Generates a prompt for creating a cognitive objective
 */
export function objectifPrompt(context: MemoContext): string {
    return createContextualPrompt(
        `${BASE_SYSTEM_PROMPT}

Rôle: Expert en pédagogie
Tâche: Rédiger une phrase d'objectif cognitif

<règles>
- Phrase infinitive simple.
- Structure: [verbe infinitif] + [complément d'objet direct]
- Objectif cognitif suffisamment accessible
- Un seul objectif cognitif
- Objectif au singulier
- Maximum ${CONTENT_CONSTRAINTS.MAX_OBJECTIVE_LENGTH} mots
</règles>

<exemples>
EXEMPLE 1:
{ "contenu": "Expliquer un processus de recrutement" }
- Action : Expliquer
- Complément : un processus de recrutement

EXEMPLE 2:
{ "contenu": "Préparer un rapport de réunion" }
- Action : Préparer
- Complément : un rapport de réunion

EXEMPLE 3:
{ "contenu": "Présenter un plan d'action détaillé" }
- Action : Présenter
- Complément : un plan d'action détaillé
</exemples>

${STANDARD_RESPONSE_FORMAT.BASIC}`,
        context
    );
}

/**
 * Generates a prompt for creating an engaging hook
 */
export function accrochePrompt(context: MemoContext): string {
    return createContextualPrompt(
        `${BASE_SYSTEM_PROMPT}

Rôle: Copywriter d'accroches
Tâche: Rédiger une accroche percutante en lien indirect avec l'objectif

<règles_strictes>
INTERDICTIONS ABSOLUES:
1. Ne jamais commencer par "Prêt à"
2. Ne jamais commencer par "Découvrez"
3. Ne jamais commencer par "Comment"
4. Ne jamais utiliser le mot "booster"
5. Ne jamais paraphraser l'objectif
6. Ne jamais utiliser de crochets [] ou de placeholders
7. Ne jamais copier les structures d'exemple telles quelles
8. Les mots-clés importants doivent être encadrés par des underscores __mot__

STRUCTURE REQUISE:
- Maximum ${CONTENT_CONSTRAINTS.MAX_ACCROCHE_LENGTH} caractères
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
{ "contenu": "Pourquoi la __routine__ tue la __créativité__ ?" }
{ "contenu": "Que se passe-t-il quand on arrête de __planifier__ ?" }
{ "contenu": "Qu'est-ce qui rend le __silence__ si puissant ?" }
</exemples_validés>

<exemples_rejetés>
{ "contenu": "Prêt à booster votre productivité ?" } → REJETÉ: Commence par "Prêt à"
{ "contenu": "Découvrez les secrets de l'agilité" } → REJETÉ: Commence par "Découvrez"
{ "contenu": "Comment [action] peut [résultat] ?" } → REJETÉ: Utilise des placeholders
{ "contenu": "Voulez-vous améliorer vos performances ?" } → REJETÉ: Trop générique
</exemples_rejetés>

${STANDARD_RESPONSE_FORMAT.BASIC}`,
        context
    );
}

/**
 * Generates a prompt for creating a concept explanation
 */
export function conceptPrompt(context: MemoContext): string {
    return createContextualPrompt(
        `${BASE_SYSTEM_PROMPT}

Rôle: Expert pédagogique
Tâche: Expliquer un concept clé de manière CONCISE et PERCUTANTE

<règles_strictes>
1. OBLIGATION d'apporter un concept TOTALEMENT NOUVEAU
2. INTERDICTION de réutiliser des mots-clés des concepts précédents
3. OBLIGATION de choisir un angle d'approche RADICALEMENT DIFFÉRENT
4. OBLIGATION d'explorer une dimension inexploitée du sujet
5. OBLIGATION d'écrire des phrases courtes et impactantes
6. OBLIGATION d'utiliser des articles (le, la, les, un, une)
7. OBLIGATION d'utiliser au moins un connecteur logique (car, donc, ainsi)
8. MISE EN FORME : Utiliser des underscores __ pour les points clés (SAUF POUR LE TITRE)
9. INTERDICTION de dépasser ${CONTENT_CONSTRAINTS.MAX_CONCEPT_LENGTH} caractères
10. OBLIGATION d'être CONCIS et DIRECT
</règles_strictes>

<instructions>
- Maximum ${CONTENT_CONSTRAINTS.MAX_TITLE_LENGTH} mots pour le titre
- Une seule idée forte par concept
- Privilégier l'impact sur la quantité
- Chaque mot doit être essentiel
</instructions>

${STANDARD_RESPONSE_FORMAT.WITH_TITLE}`,
        context
    );
} 