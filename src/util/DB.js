import path from 'path';
import {
    Database as sqliteDatabase,
    open as sqliteOpen,
} from 'sqlite';
import sqlite3 from 'sqlite3';

class DB {
    constructor(dbSchema) {
        this.db = null;
        this.dbSchema = dbSchema;
    }

    async init() {
        await this.#openDatabase();
    }

    ready() {
        return this.db instanceof sqliteDatabase;
    }

    async #openDatabase() {
        if (!process.env.DB_NAME || process.env.DB_NAME === '') {
            throw Error('No environment variable for DB_NAME');
        }

        this.db = await sqliteOpen({
            filename: path.resolve(__dirname, '../../db/', process.env.DB_NAME),
            driver: sqlite3.Database
        });

        // Check if migrations need to be run
        const tables = await this.db.all('SELECT name FROM sqlite_master WHERE type="table"');
        if (! tables.find(t => t.name === this.dbSchema.name)) {
            await this.#migrate();
        }
    }

    async #migrate(forceClear = false) {
        if (this.ready()) {
            const migrated = await this.db.migrate({
                force: forceClear,
                migrationsPath: path.resolve(__dirname, '../../db/migrations/')
            });

            return migrated;
        } else {
            throw Error('No database');
        }
    }

    async #insertRow(values) {
        this.#validateSchemaValues(values);

        const fieldNames = Object.keys(this.dbSchema.fields);

        const rawQuery = `INSERT INTO ${this.dbSchema.name} (${fieldNames.join(', ')}) `
            + `VALUES (${fieldNames.map(f => `@${f}`).join(', ')})`

        const query = await this.db.prepare(rawQuery);
        const bindValues = {};
        fieldNames.forEach(f => {
            bindValues[`@${f}`] = values[f];
        });

        await query.bind(bindValues);

        const res = await query.run();

        return res;
    }

    async #updateRow(values) {
        this.#validateSchemaValues(values);

        const index = this.dbSchema.index;
        const fieldNames = Object.keys(this.dbSchema.fields);
        const otherFields = fieldNames.filter(f => f !== index);
        const rawQuery = `UPDATE ${this.dbSchema.name} SET ${otherFields.map(f => `${f} = @${f}`).join(', ')} WHERE ${index} = @${index}`;

        const query = await this.db.prepare(rawQuery);
        const bindValues = {};
        otherFields.forEach(f => {
            bindValues[`@${f}`] = values[f];
        });

        await query.bind(bindValues);

        const res = await query.run();

        return res;
    }

    #validateSchemaValues(values = {}) {
        if (this.dbSchema === null) {
            throw Error('DBSchemaError: Missing schema');
        } else if (!(this.dbSchema instanceof Object) || this.dbSchema.constructor.name !== 'Object') {
            throw Error('DBSchemaError: schema is not an object');
        }

        for (let v in values) {
            if (!this.dbSchema.fields.hasOwnProperty(v)) {
                throw Error(`DBSchemaError: key '${v}' does not exist`);
            } else {
                switch (this.dbSchema.fields[v]) {
                    case 'string':
                        if (typeof values[v] !== 'string') {
                            throw Error(`DBSchemaError: value for '${v}' is not a string`);
                        }
                        break;

                    case 'int':
                        if (typeof values[v] !== 'number'
                            || /\./.test(values[v].toString()) === true) {
                                throw Error(`DBSchemaError: value for '${v}' is not an integer`);
                            }
                        break;

                    case 'float':
                        if (isNaN(parseFloat(values[v]))
                            || /\./.test(values[v].toString()) === false) {
                            throw Error(`DBSchemaError: value for '${v}' is not a float`);
                        }
                        break;
                }
            }
        }
    }

    async getByIndex(value) {
        if (!this.ready()) await this.#openDatabase();

        const index = this.dbSchema.index;
        const rawQuery = `SELECT * FROM ${this.dbSchema.name} WHERE ${index} = @${index}`;

        const query = await this.db.prepare(rawQuery);

        const bindValues = {
            [`@${index}`]: value
        };

        await query.bind(bindValues);

        const res = await query.get();

        return res;
    }

    /* Custom */
    async registerUser(values) {
        if (!this.ready()) await this.#openDatabase();

        const res = await this.#insertRow(values);

        return res;
    }
}

export default DB;
