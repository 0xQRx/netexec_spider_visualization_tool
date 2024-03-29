# Use an official Node runtime as a parent image, specifying version 18
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run the app, using server.js as the entry point
CMD [ "node", "server.js" ]
