var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var partnerSchema = new Schema({
    name:
    {
        type: String,
        required: true,
        unique: true

    },
    image:
    {
        type: String,
        required: true

    },
    featured:
    {
        type: Boolean,
        default: false,


    },
    description:
    {
        type: String,
        required: true


    },
},
    {
        timeStamps: true
    })

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;