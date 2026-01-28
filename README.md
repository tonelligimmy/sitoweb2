# IL LIBRO ALCHEMICO

Piattaforma web per la gestione di ricette, che integra un vasto database esterno (TheMealDB) con un ricettario personale. Gli utenti possono cercare, condividere, recensire e organizzare ricette.


## Descrizione e Scopo del Progetto

**IL LIBRO ALCHEMICO** è un ricettario digitale interattivo che consente agli utenti di:
- Registrarsi e gestire il proprio profilo
- Cercare ricette da un database esterno (TheMealDB) e dal database locale
- Creare e condividere ricette personalizzate
- Compilare un ricettario personale
- Lasciare e visualizzare recensioni su ricette
- Modificare le proprie credenziali di accesso

Il progetto combina un **backend Node.js/Express** con un **frontend React**, utilizzando **MongoDB** per contenere i dati.


## Installazione e Esecuzione

### Prerequisiti
- **Node.js** (versione 14+) e **npm**
- **MongoDB** (locale o connessione remota tramite URI)
- **Git** (per clonare il repository)

### Passo 1: Clonare il Repository
```bash
git clone <URL_REPOSITORY>
cd sitoweb
```

### Passo 2: Installare le Dipendenze
Nella radice del progetto:
```bash
npm install
```

Questo installa automaticamente le dipendenze del **backend** e della libreria `concurrently`.

### Passo 3: Configurare le Variabili d'Ambiente
Crea un file `.env` nella cartella `backend/`:
```env
MONGO_URI=mongodb://localhost:27017/ProgUni
PORT=3000
JWT_SECRET=your_secret_key_here
```

### Passo 4: Installare Dipendenze del Frontend
```bash
cd frontend
npm install
cd ..
```

### Passo 5: Avviare il Progetto
Dalla radice del progetto:
```bash
npm run dev
```

Questo comando avvia:
- **Backend** su `http://localhost:3000`
- **Frontend** su `http://localhost:3001`

#### Alternative:
- **Solo Backend:** `npm start`
- **Solo Frontend:** `cd frontend && npm start` (la porta di default è `3000`, cambierà automaticamente a `3001`)



## API Utilizzata

### TheMealDB (API Esterna)
- **Base URL:** `https://www.themealdb.com/api/json/v1/1/`
- **Utilizzo:** Ricerca ricette per nome, recupero dettagli ricette

 Non richiede autenticazione ed è gratuita.

### API Locale (Backend)

#### Authentication (`/api/auth`)
- `POST /register` - Registrazione nuovo utente
- `POST /login` - Login utente
- `POST /me` - Verifica password (richiede autenticazione)

#### Users (`/api/users`)
- `GET /me` - Ottieni dati profilo (richiede autenticazione)
- `PATCH /me` - Modifica profilo (richiede autenticazione)
- `DELETE /me` - Elimina account (richiede autenticazione)

#### Recipes (`/api/recipes`)
- `GET /search?q=<query>` - Ricerca ricette (fallback: locale → esterno)
- `GET /ricettario` - Ottieni ricettario utente (richiede autenticazione)
- `POST /local` - Aggiungi ricetta locale (richiede autenticazione)
- `GET /local/:id` - Leggi ricetta dal database
- `GET /external/:id` - Leggi ricetta da TheMealDB
- `PATCH /local/:id` - Modifica ricetta propria (richiede autenticazione)
- `DELETE /local/:id` - Elimina ricetta propria (richiede autenticazione)

#### Reviews (`/api/reviews`)
- `GET /:id?fonte=local|external` - Ottieni recensioni ricetta
- `POST /` - Aggiungi recensione (richiede autenticazione)
- `DELETE /:id?fonte=local|external` - Rimuovi propria recensione (richiede autenticazione)

## Credenziali e Mock

### Credenziali Demo (Precaricate)
Se non vuoi registrarti, usa:
- **Username:** `gimmy`
- **Password:** `27Gimmy27`

### Note sulla Sicurezza
- Le password vengono crittografate con **bcryptjs**
- L'autenticazione utilizza **JWT (JSON Web Token)**
- Nessun dato mock: tutti i dati vengono persistiti in MongoDB
- La eliminazione di un account è **irreversibile**



## Funzionalità Completate

**Autenticazione e Autorizzazione**
- Registrazione utenti con password crittografata
- Login/Logout con JWT
- Modifica password
- Eliminazione account (irreversibile)
- Middleware di autenticazione per rotte protette

**Gestione Profilo**
- Visualizzazione dati profilo
- Modifica credenziali utente
- Eliminazione account

**Ricettario Personale**
- Creazione ricette personalizzate
- Modifica ricette proprie
- Eliminazione ricette proprie
- Visualizzazione ricettario personale

**Ricerca Ricette**
- Ricerca da database locale
- Fallback a TheMealDB (API esterna)
- Homepage con ricette evidenziate (casuali ad ogni refresh)
- Barra di ricerca con autocompletamento

**Dettagli Ricetta**
- Visualizzazione ricetta completa (ingredienti, preparazione, foto)
- Aggiunta ricetta al proprio ricettario
- Visualizzazione origine ricetta (locale vs. esterna)

**Sistema di Recensioni**
- Lettura recensioni per ricetta
- Aggiunta recensioni (solo utenti loggati)
- Eliminazione proprie recensioni
- Separazione tra ricette locali ed esterne

**Frontend**
- Interfaccia reattiva con React
- Routing client-side con React Router
- Gestione autenticazione via JWT (localStorage)
- Stile CSS Bootstrap e personalizzato
- Design responsive

**Backend**
- API REST con Express.js
- Persistenza dati MongoDB
- Validazione input
- Gestione errori
- CORS configurato per dev server
- Serve static files frontend in produzione







servono 5 Routes

autenticazione:
                --> Registrazione utente    (POST   /register)
                --> Login utente            (POST    /login)
                --> Modifica Password Check (POST   /me)                    (solo loggato)


utenti:
                --> Dati profilo            (GET    /me/)                   (solo loggato)
                --> Modifica profilo        (PATCH  /me)                    (solo loggato) non uso put perche aggiorno solo i campi modificati e non tutto l'oggetto
                --> Elimina Profilo         (DELETE /me)                    (solo loggato)



ricettario:
                --> Ottieni ricettario      (GET        )                   (solo loggato)
                --> Aggiuingi ricetta       (POST       )                   (solo loggato)
                --> Rimuovi ricetta         (DELETE /:id)                   (solo loggato)
recensioni:
                --> Recensioni Ricetta X    (GET    /:id?fonte=local|external)               uso un queery param così rendo il tutto più comprensibile 
                --> Aggiungi recensione     (POST       )                     (solo loggato)
                --> Rimuovi Recensione      (DELETE /:id?fonte=local|external)(solo loggato) uso un queery param così rendo il tutto più comprensibile 



recipes: 

                --> Ricerca On e poi DB     (GET    /search?q=ricetta)      approccio Fallback 

                --> Ottieni ricettario      (GET    /ricettario)            (solo loggato)
                --> Aggiungi ricetta DB     (POST   /local)                 (solo loggato)
                --> Leggi ricetta    DB     (GET    /local/:id)  
                --> Leggi ricetta    ON     (GET    /external/:id)  
                --> Modifica ricetta DB     (PATCH  /local/:id)             (solo loggato e autore) non uso put perche aggiorno solo i campi modificati e non tutto l'oggetto
                --> Elimina ricetta  DB     (DELETE /local/:id)             (solo loggato e autore)
