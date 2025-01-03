"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api/axios";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Swal from "sweetalert2";

export default function CreateItemPage() {
  const searchParams = useSearchParams(); // Mendapatkan parameter query dari URL
  const checklistId = searchParams.get("id"); // Mengambil parameter `id`
  const router = useRouter();

  const [itemName, setItemName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checklistId) {
      Swal.fire({
        title: "Error!",
        text: "Checklist ID is missing!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      await api.post(
        `/api/checklist/${checklistId}/item`,
        { itemName },
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        title: "Success!",
        text: "Item created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.push(`/checklists/${checklistId}`); // Kembali ke halaman checklist setelah berhasil
      });
    } catch (error) {
      console.error("Failed to create item:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to create item.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Item</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Item Name"
          required
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500"
          >
            Cancel
          </Button>
          <Button type="submit">Add Item</Button>
        </div>
      </form>
    </div>
  );
}
