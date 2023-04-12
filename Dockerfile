FROM node:19-slim

# Create app directory
WORKDIR /home/node/app

USER node

CMD [ "tail", "-f", "/dev/null" ]	