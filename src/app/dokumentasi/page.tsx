// export default function DokumentasiPage() {
//     return (
//         <main>
//             <h1 className="text-3xl font-bold mb-4">Dokumentasi kegiatan</h1>
//             <p>Halaman ini akan menampilkan galeri foto-foto kegiatan</p>
//         </main>
//     );
// }
// app/dokumentasi/page.tsx
"use client";
import { useEffect, useState } from "react";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../../lib/firebase";

export default function PublikDokumentasi() {
  const [images, setImages] = useState<string[]>([]);

  const fetchImages = async () => {
    const listRef = ref(storage, "dokumentasi/");
    const result = await listAll(listRef);
    const files = await Promise.all(result.items.map((item) => getDownloadURL(item)));
    setImages(files);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Galeri Dokumentasi Kegiatan</h1>
      {images.length === 0 ? (
        <p className="text-center">Belum ada dokumentasi tersedia.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((url, idx) => (
            <div key={idx} className="rounded overflow-hidden shadow">
              <img src={url} alt={`Dokumentasi ${idx}`} className="w-full h-48 object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
