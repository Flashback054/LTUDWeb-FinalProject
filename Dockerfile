FROM node:20.4.0-alpine

# Create app directory
WORKDIR /app

# NOTE: seperate COPY commands to take advantage of Docker's build cache and only rebuild the layers that have changed

  # Copy package.json and package-lock.json to /app
COPY package*.json ./

# Install dependencies
RUN yarn install
# Install typescript compiler
RUN yarn global add typescript

# Copy the rest of the app's source code to /app
COPY . .

# Build the app
RUN yarn build

# Copy the public and views folders to /app/dist
RUN cp -r src/primary-server/public dist/src/primary-server/public
RUN cp -r src/primary-server/views dist/src/primary-server/views

# Run the app
CMD ["yarn", "run", "start:prod"]

# Expose port 8080
EXPOSE 8080
EXPOSE 6969