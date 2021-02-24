const { Schema, model } = require('mongoose');

const usuarioSchema = new Schema({

    nombre: {

        type: String,
        required: [true, 'El nombre es necesario']
    },
    correo: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'El password es necesario']
    },
    img: {
        type: String,
        required: false

    },
    role: {
        type: String,
        required: false,
        //default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']

    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }


});



usuarioSchema.methods.toJSON = function() {
    //SE CREA UNA CONSTANTE QUE DEJA FUERA LA VERSION __V, EL PASSWORD Y
    // ...USUARIO SERA EL RESTO DE PARAMETROS REUNIDOS EN UNO QUE LLAMA usuario
    // es para que no salgan esos datos
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}



//MONGOOSE LUEGO LO PASARA A USUARIOS PERO HAY QUE PONERLO AQUI EN SINGULAR
module.exports = model('Usuario', usuarioSchema);