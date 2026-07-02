const FacultyService = require("../services/faculty.service");

const getUserId = (user) =>
  user?.id || user?.userId || user?.sub;

exports.getDashboard = async (req, res) => {
  try {
    const dashboard = await FacultyService.getDashboard(
      getUserId(req.user)
    );

    res.json(dashboard);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch faculty dashboard",
    });
  }
};
