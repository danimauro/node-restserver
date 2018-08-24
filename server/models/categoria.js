const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la categoria es necesario']
    },
    descripcion: {
        type: String,
    },
    usureg: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario que registra la categira es necesario']
    }
});


module.exports = mongoose.model('Categoria', categoriaSchema);