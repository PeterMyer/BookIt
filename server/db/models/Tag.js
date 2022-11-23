//Tags DB
const Sequelize = require("sequelize");
const db = require("../db");

//Tags should not be null, empty or contain space, and have a max length of 16
const Tag = db.define("tag", {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

module.exports = Tag;
