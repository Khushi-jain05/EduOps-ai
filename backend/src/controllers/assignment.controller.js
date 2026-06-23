const prisma = require("../config/prisma");

exports.getAssignments = async (
  req,
  res
) => {
  try {

    const assignments =
      await prisma.assignment.findMany({
        where: {
          userId: req.user.id,
        },
        orderBy: {
          dueDate: "asc",
        },
      });

    res.json(assignments);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        "Failed to fetch assignments",
    });
  }
};

exports.getAssignmentById =
  async (req, res) => {

    try {

      const assignment =
        await prisma.assignment.findUnique({
          where: {
            id: req.params.id,
          },
        });

      res.json(assignment);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch assignment",
      });
    }
  };

exports.createAssignment =
  async (req, res) => {

    try {

      const {
        title,
        subject,
        description,
        faculty,
        dueDate,
        totalMarks,
      } = req.body;

      const assignment =
        await prisma.assignment.create({
          data: {
            title,
            subject,
            description,
            faculty,
            dueDate:
              new Date(dueDate),

            totalMarks:
              Number(totalMarks),

            status: "Pending",

            userId:
              req.user.id,
          },
        });

      res.status(201).json(
        assignment
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Failed to create assignment",
      });
    }
  };

exports.deleteAssignment =
  async (req, res) => {

    try {

      await prisma.assignment.delete({
        where: {
          id: req.params.id,
        },
      });

      res.json({
        message:
          "Assignment deleted",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Failed to delete assignment",
      });
    }
  };