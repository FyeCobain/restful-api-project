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

## Seeding
```bash
# seeding data into MongoDB
$ yarn run seed
```

## Commits (newest to oldest)

**Nest.js project finished**

* The Nest.js project is finished and working properly.
* Overall code improvement.

**Added properties helpers**
* Added helper functions to verify if properties are defined / undefined.

**Tickets tests implemented**
* Tickets tests where correctly implemented.

**Categories service test implemented**
* Added tests to the categories service spec file.

**Users service test file update**
* More tests added to users service spec file.

**Categories mock up service implemented**
* The mock up service for categories is working properly.

**Services mock ups added**
* Added jest mock-ups for the categories and tickets services.

**Added protection for NoSQL injection**
* Filter queries has been parameterized.

**Seeding scripts updated**
* Now the executed seeder script is the source .ts file instead of de builded .js file.

**Tickets seeder added**
* All seeders can be run using 'yarn run build' and then 'yarn run seed'.

**Categories seeder added**
* All seeders can be run using 'yarn run build' and then 'yarn run seed'.

**Added users seeding**
* Users can be seeded now using 'yarn run build' and then 'yarn run seed'.
* Libraries added:
[nestjs-seeder](https://www.npmjs.com/package/nestjs-seeder)
[@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker)

**User tests updated**
* Users data corrections.

**User and auth tests updated**
* User and auth tsts updated to match updated controllers.
* User mock up stub updated.

**Token expired message updated**
* 'Token expired' updated to 'Acces token expired'.

**User update bug fixed**
* Bug fixed when trying to update the user.

**Added new import comments**
* Added comments to tickets and categories imports.

**Added access token expiration verification**
* Now if access token is valid but expired, an 'Access token expired' message is returned.

**sendEmail method improved**
* Now the sendEmail method returns true when email was sent, false otherwise.

**Bug fixed and overall refactorization**
* fixed a bug in the refreshToken endpoint.
* Auth service and tickets service refactorize.

**Added assignee validations**
* Now only the assignee can perform CRUD Operations on the tickets.
* Tickets and categories working properly.

**Auth required for tickets and categories**
* Added guards to check if the user is authenticated and exists.

**Categories controller code improved**
* Added response codes documentation.
* Added exception filters for create and update.

**Abstract entity repository refactorized**
* Added new type for the repositories and services.

**Categories code refactorized**
* Added interface and types for the categories service.

**Categories sorting by name implemented**
* Categories can be sortied ascending or descending.

**Base repository and services improved**
* count() method added to EntityRepository.
* Added association verification on categories deletion.

**Tickets service updated**
* Tickets service now checks if the category exists on setting it.
* Custom guards moved to src.

**Categories validation added**
* Controller, service, and Dto validation added.

**Categories basic CRUD implemented**
* Basic crud implemented in controller and service.

**Categories module added**
* No new libraries added.

**Tickets code refactorized**
* Added interface and types for the ticket service.

**Tickets DTOs documentation improved**
* Added 'required: false' in optional properties.

**Tickets controller and service improved**
* Controller's documentation improved.
* Guards and filters added.
* Service validation added.

**Tickets pagination and sorting improved**
* findAllAndParse method added to TicketsRepository.
* Now tickets are sorted by due date using aggregation.

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
