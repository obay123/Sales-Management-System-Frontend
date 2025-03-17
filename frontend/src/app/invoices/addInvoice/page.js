"use client";

import React, { useState } from "react";
import useInvoicesApi from "@/api/InvoicesApi";

const AddInvoicePage = () => {
    const { addInvoice } = useInvoicesApi();
    const [customer_id, setCustomerId] = useState("");
    const [items, setItems] = useState([{ item_code: "", quantity: 1, unit_price: 0 }]);
    const [date, setDate] = useState("");

    const handleAddItem = () => {
        setItems([...items, { item_code: "", quantity: 1, unit_price: 0 }]);
    };

    const handleRemoveItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    const handleChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!customer_id || items.length === 0) {
            console.log("Error", "Customer ID and at least one item are required", "error");
            return;
        }

        const invoiceData = {
            customer_id,
            items: items.map(item => ({
                item_code: item.item_code,  // ✅ Fixed field name
                quantity: parseInt(item.quantity),
                unit_price: parseFloat(item.unit_price),  // ✅ Fixed field name
            })),
            date
        };

        try {
            await addInvoice(invoiceData);
            console.log("Success", "Invoice added successfully", "success");
            setCustomerId("");
            setItems([{ item_code: "", quantity: 1, unit_price: 0 }]);
            setDate("");
        } catch (error) {
            console.log("Error", error.message, "error");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Add Invoice</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                <div className="mb-4">
                    <label className="block font-semibold">Customer ID:</label>
                    <input
                        type="text"
                        value={customer_id}
                        onChange={(e) => setCustomerId(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold">Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <h3 className="text-lg font-semibold mb-2">Items</h3>
                {items.map((item, index) => (
                    <div key={index} className="mb-4 border p-4 rounded">
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="text"
                                placeholder="Item Code"
                                value={item.item_code}
                                onChange={(e) => handleChange(index, "item_code", e.target.value)}
                                className="border p-2 rounded"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={(e) => handleChange(index, "quantity", e.target.value)}
                                className="border p-2 rounded"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Unit Price"
                                value={item.unit_price}
                                onChange={(e) => handleChange(index, "unit_price", e.target.value)}
                                className="border p-2 rounded"
                                required
                            />
                        </div>
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-500 mt-2"
                            >
                                Remove Item
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                    Add Another Item
                </button>

                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4 block">
                    Submit Invoice
                </button>
            </form>
        </div>
    );
};

export default AddInvoicePage;
