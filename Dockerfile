FROM node:10.4

# Create new user so we're not running @ root
#RUN groupadd -r nodejs && useradd -m -r -g -s /bin/bash nodejs nodejs
#USER nodejs

# Create the app directory.
WORKDIR /home/nodejs/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install app dependencies
RUN npm install --production --only=production

# Bundle app source
COPY . . 

EXPOSE 8000

ENV  NODE_ENV production

CMD [ "npm", "start" ]
