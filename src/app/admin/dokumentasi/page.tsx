"use client";

import React, { useEffect, useState } from "react";
import { storage } from "../../../../lib/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";

export default function DokumentasiPage() {
  const [image, setImage] = useState<File | null>(null);
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const listRef = ref(storage, "dokumentasi/");
      const result = await listAll(listRef);
      const files = await Promise.all(
        result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { url, name: item.name };
        })
      );
      setImages(files);
    } catch (err) {
      console.error("Gagal memuat gambar:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert("Pilih gambar terlebih dahulu");

    const imageRef = ref(storage, `dokumentasi/${Date.now()}-${image.name}`);
    const uploadTask = uploadBytesResumable(imageRef, image);

    setUploadProgress(0);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        console.error("Upload gagal:", error);
        alert("Upload gagal: " + error.message);
        setUploadProgress(null);
      },
      async () => {
        await fetchImages();
        setImage(null);
        setUploadProgress(null);
      }
    );
  };

  const handleDelete = async (name: string) => {
    if (!confirm("Yakin ingin menghapus gambar ini?")) return;

    const imageRef = ref(storage, `dokumentasi/${name}`);
    try {
      await deleteObject(imageRef);
      await fetchImages();
    } catch (err) {
      alert("Gagal menghapus gambar");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Dokumentasi Kegiatan (Admin)</h1>

      <form onSubmit={handleUpload} className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setImage(e.target.files[0])}
          className="border p-2 rounded w-full md:w-auto"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>

      {uploadProgress !== null && (
        <div className="mb-4">
          <p className="text-sm">Progress: {uploadProgress}%</p>
          <div className="w-full bg-gray-200 rounded h-2">
            <div
              className="bg-blue-600 h-2 rounded"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">Semua Dokumentasi</h2>
      {loading ? (
        <p>Loading...</p>
      ) : images.length === 0 ? (
        <p>Belum ada dokumentasi diunggah.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.name} className="border rounded p-2 shadow-sm">
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-40 object-cover rounded"
              />
              <p className="text-sm mt-2 truncate">{img.name}</p>
              <button
                onClick={() => handleDelete(img.name)}
                className="text-red-500 text-sm mt-1 hover:underline"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
