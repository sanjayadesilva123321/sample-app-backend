# Use Node.js 18.18.2 as the base image
FROM node:18.18.2

# Create and set the working directory in the container
WORKDIR /usr/src/app

# Copy both package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code from your host to the container
COPY . .

# Build the Nest.js app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to start the app
CMD ["npm", "run", "start:prod"]

#omit dev dependecies in prod