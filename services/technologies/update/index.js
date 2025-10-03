
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors()); 
app.use(express.json()); 


const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});


app.get('/health', (req, res) => {
    res.status(200).send('OK');
});
/*  */

app.put('/', async (req, res) => {

    const { id } = req.params;
    const { name, sector, description, adoptionLevel } = req.body;

    if (!id) {
        return res.status(400).send({ error: 'Seleccione una technology' });
    }

    if (!name || !sector || !description || !adoptionLevel) {
        return res.status(400).send({ error: 'Faltan datos obligatorios' });
    }

    try{

        const queryText = `
            UPDATE technologies
            SET name = $1, sector = $2, description = $3, adoptionLevel = $4
            WHERE id = $5
            RETURNING *;
        `;
        const values = [ name, sector, description, adoptionLevel, id];
        const result = await pool.query(queryText, values);
        const technologyUpdated = result.rows[0];
        res.status(201).send({ message: 'Startup Actualizada exitosamente', technology: technologyUpdated });

    }catch(error){
        console.error('Error al buscar technology:', error);
        return res.status(500).send({ error: 'Error interno del servidor' });
    }

});

app.listen(PORT, () => {
    console.log(`Servicio UpdateTechnologyService corriendo en el puerto ${PORT}`);
});