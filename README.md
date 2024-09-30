# Free Untis
## How to Install
- Clone the repo to your desired destination
- Create a <code>.env</code> File 
- Insert the following content (change values as you desire):
```
PORT_BACKEND=8000
PORT_FRONTEND=3000
FREEUNTIS_SERVERNAME=localhost
TOKEN_SECRET=your_token_secret
```
- You MUST specify the TOKEN_SECRET, otherwise the application will not run!
- If you don't specify the PORTs, the default will be <code>3000</code> for frontend and <code>8000</code> for backend.
- If you don't specify the FREEUNTIS_SERVERNAME, the default will be <code>localhost</code>.

Fire up your container with:
```
docker compose up -d
```
Open Browser and go to  http://localhost:3000/ (or whatever hostname:port you chose)
