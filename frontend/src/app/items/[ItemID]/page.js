"use client";

import useItemsApi from "@/api/ItemsApi";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DataViewer from "@/app/components/DataViewer";

export default function ItemDetail() {
  const { ItemID } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { showItem } = useItemsApi();
        const data = await showItem(ItemID);
        setItem(data.item);
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };

    if (ItemID) fetchItem();
  }, [ItemID]);

  if (loading) return <p>Loading item details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!item) return <p className="text-gray-500">No item found.</p>;

  const columns = [
    { field: "code", header: "Code" },
    { field: "name", header: "Name" },
    { field: "description", header: "Description" },
    { field: "created_at", header: "Created At" },
    { field: "updated_at", header: "Updated At" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Item Details</h1>

      <DataViewer data={item} title="Item Details" columns={columns} />
    </div>
  );
}
