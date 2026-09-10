import {Sequelize} from "sequelize";

const sequelize = new Sequelize("expense_pro" , "root" , "Rootpass@123" , {
    host: "localhost",
    dialect: "mysql"
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();

export default sequelize;