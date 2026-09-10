import {DataTypes} from 'sequelize'
import sequelize from '../config/db.connection.js'

const Expense = sequelize.define('Expense' , {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Food' , 'Travel' , 'Shopping' , 'Entertainment' , 'Other'),
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
})

export default Expense