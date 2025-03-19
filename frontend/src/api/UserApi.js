const userApi = () => {
  const register = async (name, email, password) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      throw error.message;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      localStorage.setItem("Token", data.token);
      return data;
    } catch (error) {
      throw error.message;
    }
  };

  const logout = async () => {
    const Token = localStorage.getItem("Token");
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      localStorage.removeItem("Token");
      return data;
    } catch (error) {
      throw error.message;
    }
  };

  const getUserDetails = async () => {
    const Token = localStorage.getItem("Token");
    if (!Token) {
      throw new Error("No auth token found");
    }
    try {
      const response = await fetch("/api/user-details", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      throw error.message;
    }
  };

  return { logout, login, register, getUserDetails };
};

export default userApi;
