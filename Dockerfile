# Use a lightweight Node.js image
FROM node:18-alpine 

# Set working directory
WORKDIR /app

# Copy only package.json first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy remaining application files
COPY . .


# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]


