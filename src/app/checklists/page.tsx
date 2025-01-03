"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Checklist } from "@/types";
import api from "@/lib/api/axios"; // Sesuaikan api axios jika perlu
import { Button } from "@/components/ui/Button";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function ChecklistsPage() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChecklists();
  }, []);

  const fetchChecklists = async () => {
    try {
      const response = await api.get("/api/checklist", {
        headers: {
          accept: "*/*",
        },
      });
      setChecklists(response.data.data); // Asumsi response.data.data mengandung data checklist
    } catch (error) {
      console.error("Failed to fetch checklists:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch checklists.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Menggunakan ID untuk request DELETE
      await api.delete(`/api/checklist/${id}`, {
        headers: {
          accept: "*/*",
        },
      });
      // Memperbarui state setelah checklist dihapus
      setChecklists(checklists.filter((list) => list.id !== id));

      // Menampilkan notifikasi sukses dengan SweetAlert2
      Swal.fire({
        title: "Deleted!",
        text: "The checklist has been deleted.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Failed to delete checklist:", error);

      // Menampilkan notifikasi error dengan SweetAlert2
      Swal.fire({
        title: "Error!",
        text: "Failed to delete checklist.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Checklists</h1>
        <Link href="/checklists/create">
          <Button>Create New Checklist</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {checklists.map((checklist) => (
          <div
            key={checklist.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold mb-2">{checklist.name}</h3>{" "}
            {/* Menggunakan name sesuai API */}
            <p className="text-gray-600 text-sm mb-4">
              {checklist.description || "No description"}
            </p>
            <div className="flex justify-between">
              <Link href={`/checklists/${checklist.id}`}>
                <Button>View Details</Button>
              </Link>
              <button
                onClick={() => handleDelete(checklist.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
