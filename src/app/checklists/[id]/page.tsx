"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api/axios";
import { Button } from "@/components/ui/Button";
import { TrashIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

export default function ChecklistItemPage() {
  const { id } = useParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await api.get(`/api/checklist/${id}/item`, {
          headers: {
            accept: "*/*",
          },
        });
        setItems(itemsResponse.data.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCheckboxChange = async (itemId: string, completed: boolean) => {
    try {
      await api.put(
        `/api/checklist/${id}/item/${itemId}`,
        {
          itemCompletionStatus: completed,
        },
        {
          headers: {
            accept: "*/*",
          },
        }
      );
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId
            ? { ...item, itemCompletionStatus: completed }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update item completion:", error);
    }
  };

  const handleDelete = async (itemId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this item? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/checklist/${id}/item/${itemId}`, {
          headers: {
            accept: "*/*",
          },
        });
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        Swal.fire("Deleted!", "The item has been deleted.", "success");
      } catch (error) {
        console.error("Failed to delete item:", error);
        Swal.fire("Error!", "Failed to delete the item.", "error");
      }
    }
  };

  const handleRename = async (itemId: string) => {
    try {
      await api.put(
        `/api/checklist/${id}/item/rename/${itemId}`,
        {
          itemName: newName,
        },
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, name: newName } : item
        )
      );
      setEditingItemId(null);
      setNewName("");
    } catch (error) {
      console.error("Failed to rename item:", error);
      Swal.fire("Error!", "Failed to rename the item.", "error");
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Checklist Items</h1>
      </div>

      <div className="flex">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Items</h2>
            <Button
              onClick={() => router.push(`/items/create?id=${id}`)}
              className="bg-blue-500 text-white"
            >
              + Add Item
            </Button>
          </div>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow flex items-center justify-between"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.itemCompletionStatus}
                    onChange={() =>
                      handleCheckboxChange(item.id, !item.itemCompletionStatus)
                    }
                    className="mr-4"
                  />
                  {editingItemId === item.id ? (
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onBlur={() => handleRename(item.id)}
                      className="border border-gray-300 rounded p-1"
                    />
                  ) : (
                    <h3
                      className={`font-semibold ${
                        item.itemCompletionStatus
                          ? "line-through text-gray-500"
                          : ""
                      }`}
                      onDoubleClick={() => {
                        setEditingItemId(item.id);
                        setNewName(item.name);
                      }}
                    >
                      {item.name}
                    </h3>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button
          onClick={() => router.push(`/checklists`)}
          className="bg-gray-500 text-white"
        >
          Back to Checklists
        </Button>
      </div>
    </div>
  );
}
