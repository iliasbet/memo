import { MemoContext } from '@/types';
import {
    BASE_SYSTEM_PROMPT,
    STANDARD_RESPONSE_FORMAT,
    STORY_STRUCTURE,
    createContextualPrompt
} from './config';

/**
 * Generates a prompt for creating an illustrative story
 */
export function histoirePrompt(context: MemoContext): string {
    return createContextualPrompt(
        `${BASE_SYSTEM_PROMPT}

Rôle: Narrateur pédagogique
Tâche: Raconter une histoire vraie et inspirante qui illustre un aspect clé du sujet

<règles_strictes>
1. OBLIGATION de raconter une histoire vraie et authentique
2. OBLIGATION d'avoir un personnage principal identifiable
3. OBLIGATION de montrer une transformation concrète
4. NE JAMAIS inventer des détails artificiels
</règles_strictes>

<structure_narrative>
${Object.entries(STORY_STRUCTURE.STRUCTURE).map(([act, desc]) => `${act}: ${desc}`).join('\n')}

Exigences par acte:
${Object.entries(STORY_STRUCTURE.REQUIREMENTS).map(([act, req]) => `${act}: ${req}`).join('\n')}
</structure_narrative>

<instructions>
- Maximum 2 mots pour le titre
- Structure narrative : contexte > challenge > transformation > impact
- Inclure des détails spécifiques qui rendent l'histoire crédible
- Maximum ${STORY_STRUCTURE.MAX_CHARS} caractères
</instructions>

<exemples>
BON EXEMPLE:
{
  "titre": "Échec Créatif",
  "contenu": "En 1968, Spencer Silver cherchait à créer une super-colle pour 3M. Son expérience échoue, produisant une colle qui adhère faiblement et se décolle facilement. Pendant 5 ans, il cherche en vain une application. C'est son collègue Art Fry qui, agacé par les marque-pages qui tombent de son livre de chants, réalise le potentiel : le Post-it était né."
}

MAUVAIS EXEMPLE:
{
  "titre": "Histoire Inspirante",
  "contenu": "Un jour, quelqu'un a eu une idée et a travaillé dur pour la réaliser. Après beaucoup d'efforts, il a réussi et tout le monde était content."
}

BON EXEMPLE:
{
  "titre": "Pivot Netflix",
  "contenu": "En 2007, Reed Hastings observe l'essor de YouTube. Malgré un business model rentable de location de DVDs, il prend la décision risquée de transformer Netflix en service de streaming. Son équipe pense qu'il est fou. Aujourd'hui, cette décision contre-intuitive a révolutionné l'industrie du divertissement."
}
</exemples>

${STANDARD_RESPONSE_FORMAT.WITH_TITLE}`,
        context
    );
}

/**
 * Generates a prompt for creating a technique explanation
 */
export function techniquePrompt(context: MemoContext): string {
    return createContextualPrompt(
        `${BASE_SYSTEM_PROMPT}

Rôle: Expert en méthodologie
Tâche: Expliquer une technique pratique et concrète

<règles_strictes>
1. OBLIGATION d'être CONCRET et APPLICABLE
2. OBLIGATION d'utiliser des verbes d'action
3. OBLIGATION de donner une technique SPÉCIFIQUE
4. INTERDICTION d'être vague ou théorique
5. INTERDICTION de dépasser 220 caractères
</règles_strictes>

<instructions>
- Maximum 3 mots pour le titre
- Privilégier les verbes d'action
- Donner une technique précise et applicable
- Utiliser des mots simples et directs
</instructions>

<exemples>
BON EXEMPLE:
{
  "titre": "Méthode Pomodoro",
  "contenu": "Travaillez en blocs de 25 minutes, suivis de 5 minutes de pause. Cette alternance maintient la concentration et évite l'épuisement mental. Un timer visible renforce l'engagement dans la tâche."
}

MAUVAIS EXEMPLE:
{
  "titre": "Être Plus Efficace",
  "contenu": "Il faut bien s'organiser et faire attention à son temps. La gestion du temps est importante pour réussir."
}
</exemples>

${STANDARD_RESPONSE_FORMAT.WITH_TITLE}`,
        context
    );
}

/**
 * Generates a prompt for creating a practical workshop
 */
export function atelierPrompt(context: MemoContext): string {
    return createContextualPrompt(
        `${BASE_SYSTEM_PROMPT}

Rôle: Facilitateur d'atelier
Tâche: Concevoir un exercice pratique et engageant

<règles_strictes>
1. OBLIGATION d'être PRATIQUE et RÉALISABLE
2. OBLIGATION d'avoir un objectif clair
3. OBLIGATION d'être engageant et interactif
4. INTERDICTION d'être théorique
5. INTERDICTION de dépasser 220 caractères
</règles_strictes>

<instructions>
- Maximum 4 mots pour le titre
- Inclure une durée réaliste (15min, 30min, 1h, 2h, 1j)
- Décrire une activité concrète
- Privilégier l'action sur la réflexion
</instructions>

<exemples>
BON EXEMPLE:
{
  "titre": "Simulation de Pitch",
  "duree": "30min",
  "contenu": "En binôme, préparez un pitch de 2 minutes sur un projet imaginaire. Présentez-le à votre partenaire qui donne un feedback constructif. Inversez les rôles."
}

MAUVAIS EXEMPLE:
{
  "titre": "Réflexion Générale",
  "duree": "1h",
  "contenu": "Pensez à vos objectifs et discutez-en en groupe."
}
</exemples>

${STANDARD_RESPONSE_FORMAT.WITH_DURATION}`,
        context
    );
} 