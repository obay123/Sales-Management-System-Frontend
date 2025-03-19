const API_URL = "/api/customers";

const useCustomersApi = () => {
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("Token") : null;


  const addCustomer = async (customerData) => {
    const Token = getToken()
    if (!Token) {
      throw new Error("No auth token found")
    }

    let body
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
      Accept: "application/json",
    }
    if (customerData.photo) {
      body = new FormData()
      Object.keys(customerData).forEach((key) => {
        if (key === "tags") {
          customerData.tags.forEach((tag) => body.append("tags[]", tag))
        } else if (key === "photo") {
          body.append("photo", customerData.photo)
        } else {
          body.append(key, customerData[key])
        }
      })
      delete headers["Content-Type"]
    } else {
      body = JSON.stringify(customerData)
    }
    try {
      const response = await fetch(API_URL, {
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
      console.error("Error adding customer:", error.message)
      throw error
    }
  }

  const getCustomersName = async () => {
    const Token = getToken(); 
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}/names`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          Accept:"application/json"
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch customers names");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching customers names:", error.message);
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
    const Token = getToken();
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          Accept: "application/json"
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

  // const updateCustomer = async (id, updatedData) => {
  //   const Token = getToken();
  //   if (!Token) {
  //     throw new Error("No auth token found");
  //   }
  //   try {
  //     const response = await fetch(`${API_URL}/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${Token}`,
  //         Accept: "application/json"
  //       },
  //       body: JSON.stringify(updatedData),
  //     });
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Failed to update customer");
  //     }
  //     return await response.json();
  //   } catch (error) {
  //     console.error("Error updating customer:", error.message);
  //     throw error;
  //   }
  // };
  const updateCustomer = async (id, updatedData) => {
    const Token = getToken()
    if (!Token) {
      throw new Error("No auth token found")
    }
  
    try {
      // Check if we have a File object for photo
      if (updatedData.photo instanceof File) {
        // Use FormData for file uploads
        const formData = new FormData()
  
        // Add all other fields to FormData
        Object.keys(updatedData).forEach((key) => {
          if (key === "photo") {
            formData.append("photo", updatedData.photo)
          } else if (key === "tags" && Array.isArray(updatedData[key])) {
            // Handle tags array
            updatedData[key].forEach((tag) => {
              formData.append("tags[]", tag)
            })
          } else if (updatedData[key] !== null && updatedData[key] !== undefined) {
            formData.append(key, updatedData[key])
          }
        })
  
        const response = await fetch(`${API_URL}/${id}`, {
          method: "PUT", // Use POST with _method=PUT for Laravel/PHP backends
          headers: {
            Authorization: `Bearer ${Token}`,
            Accept: "application/json",
            // Don't set Content-Type with FormData, browser will set it with boundary
          },
          body: formData,
        })
  
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to update customer")
        }
  
        return await response.json()
      } else {
        // Regular JSON request for non-file updates
        const response = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
            Accept: "application/json",
          },
          body: JSON.stringify(updatedData),
        })
  
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to update customer")
        }
  
        return await response.json()
      }
    } catch (error) {
      console.error("Error updating customer:", error.message)
      throw error
    }
  }

  const showCustomer = async (id) => {
    const Token = getToken();
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
    const Token = getToken();
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
    getCustomersName
  };
};

export default useCustomersApi;
