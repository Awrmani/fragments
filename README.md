
# Installing Packages & Dependencies Instructions

## npm Setup

npm init -y --> -y means yes to all

npm install --> validates package.json and creates package-lock.json


## Prettier Setup

npm install --save-dev --save-exact prettier --> --save-dev means development dependancy (Not needed for production), --save-exact to use the exact version.

Create .prettierrc and .prettierignore (to ignore some files and folders such as node_modules) files.

Finally install prettier extension.


## ESLint Setup

npm install --save-dev eslint

npx eslint --init

Info on how to configure ESLint --> https://eslint.org/docs/latest/use/configure/

Install ESLint VSCode extension.


Add lint script to package.json: "lint": "eslint --config .eslintrc.js src/\*\*"

More about ESLint cli options: https://eslint.org/docs/latest/use/command-line-interface


## Structured Logging and Pino Setup

npm install --save pino pino-pretty pino-http --> Using --save to have the dependencies added to package.json automatically.

Create pino logger instance in src/logger.js: https://getpino.io/#/docs/api?id=logger


## Express App Setup

npm install --save express cors helmet compression

Create src/app.js


## Express Server Setup

npm install --save stoppable

Create src/server.js


## Server Startup Packages

npm install --save-dev nodemon --> Nodemoon to automatically reload the server when the code changes.

Adding Some scripts to package.json:

start: Runs normally.

dev: Runs via nodemoon to watch src/ folder for any changes.

debug: Same as dev but starts node inspector on port 9229 to attach a VSCode debugger.


"start": "node src/server.js"

"dev": "LOG_LEVEL=debug nodemon ./src/server.js --watch src"

"debug": "LOG_LEVEL=debug nodemon --inspect=0.0.0.0:9229 ./src/server.js --watch src"


# Runing Scripts Instruction

run lint --> npm run lint

Running Server Manually --> node src/server.js

curl to check the response --> curl http://localhost:8080

pipe curl output to jq, pretty print the JSON (-s silences usual output, only sending server response to jq) --> curl -s http://localhost:8080 | jq (WSL2 IPV4 address instead of localhost)


## Starting The Server Using Script Methods

npm start

npm run dev

npm run debug

start: Runs normally.

dev: Runs via nodemoon to watch src/ folder for any changes.

debug: Same as dev but starts node inspector on port 9229 to attach a VSCode debugger.

