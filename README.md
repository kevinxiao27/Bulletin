# Bulletin is a board for finding Study Groups at UBC

Clubs and organizations can post events and registration forms on Bulletin
which will be pushed to the wider UBC community.

## To clone this repository

In your terminal type
`git clone https://github.com/kevinxiao27/Bulletin.git`
`cd bulletin-backend-app`
`npm i`

## To run the server

Add a .env file under the bulletin-backend-app folder
Create the following environment variables:

- MONGODB_URI with the URI for your MONGODB cluster
- SECRET_KEY with a secure secret key to create JWT Tokens for authentication
- JWT_EXPIRES_IN to configure the length of time for your tokens to remain valid

## To run unit tests

`npm test`
