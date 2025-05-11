import anggota from "../../../data/anggota.json";

export default function AngkatanPage() {
    return(
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Data Anggota Komunitas</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {anggota.map((item) => (
                <div key={item.id} className="border p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">{item.nama}</h2>
                    <p>Angkatan: {item.angkatan}</p>
                    <p>Prodi: {item.prodi}</p>
                    <p>Kontak: {item.kontak}</p>
                </div>
                ))}
            </div>
        </div>
    );
}