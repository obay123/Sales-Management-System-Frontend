const exportToExcel = async (url) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No auth token found");
    }

    try {
        const response = await fetch(`${url}/export`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to export data from ${url}`);
        }

        return "Export successful!";
    } catch (error) {
        console.error("Export Error:", error.message);
        throw error;
    }
};

export default exportToExcel;
