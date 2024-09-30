#!/bin/sh
# entrypoint.sh

cd app/

# Install dependencies
npm install

# Start the application
node server.js
