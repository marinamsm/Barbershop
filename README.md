# Barbershop Scheduling Application - Backend

This is a project using Node, Express, Typescript, TypeORM, PostgreSQL, MongoDB, Redis, S3, SES and many other technologies and tools. It has logIn, scheduling services to schedule the user's appointments, to list the barber's appointments in a given period, to upload profile's picture, send notifications etc.

### Prerequisites

Node.js, PostgreSQL (or docker with PostgresSQL's image), MongoDB (docker), Redis (docker) and a package manager like npm or yarn.

### Installing

Run `npm install` or `yarn` to install all the dependencies.
Run `npm run dev` or `yarn dev:server` to run the server.

## Getting Started

The following endpoints can be tested with this server and all of them demand a bearer token as authorization:

To create your user (the body receives name (string), email (string) and password(string)):
    POST http://localhost:3333/users

To log in (the body receives email (string) and password(string)):
    POST http://localhost:3333/sessions

To upload a profile's picture (the body is a form-data with the field avatar (File)):
    PATCH http://localhost:3333/users/avatar

To get the token to reset you password (it receives the user's email (string) and an email is sent to him/her):
    POST  http://localhost:3333/password/forgot

To reset the password (the body receives token (string), password (string) and passwordConfirmation (string)):
    POST http://localhost:3333/password/reset

To list the providers in the platform:
    GET http://localhost:3333/providers

To get my appointments as a provider (it receives the query params: month (number), year (number) and date (number)):
    GET http://localhost:3333/appointments/me

To schedule an appointment (receives providerId (string) and date (ISOString)):
    POST http://localhost:3333/appointments/

To list a provider's schedule in a day (receives the query params: month (number), year (number) and date (number)):
    GET http://localhost:3333/providers/:id/day-availability

To list a provider's schedule in a day (receives the query params: month (number) and year (number)):
    GET http://localhost:3333/providers/:id/month-availability

## Running the tests

Run `npm test` or `yarn test` to run all the unit tests.
