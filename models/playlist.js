const { model, Schema } = require("mongoose")

module.exports = model("playlist", new Schema({

    Guild: String,
    User: String,
    Name: String,
    Songs: {
        URL: [],
        NAME: [],
    },
    Privacy: Boolean

}))