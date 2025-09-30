
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
});


app.get('/health', (req, res) => {
    res.status(200).send('OK');
});


app.put('/v1/api/startups/update/:id', async (req, res) => {

    const { id } = req.params;
    const { name, foundedAt, location, category, fundingAmount } = req.body;

    if (!id) {
        return res.status(400).send({ error: 'Seleccione un StartUp' });
    }

    if (!name || !foundedAt || !location || !category || !fundingAmount) {
        return res.status(400).send({ error: 'Faltan datos obligatorios' });
    }

    try{

        const queryText = `
            UPDATE startups
            SET name = $1, foundedAt = $2, location = $3, category = $4, fundingAmount = $5
            WHERE id = $6
            RETURNING *;
        `;
        const values = [ name, foundedAt, location, category, fundingAmount, id];
        const result = await pool.query(queryText, values);
        const newStartup = result.rows[0];
        res.status(201).send({ message: 'Startup Actualizada exitosamente', startup: newStartup });

    }catch(error){
        console.error('Error al buscar la startup:', error);
        return res.status(500).send({ error: 'Error interno del servidor' });
    }

});

app.listen(PORT, () => {
    console.log(`Servicio UpdateStartupService corriendo en el puerto ${PORT}`);
});