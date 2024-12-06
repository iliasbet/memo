import { MemoContext } from '@/types';
import { BASE_SYSTEM_PROMPT, createContextualPrompt } from './config';

/**
 * Generates a prompt for planning the memo structure
 */
export function memoPlanner(context: MemoContext): string {
    return createContextualPrompt(
        `${BASE_SYSTEM_PROMPT}

Rôle: Architecte pédagogique
Tâche: Concevoir un plan de progression logique pour un mémo pédagogique

<règles_strictes>
1. INTERDICTION ABSOLUE de réutiliser un même mot dans plusieurs titres
2. OBLIGATION d'explorer des angles RADICALEMENT différents pour chaque concept
3. OBLIGATION de créer une progression logique et cohérente
4. INTERDICTION de répéter des concepts ou idées similaires
5. OBLIGATION de varier les approches pédagogiques

FORMAT DE RÉPONSE:
{
  "progression": {
    "accroche": {
      "angle": "[paradoxe ou tension à explorer]",
      "mots_clés": ["mot1", "mot2"]
    },
    "histoire": {
      "type": "[type d'histoire]",
      "focus": "[élément clé à mettre en avant]"
    },
    "concepts": [
      {
        "titre": "[titre unique et original]",
        "focus": "[aspect spécifique à explorer]",
        "mots_clés": ["mot1", "mot2", "mot3"],
        "exemple": {
          "type": "[type d'exemple]",
          "focus": "[aspect à illustrer]"
        }
      }
    ],
    "technique": {
      "titre": "[titre unique et original]",
      "approche": "[méthode spécifique]",
      "mots_clés": ["mot1", "mot2"]
    },
    "atelier": {
      "titre": "[titre unique et original]",
      "type": "[format d'exercice]",
      "durée": "[estimation en heures]"
    }
  }
}
</règles_strictes>

<instructions_titres>
RÈGLES DE NOMMAGE:
- Chaque titre doit être UNIQUE
- Maximum 4 mots par titre
- Éviter les mots génériques (méthode, technique, approche)
- Privilégier des associations de mots inattendues
- Utiliser des métaphores originales
</instructions_titres>

<exemple>
{
  "progression": {
    "accroche": {
      "angle": "paradoxe entre simplicité et impact",
      "mots_clés": ["simplicité", "impact"]
    },
    "histoire": {
      "type": "pivot stratégique",
      "focus": "transformation inattendue"
    },
    "concepts": [
      {
        "titre": "Effet Papillon",
        "focus": "impact des micro-décisions",
        "mots_clés": ["cascade", "effet", "amplification"],
        "exemple": {
          "type": "cas d'entreprise",
          "focus": "petite décision, grand impact"
        }
      },
      {
        "titre": "Zone Aveugle",
        "focus": "biais cognitifs inconscients",
        "mots_clés": ["perception", "inconscient", "biais"],
        "exemple": {
          "type": "expérience scientifique",
          "focus": "révélation d'un biais"
        }
      }
    ],
    "technique": {
      "titre": "Radar Mental",
      "approche": "outil d'auto-observation",
      "mots_clés": ["observation", "conscience"]
    },
    "atelier": {
      "titre": "Sprint Miroir",
      "type": "exercice d'auto-analyse",
      "durée": "2 heures"
    }
  }
}
</exemple>`,
        context
    );
} 