#!/bin/sh
# entrypoint.sh


##  
cd app/
### init DB if not existent
cd db/

if [ ! -f 'freeuntis.db' ]; then 
	sqlite3 freeuntis.db < init.sql
	echo "DB created!"
fi
cd ..

### Install & start NodeJS
# Install dependencies
npm ci
# Start the application
npm run dev
