# Free Untis

## How to Install
- Clone the repo to your desired destination
- Create a <code>.env</code> File 
- Type the following content: </br>
<code>PORT_BACKEND=8000
PORT_FRONTEND=3000
FREEUNTIS_SERVERNAME=localhost
TOKEN_SECRET=your_token_secret 
</code> </br>
- You MUST specify the TOKEN_SECRET, otherwise the application will not run!
- If you don't specify the PORTs, the default will be 3000 for frontend and 8000 for backend.
- If you don't specify the FREEUNTIS_SERVERNAME, the default will be localhost.


## Lokal Testen
### Docker Compose
Um Backend und Frondend lokal zu testen führe folgenden Befehl aus:
```
docker compose up -d
```
Anschließen im Browser auf http://localhost:3000/ zugreifen.
