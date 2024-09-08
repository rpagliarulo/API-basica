//trae desde otra librería una función
const express= require("express")

const data= require("../data/data.json")

//ejecuta esa función y almacena el resultado de ejecutarla en otra const 
const app= express();

//Indicamos que de la libreria express, utilice json como metodo para recibir informacion de todos los POST que vaya a hacer
//de no escribir esto, hay que indicarselo en cada request 
app.use(express.json())

//recurso al que queremos acceder (el que vamos a escribir en la url) ---> alquilable

//endpoint para obtener todos los items
app.get('/alquilable', (req, res)=>{
    res.status(200).json(data)
})

//endpoint para obtener un item específico
// hacer un valor variable --> :
app.get('/alquilable/:id', (req, res)=>{
    //req captura el valor que tiene id en ese momento y lo guarda en una const
    const id= req.params.id
    const alquilable= data.find( elemento => elemento.id == id)
    //esto da V si alquilable != null
    if (alquilable) {
        res.status(200).json(alquilable)
    } else {  
        res.status(404).json({error: `El id ${id} no existe`})
    
    }
})

//endpoint para eliminar un item
app.delete('/alquilable/:id', (req, res)=>{
    //req captura el valor que tiene id en ese momento y lo guarda en una const
    const id= req.params.id
    //A traves del id, busco el indice del arreglo donde esta ubicado el elemento que quiero borrar
    const idx= data.findIndex (elemento => elemento.id == id)

    if (idx >=0) {
        //A partir de ese elemento (idx), borro uno solo y lo guardo en removed
    const removed= data.splice(idx, 1)
    //como segundo atributo, mando los datos del alquilable que fue borrado
    res.status(200).json({
        message: `El alquilable con id ${id} fue eliminado`, 
        alquilable: removed})
    } else {  
        res.status(404).json({error: `El id ${id} no existe`})
    }
})

//endpoint para agregar un objeto nuevo 
app.post('/alquilable', (req, res)=>{
   const alquilable= req.body
   const maxId= data.reduce(
    (actual, next) => actual > next.id ? actual : next.id 
    , 0) + 1
    //ingreso el nuevo item al arreglo
    data.push({id: maxId, ...alquilable})
    //devuelvo el nuevo item
    res.status(201).json({id: maxId, ...alquilable})
})

//los servidores que vayamos a programar, tienen que estar escuchando en un puerto determinado
//cuado la API se inicie, le debo indicar en que puerto debo estar escuchando solicitudes

//Iniciar el servidor
app.listen(3000, ()=>{
    console.log("La aplicación arrancó correctamente en el puerto 3000")
})