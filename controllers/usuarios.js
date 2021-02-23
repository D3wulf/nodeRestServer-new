const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');



const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

// MANDAREMOS LOS USUARIOS AHORA POR BODY/RAW/JSON DE POSTMAN
const usuariosPost = async(req, res = response) => {

    // lo que se que venga en el body lo recibire en dos constantes
    //recibire lo que pida del body
    const { nombre, correo, password } = req.body;

    //const body = req.body;
    //PARA CREAR UNA NUEVA INSTANCIA
    const usuario = new Usuario({ nombre, correo, password });
    //encriptacion DOCUMENTACION BCRYPT SALE ESO COMO EJEMPLO--BCRYPT
    const salt = bcryptjs.genSaltSync();
    //HASHSYNC PIDE EL STRING QUE QUERAMOS ENCRIPTAR Y LA ENCRIPTACION
    usuario.password = bcryptjs.hashSync(password, salt);

    //salvar en bd
    await usuario.save();

    res.json({
        msg: 'Respuesta satisfactoria',
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;

    //LO QUE EXCLUIMOS
    const { password, google, correo, ...resto } = req.body;
    //VALIDAR CON LA BASE DE DATOS
    if (password) {
        // Encriptar la contraseña, REUSAMOS LA DEL POST
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    // Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });


    res.json(usuario);
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}