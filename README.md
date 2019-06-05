# Northcoders NC News Project API

A RESTful API for a reddit-style website called Bogus News.

Bogus News has a database of articles, each within a topic and created by a user. Logged-in users can like or dislike an article and comment on that article. Comments can also be liked or disliked. Users can create new topics and articles or delete their own articles and comments.

The ncnews api is hosted on Heroku [here](https://alcrewe-news.herokuapp.com/api).

You can find the frontend GitHub repository [here](https://github.com/alvincentinio/bogusnews).

## Built With

- [Node.js](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org/) - open-source relational database
- [Express.js](https://expressjs.com/) (v4.16.4) - a web application framework for Node.js
- [Knex.js](https://knexjs.org/) (v0.16.5) - SQL query builder used with Postgres
- [node-postgres(pg)](https://node-postgres.com/) (v7.10.0) - a collection of node.js modules for interfacing with the PostgreSQL database
- [nodemon](https://nodemon.io/) (v1.18.11)

## Tested With

- [Chai](https://www.chaijs.com/) (v4.2.0) - testing assertion library for Node.js
- [Mocha](https://mochajs.org/) (v6.1.3) - JavaScript testing framework running on Node.js
- [Supertest](https://www.npmjs.com/package/supertest)(v4.0.2) - a library for testing Node.js http servers

## Getting Started

To run the API on your machine please follow the steps below.

### Prerequisites

You will need to check you have Node.js installed.

```
node -v
```

If not please follow the instructions at [Node.js](https://nodejs.org/en/). This will also install npm.

Also check you have [git](https://git-scm.com/downloads) installed

```
git --version
```

You will also need [PostgreSQL](https://www.postgresql.org/)

### Installing

Clone this GitHub repository in the folder you want to install it

```
git clone https://github.com/alvincentinio/ncnews.git
```

Create a file called knexfile.js and copy and paste this code into it

```
const ENV = process.env.NODE_ENV || "development";
const { DB_URL } = process.env;

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfigs = {
  development: {
    connection: {
      database: "ncnews"
    }
  },
  test: {
    connection: {
      database: "ncnews_test"
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...baseConfig, ...customConfigs[ENV] };

```

Then install all dependencies

```
npm i
```

Start [PostgreSQL](https://www.postgresql.org/)

```
brew services start postgresql
```

In the terminal seed the development database

```
npm seed-dev
```

Now run the server locally

```
npm run dev
```

The API can now be accessed through localhost:9090 or by using a REST Client such as [Insomnia](https://insomnia.rest/)

## API Endpoints

A JSON representation of all the available endpoints on the API can be found [here](https://alcrewe-news.herokuapp.com/api)

## Running The Tests

```
npm t
```

# Hosting Your Own Version Using Heroku

## 1. Install the Heroku CLI

On macOS:

```bash
brew tap heroku/brew && brew install heroku
```

...or Ubuntu:

```bash
sudo snap install --classic heroku
```

## 2. Create a Heroku App

Log into Heroku using their command line interface:

```bash
heroku login
```

Create an app in an active git directory. Doing this in the folder where your server exists is a good start, as this is what you will be hosting.

```bash
heroku create your-app-name
```

Here `your-app-name` should be the name you want to give your application. If you don't specify an app name, you'll get a random one which can sometimes be a bit iffy.

This command will both create an app on Heroku for your account. It will also add a new `remote` to your git repository.
Check this by looking at your git remotes:

```bash
git remote -v
```

## 3. Push Your code up to Heroku

```bash
git push heroku master
```

## 4. Creating a Hosted Database

Go to the heroku site and log in.

- Select your application
- `Configure Add-ons`
- Choose `Heroku Postgres`

The free tier will be adequate for our purposes. This will provide you with a `postgreSQL` pre-created database!

Check that the database exists. Click `settings` on it, and view the credentials. Keep an eye on the URI. Don't close this yet!

## 5. Seeding the Production Database

Check that your database's url is added to the environment variables on Heroku:

```bash
heroku config:get DATABASE_URL
```

If you are in your app's directory, and the database is correctly linked as an add on to Heroku, it should display a DB URI string that is exactly the same as the one in your credentials.

Make sure to **run the seed prod script** from your `package.json`:

```bash
npm run seed:prod
```

Commit your changes, and push to heroku master.

```bash
git push heroku master
```

## 6. Review Your App

```bash
heroku open
```

Any issues should be debugged with:

```bash
heroku logs --tail
```

## Author

- **Alistair Crewe**

## Acknowledgments

Thanks to all the tutors and staff at Northcoders Manchester.
