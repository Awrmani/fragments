# Use node version 18.14.2 - https://hub.docker.com/_/node
FROM node:18.14.2@sha256:586cdef48f920dea2f47a954b8717601933aa1daa0a08264abf9144789abf8ae AS dependencies

LABEL maintainer="Arman Valaee <armanvalaee@gmail.com>" \
      description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory - https://docs.docker.com/engine/reference/builder/#workdir
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm install

########################################################
FROM node:18.14.2-alpine3.16@sha256:84b677af19caffafe781722d4bf42142ad765ac4233960e18bc526ce036306fe AS deploy

WORKDIR /app
COPY --from=dependencies /app /app

# Copy src to /app/src/
COPY --chown=node:node ./src ./src

# Copy our HTPASSWD file
COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd

# Change to a lower privilaged user
 USER node

# Start the container by running our server
CMD ["node", "src/index.js"]

HEALTHCHECK --interval=30s --timeout=1m --retries=3 \
    CMD curl --fail http://localhost:${PORT}/ || exit 1

# We run our service on port 8080
EXPOSE 8080
