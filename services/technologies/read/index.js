
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

app.get('/', async (req, res) => {
    // 1. Extraer los posibles filtros del objeto req.query
    const { sector, adoptionLevel } = req.query;

    // 2. Construir la consulta SQL dinámicamente (versión simplificada)
    let queryText = 'SELECT * FROM technologies';
    const values = [];
    const conditions = [];

    // Si el filtro 'sector' existe, añadirlo a la consulta
    if (sector) {
        values.push(`%${sector}%`);
        conditions.push(`sector ILIKE $${values.length}`);
    }

    // Si el filtro 'adoptionLevel' existe, añadirlo a la consulta
    if (adoptionLevel) {
        values.push(adoptionLevel);
        conditions.push(`adoptionLevel = $${values.length}`); // Nota: Se usan comillas por la mayúscula
    }

    // Si hay condiciones, unirlas con 'AND' y añadirlas al 'WHERE'
    if (conditions.length > 0) {
        queryText += ' WHERE ' + conditions.join(' AND ');
    }

    try {
        const result = await pool.query(queryText, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al leer technologies:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});



app.get('/:id', async (req, res) => {
    
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ error: 'Seleccione una tecnology' });
    }

    try{

        const queryText = `
            SELECT * FROM technologies WHERE id = $1;
        `;
        const values = [id];
        const result = await pool.query(queryText, values);
        if (result.rows.length === 0) {
            return res.status(404).send({ error: 'technology no encontrada' });
        }
        const technology = result.rows[0];
        res.status(200).send({ technology });

    }catch(error){
        console.error('Error al leer technology:', error);
        return res.status(500).send({ error: 'Error interno del servidor' });
    }

});

app.listen(PORT, () => {
    console.log(`Servicio ReadTecnologyService corriendo en el puerto ${PORT}`);
});