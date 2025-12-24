import React from 'react';
import { Document, Page, Text, View, StyleSheet, renderToFile } from '@react-pdf/renderer';
import path from 'path';

// ============================================================================ 
// THEME CONFIGURATION
// ============================================================================ 
const THEME = {
  colors: {
    primary: '#D4AF37',    // Gold (Alecia Brand)
    secondary: '#0F172A',  // Navy/Dark Slate
    secondaryLight: '#1E293B',
    background: '#FFFFFF',
    surface: '#F8FAFC',    // Slate 50
    border: '#E2E8F0',     // Slate 200
    textMain: '#334155',   // Slate 700
    textMuted: '#64748B',  // Slate 500
    accent: '#3B82F6',     // Blue (Links/Info)
    success: '#10B981',
    error: '#EF4444',
  },
  fonts: {
    heading: 'Helvetica-Bold',
    body: 'Helvetica',
    code: 'Courier',
  }
};

const styles = StyleSheet.create({
  // LAYOUT
  page: {
    backgroundColor: THEME.colors.background,
    fontFamily: THEME.fonts.body,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15 30',
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: THEME.colors.primary,
  },
  headerLogo: {
    fontSize: 14,
    fontFamily: THEME.fonts.heading,
    color: THEME.colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  headerPagination: {
    fontSize: 9,
    color: THEME.colors.textMuted,
  },
  content: {
    padding: '30 40',
  },
  
  // COVER PAGE
  cover: {
    backgroundColor: THEME.colors.secondary,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverBorder: {
    position: 'absolute',
    top: 20, left: 20, right: 20, bottom: 20,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
    opacity: 0.5,
  },
  coverLogoText: {
    fontSize: 48,
    fontFamily: THEME.fonts.heading,
    color: THEME.colors.primary,
    marginBottom: 10,
    letterSpacing: 4,
  },
  coverSubtitle: {
    fontSize: 16,
    color: THEME.colors.surface,
    marginBottom: 40,
    letterSpacing: 1,
    opacity: 0.9,
  },
  coverBadge: {
    padding: '8 20',
    backgroundColor: THEME.colors.primary,
    borderRadius: 4,
    marginBottom: 20,
  },
  coverBadgeText: {
    color: THEME.colors.secondary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  coverFooter: {
    position: 'absolute',
    bottom: 40,
    fontSize: 10,
    color: THEME.colors.textMuted,
  },

  // TYPOGRAPHY
  h1: {
    fontSize: 24,
    fontFamily: THEME.fonts.heading,
    color: THEME.colors.secondary,
    marginBottom: 16,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  h2: {
    fontSize: 16,
    fontFamily: THEME.fonts.heading,
    color: THEME.colors.primary,
    marginBottom: 12,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    paddingBottom: 4,
  },
  h3: {
    fontSize: 12,
    fontFamily: THEME.fonts.heading,
    color: THEME.colors.secondary,
    marginBottom: 8,
    marginTop: 12,
  },
  text: {
    fontSize: 10,
    color: THEME.colors.textMain,
    lineHeight: 1.6,
    marginBottom: 8,
    textAlign: 'justify',
  },
  
  // COMPONENTS
  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.secondary,
  },
  cardTitle: {
    fontSize: 11,
    fontFamily: THEME.fonts.heading,
    color: THEME.colors.secondary,
    marginBottom: 4,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  stepNumber: {
    width: 16,
    fontSize: 10,
    fontFamily: THEME.fonts.heading,
    color: THEME.colors.primary,
  },
  stepText: {
    flex: 1,
    fontSize: 10,
    color: THEME.colors.textMain,
  },
  
  // UI VISUALIZATION
  uiContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  uiHeader: {
    backgroundColor: '#E2E8F0',
    padding: '4 8',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    flexDirection: 'row',
    gap: 4,
  },
  uiDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: '#94A3B8'
  },
  uiBody: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uiText: {
    fontSize: 8,
    color: THEME.colors.textMuted,
    fontStyle: 'italic',
  },
  
  // BADGES & INFO
  infoBox: {
    backgroundColor: '#EFF6FF', // Blue 50
    padding: 10,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: THEME.colors.accent,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 9,
    color: '#1E40AF', // Blue 800
  },
  shortcut: {
    fontFamily: THEME.fonts.code,
    backgroundColor: '#F1F5F9',
    padding: '2 4',
    borderRadius: 3,
    fontSize: 9,
    color: THEME.colors.secondary,
  }
});

// ============================================================================ 
// COMPONENTS
// ============================================================================ 

const Header = ({ title }: { title: string }) => (
  <View style={styles.header}>
    <Text style={styles.headerLogo}>ALECIA OS</Text>
    <Text style={styles.headerPagination}>{title}</Text>
  </View>
);

const HowToCard = ({ title, steps }: { title: string, steps: string[] }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    {steps.map((step, i) => (
      <View key={i} style={styles.step}>
        <Text style={styles.stepNumber}>{i + 1}.</Text>
        <Text style={styles.stepText}>{step}</Text>
      </View>
    ))}
  </View>
);

const UIPreview = ({ label }: { label: string }) => (
  <View style={styles.uiContainer}>
    <View style={styles.uiHeader}>
      <View style={styles.uiDot} />
      <View style={styles.uiDot} />
      <View style={styles.uiDot} />
    </View>
    <View style={styles.uiBody}>
      <Text style={styles.uiText}>[ {label} ]</Text>
    </View>
  </View>
);

const InfoBlock = ({ text }: { text: string }) => (
  <View style={styles.infoBox}>
    <Text style={styles.infoText}>💡 {text}</Text>
  </View>
);

// ============================================================================ 
// DOCUMENT STRUCTURE
// ============================================================================ 

const ManualPDF = () => (
  <Document>
    
    {/* 1. COVER PAGE */}
    <Page size="A4" style={styles.cover}>
      <View style={styles.coverBorder} />
      <Text style={styles.coverLogoText}>ALECIA</Text>
      <Text style={styles.coverSubtitle}>OPERATING SYSTEM 3.0</Text>
      
      <View style={styles.coverBadge}>
        <Text style={styles.coverBadgeText}>GUIDE UTILISATEUR</Text>
      </View>

      <Text style={{ color: THEME.colors.primary, fontSize: 12, marginTop: 40 }}>
        M&A Advisory • Intelligence • Collaboration
      </Text>
      
      <Text style={styles.coverFooter}>© 2025 Alecia - Confidentiel</Text>
    </Page>

    {/* 2. INTRODUCTION & AUTH */}
    <Page size="A4" style={styles.page}>
      <Header title="Introduction" />
      <View style={styles.content}>
        <Text style={styles.h1}>Bienvenue sur Alecia OS</Text>
        <Text style={styles.text}>
          Alecia OS est la plateforme centrale pilotant l'activité de conseil M&A. 
          Elle unifie la gestion des deals, la recherche de marché, et la collaboration équipe 
          dans une interface unique, sécurisée et performante.
        </Text>

        <Text style={styles.h2}>Accès et Sécurité</Text>
        <Text style={styles.text}>
          La sécurité est au cœur du système. L'authentification utilise une protection contre 
          les attaques par force brute et une gestion stricte des rôles.
        </Text>

        <UIPreview label="Interface de Connexion avec Avatar" />

        <HowToCard 
          title="Se Connecter à la Plateforme"
          steps={[
            "Rendez-vous sur /admin/login.",
            "Sélectionnez votre profil dans le menu déroulant (inutile de taper l'email).",
            "Entrez votre mot de passe.",
            "Cliquez sur 'Se connecter'.",
          ]}
        />
        
        <InfoBlock text="En cas d'oubli de mot de passe, contactez l'administrateur système (Sudo)." />
      </View>
    </Page>

    {/* 3. NAVIGATION & DASHBOARD */}
    <Page size="A4" style={styles.page}>
      <Header title="Navigation" />
      <View style={styles.content}>
        <Text style={styles.h1}>L'Interface "Business OS"</Text>
        
        <Text style={styles.h2}>Le Tableau de Bord</Text>
        <Text style={styles.text}>
          Votre cockpit personnel. Il affiche en temps réel :
        </Text>
        <Text style={{ ...styles.text, marginLeft: 10 }}>
          • Les KPIs financiers (Pipeline, Leads).{'\n'}          • Un flux d'activité (Derniers posts, mises à jour deals).{'\n'}          • Des actions rapides pour démarrer une tâche sans naviguer.
        </Text>

        <UIPreview label="Dashboard Grid: Metrics + Activity Feed" />

        <Text style={styles.h2}>La Palette de Commande</Text>
        <Text style={styles.text}>
          Pour gagner du temps, Alecia OS intègre un moteur de navigation rapide.
        </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            <Text style={styles.text}>Appuyez sur </Text>
            <Text style={styles.shortcut}> CMD + K </Text>
            <Text style={styles.text}> (ou Ctrl + K) n'importe où.</Text>
        </View>

        <HowToCard 
          title="Utiliser la Palette de Commande"
          steps={[
            "Faites le raccourci clavier ou cliquez sur la barre de recherche.",
            "Tapez 'Deal' pour aller aux transactions, 'Forum' pour les discussions, etc.",
            "Utilisez les flèches pour sélectionner et Entrée pour valider.",
          ]}
        />
      </View>
    </Page>

    {/* 4. COMMUNICATION (FORUM) */}
    <Page size="A4" style={styles.page}>
      <Header title="Communication" />
      <View style={styles.content}>
        <Text style={styles.h1}>Forum Interne</Text>
        <Text style={styles.text}>
          L'espace d'échange de l'équipe, structuré par thèmes (Annonces, Deals, Veille).
          Il remplace les chaînes d'emails fragmentées.
        </Text>

        <Text style={styles.h2}>Créer et Répondre</Text>
        <UIPreview label="Éditeur Riche (TipTap) avec Toolbar" />

        <HowToCard 
          title="Lancer une nouvelle discussion"
          steps={[
            "Allez dans le module 'Forum'.",
            "Entrez dans la catégorie concernée (ex: Discussions Deals).",
            "Cliquez sur 'Nouveau sujet'.",
            "Rédigez votre titre et votre message (Gras, Italique, Listes disponibles).",
            "Cliquez sur 'Publier'.",
          ]}
        />

        <Text style={styles.h3}>Pièces Jointes</Text>
        <Text style={styles.text}>
          Vous pouvez joindre des images ou des documents directement dans l'éditeur via 
          l'icône image. Les fichiers sont stockés de manière sécurisée (Vercel Blob).
        </Text>
      </View>
    </Page>

    {/* 5. COLLABORATION (PADS & SHEETS) */}
    <Page size="A4" style={styles.page}>
      <Header title="Collaboration" />
      <View style={styles.content}>
        <Text style={styles.h1}>La Suite Bureautique</Text>
        
        <Text style={styles.h2}>Alecia Pads (Docs)</Text>
        <Text style={styles.text}>
          Un traitement de texte collaboratif pour vos mémos, notes de réunion et drafts.
        </Text>
        <HowToCard 
          title="Gérer un Document"
          steps={[
            "Menu Collaboration > Documents > Onglet 'Pads'.",
            "Créez un Pad et donnez-lui un titre.",
            "L'enregistrement est automatique (toutes les 10s si modifications).",
            "Utilisez le bouton 'Export PDF' pour générer une version imprimable propre.",
          ]}
        />

        <Text style={styles.h2}>Alecia Sheets (Tableurs)</Text>
        <Text style={styles.text}>
          Un outil de grille pour vos listes de données, calculs rapides et suivis.
        </Text>
        <UIPreview label="Grille Tableur avec outils Ligne/Colonne" />
        
        <HowToCard 
          title="Travailler sur un Spreadsheet"
          steps={[
            "Menu Collaboration > Spreadsheets.",
            "Ajoutez des lignes/colonnes via la barre d'outils.",
            "Saisissez vos données.",
            "Exportez en un clic au format Excel (.xlsx) natif.",
          ]}
        />
      </View>
    </Page>

    {/* 6. INTELLIGENCE (AI) */}
    <Page size="A4" style={styles.page}>
      <Header title="Intelligence Artificielle" />
      <View style={styles.content}>
        <Text style={styles.h1}>Moteur de Recherche AI</Text>
        <Text style={styles.text}>
          Alecia OS combine la puissance de Groq (Vitesse) et Mistral Large (Précision) 
          pour réaliser des études de marché autonomes.
        </Text>

        <Text style={styles.h2}>Lancer une Étude</Text>
        <HowToCard 
          title="Processus de Recherche"
          steps={[
            "Menu Intelligence > Market Research.",
            "Cliquez sur 'Nouvelle Étude'.",
            "Décrivez votre besoin (ex: 'Marché de la cybersécurité PME en France').",
            "Laissez l'IA travailler (approx. 30 secondes).",
            "Consultez le rapport généré automatiquement.",
          ]}
        />

        <Text style={styles.h3}>Outils d'Analyse Avancés</Text>
        <Text style={styles.text}>
          Une fois le rapport généré, vous pouvez utiliser les "Actions AI" en haut à droite :
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 5 }}>
            <Text style={styles.shortcut}> EXTRAIRE SWOT </Text>
            <Text style={styles.text}> : Génère un tableau Forces/Faiblesses instantané.</Text>
        </View>

        <Text style={styles.h2}>Web Crawler</Text>
        <Text style={styles.text}>
          Besoin d'analyser un site concurrent ? Utilisez l'onglet "Web Crawler", entrez l'URL, 
          et le système aspirera le contenu pertinent pour analyse.
        </Text>
      </View>
    </Page>

    {/* 7. OPERATIONS (DEALS & CRM) */}
    <Page size="A4" style={styles.page}>
      <Header title="Opérations" />
      <View style={styles.content}>
        <Text style={styles.h1}>Gestion des Mandats</Text>

        <Text style={styles.h2}>Kanban des Deals</Text>
        <Text style={styles.text}>
          Visualisez l'ensemble du pipeline. Chaque carte représente une opportunité.
        </Text>
        <HowToCard 
          title="Piloter les Deals"
          steps={[
            "Changez le statut d'un deal en changeant le selecteur dans la carte.",
            "Les cartes s'animent automatiquement vers la bonne colonne.",
            "Cliquez sur le titre pour entrer dans le détail du dossier (Timeline, Infos).",
          ]}
        />

        <Text style={styles.h2}>CRM (Contacts & Sociétés)</Text>
        <Text style={styles.text}>
          Annuaire centralisé enrichi.
        </Text>
        <UIPreview label="Liste CRM avec Filtres & Export" />
        
        <HowToCard 
          title="Exports & Données"
          steps={[
            "Filtrez par nom ou email via la barre de recherche.",
            "Basculez entre la vue 'Contacts' et 'Sociétés'.",
            "Cliquez sur l'icône Excel pour télécharger la base filtrée.",
          ]}
        />
      </View>
    </Page>

    {/* 8. ADMIN & MAINTENANCE */}
    <Page size="A4" style={styles.page}>
      <Header title="Système" />
      <View style={styles.content}>
        <Text style={styles.h1}>Administration Système</Text>
        <Text style={styles.text}>
          Accès réservé aux administrateurs (Sudo) pour la maintenance de l'OS.
        </Text>

        <InfoBlock text="URL d'accès : /sudo (Protégée par cookie spécifique)" />

        <Text style={styles.h2}>Maintenance Mode</Text>
        <Text style={styles.text}>
          En cas de mise à jour critique, vous pouvez verrouiller l'accès à l'application 
          pour tous les utilisateurs non-sudo.
        </Text>
        <HowToCard 
          title="Activer la Maintenance"
          steps={[
            "Connectez-vous au Sudo Panel.",
            "Section 'System & Cache'.",
            "Cliquez sur 'ENABLE MAINTENANCE'.",
            "Une page d'attente s'affichera pour tous les autres utilisateurs.",
          ]}
        />

        <Text style={styles.h2}>Santé du Système</Text>
        <Text style={styles.text}>
          Le panneau "Health Check" teste en temps réel la connexion à la base de données Neon, 
          au stockage Vercel Blob et aux API externes.
        </Text>
      </View>
      
      <Text style={{ ...styles.coverFooter, left: 40, right: 40, textAlign: 'center' }}>
        Alecia OS Documentation • Généré automatiquement par l'Agent
      </Text>
    </Page>

  </Document>
);

const outputPath = path.join(process.cwd(), 'alecia-app', 'public', 'alecia-user-manual.pdf');

const main = async () => {
    try {
        console.log("Generating Enhanced PDF...");
        await renderToFile(<ManualPDF />, outputPath);
        console.log(`Success! Manual saved to: ${outputPath}`);
    } catch (e) {
        console.error("PDF Generation Error:", e);
    }
};

main();