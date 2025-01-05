import { MemoContext } from '@/types';
import { BASE_SYSTEM_PROMPT, STANDARD_RESPONSE_FORMAT } from './config';

const COMMON_RULES = `
1. OBLIGATION d'être CONCRET et APPLICABLE
2. OBLIGATION d'utiliser des verbes d'action
3. INTERDICTION d'être vague ou théorique
4. Maximum 220 caractères`;

export function histoirePrompt(context: MemoContext): string {
    return `${BASE_SYSTEM_PROMPT}

Rôle: Narrateur pédagogique
Tâche: Raconter une histoire vraie et inspirante

${COMMON_RULES}
+ OBLIGATION d'avoir un personnage principal identifiable
+ OBLIGATION de montrer une transformation concrète

<exemple>
{
  "titre": "Pivot Netflix",
  "contenu": "En 2007, Reed Hastings observe l'essor de YouTube. Malgré un business model rentable de location de DVDs, il prend la décision risquée de transformer Netflix en service de streaming. Son équipe pense qu'il est fou. Aujourd'hui, cette décision contre-intuitive a révolutionné l'industrie du divertissement."
}
</exemple>

${STANDARD_RESPONSE_FORMAT.WITH_TITLE}`;
}

export function techniquePrompt(context: MemoContext): string {
    return `${BASE_SYSTEM_PROMPT}

Rôle: Expert en méthodologie
Tâche: Expliquer une technique pratique

${COMMON_RULES}
+ OBLIGATION de donner une technique SPÉCIFIQUE

<exemple>
{
  "titre": "Méthode Pomodoro",
  "contenu": "Travaillez en blocs de 25 minutes, suivis de 5 minutes de pause. Cette alternance maintient la concentration et évite l'épuisement mental. Un timer visible renforce l'engagement dans la tâche."
}
</exemple>

${STANDARD_RESPONSE_FORMAT.WITH_TITLE}`;
}

export function atelierPrompt(context: MemoContext): string {
    return `${BASE_SYSTEM_PROMPT}

Rôle: Facilitateur d'atelier
Tâche: Concevoir un exercice pratique

${COMMON_RULES}
+ OBLIGATION d'avoir un objectif clair
+ OBLIGATION d'être engageant et interactif

<exemple>
{
  "titre": "Simulation de Pitch",
  "duree": "30min",
  "contenu": "En binôme, préparez un pitch de 2 minutes sur un projet imaginaire. Présentez-le à votre partenaire qui donne un feedback constructif. Inversez les rôles."
}
</exemple>

${STANDARD_RESPONSE_FORMAT.WITH_DURATION}`;
} 