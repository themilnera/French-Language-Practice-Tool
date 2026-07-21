import { Pool } from 'pg';
import { DB_URL } from '$env/static/private';

export const pool = new Pool({
	connectionString: DB_URL
});
