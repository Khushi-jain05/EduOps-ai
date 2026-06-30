const prisma = require("../config/prisma");

const getSubjects = async (req, res) => {
  try {
    let subjects = await prisma.subject.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        code: "asc",
      },
    });

    if (subjects.length === 0 && req.user.role === "faculty") {
      subjects = await prisma.subject.findMany({
        orderBy: {
          code: "asc",
        },
      });

      if (subjects.length === 0) {
        const defaults = [
          {
            id: `subject-${req.user.id}-dbms`,
            code: "CS301",
            name: "Database Management Systems",
            faculty: "Faculty",
            color: "blue",
            userId: req.user.id,
          },
          {
            id: `subject-${req.user.id}-os`,
            code: "CS305",
            name: "Operating Systems",
            faculty: "Faculty",
            color: "green",
            userId: req.user.id,
          },
          {
            id: `subject-${req.user.id}-dsa`,
            code: "CS210",
            name: "Data Structures",
            faculty: "Faculty",
            color: "purple",
            userId: req.user.id,
          },
          {
            id: `subject-${req.user.id}-cn`,
            code: "CS320",
            name: "Computer Networks",
            faculty: "Faculty",
            color: "orange",
            userId: req.user.id,
          },
        ];

        await prisma.subject.createMany({
          data: defaults,
          skipDuplicates: true,
        });

        subjects = await prisma.subject.findMany({
          where: {
            userId: req.user.id,
          },
          orderBy: {
            code: "asc",
          },
        });
      }
    }

    res.json(subjects);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch subjects",
    });

  }
};

module.exports = {
  getSubjects,
};
