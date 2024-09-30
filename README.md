# Free Untis

## How to Install
- Clone the repo to your desired destination
### Optional (but highly recommended)
- In the frontend and backend directory, create a .env file
- In both .env files, specify a <code>PORT=1234</code> environment variable with your desired port (Default is)
- In the backend .env file, additionally specify your private key for storing user passwords in the database and authenticating them like this: </br>
<code>TOKEN_SECRET=your_token_secret</code> </br>
- Fire up your ready-to-go Container with <code>docker compose up -d</code>

## Lokal Testen
### Docker Compose
Um Backend und Frondend lokal zu testen führe folgenden Befehl aus:
```
docker compose up -d
```
Anschließen im Browser auf http://localhost:3000/ zugreifen.
