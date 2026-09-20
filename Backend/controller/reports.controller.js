import { Reports } from "../models/index.js"

export const getDownloads = async (req , res) => {
    try {
        const userId = req.user.userId
        
        const AllDownloadsUrl = await Reports.findAll({where:{
            userId
        }})

        res.status(200).json(AllDownloadsUrl)
    } catch (error) {
        res.status(500).json({message:"internal server error"})
    }
}

