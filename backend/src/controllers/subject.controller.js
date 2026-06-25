const prisma = require("../config/prisma");

const getSubjects = async (req,res)=>{

    try{

        const subjects =
        await prisma.subject.findMany({

            where:{
                userId:req.user.id
            },

            orderBy:{
                createdAt:"asc"
            }

        });

        res.json(subjects);

    }

    catch(err){

        console.log(err);

        res.status(500).json({
            message:"Failed to fetch subjects"
        });

    }

};

module.exports={
    getSubjects
};