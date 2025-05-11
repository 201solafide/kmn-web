"use client";

// import React, { useState } from "react";
// import anggotaData from "../../../../data/anggota.json";
import React, {useEffect, useState} from "react";
// import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
  } from "firebase/firestore";

type Anggota = {
    id: string,
    nama: string,
    angkatan: string,
    prodi: string,
    kontak: string
};

export default function DashboardPage() {
    const [anggota, setAnggota] = useState<Anggota[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({
        nama: "",
        angkatan: "",
        prodi: "",
        kontak: "",
    });

    // bagian edit
    const [editId, setEditId] = useState<string | null>(null);

    // ambil data dari firebase saat halaman dimuat
    useEffect(() => {
        const fetchData = async () => {
          const snapshot = await getDocs(collection(db, "anggota"));
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Anggota[];
          setAnggota(data);
        };
        fetchData();
    }, []);

    const grouped = anggota.reduce((acc: Record<string, Anggota[]>, curr) => {
       acc[curr.angkatan] = acc[curr.angkatan] || [];
       acc[curr.angkatan].push(curr);
       return acc; 
    }, {} );


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    // untuk submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (editId) {
          // Edit anggota di Firestore
          await updateDoc(doc(db, "anggota", editId), form);
          setAnggota((prev) =>
            prev.map((a) => (a.id === editId ? { ...a, ...form } : a))
          );
        } else {
          // Tambah anggota baru ke Firestore
          const docRef = await addDoc(collection(db, "anggota"), form);
          setAnggota((prev) => [...prev, { id: docRef.id, ...form }]);
        }
    
        setForm({ nama: "", angkatan: "", prodi: "", kontak: "" });
        setEditId(null);
        setIsModalOpen(false);
    };
    

    // untuk edit
    const handleEdit = (item: Anggota) => {
        setForm({
            nama: item.nama,
            angkatan: item.angkatan,
            prodi: item.prodi,
            kontak: item.kontak,
        });
        setEditId(item.id);
        setIsModalOpen(true);
    };

    // untuk hapus
    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, "anggota", id));
        setAnggota((prev) => prev.filter((a) => a.id !== id));
    };
    

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard admin</h1>
            <p>Halaman ini adalah panel admin untuk mengelola data anggota dan dokumentasi kegiatan</p>

            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
            >
                Tambah Anggota
            </button>

            {/* tabel angkatan */}
            {Object.keys(grouped)
                .sort()
                .map((angkatan) => (
                    <div key={angkatan} className="mb-8">
                        <h2 className="bg-red-200 px-3 py-1 font-semibold">
                            Angkatan {angkatan}
                        </h2>
                        <table className="w-full border text-sm">
                            <thead className="bg-green-200">
                                <tr>
                                <th className="border px-2 py-1">No</th>
                                <th className="border px-2 py-1">Nama Lengkap</th>
                                <th className="border px-2 py-1">Prodi</th>
                                <th className="border px-2 py-1">Kontak</th>
                                <th className="border px-2 py-1">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grouped[angkatan].map((a, i) => (
                                <tr key={a.id} className="text-center">
                                    <td className="border px-2 py-1">{i + 1}</td>
                                    <td className="border px-2 py-1">{a.nama}</td>
                                    <td className="border px-2 py-1">{a.prodi}</td>
                                    <td className="border px-2 py-1">{a.kontak}</td>
                                    <td className="border px-2 py-1 space-x-1">
                                    <button
                                        onClick={() => handleEdit(a)}
                                        className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(a.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        Hapus
                                    </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            }
            {/* modal from tambah/edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <form 
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded shadow-md w-full max-w-md"
                    >
                        <h2 className="text-lg font-bold mb-4">
                            {editId ? "Edit Anggota" : "Tambah Anggota"}
                        </h2>
                        <input 
                            name="nama"
                            value={form.nama}
                            onChange={handleChange}
                            placeholder="Nama"
                            className="w-full mb-2 px-3 py-2 border rounded"
                            required
                        />
                        <input 
                            name="angkatan"
                            value={form.angkatan}
                            onChange={handleChange}
                            placeholder="Angkatan"
                            className="w-full mb-2 px-3 py-2 border rounded"
                            required
                        />
                        <input 
                            name="prodi"
                            value={form.prodi}
                            onChange={handleChange}
                            placeholder="Prodi"
                            className="w-full mb-2 px-3 py-2 border rounded"
                            required
                        />
                        <input 
                            name="kontak"
                            value={form.kontak}
                            onChange={handleChange}
                            placeholder="Kontak"
                            className="w-full mb-2 px-3 py-2 border rounded"
                            required
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditId(null);
                                    setForm({ nama: "", angkatan: "", prodi: "", kontak: ""});
                                }}
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Simpan
                            </button>
                        </div>

                    </form>
                </div>
            )}
        </div>
    );
}