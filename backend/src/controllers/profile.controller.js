const prisma = require("../config/prisma");

exports.getProfile = async (req, res) => {

  try {

    const userId =
      req.user.id ||
      req.user.userId ||
      req.user.sub;

    const user =
      await prisma.user.findUnique({

        where:{
          id:userId
        }

      });

    if(!user){

      return res.status(404).json({
        message:"User not found"
      });

    }

    const assignments =
      await prisma.assignment.count({
        where:{userId}
      });

    const attendance =
      await prisma.attendance.findFirst({
        where:{userId}
      });

    const exams =
      await prisma.exam.count({
        where:{userId}
      });

    const subjects =
      await prisma.subject.count({
        where:{userId}
      });

    res.json({

      user,

      stats:{

        assignments,
        attendance:
          attendance?.percentage || 0,
        exams,
        subjects

      },

      activity:[]

    });

  }

  catch(error){

    console.log(error);

    res.status(500).json({
      message:"Server Error"
    });

  }

};


exports.updateProfile = async (req,res)=>{

  try{

    const userId =
      req.user.id ||
      req.user.userId ||
      req.user.sub;

    const {

      username,
      phone,
      dob,
      city,
      program,
      semester,
      studentId,
      address,
      about

    } = req.body;

    const updatedUser =
      await prisma.user.update({

        where:{
          id:userId
        },

        data:{

          username,
          phone,
          dob,
          city,
          program,
          semester,
          studentId,
          address,
          about

        }

      });

    res.json(updatedUser);

  }

  catch(error){

    console.log(error);

    res.status(500).json({
      message:"Failed to update profile"
    });

  }

};