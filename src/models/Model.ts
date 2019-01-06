import {Pool} from 'pg';

export default class Model {

    private pool: Pool;
    protected table: string;
    protected primaryKey: string;
    protected model: Object;

    constructor() {

        this.pool = new Pool({
            user: process.env.DB_USERNAME,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT),
        });

        this.table = "";

        this.primaryKey = "";

        this.model = null;

    }

    query(queryString: string, parameters: Array<any> = []): Promise<any> {
        return this.pool.query(queryString, parameters);
    }

    async findAll(): Promise<any> {

        try {

            let {rows} = await this.query(`SELECT * FROM ${this.table}`);

            let data: Array<Object> = [];

            rows.forEach(row => data.push(Object.assign(this.model, row)));

            return data;

        } catch (error) {
            throw Error(error);
        }

    }

    async findOne(id: any): Promise<any> {

        if (id === null || id === undefined) {
            throw Error("ID cannot be empty");
        }

        try {

            let {rows} = await this.query(
                `SELECT * FROM ${this.table} WHERE ${this.primaryKey} = $1`,
                [id]
            );

            return Object.assign(this.model, rows[0]);

        } catch (error) {
            throw Error(error);
        }

    }

    async save(data: Object): Promise<any> {

        if (typeof data !== 'object') {
            throw TypeError("Data must be an object");
        }

        if (data === {}) {
            throw Error("Data cannot be empty");
        }

        let columns: Array<String> = [];

        let parameters: Array<any> = [];

        Object.entries(data).forEach(([key, value]) => {
            columns.push(key);
            parameters.push(value);
        });

        let keys: Array<String> = columns.map((column, index) => `$${index + 1}`);

        let query: string = `INSERT INTO ${this.table}(${columns.join(",")}) VALUES (${keys.join(",")}) RETURNING *`;

        try {

            let {rows} = await this.query(query, parameters);

            return Object.assign(this.model, rows[0]);

        } catch (error) {
            throw Error(error);
        }

    }

    async update(data: Object, criteria: Object): Promise<any> {

        if (typeof data !== 'object') {
            throw TypeError("Data must be an object");
        }

        if (data === {}) {
            throw Error("Data cannot be empty");
        }

        let columns: Array<String> = Object.entries(data).map(([key, value]) => `${key}=${value}`);

        let whereCriteria: Array<String> = Object.entries(criteria).map(([key, value]) => `${key}=${value}`);

        let query: string = `UPDATE ${this.table} SET ${columns.join(",")} WHERE ${whereCriteria.join(" AND ")} RETURNING *`;

        try {

            let {rows} = await this.query(query);

            return Object.assign(this.model, rows[0]);

        } catch (error) {
            throw Error(error);
        }
    }

    async findByCriteria(criteria: Object): Promise<any> {

        try {

            let columns: Array<String> = [];

            let parameters: Array<String> = [];

            Object.entries(criteria).forEach(([key, value], index) => {
                columns.push(`${key}=$${index + 1}`);
                parameters.push(value);
            });

            let {rows} = await this.query(
                `SELECT * FROM ${this.table} WHERE ${columns.join(" AND ")}`,
                parameters
            );

            return Object.assign(this.model, rows[0]);

        } catch (error) {
            throw Error(error);
        }
    }
}
