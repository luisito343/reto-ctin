
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');



const app = express();
const PORT = process.env.PORT || 3000;


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


app.post('/', async (req, res) => {
    
    const { name, foundedAt, location, category, fundingAmount } = req.body;
    if (!name || !foundedAt || !location || !category || !fundingAmount) {
        return res.status(400).send({ error: 'Faltan datos obligatorios' });
    }

    try{

        const queryText = `
            INSERT INTO startups (name, foundedAt, location, category, fundingAmount)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *; 
        `;
        const values = [name, foundedAt, location, category, fundingAmount];
        const result = await pool.query(queryText, values);
        const newStartup = result.rows[0];
        res.status(201).send({ message: 'Startup creada exitosamente', startup: newStartup });

    }catch(error){
        console.error('Error al crear la startup:', error);
        return res.status(500).send({ error: 'Error interno del servidor' });
    }

});

app.listen(PORT, () => {
    console.log(`Servicio CreateStartupService corriendo en el puerto ${PORT}`);
});