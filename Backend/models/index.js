import User from "./user.model.js"
import Expense from "./expense.model.js"
import Orders from "./order.model.js"
import ResetPass from "./reset_pass.model.js"


User.hasMany(Expense , {
    foreignKey:"userId"
})

Expense.belongsTo(User , {
    foreignKey:"userId"
})

User.hasMany(Orders, {
    foreignKey:"userId" 
})


Orders.belongsTo(User,{
    foreignKey:"userId"
})

User.hasMany(ResetPass , {
    foreignKey:"userId"
})

ResetPass.belongsTo(User,{
    foreignKey:"userId"
})

export {
    User,
    Expense,
    Orders,
    ResetPass
}