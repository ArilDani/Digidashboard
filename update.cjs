const fs = require('fs');
const dbPath = 'd:/Coding Banget/Project/Digidashboard v3/digidashboard/src/data/database.json';
const db = JSON.parse(fs.readFileSync(dbPath));

db.kegiatan.push(
  {
    "ID_Kegiatan": "KGT006",
    "Nama_Kegiatan": "Kajian",
    "Tanggal": null,
    "Jenis_Kegiatan": "Proker",
    "Penyelenggara": "HIMA BISDIG FEB UNM",
    "Lokasi": null,
    "Jumlah_Pelaksanaan": 5,
    "Target_Peserta": "Umum",
    "Status": "Selesai"
  },
  {
    "ID_Kegiatan": "KGT007",
    "Nama_Kegiatan": "Fun Games",
    "Tanggal": null,
    "Jenis_Kegiatan": "Proker",
    "Penyelenggara": "HIMA BISDIG FEB UNM",
    "Lokasi": null,
    "Jumlah_Pelaksanaan": 4,
    "Target_Peserta": "Mahasiswa Bisnis Digital",
    "Status": "Selesai"
  }
);

db.surveiMinatBakat = [
  {"Minat & Bakat":"Music","Masukan / Saran":"."},
  {"Minat & Bakat":"Akademik, Music, Seni, Coding / Pemrograman / IT, Olahraga, Desain / Videografi","Masukan / Saran":"Blm terpikirkan, maaf 🙏🏻"},
  {"Minat & Bakat":"Music, Seni","Masukan / Saran":"bikin pentas seni"},
  {"Minat & Bakat":"Akademik, Music, Desain / Videografi","Masukan / Saran":"adain olahraga khusus buat cewek2 juga misal karna biasanya cewek males ikut olahraga karna malu2 banyak cowok"},
  {"Minat & Bakat":"Music, Seni, Desain / Videografi","Masukan / Saran":"mungkin bagus kalau ada kegiatan terus menampilkan drama pendek (yang fun)"},
  {"Minat & Bakat":"Olahraga","Masukan / Saran":"Badminton"},
  {"Minat & Bakat":"E - Sport, Olahraga","Masukan / Saran":"saran dari saya kalau bisa adakan juga untuk esport"},
  {"Minat & Bakat":"Seni, Desain / Videografi, baking","Masukan / Saran":"semangat!"}
];

db.kajianIsu = [
  { "isu": "RUPIAH MELEMAH (18 Mei 2026)", "suka": 110, "komen": 0, "posting_ulang": 4, "bagikan": 13 },
  { "isu": "Pembangunan gedung BU(18 mei 2026)", "suka": 0, "komen": 0, "posting_ulang": 0, "bagikan": 0 },
  { "isu": "KENAPA PEREMPUN SELALU DIJADIKAN UMPAN DI MEDIA SOSIAL (19 Mei 2026)", "suka": 193, "komen": 3, "posting_ulang": 19, "bagikan": 16 },
  { "isu": "SELAMAT HARI PENDIDIKAN NASIONAL (2 Mei 2026)", "suka": 31, "komen": 0, "posting_ulang": 1, "bagikan": 2 }
];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Done');
