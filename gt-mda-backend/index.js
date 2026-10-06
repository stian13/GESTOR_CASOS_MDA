import express from 'express';
import { pool } from './db.js';
import cors from 'cors'


const app = express();

app.use(express.json()) //para que el servidor pueda recibir informacion en formato json
app.use(cors())
const puerto = 3000

// Obtener todos los usuarios para la lista desplegable de reasignación
app.get('/usuarios', async (req, res) => {
    try {
        const comandoSQL = 'SELECT id_usuarios, nombre, rol FROM usuarios;';
        const resultado = await pool.query(comandoSQL);
        res.json(resultado.rows); // Retorna la lista de usuarios
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json([]);
    }
});

app.post('/login', async (req, res) => {
  try {
    const { nombre, contrasena } = req.body;
    
    // 1. Buscamos al usuario en la base de datos
    const comandoSQL = 'SELECT * FROM usuarios WHERE nombre = $1;';
    const resultado = await pool.query(comandoSQL, [nombre]);

    // 2. Verificamos si el usuario existe
    if (resultado.rows.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    const usuarioBD = resultado.rows[0];
    console.log(usuarioBD.rol);
    

    // 3. Verificamos que la contraseña coincida
    if (contrasena !== usuarioBD.contrasena) {
      return res.status(401).send('Contraseña incorrecta');
    }

    // 4. Si todo está correcto, damos acceso
    //res.send('Login exitoso');
    res.json({
            mensaje: 'Login exitoso, bienvenido',
            id: usuarioBD.id_usuarios,         // 👈 Usamos usuarioBD en lugar de usuarioEncontrado
            nombre: usuarioBD.nombre,
            rol: usuarioBD.rol
        })

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).send('Hubo un error al procesar la solicitud');
  }
});


app.post('/casos', async (req, res) => {
    try {
        // 1. Extraemos los datos que envía el frontend
        const { numero_de_caso, asunto, comentario, proyecto, id_usuarios } = req.body;

        // Preparamos el comando SQL con comodines
        const comandoSQL = `
            INSERT INTO casos (numero_de_caso, asunto, comentario, proyecto, id_usuarios) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *;
        `;
        // Aquí ejecutaremos la consulta (falta el arreglo de valores)
        // const resultado = await pool.query(comandoSQL, [ ... ])
        const resultado = await pool.query(comandoSQL, [numero_de_caso, asunto, comentario, proyecto, id_usuarios]);
        //res.send('Caso guardado exitosamente en la base de datos');

        res.json(resultado.rows[0]);

    } catch (error){
        console.error('Error al guardar el caso:', error);
        res.status(500).send('Hubo un error al procesar la solicitud')
    }

    //res.body -> nuestro servidor puede acceder a toda la información que el frontend haya enviado.
    /*    
        const nuevoCaso =req.body;
        console.log('datos recibidos del formulario', nuevoCaso);
        
        res.send('casos recibido exitosamente ')
    */
   //const usuarioBD = resultado.rows[0]
})

// 2. Reasignar masivamente los casos seleccionados a un nuevo agente
app.put('/casos/reasignar', async (req, res) => {
    try {
        const { id_usuarios, idsCasos } = req.body; // idsCasos es un arreglo, ej: [41, 45]
        const comandoSQL = 'UPDATE casos SET id_usuarios = $1 WHERE id = ANY($2::int[]);';
        await pool.query(comandoSQL, [id_usuarios, idsCasos]);
        res.json({ mensaje: 'Casos reasignados con éxito' });
    } catch (error) {
        console.error('Error al reasignar casos:', error);
        res.status(500).send('Error al reasignar casos');
    }
});

// 3. Eliminar / Cerrar masivamente los casos seleccionados
app.delete('/casos/cerrar', async (req, res) => {
    try {
        const { idsCasos } = req.body;
        const comandoSQL = 'DELETE FROM casos WHERE id = ANY($1::int[]);';
        await pool.query(comandoSQL, [idsCasos]);
        res.json({ mensaje: 'Casos eliminados con éxito' });
    } catch (error) {
        console.error('Error al cerrar casos:', error);
        res.status(500).send('Error al cerrar casos');
    }
});

//POST para enviar informacion

//get para solicitar u obtener informacion 
app.get('/casos', async (req, res) => {
    //res.send('Servidor del Sistema de Gestión activo y listo para recibir casos')
    //res -> representa lo que le respondemos al usuario
    try {
        const comandoSQL = `
            SELECT 
                casos.*, 
                usuarios.nombre AS nombre_agente 
            FROM casos 
            LEFT JOIN usuarios ON casos.id_usuarios = usuarios.id_usuarios
            ORDER BY casos.id DESC;
        `;
        const resultado = await pool.query(comandoSQL);

        res.json(resultado.rows)

    } catch (error) {
        console.error('Error al obtener los casos:', error);
        res.status(500).send('Hubo un error al procesar la solicitud');
        
    }
})

//liste -> escuchando nos ayuda a iniciar el servidor, aca el servidor solo ecucha pero no sabe que responder
app.listen(puerto, () =>{
    console.log('servidor corriendo XD');
})

//rutas o endpoints -> Cuando abres una dirección web, el navegador hace una petición de tipo GET a la ruta principal, que se representa con una barra diagonal ('/').

// Actualizar/Editar un caso por su ID
app.put('/casos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { numero_de_caso, asunto, comentario, proyecto, id_usuarios } = req.body;

        const comandoSQL = `
            UPDATE casos 
            SET numero_de_caso = $1, 
                asunto = $2, 
                comentario = $3, 
                proyecto = $4, 
                id_usuarios = $5
            WHERE id = $6
            RETURNING *;
        `;

        const resultado = await pool.query(comandoSQL, [
            numero_de_caso, 
            asunto, 
            comentario, 
            proyecto, 
            id_usuarios, 
            id
        ]);

        if (resultado.rows.length === 0) {
            return res.status(404).send('Caso no encontrado');
        }

        res.json({ mensaje: 'Caso actualizado con éxito', caso: resultado.rows[0] });
    } catch (error) {
        console.error('Error al actualizar el caso:', error);
        res.status(500).send('Error al actualizar el caso');
    }
});