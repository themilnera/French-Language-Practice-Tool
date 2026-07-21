import { json } from '@sveltejs/kit';
import { pool } from '$lib/postgres/pool.js';

export async function POST({ request }) {
	const body = await request.json();
	console.log(body);
	const { infinitive, pronomial, subtype, definition } = body;
	let pronomial_final = pronomial;
	if (pronomial == null || pronomial == '') {
		pronomial_final = false;
	}
	console.log('Attempting to insert verb into table.');
	try {
		const result = await pool.query(
			`
            INSERT INTO verb(infinitive, pronomial, subtype, definition)
            VALUES ($1, $2, $3, $4)
            RETURNING * 
        `,
			[infinitive, pronomial_final, subtype, definition]
		);
		return new json({ success: 'Successfully inserted data.', status: 201 });
	} catch (error) {
		console.error('Database error: ', error);
	}
	console.log(
		`Created verb entry:\nVerb: ${infinitive}\nPronm?: ${pronomial}\nSubtype?: ${subtype}\nDefinition: ${definition}`
	);
}

export async function GET({ request }) {
	try {
		const result = await pool.query(`SELECT * FROM verb`);
		return json(result.rows);
	} catch (error) {
		console.error('Database error: ', error);
	}
}
