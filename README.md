# nome progetto: IL LIBRO ALCHEMICO 

Il progetto è un sito web che contiene una grndissima dispensa di ricette ( insomma un ricettario) nel quale ci si può registrare/loggare e si possoo cercare, recensire e pubblicare ricette.



## FUNZIONI GENERALI DEL SITO : 
- registrazione, log in/out, eliminazione account. ( se account viene eliminato è irreversibile )
- se si prova a accedere con crediziali sbagliate/insesitsenti appare il messaggio di errore.

- DALLA SEZIONE PROFILO SI PUO':
- si possono inserire ricette con relativa descrizione e foto, cancellare e rimuovere ricette (già salvate) di altre persone dal proprio ricettario.
- si possono cambiare le credenziali ( es. password )

- DALLA PAGINA DI UNA DETERMINATA RICETTA SI PUO' : 
- si possono recensire le ricette (anche cancellare le recensioni).
- aggiungere una ricetta al proprio ricettario

- LA HOME:
- la home è strutturata in modo tale che a ogni refresh le ricette in evidenza cambino.
- nella home c'è una barra di ricerca che permette di cercare determinate ricette attraverso il nome ( se vuole provare basta il nome generico del piatto es. paella, pizza ecc..)

- DATABASE : il database contiene e memorizza tutte le ricette che vengono aggiunte ,  i nuovi profili e le varie recensioni. Il database è già fornito di un enorme roster di ricette.


## AVVIAZIONE E INSTALLAZIONE:
- per avviare il progetto basta andare su terminale e digitare il comando ' npm run dev' e ti avvia il frontend , backend e database


## CREDENZIALI: 
non sono state utilizzate credenziali mock
se non vuole registrarsi le credenziali sono:
nome utente: gimmy
password: 27Gimmy27





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
