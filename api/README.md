## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Commits (newest to oldest)

**Nest.js commit descriptions added**
* Commit description added to this README.md file.

**User module and endpoints added**
* User module and endpoints working. No libraries added.

**moduleNameMapper added**
* 'moduleNameMapper' added in _package.json_ for testing paths resolve.

**listen port loaded from enviroment**
* No libraries added.

**minor csrf protection code improvement**
* Http methods specified in the global csrf protection code.

**Added env vars validation**
* .env file variables valitated using joi. No libraries added.


**Added argon2, passport and joi libraries**
* Libraries:
[argon2](https://www.npmjs.com/package/argon2)
[passport](https://www.npmjs.com/package/passport)
[passport-jwt](https://www.npmjs.com/package/passport-jwt)
[@nestjs/passport](https://www.npmjs.com/package/@nestjs/passport)
[joi](https://www.npmjs.com/package/joi)

**csrf protection added**
* Libraries:
[express-session](https://www.npmjs.com/package/express-session)
[create-nestjs-middleware-module](https://www.npmjs.com/package/create-nestjs-middleware-module)
[@tekuconcept/nestjs-csrf](https://www.npmjs.com/package/@tekuconcept/nestjs-csrf)

**MongoDB connection added**
* MongoDB connection working.
* Libraries (already added):
[mongoose](https://www.npmjs.com/package/mongoose)
[@nestjs/mongoose](https://www.npmjs.com/package/@nestjs/mongoose)
