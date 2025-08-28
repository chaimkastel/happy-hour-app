FROM node:20-bullseye

WORKDIR /app

# Copy Prisma schema EARLY so postinstall (prisma generate) can see it
COPY prisma ./prisma/

# Install deps
COPY package.json package-lock.json* ./
RUN npm install --silent

# Copy the rest
COPY . .

# Generate Prisma client (explicit path just in case)
RUN npx prisma generate --schema=prisma/schema.prisma

EXPOSE 3000
CMD ["npm","run","dev"]
