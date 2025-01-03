"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect pengguna ke halaman /login
    router.replace("/login");
  }, [router]);

  return null; // Tidak menampilkan konten apa pun karena langsung diarahkan
}
