import { json } from '@sveltejs/kit';
import { pool } from '$lib/postgres/pool.js';

export async function POST({ request }) {
	const body = await request.json();
	const { infinitive, pronomial, subtype, definition } = body;
	let pronomial_final = pronomial;
	if (pronomial == null || pronomial == '') {
		pronomial_final = false;
	}
	console.log(body);
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
		return json({ success: 'Successfully inserted data.' }, { status: 201 });
	} catch (error) {
		console.error('Database error: ', error);
	}
	console.log(
		`Created verb entry:\nVerb: ${infinitive}\nPronm?: ${pronomial}\nSubtype?: ${subtype}\nDefinition: ${definition}`
	);
}

export async function PUT({ request }) {
	const body = await request.json();
	const { infinitive, pronomial, subtype, definition, id } = body;
	let pronomial_final = pronomial;
	if (pronomial == null || pronomial == '') {
		pronomial_final = false;
	}
	console.log('Attempting to update verb in table.');
	try {
		const result = await pool.query(
			`
            UPDATE verb 
			SET infinitive = $1,
			pronomial = $2,
			subtype = $3,
			definition = $4
			WHERE id = $5
            RETURNING * 
        `,
			[infinitive, pronomial_final, subtype, definition, id]
		);
		console.log('Success');
		return json({ success: 'Successfully inserted data.' }, { status: 201 });
	} catch (error) {
		console.error('Database error: ', error);
	}
}

export async function DELETE({ request }) {
	const body = await request.json();
	const { id } = body;
	try {
		const result = await pool.query(
			`
            DELETE FROM verb 
			WHERE id = $1 
			RETURNING *
        `,
			[id]
		);
		return json({ success: 'Successfully deleted ID: ' + id }, { status: 201 });
	} catch (error) {
		console.error('Failed to delete from database. ID:' + id);
	}
}

export async function GET({ request }) {
	try {
		const result = await pool.query(`SELECT * FROM verb ORDER BY id`);
		return json(result.rows);
	} catch (error) {
		console.error('Database error: ', error);
	}
}
