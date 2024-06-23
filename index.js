//traigo la libreria
const express = require('express');
//ejecuto funcionaildades de express
const app = express();
//Al tener que trabajr con filesystem traemos la libreria para manipular archivos de nodejs.
const fs = require('fs');
//middleware
app.use(express.json());
app.get('/', (req, res) => {
  console.log(__dirname);
  res.sendFile(__dirname + '/index.html');
});

//Creación metodo GET, POST y PUT Reciben 2 parámetros: El primero es el nombre de la ruta que se va a consultar. Lo segundo es un callback que recibe
//dos parámetros (request y response)

app.get('/canciones', (req, res) => {
  try {
    const response = fs.readFileSync('repositorio.json');
    const canciones = JSON.parse(response);
    res.status(200).send(canciones);
  } catch (error) {
    res.status(501).send('Error al obtener la información');
  }
});

app.post('/canciones', (req, res) => {
  try {
    const { titulo, artista, tono } = req.body;
    if (titulo == '' || artista == '' || tono == '') {
      throw new Error(
        'Todos los campos deben ser completados! - PRUEBA: Mensaje desde el servidor.'
      );
    }
    const cancion = req.body;
    const canciones = JSON.parse(fs.readFileSync('repositorio.json'));
    canciones.push(cancion);
    fs.writeFileSync('repositorio.json', JSON.stringify(canciones));
    res.status(200).json({ message: 'Canción agregada con éxito - PRUEBA:Mensaje desde el servidor' });
  } catch (error) {
    res
      .status(400)
      .json({ message: `La canción no pude ser agregada: ${error.message}` });
  }
});

app.put('/canciones/:id', (req, res) => {
  try {
    const { id } = req.params;
    if (id == undefined) {
      throw new Error('Todos los campos deben ser completados.');
    }
    const cancion = req.body;
    const canciones = JSON.parse(fs.readFileSync('repositorio.json'));
    const index = canciones.findIndex((cancion) => cancion.id == id);

    if (index === -1) {
      throw new Error('Id no encontrado.');
    } else {
      canciones[index] = cancion;
      fs.writeFileSync('repositorio.json', JSON.stringify(canciones, null, 2));
      res.status(200).json({ message: `Canción ${cancion.titulo} actualizada con éxito - PRUEBA:Mensaje desde el servidor` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `No se pudo actualizar la cancion:${error.message}` });
  }
});

app.delete('/canciones/:id', (req, res) => {
  try {
    const { id } = req.params;
    if (id == undefined) {
      throw new Error('Todos los campos deben ser completados.');
    }
    const canciones = JSON.parse(fs.readFileSync('repositorio.json'));
    const index = canciones.findIndex((cancion) => cancion.id == id);

    if (index === -1) {
      throw new Error('Id no encontrado.');
    } else {
      canciones.splice(index, 1);
      fs.writeFileSync('repositorio.json', JSON.stringify(canciones, null, 2));
      res.status(200).json({ message: 'Canción Eliminada con éxito' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `No se pudo eliminar la cancion:${error.message}` });
  }
});

//metetodo para levantar el servidor. Recibe el puerto y un callback.
app.listen(3000, () => console.log('Estoy operando en el puerto 3000'));
