# Chat WebSocket Application

Une application de chat en temps réel utilisant WebSocket, construite avec NestJS pour le backend et Next.js pour le frontend.

## Créateur
ASSO'O EMANE Ulysse

## Technologies Utilisées

### Backend (NestJS)
- NestJS (Framework Node.js)
- Socket.IO pour la communication en temps réel
- Prisma comme ORM
- PostgreSQL comme base de données
- JWT pour l'authentification
- Multer pour la gestion des fichiers

### Frontend (Next.js)
- Next.js 15
- React 19
- Socket.IO Client
- TailwindCSS pour le styling
- Zustand pour la gestion d'état
- React Hook Form pour la gestion des formulaires

## Prérequis

- Node.js (version recommandée : 18 ou supérieure)
- PostgreSQL
- npm ou yarn

## Installation

### Backend

1. Naviguez vers le dossier server :
```bash
cd server
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez la base de données :
- Créez un fichier `.env` à la racine du dossier server
- Ajoutez les variables d'environnement nécessaires (voir `.env.example`)

4. Initialisez la base de données :
```bash
npx prisma migrate dev
```

### Frontend

1. Naviguez vers le dossier client :
```bash
cd client
```

2. Installez les dépendances :
```bash
npm install
```

## Démarrage

### Backend

Pour démarrer le serveur en mode développement :
```bash
cd server
npm run start:dev
```

Le serveur sera accessible sur `http://localhost:4000`

### Frontend

Pour démarrer l'application frontend en mode développement :
```bash
cd client
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Fonctionnalités

- Authentification des utilisateurs (inscription/connexion)
- Chat en temps réel
- Gestion des messages
- Interface utilisateur moderne et responsive
- Changement de mot de passe et de couleur de texte dans le chat
- Page profil
- Gestion des fichiers (upload photo de profil)

## Structure du Projet

```
.
├── client/                 # Frontend Next.js
│   ├── src/               # Code source
│   ├── public/            # Fichiers statiques
│   └── ...
└── server/                # Backend NestJS
    ├── src/              # Code source
    ├── prisma/           # Configuration Prisma
    └── ...
```
