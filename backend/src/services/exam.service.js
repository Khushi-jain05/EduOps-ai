export const downloadExamPdf =
  async () => {

    const token =
      localStorage.getItem("token");

    const response =
      await axios.get(
        "http://localhost:8000/api/exams/download",
        {
          responseType: "blob",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};