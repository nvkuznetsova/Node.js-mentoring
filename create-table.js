import { Client } from 'pg';
import dotenv from 'dotenv';
import format from 'pg-format';

const users = [
    ['hobbit@test.com', 'qwerty1', 14, false],
    ['BilboBaggins@test.com', 'qwerty10', 111, false],
    ['Gandalf@test.com', 'qwerty11', 120, false],
    ['FrodoBaggins@test.com', 'qwerty123', 33, false],
    ['vasya@test.com', 'qwerty5', 23, false],
];
const insertQuery = format(
    'INSERT INTO users(login, password, age, isDeleted) VALUES %L;',
    users
);
const selectQuery = 'SELECT * FROM users;';

const createUsersTable = async () => {
    try {
        await client.connect();
        await client.query(
            `CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          login VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(50) NOT NULL,
          age INT NOT NULL,
          isDeleted BOOLEAN NOT NULL);`
        );

        await client.query(insertQuery);

        const { rows: selectedRows } = await client.query(selectQuery);
        console.log(selectedRows);

        await client.end();
    } catch (err) {
        console.log(err);
    }
};

dotenv.config();
const connectionString = process.env.CONNECTION_STRING;

const client = new Client({ connectionString });
createUsersTable();
