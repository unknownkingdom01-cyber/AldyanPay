const STORAGE_KEY = "aldyanpay_v2";

let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    saldo: 0,
    masuk: 0,
    keluar: 0,
    catatan: "",
    target: [],
    riwayat: []
};

/* ======================
   SIMPAN
====================== */

function simpan() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

    render();
}

/* ======================
   TARGET
====================== */

function tambahTarget() {

    const nama = document
        .getElementById("namaTarget")
        .value
        .trim();

    const jumlah = parseInt(
        document.getElementById("jumlahTarget").value
    );

    if (!nama || !jumlah) {
        alert("Lengkapi data target");
        return;
    }

    data.target.push({
        nama,
        jumlah,
        terkumpul: 0,
        item: []
    });

    document.getElementById("namaTarget").value = "";
    document.getElementById("jumlahTarget").value = "";

    simpan();
}

function hapusTarget(index) {

    if (!confirm("Hapus target ini?")) {
        return;
    }

    data.target.splice(index, 1);

    simpan();
}

function tambahItemTarget(index) {

    const namaItem = prompt(
        "Nama item target?"
    );

    if (!namaItem) return;

    data.target[index].item.push({
        nama: namaItem,
        selesai: false
    });

    simpan();
}

function toggleItemTarget(
    targetIndex,
    itemIndex
) {

    const item =
        data.target[targetIndex]
        .item[itemIndex];

    item.selesai = !item.selesai;

    simpan();
}

function tambahDanaTarget(index) {

    const nominal = parseInt(
        prompt("Masukkan nominal")
    );

    if (!nominal) return;

    if (nominal > data.saldo) {
        alert("Saldo tidak cukup");
        return;
    }

    data.saldo -= nominal;

    data.target[index].terkumpul += nominal;

    simpan();
}

/* ======================
   TRANSAKSI
====================== */

function tambahTransaksi() {

    const ket = document
        .getElementById("keterangan")
        .value
        .trim();

    const nominal = parseInt(
        document.getElementById("nominal").value
    );

    const jenis = document
        .getElementById("jenisTransaksi")
        .value;

    if (!ket || !nominal) {
        alert("Lengkapi data transaksi");
        return;
    }

    if (jenis === "masuk") {

        data.saldo += nominal;
        data.masuk += nominal;

    } else {

        data.saldo -= nominal;
        data.keluar += nominal;
    }

    data.riwayat.unshift({
        ket,
        nominal,
        jenis,
        tanggal: new Date()
            .toLocaleString("id-ID")
    });

    document.getElementById("keterangan").value = "";
    document.getElementById("nominal").value = "";

    simpan();
}

function hapusTransaksi(index) {

    const item = data.riwayat[index];

    if (item.jenis === "masuk") {

        data.saldo -= item.nominal;
        data.masuk -= item.nominal;

    } else {

        data.saldo += item.nominal;
        data.keluar -= item.nominal;
    }

    data.riwayat.splice(index, 1);

    simpan();
}

/* ======================
   CATATAN
====================== */

function simpanCatatan() {

    const isi =
        document.getElementById("catatan")
        .value;

    data.catatan = isi;

    simpan();

    alert("Catatan disimpan");
}

/* ======================
   FORMAT RUPIAH
====================== */

function rupiah(angka) {

    return "Rp " +
        angka.toLocaleString("id-ID");
}

/* ======================
   RENDER
====================== */

function render() {

    /* saldo */

    const saldo =
        document.getElementById("saldo");

    if (saldo) {
        saldo.innerHTML =
            rupiah(data.saldo);
    }

    /* ringkasan */

    const totalMasuk =
        document.getElementById("totalMasuk");

    const totalKeluar =
        document.getElementById("totalKeluar");

    if (totalMasuk) {
        totalMasuk.innerHTML =
            rupiah(data.masuk);
    }

    if (totalKeluar) {
        totalKeluar.innerHTML =
            rupiah(data.keluar);
    }

    /* catatan */

    const catatan =
        document.getElementById("catatan");

    if (catatan) {
        catatan.value =
            data.catatan || "";
    }

    /* statistik */

    const statMasuk =
        document.getElementById("statMasuk");

    const statKeluar =
        document.getElementById("statKeluar");

    if (statMasuk) {
        statMasuk.innerHTML =
            rupiah(data.masuk);
    }

    if (statKeluar) {
        statKeluar.innerHTML =
            rupiah(data.keluar);
    }

    /* target */

    const daftar =
        document.getElementById("daftarTarget");

    if (daftar) {

        daftar.innerHTML = "";

        data.target.forEach(
            (item, index) => {

                const selesai =
                    item.item.filter(
                        x => x.selesai
                    ).length;

                const persenItem =
                    item.item.length
                    ? (selesai /
                        item.item.length) * 100
                    : 0;

                let daftarItem = "";

                item.item.forEach(
                    (sub, i) => {

                        daftarItem += `
                        <div>
                            <input
                            type="checkbox"
                            ${sub.selesai ? "checked" : ""}
                            onclick="toggleItemTarget(${index},${i})">

                            ${sub.nama}
                        </div>
                        `;
                    }
                );

                const persenDana =
                    (item.terkumpul /
                        item.jumlah) * 100;

                daftar.innerHTML += `
                <div class="target">

                    <h3>${item.nama}</h3>

                    <p>
                        ${rupiah(item.terkumpul)}
                        /
                        ${rupiah(item.jumlah)}
                    </p>

                    <div class="progress-box">
                        <div
                        class="progress"
                        style="width:${Math.min(persenDana,100)}%">
                        </div>
                    </div>

                    <p>
                        Dana:
                        ${persenDana.toFixed(1)}%
                    </p>

                    <p>
                        Checklist:
                        ${persenItem.toFixed(1)}%
                    </p>

                    ${daftarItem}

                    <button onclick="tambahDanaTarget(${index})">
                        💰 Tambah Dana
                    </button>

                    <button onclick="tambahItemTarget(${index})">
                        ➕ Tambah Item
                    </button>

                    <button onclick="hapusTarget(${index})">
                        🗑 Hapus Target
                    </button>

                </div>
                `;
            }
        );
    }

    /* riwayat */

    const riwayat =
        document.getElementById("riwayat");

    if (riwayat) {

        riwayat.innerHTML = "";

        data.riwayat.forEach(
            (item, index) => {

                riwayat.innerHTML += `
                <div class="transaksi ${item.jenis}">

                    <div>
                        <b>${item.ket}</b>
                        <br>
                        ${rupiah(item.nominal)}
                        <br>
                        <small>${item.tanggal}</small>
                    </div>

                    <button
                    class="hapus"
                    onclick="hapusTransaksi(${index})">
                        Hapus
                    </button>

                </div>
                `;
            }
        );
    }
}

let saldo = 0;
let totalMasuk = 0;
let totalKeluar = 0;

let transaksi = [];
let target = [];

function updateUI() {
  document.getElementById("saldo").innerText = "Rp " + saldo;
  document.getElementById("totalMasuk").innerText = "Rp " + totalMasuk;
  document.getElementById("totalKeluar").innerText = "Rp " + totalKeluar;

  localStorage.setItem("data", JSON.stringify({
    saldo,
    totalMasuk,
    totalKeluar,
    transaksi,
    target
  }));
}

function tambahTransaksi() {
  let ket = document.getElementById("keterangan").value;
  let nominal = parseInt(document.getElementById("nominal").value);
  let jenis = document.getElementById("jenisTransaksi").value;

  if (!ket || !nominal) return alert("Isi dulu!");

  if (jenis === "masuk") {
    totalMasuk += nominal;
    saldo += nominal;
  } else {
    totalKeluar += nominal;
    saldo -= nominal;
  }

  transaksi.push({ ket, nominal, jenis });

  updateUI();
}

function tambahTarget() {
  let nama = document.getElementById("namaTarget").value;
  let jumlah = parseInt(document.getElementById("jumlahTarget").value);

  if (!nama || !jumlah) return alert("Isi target!");

  target.push({ nama, jumlah });

  updateUI();
}

function simpanCatatan() {
  let isi = document.getElementById("catatan").value;
  localStorage.setItem("catatan", isi);
  alert("Catatan disimpan!");
}

// LOAD DATA
window.onload = function () {
  let data = JSON.parse(localStorage.getItem("data"));

  if (data) {
    saldo = data.saldo;
    totalMasuk = data.totalMasuk;
    totalKeluar = data.totalKeluar;
    transaksi = data.transaksi;
    target = data.target;
  }

  updateUI();
};

render();
