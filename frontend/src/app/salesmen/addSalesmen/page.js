"use client";

import useSalesmenApi from "@/api/salesmenApi";
import { useState } from "react";

const AddSalesman = () => {
  const { addSalesmen } = useSalesmenApi();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [salesman, setSalesman] = useState({
    code: "",
    name: "",
    phone: "",
    address: "",
    is_inactive: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSalesman((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddSalesman = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await addSalesmen(salesman);
      setSuccess("Salesman added successfully!");
      console.log("Salesman added successfully");
      setSalesman({
        code: "",
        name: "",
        phone: "",
        address: "",
        is_inactive: false,
      });
    } catch (error) {
      setError(error.message || "Error adding salesmen.");
    }
  };

  return (
    <form onSubmit={handleAddSalesman}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <input
        type="text"
        name="code"
        value={salesman.code}
        onChange={handleChange}
        placeholder="Code"
        required
      />
      <input
        type="text"
        name="name"
        value={salesman.name}
        onChange={handleChange}
        placeholder="Salesman Name"
        required
      />
      <input
        type="text"
        name="phone"
        value={salesman.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        required
      />
      <input
        type="text"
        name="address"
        value={salesman.address}
        onChange={handleChange}
        placeholder="Address"
        required
      />
      <input
        type="checkbox"
        name="is_inactive"
        checked={salesman.is_inactive}
        onChange={handleChange}
      />

      <button
        type="submit"
        disabled={
          !salesman.code ||
          !salesman.name ||
          !salesman.phone ||
          !salesman.address
        }
      >
        Add Salesman
      </button>
    </form>
  );
};

export default AddSalesman;
