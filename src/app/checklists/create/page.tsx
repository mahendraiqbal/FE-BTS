"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/api/axios";

export default function CreateChecklistPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "", // Mengganti title menjadi name sesuai API
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mengirim data sesuai API yang diinginkan
      await api.post("/api/checklist", {
        name: formData.name, // Menggunakan name sebagai properti
      });
      router.push("/checklists");
    } catch (error) {
      console.error("Failed to create checklist:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Checklist</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Name"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              name: e.target.value, // Update dengan 'name'
            }))
          }
        />
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500"
          >
            Cancel
          </Button>
          <Button type="submit">Create Checklist</Button>
        </div>
      </form>
    </div>
  );
}
