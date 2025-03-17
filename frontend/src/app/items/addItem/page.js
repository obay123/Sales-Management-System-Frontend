"use client";

import { Input } from "@/components/ui/input"
import useItemsApi from "@/api/ItemsApi";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const AddItem = () => {
  const { addItem } = useItemsApi();
  const [item, setItem] = useState({ code: "", name: "", description: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await addItem(item);
      setSuccess("Item added successfully!");
      setItem({ code: "", name: "", description: "" });
    } catch (error) {
      setError(error.message || "Error adding item.");
    }
  };

  return (
      <Card>
        <CardHeader>
          <CardTitle>Add Item</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem}>
            <Input type="text"
              name="code"
              value={item.code}
              onChange={handleChange}
              placeholder="Code"
              required
            />
            <Input type="text"
              name="name"
              value={item.name}
              onChange={handleChange}
              placeholder="Item Name"
              required
            />
            <Input type="text"
              name="description"
              value={item.description}
              onChange={handleChange}
              placeholder="Description"
              required
            />
          </form>
        </CardContent>
        <CardFooter>
        <Button variant="outline" type="submit"
              disabled={!item.code || !item.name || !item.description}
            >
              Add Item
            </Button>
        </CardFooter>
      </Card>
  );
};

export default AddItem;
