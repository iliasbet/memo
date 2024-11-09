import { MemoContext } from '@/types/index';

// Prompt système de base
export const systemBasePrompt = `Tu es un expert en pédagogie spécialisé dans la création de contenus éducatifs clairs et structurés.
Ta mission est de générer du contenu qui soit à la fois rigoureux, engageant et facilement mémorisable.
Adapte toujours ton niveau de langage pour qu'il soit accessible tout en restant précis.`;

const createPrompt = (instruction: string, contextHandler?: (context: MemoContext) => string) =>
    (context: MemoContext) => `${systemBasePrompt}

${instruction}

${contextHandler ? contextHandler(context) : ''}

Réponds directement avec le contenu, sans formatage. Limite ta réponse à strictement 140 caractères maximum.`;

// Maintenir la compatibilité avec les exports existants
export const objectifPrompt = createPrompt(
    `Définissez l'objectif d'apprentissage principal du sujet dans une phrase simple.

    Contraintes :
    - Pertinent
    - Mesurable
    - Commmence par un seul verbe d'action à l'infinitif

    Exemples : 
    - "Comprendre le fonctionnement de la mémoire"
    - "Connaître les bases de la méthode Agile"
    - "Savoir utiliser un logiciel de gestion de projet"
    - "Comprendre les principes de la théorie des cordes"
    - "Savoir programmer en Python"
    
    À bannir :
    - Aucun marqueur de temps
    `
);

export const accrochePrompt = createPrompt(
    `Créez une accroche percutante.
    Contraintes :
    - Lien direct mais non directif avec le sujet
    - Susciter l'intérêt avec un ton engageant voire provocateur
    - Style d'écriture fort, provoquant une charge cognitive élevée
    - Crée l'émotion à la lecture -> surprise, choc, étonnement, intrigue
    Exemples :
    - "Aujourd'hui, maman est morte. Ou peut-être hier, je ne sais pas."
    - "Assez parlé du Pape, Écoutons Dieu."
    - "Et s'il éxistait une théorie du tout ?"
    - "Notre culture d’entreprise : plus épicée qu’un café turc, plus douce qu’un lundi matin."
    - "Développe tes compétences : parce que même Superman a besoin d’un costume."
    - "Nos partenaires connaissent nos produits mieux que leur playlist Spotify."
    - "Maîtrise l’art de la vente : parce que charmer, c’est mieux que forcer."
    À bannir :
    - Aucun guillemet`
);

export const ideePrompt = createPrompt(
    `Développez une idée principale pour cette partie.
    
    Contraintes :
    - Claire, simple, et logique
    - Sans superflu, réduite à sa forme la plus pure
    - Formulée en phrase déclarative ou impérative
    - Doit être différente des idées principales précédentes`,
    (context) => `
    Sujet : ${context.topic}
    Objectif : ${context.objective}
    Partie actuelle : ${context.currentPartIndex + 1}/3
    
    Idées principales précédentes à NE PAS répéter :
    ${context.ideaGroups.map((group, i) => `${i + 1}. ${group.mainIdea}`).join('\n')}
    `
);

export const argumentPrompt = createPrompt(
    `Présentez un argument solide.
    - Logique
    - Basé sur des faits
    - Clair
    - Renforce l'idée principale`
);

export const exemplePrompt = createPrompt(
    `Donnez un exemple concret.
    - Illustre le point
    - Concret
    - Lié au contexte
    - Aide à comprendre`
);

export const transitionPrompt = createPrompt(
    `Créez une transition.
    - Lie les idées
    - Garde le fil
    - Prépare la suite
    - Assure cohérence`
);

export const resumePrompt = createPrompt(
    `Résumez les points clés.
    - Synthétique
    - Logique@
    - Points essentiels
    - Facile à retenir`
);

export const acquisPrompt = createPrompt(
    `Listez les acquis.
    - Points essentiels
    - Suite logique
    - Mémorisable
    - Suit les objectifs`
);

export const ouverturePrompt = createPrompt(
    `Proposez une ouverture.
    - Liens avec d'autres sujets
    - Nouvelles questions
    - Invite à approfondir
    - Stimule curiosité`
);

export const followUpIdeaPrompt = createPrompt(
    `Développez une idée qui découle naturellement de l'idée précédente.
    
    Contraintes :
    - Doit être une progression logique de l'idée principale
    - Approfondit ou nuance l'idée précédente
    - Garde le même style d'écriture
    - Reste concis et mémorisable
    - Évite la répétition des idées précédentes
    
    Exemples de progression :
    - Idée principale : "La confiance est le fondement de toute relation"
    - Suivi : "La transparence nourrit cette confiance au quotidien"
    
    - Idée principale : "L'innovation naît souvent de la contrainte"
    - Suivi : "Les limites forcent la créativité à se réinventer"`,
    (context) => {
        const currentGroup = context.ideaGroups[context.currentPartIndex];
        return `
        Sujet : ${context.topic}
        Objectif : ${context.objective}
        
        Idée principale actuelle : ${currentGroup?.mainIdea || ''}
        
        Idées de suivi déjà générées :
        ${currentGroup?.followUpIdeas.map((idea, i) => `${i + 1}. ${idea}`).join('\n')}
        `
    }
);