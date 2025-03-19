const API_URL = "/api/salesmen";

const useSalesmenApi = () => {
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("Token") : null;
  const Token = getToken();
  const addSalesmen = async (salesmenData) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify(salesmenData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add salesman");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding salesman:", error.message);
      throw error;
    }
  };

  const getSalesmen = async (page = 1) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch salesmen");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error while fetching salesmen", error);
      throw error;
    }
  };
  const deleteSalesmen = async (id) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete salesmen");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching salesmen:", error.message);
      throw error;
    }
  };

  const updateSalesmen = async (id, updatedData) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update salesmen");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating salesmen:", error.message);
      throw error;
    }
  };
  const showSalesmen = async (id) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update salesmen");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating salesmen:", error.message);
      throw error;
    }
  };
  const bulkDeleteSalesmen = async (ids) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/saleman/bulk-delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete salesmen");
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting salesmen:", error.message);
      throw error;
    }
  };
  return {
    showSalesmen,
    updateSalesmen,
    deleteSalesmen,
    getSalesmen,
    addSalesmen,
    bulkDeleteSalesmen,
  };
};
export default useSalesmenApi;
