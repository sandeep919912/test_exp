import {DataTypes} from "sequelize"
import sequelize from "../config/db.connection.js"

const Orders = sequelize.define("Orders" , {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    orderId:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    paymentSessionId: {
        type: DataTypes.STRING,
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM(
            "PENDING",
            "SUCCESSFUL",
            "FAILED"
        ),
        defaultValue: "PENDING",
        allowNull: false
    }

})

export default Orders