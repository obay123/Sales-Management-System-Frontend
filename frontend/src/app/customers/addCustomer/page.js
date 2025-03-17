"use client";
import { useState } from "react";
import useCustomersApi from "@/api/CustomersApi";

const AddCustomerPage = () => {
  const [formData, setFormData] = useState({
    salesmen_code: "",
    name: "",
    tel1: "",
    tel2: "",
    address: "",
    gender: "",
    subscription_date: "",
    rate: "",
    photo: null,
    tags: [],
  });

  const { addCustomer } = useCustomersApi();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleTagsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      tags: e.target.value.split(",").map((tags) => tags.trim()),
    }));
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();

    try {
      await addCustomer(formData);
      alert("Customer added successfully");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add customer");
    }
  };

  return (
    <div>
      <h2>Add Customer</h2>

      <form onSubmit={handleAddCustomer} encType="multipart/form-data">
        <input
          type="number"
          name="salesmen_code"
          placeholder="Salesman Code"
          value={formData.salesmen_code}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="tel1"
          placeholder="Phone Number"
          value={formData.tel1}
          onChange={handleChange}
        />

        <input
          type="text"
          name="tel2"
          placeholder="Alternative Phone Number"
          value={formData.tel2}
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={formData.gender}
          onChange={handleChange}
        />

        <input
          type="date"
          name="subscription_date"
          placeholder="Subscription Date"
          value={formData.subscription_date}
          onChange={handleChange}
        />

        <input
          type="number"
          name="rate"
          placeholder="Rate"
          value={formData.rate}
          onChange={handleChange}
        />

        <input type="file" accept="image/*" onChange={handleFileChange} />

        <input
          type="text"
          placeholder="Enter tag (comma-separated)"
          value={formData.tags.join(", ")}
          onChange={handleTagsChange}
        />

        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
};

export default AddCustomerPage;
