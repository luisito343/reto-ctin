
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


app.post('/', async (req, res) => {
    const { name, sector, description, adoptionLevel } = req.body;
    if (!name || !sector || !description || !adoptionLevel) {
        return res.status(400).send({ error: 'Faltan datos obligatorios' });
    }

    try{

        const queryText = `
            INSERT INTO technologies (name, sector, description, adoptionLevel)
            VALUES ($1, $2, $3, $4)
            RETURNING *; 
        `;
        const values = [name, sector, description, adoptionLevel];
        const result = await pool.query(queryText, values);
        const newTechnology = result.rows[0];
        res.status(201).send({ message: 'tecnology creada exitosamente', technology: newTechnology });

    }catch(error){
        console.error('Error al crear technology:', error);
        return res.status(500).send({ error: 'Error interno del servidor' });
    }

});

app.listen(PORT, () => {
    console.log(`Servicio CreateTechnologyService corriendo en el puerto ${PORT}`);
});