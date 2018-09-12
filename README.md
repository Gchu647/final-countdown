# Final Countdown
> An app for those you leave behind

___

## Installation

```

npm install

```

___

## Database Setup
1. Install [PostgreSQL](https://www.postgresql.org/download/)

2. Replace ```your_db_user``` and ```your_password``` with custom values in the code block below, and run the following commands to create your database:

```

# From the terminal:

psql


# From the PostgreSQL CLI:

DROP DATABASE IF EXISTS fn_countdown_db;
DROP USER IF EXISTS your_db_user;
CREATE USER your_db_user WITH PASSWORD 'your_password';
CREATE DATABASE fn_countdown_db WITH OWNER your_db_user;

```

3. Create and populate your database tables by running the following commands in the terminal from the project root directory:

```

# Create database tables:

./node_modules/.bin/knex migrate:latest


# Seed database tables:

./node_modules/.bin/knex seed:run

```

___

## Environment Configuration

1. Copy the contents of ```.env.example``` into a file named ```.env``` by running the following command from the project root directory:

```

cp .env.example .env

```

2. Replace ```username```, ```password```, ```secret``` in the newly created ```.env``` file with the values  previously assigned in Step 2 of "Database Setup" to ```your_db_user``` and ```your_password```, respectively.

___

## Contributors

* George Chu
* Isaiah Harris
* Bronson Avila
