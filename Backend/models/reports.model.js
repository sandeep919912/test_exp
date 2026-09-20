import { DataTypes } from "sequelize";
import sequelize from "../config/db.connection.js";

const Reports = sequelize.define("reports" , {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    url:{   
        type:DataTypes.STRING,
        allowNull:false
    }
})

export default Reports