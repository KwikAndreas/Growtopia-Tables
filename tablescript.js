function clearTable() {
  var table = document.getElementById("myTable");
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
}

function getLocalStorageData() {
  var data = localStorage.getItem("myTableData");
  return data ? JSON.parse(data) : [];
}

// Fungsi untuk menyimpan data ke Local Storage
function setLocalStorageData(data) {
  localStorage.setItem("myTableData", JSON.stringify(data));
}

// Fungsi untuk memuat data dari Local Storage ke tabel
function loadTableData() {
  var table = document.getElementById("myTable");
  var data = getLocalStorageData();

  clearTable();

  for (var i = 0; i < data.length; i++) {
    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    cell1.innerHTML =
      "<input type='text' placeholder='Nama Barang' value='" +
      data[i].namaBarang +
      "'>";
    cell2.innerHTML =
      "<input type='number' placeholder='Jumlah Barang' oninput='validateInput(this)' min='0' value='" +
      data[i].jumlahBarang +
      "'>";
    cell3.innerHTML =
      "<input type='number' placeholder='Harga Barang' oninput='validateInput(this)' min='0' value='" +
      data[i].hargaBarang +
      "'>";
    cell4.innerHTML =
      "<input type='text' placeholder='Total' disabled value='" +
      data[i].total +
      "'>";

    updateTotal(row.cells[2].getElementsByTagName("input")[0]);
  }
}

// Memanggil fungsi untuk memuat data saat halaman dimuat
loadTableData();

function addRow() {
  var table = document.getElementById("myTable");
  var row = table.insertRow(table.rows.length);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);

  cell1.innerHTML = "<input type='text' placeholder='Nama Barang'>";
  cell2.innerHTML =
    "<input type='text' placeholder='Jumlah Barang' oninput='updateTotal(this)'>";
  cell3.innerHTML =
    "<input type='text' placeholder='Harga Barang' oninput='updateTotal(this)'>";
  cell4.innerHTML = "<input type='text' placeholder='Total' disabled>";

  updateTotal(row.cells[2].getElementsByTagName("input")[0]);
}

function deleteRow() {
  var table = document.getElementById("myTable");
  if (table.rows.length > 1) {
    table.deleteRow(table.rows.length - 1);
    updateGrandTotal();
  }
}

function updateTotal(input) {
  var row = input.parentNode.parentNode;
  var jumlahBarang = row.cells[1].getElementsByTagName("input")[0].value;
  var hargaBarang = row.cells[2].getElementsByTagName("input")[0].value;
  var total = jumlahBarang * hargaBarang;

  if (!isNaN(total)) {
    row.cells[3].getElementsByTagName("input")[0].value = total;
  } else {
    row.cells[3].getElementsByTagName("input")[0].value = "";
  }

  updateGrandTotal();
  saveTableData(); // Menyimpan data ke Local Storage setiap kali data berubah
}

function validateInput(input) {
  // Menghapus karakter selain angka
  input.value = input.value.replace(/\D/g, "");

  // Update total setelah validasi
  updateTotal(input);
}

function updateGrandTotal() {
  var table = document.getElementById("myTable");
  var grandTotal = 0;

  for (var i = 1; i < table.rows.length; i++) {
    var totalCell = table.rows[i].cells[3].getElementsByTagName("input")[0];
    if (!isNaN(totalCell.value)) {
      grandTotal += parseFloat(totalCell.value);
    }
  }

  // Update Total Harga Seluruh Barang
  document.getElementById("totalAmount").innerText = grandTotal;

  // Bulatkan ke puluh terdekat dan bagikan dengan 100
  var roundedTotal = Math.ceil(grandTotal / 10) * 10;
  document.getElementById("roundedTotal").innerText = roundedTotal;

  var finalTotal = roundedTotal / 100;
  document.getElementById("finalTotal").innerText = finalTotal;

  // Update Total DL x Harga DL
  var hargaDL = document.getElementById("hargaDL").value || 0;
  var totalDLAmount = finalTotal * hargaDL;
  document.getElementById("totalDLAmount").innerText = totalDLAmount;
}

function saveTableDataToLocalStorage() {
  saveTableData();
  alert("Data disimpan ke Local Storage!");
}

// Fungsi untuk menyimpan data ke Local Storage
function saveTableData() {
  var table = document.getElementById("myTable");
  var data = [];

  for (var i = 1; i < table.rows.length; i++) {
    var rowData = {
      namaBarang: table.rows[i].cells[0].getElementsByTagName("input")[0].value,
      jumlahBarang:
        table.rows[i].cells[1].getElementsByTagName("input")[0].value,
      hargaBarang:
        table.rows[i].cells[2].getElementsByTagName("input")[0].value,
      total: table.rows[i].cells[3].getElementsByTagName("input")[0].value,
    };

    data.push(rowData);
  }

  // Mendapatkan nilai lastUpdate, hargaDL, dan totalDLAmount
  var lastUpdate = document.getElementById("lastUpdate").value || "";
  var hargaDL = document.getElementById("hargaDL").value || 0;
  var totalDLAmount = document.getElementById("totalDLAmount").innerText || 0;

  // Menambahkan keterangan tambahan ke objek penyimpanan
  var storageData = {
    tableData: data,
    lastUpdate: lastUpdate,
    hargaDL: hargaDL,
    totalDLAmount: totalDLAmount,
  };

  setLocalStorageData(data);
}
