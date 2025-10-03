
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

app.get('/', async (req, res) => {
    // 1. Extraer los posibles filtros del objeto req.query
    const { name, category } = req.query;

    // 2. Construir la consulta SQL dinámicamente
    let queryText = 'SELECT * FROM startups';
    const values = [];
    const conditions = [];

    // Si el filtro 'name' existe, añadirlo a la consulta
    if (name) {
        values.push(`%${name}%`); // Usamos '%' para búsquedas parciales (LIKE)
        conditions.push(`name ILIKE $${values.length}`); // ILIKE no distingue mayúsculas/minúsculas
    }

    // Si el filtro 'category' existe, añadirlo a la consulta
    if (category) {
        values.push(category);
        conditions.push(`category = $${values.length}`);
    }

    // Si hay condiciones, unirlas con 'AND' y añadirlas al 'WHERE'
    if (conditions.length > 0) {
        queryText += ' WHERE ' + conditions.join(' AND ');
    }

    try {
        const result = await pool.query(queryText, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al leer startups:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


app.get('/:id', async (req, res) => {
    
    const { id } = req.params;
    try{

        const queryText = `
            SELECT * FROM startups WHERE id = $1;
        `;
        const values = [id];
        const result = await pool.query(queryText, values);
        if (result.rows.length === 0) {
            return res.status(404).send({ error: 'Startup no encontrada' });
        }
        const startup = result.rows[0];
        res.status(200).send(startup );

    }catch(error){
        console.error('Error al leer la startup:', error);
        return res.status(500).send({ error: 'Error interno del servidor' });
    }

});

app.listen(PORT, () => {
    console.log(`Servicio ReadStartupService corriendo en el puerto ${PORT}`);
});