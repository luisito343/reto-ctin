
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


app.delete('/:id', async (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ error: 'Seleccione un StartUp' });
    }

    try{

        const queryText = `
            DELETE FROM startups WHERE id = $1 RETURNING *;
        `;
        const values = [id];
        const result = await pool.query(queryText, values);

        if (result.rowCount === 0) {
            return res.status(404).send({ error: 'Startup no encontrada' });
        }
        const deletedStartup = result.rows[0];
        res.status(200).send({ message: 'Startup eliminada exitosamente', deletedStartup: deletedStartup });

    }catch(error){
        console.error('Error al eliminar la startup:', error);
        return res.status(500).send({ error: 'Error interno del servidor' });
    }

});

app.listen(PORT, () => {
    console.log(`Servicio deleteStartupService corriendo en el puerto ${PORT}`);
});