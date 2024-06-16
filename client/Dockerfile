# Step 1: Build the React app
FROM node:16 as build

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install

COPY . /app
RUN npm run build

# Step 2: Serve the React app using a simple HTTP server
FROM node:16-alpine

WORKDIR /app

COPY --from=build /app/build /app/build

RUN npm install -g serve

# Set the default port to 3000 if not provided
ENV PORT=${PORT:-3000}

CMD ["sh", "-c", "serve -s build -l $PORT"]
