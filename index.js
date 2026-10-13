const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para interpretar JSON en las peticiones
app.use(express.json());

// Arreglo en memoria para simular una colección de datos (entidad: Recursos de Datos)
let recursos = [
    { id: 1, nombre: 'Dataset de Ventas', tipo: 'CSV', registros: 1500 },
    { id: 2, nombre: 'Modelo de Machine Learning', tipo: 'Algoritmo', precision: 0.92 },
    { id: 3, nombre: 'Script de Limpieza', tipo: 'Python', autor: 'Equipo' }
];

// 1. Ruta base
app.get('/', (req, res) => {
    res.send('Servidor en línea y API REST funcionando correctamente 🚀');
});

// 2. GET /api/recursos - Obtener todos los objetos
app.get('/api/recursos', (req, res) => {
    res.json(recursos);
});

// 3. GET /api/recursos/:id - Obtener un objeto por ID (con manejo de 404)
app.get('/api/recursos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const recurso = recursos.find(r => r.id === id);
    
    if (!recurso) {
        return res.status(404).json({ error: 'Recurso no encontrado' });
    }
    
    res.json(recurso);
});

// 4. POST /api/recursos - Crear un nuevo objeto (Código 201 Created)
app.post('/api/recursos', (req, res) => {
    const { nombre, tipo, registros, precision, autor } = req.body;
    
    const nuevoId = recursos.length > 0 ? recursos[recursos.length - 1].id + 1 : 1;
    
    const nuevoRecurso = {
        id: nuevoId,
        nombre: nombre || 'Sin nombre',
        tipo: tipo || 'General',
        ...(registros !== undefined && { registros }),
        ...(precision !== undefined && { precision }),
        ...(autor !== undefined && { autor })
    };

    recursos.push(nuevoRecurso);
    res.status(201).json(nuevoRecurso);
});

// 5. PUT /api/recursos/:id - Actualizar un objeto por ID
app.put('/api/recursos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = recursos.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Recurso no encontrado para actualizar' });
    }

    const { nombre, tipo, registros, precision, autor } = req.body;

    recursos[index] = {
        id,
        nombre: nombre || recursos[index].nombre,
        tipo: tipo || recursos[index].tipo,
        registros: registros !== undefined ? registros : recursos[index].registros,
        precision: precision !== undefined ? precision : recursos[index].precision,
        autor: autor || recursos[index].autor
    };

    res.json(recursos[index]);
});

// 6. DELETE /api/recursos/:id - Eliminar un objeto por ID
app.delete('/api/recursos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = recursos.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Recurso no encontrado para eliminar' });
    }

    const recursoEliminado = recursos.splice(index, 1);
    
    res.json({
        mensaje: 'Recurso eliminado correctamente',
        recurso: recursoEliminado[0]
    });
});

// Iniciar servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});