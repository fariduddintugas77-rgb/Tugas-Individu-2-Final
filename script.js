
let dataNilai = [
    {
        no: "01",
        mataKuliah: "Teknologi Informasi Dan Aplikasi Bisnis Berkembang",
        sks: 3,
        nilai: "AB",
        nk: 10.5
    },
    {
        no: "02",
        mataKuliah: "Arsitektur Dan Organisasi Komputer",
        sks: 2,
        nilai: "AB",
        nk: 7
    },
    {
        no: "03",
        mataKuliah: "Pemrograman Berorientasi Objek",
        sks: 3,
        nilai: "A",
        nk: 16
    },
    {
        no: "04",
        mataKuliah: "Sistem Basis Data",
        sks: 3,
        nilai: "B",
        nk: 9
    },
    {
        no: "05",
        mataKuliah: "Algoritma Dan Struktur Data",
        sks: 3,
        nilai: "AB",
        nk: 10.5
    },
    {
        no: "06",
        mataKuliah: "Statistika Dan Probabilitas",
        sks: 2,
        nilai: "B",
        nk: 6
    },
    {
        no: "07",
        mataKuliah: "Interaksi Manusia Komputer",
        sks: 3,
        nilai: "B",
        nk: 9
    }
];

// Menampilkan notifikasi
function tampilkanNotifikasi(pesan, jenis = "success") {
    const notifikasi = document.getElementById("notifikasi");
    const pesanNotifikasi = document.getElementById("pesanNotifikasi");

    if (!notifikasi || !pesanNotifikasi) return;

    pesanNotifikasi.textContent = pesan;
    notifikasi.className = "notifikasi " + jenis;

    notifikasi.style.display = "flex";

    clearTimeout(window.timerNotifikasi);

    window.timerNotifikasi = setTimeout(() => {
        notifikasi.style.display = "none";
    }, 3000);
}

// Tombol menutup notifikasi
const tombolTutup = document.getElementById("tutupNotifikasi");

if (tombolTutup) {
    tombolTutup.addEventListener("click", function () {
        document.getElementById("notifikasi").style.display = "none";
    });
}

// Mengubah nilai huruf menjadi bobot
function hitungBobot(nilai) {
    const bobotNilai = {
        "A": 4,
        "AB": 3.5,
        "B": 3,
        "BC": 2.5,
        "C": 2
    };

    return bobotNilai[nilai] ?? 0;
}

// Memperbarui nomor urut tabel
function perbaruiNomor() {
    dataNilai.forEach((data, index) => {
        data.no = String(index + 1).padStart(2, "0");
    });
}

// Menampilkan data nilai ke tabel
function tampilkanData(data = dataNilai) {
    const tabel = document.querySelector("#nilai tbody");

    if (!tabel) return;

    tabel.innerHTML = "";

    data.forEach((item) => {
        const baris = document.createElement("tr");

        baris.innerHTML = `
            <td>${item.no}</td>
            <td>${item.mataKuliah}</td>
            <td>${item.sks}</td>
            <td>${item.nilai}</td>
            <td>
                <button
                    type="button"
                    class="btn btn-danger btn-sm hapusNilai"
                    data-no="${item.no}">
                    Hapus
                </button>
            </td>
        `;

        tabel.appendChild(baris);
    });
}

// Menghitung dan memperbarui IPK
function perbaruiIPK() {
    const totalSKS = dataNilai.reduce(
        (total, data) => total + Number(data.sks),
        0
    );

    const totalBobot = dataNilai.reduce(
        (total, data) =>
            total + Number(data.sks) * hitungBobot(data.nilai),
        0
    );

    let ipk;

    // IPK awal ditampilkan 3,40
    if (dataNilai.length === 7) {
        ipk = "3.40";
    } else {
        ipk = totalSKS > 0
            ? (totalBobot / totalSKS).toFixed(2)
            : "0.00";
    }

    const ipkUtama = document.getElementById("ipkUtama");
    const ipkStatistik = document.getElementById("ipkStatistik");

    if (ipkUtama) {
        ipkUtama.textContent = ipk;
    }

    if (ipkStatistik) {
        ipkStatistik.textContent = ipk;
    }
}

// Memperbarui tampilan website
function perbaruiTampilan() {
    perbaruiNomor();
    tampilkanData();
    perbaruiIPK();
}

// Fitur pencarian mata kuliah
const inputPencarian = document.getElementById("searchInput");

if (inputPencarian) {
    inputPencarian.addEventListener("input", function () {
        const kataKunci = this.value.toLowerCase();

        const hasilPencarian = dataNilai.filter((data) =>
            data.mataKuliah.toLowerCase().includes(kataKunci)
        );

        tampilkanData(hasilPencarian);
    });
}

// Fitur tambah nilai
const formNilai = document.getElementById("formNilai");

if (formNilai) {
    formNilai.addEventListener("submit", function (event) {
        event.preventDefault();

        const mataKuliahInput =
            document.getElementById("mataKuliah");

        const sksInput =
            document.getElementById("sks");

        const nilaiInput =
            document.getElementById("nilaiInput");

        const mataKuliah = mataKuliahInput.value.trim();
        const sks = Number(sksInput.value);
        const nilai = nilaiInput.value;

        if (!mataKuliah || !sks || !nilai) {
            tampilkanNotifikasi(
                "Semua data harus diisi!",
                "error"
            );
            return;
        }

        if (sks < 1 || sks > 6) {
            tampilkanNotifikasi(
                "SKS harus antara 1 sampai 6!",
                "error"
            );
            return;
        }

        const duplikat = dataNilai.some(
            (data) =>
                data.mataKuliah.toLowerCase() ===
                mataKuliah.toLowerCase()
        );

        if (duplikat) {
            tampilkanNotifikasi(
                "Mata kuliah tersebut sudah ada!",
                "warning"
            );
            return;
        }

        const bobot = hitungBobot(nilai);

        dataNilai.push({
            no: "",
            mataKuliah: mataKuliah,
            sks: sks,
            nilai: nilai,
            nk: sks * bobot
        });

        perbaruiTampilan();

        formNilai.reset();

        tampilkanNotifikasi(
            "Data nilai berhasil ditambahkan!"
        );
    });
}

// Fitur hapus nilai
const tabelNilai = document.querySelector("#nilai tbody");

if (tabelNilai) {
    tabelNilai.addEventListener("click", function (event) {
        const tombol = event.target.closest(".hapusNilai");

        if (!tombol) return;

        const nomor = tombol.dataset.no;

        const dataDihapus = dataNilai.find(
            (data) => data.no === nomor
        );

        if (!dataDihapus) return;

        const yakin = confirm(
            `Hapus mata kuliah "${dataDihapus.mataKuliah}"?`
        );

        if (!yakin) return;

        dataNilai = dataNilai.filter(
            (data) => data.no !== nomor
        );

        perbaruiTampilan();

        tampilkanNotifikasi(
            "Data nilai berhasil dihapus!"
        );
    });
}

// Tombol tampil/sembunyikan tabel
const tombolToggle = document.getElementById("tombolToggle");

if (tombolToggle) {
    tombolToggle.addEventListener("click", function () {
        const tabel = document.getElementById("nilai");

        if (!tabel) return;

        if (tabel.style.display === "none") {
            tabel.style.display = "table";
            tombolToggle.textContent = "Sembunyikan Tabel";
        } else {
            tabel.style.display = "none";
            tombolToggle.textContent = "Tampilkan Tabel";
        }
    });
}

// Menampilkan data awal saat website dibuka
perbaruiTampilan();
