const prisma = require("../config/prisma");

const getUnitsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const units = await prisma.units.findMany({
      where: {
        subject_id: subjectId,
      },
      orderBy: {
        unit_number: "asc",
      },
    });

    if (units.length === 0) {
      return res.json(
        [1, 2, 3, 4, 5].map((unitNumber) => ({
          id: `default-${subjectId}-${unitNumber}`,
          title: `Unit ${unitNumber}`,
          unitNumber,
          subjectId,
          createdAt: null,
        }))
      );
    }

    res.json(
      units.map((unit) => ({
        id: unit.id,
        title: unit.title,
        unitNumber: unit.unit_number,
        subjectId: unit.subject_id,
        createdAt: unit.created_at,
      }))
    );
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch units",
    });
  }
};

module.exports = {
  getUnitsBySubject,
};
