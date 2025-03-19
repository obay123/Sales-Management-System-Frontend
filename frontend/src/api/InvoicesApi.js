const API_URL = "/api/invoices";

const useInvoicesApi = () => {
  const Token = localStorage.getItem("Token");

  const addInvoice = async (invoiceData) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(invoiceData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add invoice");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding invoice:", error.message);
      throw error;
    }
  };
  const getInvoices = async (page = 1) => {
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
        throw new Error(errorData.message || "Failed to fetch invoices");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching invoices:", error.message);
      throw error;
    }
  };
  const deleteInvoice = async (id) => {
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
        throw new Error(errorData.message || "Failed to delete invoice");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const updateInvoice = async (id, updatedData) => {
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
        throw new Error(errorData.message || "Failed to update invoice");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating invoice:", error.message);
      throw error;
    }
  };
  const showInvoice = async (id) => {
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
        throw new Error(errorData.message || "Failed to update invoice");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating invoice:", error.message);
      throw error;
    }
  };
  const bulkDeleteInvoices = async (ids) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}/bulk-delete`, {
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
        throw new Error(errorData.message || "Failed to delete invoices");
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting invoices:", error.message);
      throw error;
    }
  };

  return {
    showInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoices,
    addInvoice,
    bulkDeleteInvoices,
  };
};
export default useInvoicesApi;
