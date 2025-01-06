import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      menu: {
        home: "Accueil",
        login: "Se connecter",
        signup: "S'inscrire",
        settings: "Paramètres",
        goPro: "Passer à pro"
      },
      settings: {
        title: "Paramètres",
        language: "Langue",
        confirm: "Confirmer"
      },
      input: {
        placeholder: "Posez votre question..."
      },
      auth: {
        signin: "Se connecter",
        signup: "S'inscrire",
        email: "Email",
        password: "Mot de passe",
        loading: "Chargement...",
        noAccount: "Pas encore de compte ? S'inscrire",
        hasAccount: "Déjà un compte ? Se connecter"
      },
      error: {
        default: "Oups ! La génération du memo n'a pas fonctionné... Réessayons !",
        retry: "Réessayer"
      },
      defaultMemo: {
        title: "Votre prochain mémo arrive...",
        point1: "Je vous aide à organiser vos pensées",
        point2: "Décomposer des sujets complexes en points clairs",
        point3: "Créer des résumés structurés",
        point4: "Générer des insights actionnables",
        heuristic: "Plus c'est simple, plus c'est mémorisable"
      },
      pro: {
        description: "Débloquez tout le potentiel de Memo avec notre offre Pro",
        subscribe: "Passer à Pro",
        price: {
          amount: "9.99€",
          period: "/mois"
        },
        features: {
          unlimited: "Génération de mémos illimitée",
          styles: "Accès à tous les styles d'écriture",
          support: "Support prioritaire",
          preview: "Fonctionnalités en avant-première"
        }
      }
    }
  },
  en: {
    translation: {
      menu: {
        home: "Home",
        login: "Log in",
        signup: "Sign up",
        settings: "Settings",
        goPro: "Go Pro"
      },
      settings: {
        title: "Settings",
        language: "Language",
        confirm: "Confirm"
      },
      input: {
        placeholder: "Ask your question..."
      },
      auth: {
        signin: "Sign in",
        signup: "Sign up",
        email: "Email",
        password: "Password",
        loading: "Loading...",
        noAccount: "No account yet? Sign up",
        hasAccount: "Already have an account? Sign in"
      },
      error: {
        default: "Oops! The memo generation didn't work... Let's try again!",
        retry: "Retry"
      },
      defaultMemo: {
        title: "Your next memo is coming...",
        point1: "I will help you organize your thoughts",
        point2: "Break down complex topics into clear points",
        point3: "Create structured summaries",
        point4: "Generate actionable insights",
        heuristic: "The simpler it is, the easier it sticks"
      },
      pro: {
        description: "Unlock Memo's full potential with our Pro offer",
        subscribe: "Go Pro",
        price: {
          amount: "9.99€",
          period: "/month"
        },
        features: {
          unlimited: "Unlimited memo generation",
          styles: "Access to all writing styles",
          support: "Priority support",
          preview: "Preview features"
        }
      }
    }
  },
  es: {
    translation: {
      menu: {
        home: "Inicio",
        login: "Iniciar sesión",
        signup: "Registrarse",
        settings: "Ajustes",
        goPro: "Hazte Pro"
      },
      settings: {
        title: "Ajustes",
        language: "Idioma",
        confirm: "Confirmar"
      },
      input: {
        placeholder: "Haz tu pregunta..."
      },
      auth: {
        signin: "Iniciar sesión",
        signup: "Registrarse",
        email: "Correo electrónico",
        password: "Contraseña",
        loading: "Cargando...",
        noAccount: "¿No tienes cuenta? Regístrate",
        hasAccount: "¿Ya tienes cuenta? Inicia sesión"
      },
      error: {
        default: "¡Ups! La generación del memo no funcionó... ¡Intentémoslo de nuevo!",
        retry: "Reintentar"
      },
      defaultMemo: {
        title: "Tu próximo memo está en camino...",
        point1: "Te ayudaré a organizar tus pensamientos",
        point2: "Desglosar temas complejos en puntos claros",
        point3: "Crear resúmenes estructurados",
        point4: "Generar ideas accionables",
        heuristic: "Lo más simple es lo más memorable"
      },
      pro: {
        description: "Desbloquea todo el potencial de Memo con nuestra oferta Pro",
        subscribe: "Hazte Pro",
        price: {
          amount: "9.99€",
          period: "/mes"
        },
        features: {
          unlimited: "Generación ilimitada de memos",
          styles: "Acceso a todos los estilos de escritura",
          support: "Soporte prioritario",
          preview: "Funciones en vista previa"
        }
      }
    }
  },
  de: {
    translation: {
      menu: {
        home: "Startseite",
        login: "Anmelden",
        signup: "Registrieren",
        settings: "Einstellungen",
        goPro: "Pro werden"
      },
      settings: {
        title: "Einstellungen",
        language: "Sprache",
        confirm: "Bestätigen"
      },
      input: {
        placeholder: "Stelle deine Frage..."
      },
      auth: {
        signin: "Anmelden",
        signup: "Registrieren",
        email: "E-Mail",
        password: "Passwort",
        loading: "Laden...",
        noAccount: "Noch kein Konto? Registrieren",
        hasAccount: "Bereits ein Konto? Anmelden"
      },
      error: {
        default: "Ups! Die Memo-Generierung hat nicht funktioniert... Versuchen wir es noch einmal!",
        retry: "Wiederholen"
      },
      defaultMemo: {
        title: "Dein nächstes Memo kommt...",
        point1: "Ich helfe dir, deine Gedanken zu organisieren",
        point2: "Komplexe Themen in klare Punkte aufteilen",
        point3: "Strukturierte Zusammenfassungen erstellen",
        point4: "Umsetzbare Erkenntnisse generieren",
        heuristic: "Je einfacher, desto einprägsamer"
      },
      pro: {
        description: "Schalte das volle Potenzial von Memo mit unserem Pro-Angebot frei",
        subscribe: "Pro werden",
        price: {
          amount: "9.99€",
          period: "/Monat"
        },
        features: {
          unlimited: "Unbegrenzte Memo-Generierung",
          styles: "Zugriff auf alle Schreibstile",
          support: "Prioritäts-Support",
          preview: "Vorschau-Funktionen"
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false
    }
  });

export default i18n; 