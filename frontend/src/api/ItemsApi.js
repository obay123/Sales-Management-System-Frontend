const API_URL = "/api/items";

const useItemsApi = () => {
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("Token") : null;
  const Token = getToken();
  const addItem = async (item) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${Token}`
        },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add item");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding item:", error.message);
      throw error;
    }
  };

  const getItems = async (page = 1) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}?page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          Accept: "application/json"
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || " response error Failed to fetch items"
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching items");
      throw error;
    }
  };
  const deleteItem = async (id) => {
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
        throw new Error(errorData.message || "Failed to delete items");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const updateItem = async (id, updatedData) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          Accept: "application/json"
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update item");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating item:", error.message);
      throw error;
    }
  };
  const showItem = async (id) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          Accept: "application/json"
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update item");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating item:", error.message);
      throw error;
    }
  };

  const bulkDeleteItems = async (ids) => {
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch(`${API_URL}/bulk-delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          Accept: "application/json"
        },
        body: JSON.stringify( {ids} ),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete items");
      }
      return await response.json();
    } catch (error) {
      console.error("Error deleting items:", error.message);
      throw error;
    }
  };

  return {
    addItem,
    getItems,
    deleteItem,
    updateItem,
    showItem,
    bulkDeleteItems,
  };
};
export default useItemsApi;
