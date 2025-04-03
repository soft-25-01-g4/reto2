const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const app = express();
app.use(express.json());

app.post('/consulta', (req, res) => {
    const data = req.body;

    if (!data.id_detalle_pedido || !data.id_pedido || !data.id_inventario) {
        return res.status(400).json({ error: "Datos incompletos en la solicitud" });
    }

    const request_id = uuidv4();

    // Aquí lo dejo con un 30% de probabilidad para que falle
    let cantidad = 50;
    if (Math.random() < 0.3) {
        cantidad = Math.floor(Math.random() * (100 - 10 + 1)) + 10; 
    }

    const respuesta = {
        id_detalle_pedido: data.id_detalle_pedido,
        id_pedido: data.id_pedido,
        id_inventario: data.id_inventario,
        cantidad: cantidad
    };

    const logEntry = `${new Date().toISOString()}|${request_id}|${JSON.stringify(respuesta)}\n`;

    fs.appendFile("log_nodejs.txt", logEntry, (err) => {
        if (err) {
            console.error("Error escribiendo en el log:", err);
        }
    });

    res.json(respuesta);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
