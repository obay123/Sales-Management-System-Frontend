const API_URL = "/api/customers";

const useCustomersApi = () => {
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("Token") : null;

  const addCustomer = async (customerData) => {
    const Token = getToken();
    if (!Token) {
      throw new Error("No auth token found");
    }

    let body;
    let headers = {
      Authorization: `Bearer ${Token}`,
      Accept: "application/json",
    };

    if (customerData.photo) {
      body = new FormData();
      Object.keys(customerData).forEach((key) => {
        if (key === "tags") {
          customerData.tags.forEach((tag) => body.append("tags[]", tag));
        } else {
          body.append(key, customerData[key]);
        }
      });
    } else {
      body = JSON.stringify(customerData);
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add customer");
      }
      return await response.json();
    } catch (error) {
      console.error("Error adding customer:", error.message);
      throw error;
    }
  };

  const getCustomers = async () => {
    const Token = getToken();
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch customers");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching customers:", error.message);
      throw error;
    }
  };

  const deleteCustomer = async (id) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete customer");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const updateCustomer = async (id, updatedData) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update customer");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating customer:", error.message);
      throw error;
    }
  };

  const showCustomer = async (id) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch customer details"
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching customer details:", error.message);
      throw error;
    }
  };

  const bulkDeleteCustomers = async (ids) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}/bulk-delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete customers");
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting customers:", error.message);
      throw error;
    }
  };

  return {
    addCustomer,
    getCustomers,
    deleteCustomer,
    updateCustomer,
    showCustomer,
    bulkDeleteCustomers,
  };
};

export default useCustomersApi;
