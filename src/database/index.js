import Sequelize  from "sequelize";
import mongoose from "mongoose";

import User from '../app/models/User';
import File from "../app/models/File";
import Appointment from "../app/models/Appointment";

import databaseConfig from '../config/database';

const models = [User, File, Appointment]

class Database{
    constructor(){
        this.init()
        this.mongo()
    }

    init(){
        this.connection = new Sequelize(databaseConfig)
        models.map(data => { data.init(this.connection) })
        models.map(data => data.associate && data.associate(this.connection.models))
    }

    mongo(){
        this.mongo_connection = mongoose.set("strictQuery", true)
        this.mongo_connection = mongoose.connect(process.env.MONGO_URL, {useNewUrlParser:true})
    }
}

export default new Database();