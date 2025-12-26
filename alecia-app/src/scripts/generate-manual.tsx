import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, renderToFile } from '@react-pdf/renderer';
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
    accent: '#3B82F6',     // Blue
  },
  fonts: {
    heading: 'Helvetica-Bold',
    body: 'Helvetica',
    code: 'Courier',
  }
};

const ASSETS_PATH = path.join(process.cwd(), 'alecia-app', 'public', 'manual_assets');

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
  screenshotContainer: {
    marginVertical: 15,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  screenshot: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
  },
  caption: {
    fontSize: 8,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
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
  },
  bulletPoint: {
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 10,
    lineHeight: 1.4,
    color: THEME.colors.textMain,
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

const Screenshot = ({ src, caption }: { src: string, caption?: string }) => (
  <View style={styles.screenshotContainer}>
    {/* @ts-expect-error - Image alt not supported by react-pdf */}
    <Image src={path.join(ASSETS_PATH, src)} style={styles.screenshot} alt={caption || "Screenshot"} />
    {caption && <Text style={styles.caption}>{caption}</Text>}
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
          Alecia OS est la plateforme centrale pilotant l&apos;activité de conseil M&A. 
          Elle unifie la gestion des deals, la recherche de marché, et la collaboration équipe 
          dans une interface unique, sécurisée et performante.
        </Text>

        <Text style={styles.h2}>Accès et Sécurité</Text>
        <Text style={styles.text}>
          La sécurité est au cœur du système. L&apos;authentification utilise une protection contre 
          les attaques par force brute et une gestion stricte des rôles.
        </Text>

        <Screenshot src="login.png" caption="Nouvelle interface de connexion sécurisée avec sélection de profil" />

        <HowToCard 
          title="Se Connecter à la Plateforme"
          steps={[
            "Rendez-vous sur /admin/login.",
            "Sélectionnez votre profil dans le menu déroulant.",
            "Entrez votre mot de passe.",
            "Cliquez sur 'Se connecter'.",
          ]}
        />
      </View>
    </Page>

    {/* 3. NAVIGATION & DASHBOARD */}
    <Page size="A4" style={styles.page}>
      <Header title="Tableau de Bord" />
      <View style={styles.content}>
        <Text style={styles.h1}>Pilotage de l&apos;Activité</Text>
        
        <Text style={styles.h2}>Le Dashboard</Text>
        <Text style={styles.text}>
          Dès la connexion, le tableau de bord offre une vue synthétique des opérations.
          Il regroupe les indicateurs clés (Pipeline, Deals Actifs), un accès rapide aux outils 
          courants, et un fil d&apos;actualité des discussions récentes.
        </Text>

        <Screenshot src="dashboard.png" caption="Vue d'ensemble du Dashboard avec KPIs et Widgets" />

        <Text style={styles.h2}>La Palette de Commande</Text>
        <Text style={styles.text}>
          Pour une navigation ultra-rapide, utilisez la palette de commande globale.
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            <Text style={styles.text}>Raccourci : </Text>
            <Text style={styles.shortcut}> CMD + K </Text>
        </View>
      </View>
    </Page>

    {/* 4. OPERATIONS KANBAN */}
    <Page size="A4" style={styles.page}>
      <Header title="Opérations" />
      <View style={styles.content}>
        <Text style={styles.h1}>Gestion des Transactions</Text>

        <Text style={styles.h2}>Kanban Interactif</Text>
        <Text style={styles.text}>
          Le cœur du système pour le suivi des mandats. L&apos;interface visuelle permet de 
          déplacer les dossiers entre les phases (Lead, Due Diligence, Closing, Closed).
        </Text>

        <Screenshot src="kanban.png" caption="Vue Kanban avec Drag & Drop et statuts dynamiques" />

        <HowToCard 
          title="Piloter les Deals"
          steps={[
            "Utilisez le bouton 'Nouveau Dossier' pour créer une opportunité.",
            "Changez le statut via le sélecteur directement sur la carte.",
            "Les cartes se réorganisent automatiquement avec une animation fluide.",
            "Cliquez sur le titre pour accéder à la Data Room et à la Timeline du deal.",
          ]}
        />
      </View>
    </Page>

    {/* 5. CRM & DATA */}
    <Page size="A4" style={styles.page}>
      <Header title="Base de Données" />
      <View style={styles.content}>
        <Text style={styles.h1}>CRM Centralisé</Text>
        <Text style={styles.text}>
          Une base de données unifiée pour gérer l&apos;ensemble de l&apos;écosystème : 
          Cédants, Acquéreurs, Fonds d&apos;Investissement, et Conseils.
        </Text>

        <Screenshot src="crm.png" caption="Interface CRM avec filtres, recherche et export Excel" />

        <Text style={styles.h2}>Fonctionnalités Clés</Text>
        <Text style={styles.bulletPoint}>• Recherche Instantanée : Filtrez par nom, email ou société.</Text>
        <Text style={styles.bulletPoint}>• Tags Intelligents : Classification automatique (Investisseur, Cédant...).</Text>
        <Text style={styles.bulletPoint}>• Export Excel : Générez des listes de prospection en un clic.</Text>
        <Text style={styles.bulletPoint}>• Enrichissement : Outil intégré pour compléter les données (SIREN, CA).</Text>
      </View>
    </Page>

    {/* 6. COMMUNICATION */}
    <Page size="A4" style={styles.page}>
      <Header title="Communication" />
      <View style={styles.content}>
        <Text style={styles.h1}>Forum & Discussions</Text>
        <Text style={styles.text}>
          Un espace dédié pour remplacer les emails internes. Organisé par thèmes 
          (Annonces, Deals, Veille), il permet de centraliser la connaissance.
        </Text>

        <Screenshot src="forum.png" caption="Éditeur de discussion riche pour les annonces et échanges" />

        <HowToCard 
          title="Collaborer sur le Forum"
          steps={[
            "Sélectionnez une catégorie (ex: Annonces Officielles).",
            "Utilisez l'éditeur riche pour mettre en forme votre message.",
            "Ajoutez des listes, du gras/italique pour la clarté.",
            "Publiez pour notifier l'équipe instantanément.",
          ]}
        />
      </View>
    </Page>

    {/* 7. ANALYTICS & SPREADSHEETS */}
    <Page size="A4" style={styles.page}>
      <Header title="Outils d&apos;Analyse" />
      <View style={styles.content}>
        <Text style={styles.h1}>Suite Financière</Text>
        
        <Text style={styles.h2}>Alecia Sheets</Text>
        <Text style={styles.text}>
          Un tableur intégré pour vos modélisations rapides, listes de cibles ou 
          calculs de valorisation, sans quitter l&apos;interface.
        </Text>

        <Screenshot src="spreadsheet.png" caption="Éditeur de tableur avec gestion de colonnes/lignes" />

        <Text style={styles.h2}>Marketing Studio</Text>
        <Text style={styles.text}>
          Suivez la performance des campagnes et l&apos;engagement sur le site public.
        </Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <View style={{ width: '48%' }}>
                {/* @ts-expect-error - Image alt not supported by react-pdf */}
                <Image src={path.join(ASSETS_PATH, 'marketing_1.png')} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 4 }} alt="Marketing 1" />
            </View>
            <View style={{ width: '48%' }}>
                {/* @ts-expect-error - Image alt not supported by react-pdf */}
                <Image src={path.join(ASSETS_PATH, 'marketing_2.png')} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 4 }} alt="Marketing 2" />
            </View>
        </View>
        <Text style={styles.caption}>Tableaux de bord Marketing & Analytics</Text>
      </View>
    </Page>

    {/* 8. WEBSITE MANAGEMENT */}
    <Page size="A4" style={styles.page}>
      <Header title="Gestion Site Web" />
      <View style={styles.content}>
        <Text style={styles.h1}>CMS Intégré</Text>
        <Text style={styles.text}>
          Pilotez le contenu du site public (alecia.fr) directement depuis l&apos;OS. 
          Modifiez les actualités, l&apos;équipe, et les pages sectorielles en temps réel.
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 15 }}>
             <View style={{ width: '30%', marginBottom: 10 }}>
                {/* @ts-expect-error - Image alt not supported by react-pdf */}
                <Image src={path.join(ASSETS_PATH, 'website_menu.png')} style={{ width: '100%', height: 'auto', borderRadius: 4, borderWidth: 1, borderColor: THEME.colors.border }} alt="Website Menu" />
                <Text style={styles.caption}>Menu CMS</Text>
            </View>
            <View style={{ width: '65%', marginBottom: 10 }}>
                {/* @ts-expect-error - Image alt not supported by react-pdf */}
                <Image src={path.join(ASSETS_PATH, 'website_1.png')} style={{ width: '100%', height: 'auto', borderRadius: 4, borderWidth: 1, borderColor: THEME.colors.border }} alt="Website 1" />
                <Text style={styles.caption}>Édition de Contenu</Text>
            </View>
        </View>

        <Text style={styles.h2}>Capacités</Text>
        <Text style={styles.bulletPoint}>• Newsroom : Publication d&apos;articles et communiqués.</Text>
        <Text style={styles.bulletPoint}>• Équipe : Mise à jour des bios et photos des associés.</Text>
        <Text style={styles.bulletPoint}>• Carrières : Gestion des offres d&apos;emploi.</Text>
      </View>
      <Text style={{ ...styles.coverFooter, left: 40, right: 40, textAlign: 'center' }}>
        Alecia OS Documentation 3.0 • Généré le {new Date().toLocaleDateString('fr-FR')}
      </Text>
    </Page>

  </Document>
);

const outputPath = path.join(process.cwd(), 'alecia-app', 'public', 'alecia-user-manual.pdf');

const main = async () => {
    try {
        console.log("Generating Enriched PDF with Screenshots...");
        await renderToFile(<ManualPDF />, outputPath);
        console.log(`Success! Manual saved to: ${outputPath}`);
    } catch (e) {
        console.error("PDF Generation Error:", e);
    }
};

main();