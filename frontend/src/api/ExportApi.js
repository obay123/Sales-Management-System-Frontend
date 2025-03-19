const exportToExcel = async (url) => {
  const token = localStorage.getItem("Token");

  if (!token) {
    throw new Error("No auth token found");
  }

  try {
    const response = await fetch(`/api/${url}/export`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to export data from ${url}`);
    }

    const blob = await response.blob();
    const urlObject = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = urlObject;
    a.download = `${url}-export.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(urlObject);

    return "Export successful!";
  } catch (error) {
    console.error("Export Error:", error.message);
    throw error;
  }
};

export default exportToExcel;
