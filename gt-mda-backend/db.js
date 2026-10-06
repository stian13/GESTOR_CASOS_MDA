import pg from 'pg';
const { Pool } = pg;

//pg -> este se instala con npm install pg. Nos sirve para conectarnos a la base de datos de PostgreSQL. \

export const pool = new Pool ({
    user: 'postgres',
    password: '201016',
    host: 'localhost',
    port: 5432,
    database: 'gt_mda_db'
    //contiene los datos nesesarions para conectarse a la base de datos 
})

