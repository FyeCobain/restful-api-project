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

# test verbose
$ yarn run test:ver

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Commits (newest to oldest)

**Tickets pagination implemented**
* Tickets pagination working.

**Base repository and tickets service improved**
* Base repository's find method now accepts skip, limit and sort parameters.
* TicketsService code refactorized.

**Tiny code improvement**
* Default database restored.
* Eslint alert temporarily disabled.

**Tickets sorting and filtering implemented**
* Tickets can be sorted ascending or descenging by due date.
* Tickets without due date go to the end.
* Tickets can be filtered by category.

**Tickets service improved**
* Tickets service now checks if assignee exists on create.
* Soft delete implemented.

**Tickets DTOs improved**
* Ticket create and update DTOs improved with @Transform.
* Ticket schema no longer needs lowercase option.

**Tickets Dto's improved**
* Ticket create and update Dto improved.

**Tickets basic CRUD implemented**
* Basic crud implemented in controller and service.
* No new libraries added.

**Tickets module added**
* No new libraries added.

**JwtManager class added**
* Added class for manual jwt validation and payload recovery.
* Jwt manual validation is no longer in AuthService.

**Status codes improved**
* Status codes are now more consistent.

**Common return types encapsulated**
* Common return types (mostly promises) encapsulated.

**Comments refactorized**
* Redundant comments were deleted, now the code is cleaner.

**Auth tests implemented**
* Auth.controller.spec.ts implemented.
* Auth data and service mocked up.

**Users feature tests improved**
* UsersService mock up properly implemented.
* Single user stub changed to a list of users.

**Users service tests implemented**
* Users.service.spec.ts implemented.

**Users controller tests implemented**
* DeleteResult type added.
* User data and service mocked up.
* Users.controller.spec.ts implemented.

**Users service updated added**
* Users service now works with the abstract entity repository.

**Entity abstract repository added**
* No new libraries added.

**Services interfaces added**
* Added interfaces for each service.
* Interfaces code refactorized.
* Added types for JWTs object.

**Email template improved**
* Email template improved.

**Email sending improved**
* Email errors catched.
* Email template improved.

**Email sending working**
* Email sending working for password reset request token.
* Libraries added:
[nodemailer](https://www.npmjs.com/package/nodemailer)
[@nestjs-modules/mailer](https://www.npmjs.com/package/@nestjs-modules/mailer)
[ejs](https://www.npmjs.com/package/ejs)

**Tiny code fixes**
* Tiny code fixes in many places.

**Reset password endpoint added**
* Reset password endpoint working.
* Implemented service method for manully validate JWT's signature.

**Reset password request endpoint added**
* Reset password request endpoint and service method working and returning JWT.

**IdValidGuard created**
* Created guard for checking if the give user id has a valid mongoose id format.

**SubExistsGuard created**
* Created guard for checking if the token's sub exists in the database.

**Guards implemented and services updated**
* Guards and validations implemented in user endpoints.
* User service create and update methods now hashing password.
* Auth service create method no longer hashing password.

**Documentation improved**
* Added 'ApiTag' to controllers.
* Added 'ApiResponse' to endpoints.
* Document endpoint changed to '/docs'.
* Added 'lowercase: true' to the email's prop.
* 'forceConsistentCasingInFileNames' changed to true.

**Added whitelist and transform validation options**
* Whitelist and transform validation options set to true.
* Projection objects added in find methods.
* Improved some returned exceptions.

**Blank fields handling improved**
* Added filters and helpers for blank fields handling in DTOs.

**Documentation improved**
* Swagger documentation improved.

**Refresh endpoint working**
* Refresh endpoint working properly.

**Logout endpoint working**
* Logout endpoint working properly.
* JWT strategies and guards added.

**SignIn endpoint added**
* SignIn working properly. No libraries added.

**Added Auth module**
* Secrets .env variables validated.
* SignUp endpoint working.
* Libraries added:
[@nestjs/jwt](https://www.npmjs.com/package/@nestjs/jwt)

**Added exception filters and statuses**
* Added exception filters, helper classes.
* Returning correct http statuses.

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
* Libraries added:
[argon2](https://www.npmjs.com/package/argon2)
[passport](https://www.npmjs.com/package/passport)
[passport-jwt](https://www.npmjs.com/package/passport-jwt)
[@nestjs/passport](https://www.npmjs.com/package/@nestjs/passport)
[joi](https://www.npmjs.com/package/joi)

**csrf protection added**
* Libraries added:
[express-session](https://www.npmjs.com/package/express-session)
[create-nestjs-middleware-module](https://www.npmjs.com/package/create-nestjs-middleware-module)
[@tekuconcept/nestjs-csrf](https://www.npmjs.com/package/@tekuconcept/nestjs-csrf)

**MongoDB connection added**
* MongoDB connection working.
* Libraries (already added):
[mongoose](https://www.npmjs.com/package/mongoose)
[@nestjs/mongoose](https://www.npmjs.com/package/@nestjs/mongoose)
