import User from "../models/user.model.js"

const getLeaderBoard = async (req , res) => {
    try {
        const leaderboard = await User.findAll(
            {
                attributes:["id" , "name" , "totalExpenses"],
                order:[["totalExpenses" , "DESC"]]
            }
        )

        res.status(200).json(leaderboard)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"interval server error" , error})
    }
}

export {getLeaderBoard}