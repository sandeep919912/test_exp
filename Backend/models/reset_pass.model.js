import { DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../config/db.connection.js";

const ResetPass = sequelize.define("reset_pass" , {
    id:{
        type:DataTypes.UUID,
        defaultValue:UUIDV4,
        primaryKey:true,
        allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    }
})

export default ResetPass