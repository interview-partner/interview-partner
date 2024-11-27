# Use Node.js official image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose the application port
EXPOSE 8010

# Start the application
CMD ["node", "app.js"]