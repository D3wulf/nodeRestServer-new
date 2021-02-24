const { response } = require('express');

const Usuario = require('../models/usuario');

const bcryptjs = require('bcryptjs');

const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req, res = response) => {

    /*res.json({
        msg: 'los muertos de node'
    })*/

    const { correo, password } = req.body;

    try {
        //verificar si email existe
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({

                msg: 'Usuario / password no son correctos - Correo (Auth controlador)'
            });
        }
        //si el usuario esta activo requerimos modelo usuario

        if (!usuario.estado) {
            return res.status(400).json({

                msg: 'Usuario / password no son correctos - Usuario desactivado (Auth controlador)'
            });
        }
        //verficar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({

                msg: 'Usuario / password no son correctos - Password incorrecto (el que se manda y el que esta en la bd) (Auth controlador)'
            });
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {

        return res.status(500).json({

            msg: "Algo salió mal en el login"
        });
    }




}

module.exports = {

    login
}