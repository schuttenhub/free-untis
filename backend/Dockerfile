FROM node:20-alpine

# Install Python and build dependencies
USER root

RUN apk add --no-cache python3 sqlite py3-pip make g++ \
    && ln -sf python3 /usr/bin/python

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/
COPY entrypoint.sh ./

RUN chmod a+x ./entrypoint.sh

USER node

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
