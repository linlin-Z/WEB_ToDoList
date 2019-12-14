// Compte sur le site elephantsql.com
const { Pool } = require('pg')
const fs = require('fs')

// Import du fichier avec les commandes SQL
const dbFilePath = `${__dirname}/populate.sql`
const sql = fs.readFileSync(dbFilePath).toString()

// Inialisation de la connexion
const pool = new Pool({
	user: 'xvymrvgg',
	host: 'manny.db.elephantsql.com',
	database: 'xvymrvgg',
	password: 'uxJOb6HnjhwEV9SGeGsMl134-qpNiBBn',
	port: 5432,
	idleTimeoutMillis: 30000
})
pool.connect()

// Execution des commandes SQL
pool.query(sql, (err, res) => {
	if (err) {
		console.log(err);
	}
	else {
		console.log("Import terminé");
	}
})

// pool.end().then(() => console.log('pool has ended'))
