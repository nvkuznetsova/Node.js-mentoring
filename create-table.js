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

const insertGroupsQuery = `INSERT INTO groups(name, permissions) VALUES 
    ('Group1', ARRAY['READ', 'WRITE']),
    ('Group2', ARRAY['READ', 'WRITE', 'DELETE']),
    ('Group3', ARRAY['READ', 'SHARE']);`;
const selectGroupsQuery = 'SELECT * FROM groups;';

const createUsersTable = async (client) => {
    try {
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
    } catch (err) {
        console.log(err);
    }
};

const createGroupsTable = async (client) => {
    try {
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
        await client.query(
            `CREATE TABLE IF NOT EXISTS groups (
          id UUID DEFAULT uuid_generate_v4(),
          name VARCHAR(255) UNIQUE NOT NULL,
          permissions TEXT[] NOT NULL,
          PRIMARY KEY (id));`
        );

        await client.query(insertGroupsQuery);

        const { rows: selectedRows } = await client.query(selectGroupsQuery);
        console.log(selectedRows);

    } catch(err) {
        console.log(err);
    }
}

const createUserGroupTable = async (client) => {
    try {
        await client.query(`CREATE TABLE IF NOT EXISTS usergroup (
            group_id UUID NOT NULL,
            user_id SERIAL NOT NULL,
            PRIMARY KEY (group_id, user_id),
            CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE,
            CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );`);
    } catch(err) {
        console.log(err);
    }
}

const createTables = async (client) => {
    try {
        await client.connect();
        await createUsersTable(client);
        await createGroupsTable(client);
        await createUserGroupTable(client);
        await client.end();
    } catch(err) {
        console.log(err);
    }
}

dotenv.config();
const connectionString = process.env.CONNECTION_STRING;

const client = new Client({ connectionString });
createTables(client);
