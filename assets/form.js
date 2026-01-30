const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwnsxv605i4E3R7OOF7EdZCcX97o_MyIyB_us5cgEmm_FhUVM6txENGUxMa1UkDd-Qq/exec";

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    transactionDate.value = today;
    updateInfoDate(today);
    selectUnit(document.querySelector('.unit-option[data-unit=""]'));
    addAlkesField();
    loadHistory();
});

/* ================= TANGGAL ================= */
resetDate.onclick = () => {
    const today = new Date().toISOString().split('T')[0];
    transactionDate.value = today;
    updateInfoDate(today);
};

transactionDate.onchange = e => updateInfoDate(e.target.value);

function updateInfoDate(dateString){
    const date = new Date(dateString);
    infoDate.textContent = date.toLocaleDateString('id-ID',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
}

/* ================= UNIT ALKES ================= */
// Pilihan unit
const unitOptions = document.querySelectorAll('.unit-option');
unitOptions.forEach(option => {
    option.addEventListener('click', function() {
        selectUnit(this);
    });
});

function selectUnit(element) {
    // Hapus kelas selected dari semua opsi
    unitOptions.forEach(opt => {
        opt.classList.remove('selected-unit');
        opt.classList.remove('border-blue-500');
        opt.classList.add('border-gray-200');
    });
    
    // Tambah kelas selected ke opsi yang dipilih
    element.classList.remove('border-gray-200');
    element.classList.add('selected-unit', 'border-blue-500');
    
    // Set nilai input tersembunyi
    const selectedUnit = element.getAttribute('data-unit');
    document.getElementById('selectedUnit').value = selectedUnit;
    document.getElementById('infoUnit').textContent = selectedUnit;
}

// Paket alkes
document.getElementById('packageSelect').addEventListener('change', function() {
    if (this.value) {
        const packageMap = {
            'infus-dewasa': 'infus dewasa',
            'infus-anak': 'infus anak',
            'injeksi-lambung': 'injeksi lambung',
            'jahit-luka': 'jahit luka'
        };
        addPackageItems(packageMap[this.value]);
    }
});

function addPackageItems(packageType) {
    // Hapus semua item alkes yang ada
    const container = document.getElementById('alkesContainer');
    container.innerHTML = '';
    
    let items = [];
    
    // Tentukan item berdasarkan paket
    if (packageType === 'infus dewasa') {
        items = [
            { name: 'Abbocath 22', qty: 1 },
            { name: 'Abbocath 20', qty: 1 },
            { name: 'Macro Set', qty: 1 },
            { name: 'NaCl 500 ml', qty: 1 }
        ];
    
    } else if (packageType === 'infus anak') {
        items = [
            { name: 'Abbocath 24', qty: 1 },
            { name: 'Abbocath 26', qty: 1 },
            { name: 'Macro Set', qty: 1 },
            { name: 'Spalk Anak', qty: 1 },
            { name: 'Kaen 3B 500 ml', qty: 1 }
        ];
    } else if (packageType === 'injeksi lambung') {
        items = [
            { name: 'Abbocath 22', qty: 1 },
            { name: 'Macro Set', qty: 1 },
            { name: 'Omeprazole 40 mg IV', qty: 1 },
            { name: 'Ondansentron 4 mg IV', qty: 1 },
            { name: 'Spuit 5 ml', qty: 1 },
            { name: 'Spuit 3 ml', qty: 1 }
        ];
    } else if (packageType === 'jahit luka') {
        items = [
            { name: 'Lidocain IV', qty: 2 },
            { name: 'Spuit 3 ml', qty: 1 },
            { name: 'Polypropilen 3/0 TS 27', qty: 1 },
            { name: 'Underpad', qty: 1 },
            { name: 'Daryantul', qty: 1 },
            { name: 'NaCl 500 ml', qty: 1 }
        ];
    }
    
    // Tambahkan item ke form
    items.forEach(item => {
        addAlkesField(item.name, item.qty);
    });
    
    // Update info alkes
    updateAlkesInfo();
}

// Tambah field alkes dinamis
document.getElementById('addAlkes').addEventListener('click', function() {
    addAlkesField();
});

function addAlkesField(name = '', qty = 1) {
    const container = document.getElementById('alkesContainer');
    const fieldCount = container.children.length;
    const fieldId = Date.now() + fieldCount;
    
    const fieldHTML = `
        <div class="dynamic-field mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm" id="alkes-${fieldId}">
            <div class="flex flex-col md:flex-row gap-4">
                <div class="md:w-2/3">
                    <label class="block text-gray-600 text-sm mb-1">Nama Alkes</label>
                    <input type="text" name="alkesName[]" class="alkes-name-input w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: Abbocath 22" value="${name}" required>
                </div>
                <div class="md:w-1/4">
                    <label class="block text-gray-600 text-sm mb-1">Jumlah</label>
                    <div class="flex items-center">
                        <button type="button" class="decrease-qty p-3 bg-gray-200 text-gray-700 rounded-l-lg hover:bg-gray-300">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" name="alkesQty[]" class="alkes-qty-input w-full p-3 border-t border-b border-gray-300 text-center" min="1" value="${qty}" required>
                        <button type="button" class="increase-qty p-3 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="md:w-1/12 flex items-end">
                    <button type="button" class="remove-alkes p-3 btn-danger text-white rounded-lg hover:opacity-90">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('afterbegin', fieldHTML);
    
    // Tambahkan event listener untuk tombol hapus
    const newField = document.getElementById(`alkes-${fieldId}`);
    const removeBtn = newField.querySelector('.remove-alkes');
    
    removeBtn.addEventListener('click', function() {
        newField.remove();
        updateRemoveButtons();
        updateAlkesInfo();
    });
    
    // Tambahkan event listener untuk tombol jumlah
    const decreaseBtn = newField.querySelector('.decrease-qty');
    const increaseBtn = newField.querySelector('.increase-qty');
    const qtyInput = newField.querySelector('.alkes-qty-input');
    
    decreaseBtn.addEventListener('click', function() {
        if (qtyInput.value > 1) {
            qtyInput.value = parseInt(qtyInput.value) - 1;
            updateAlkesInfo();
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        qtyInput.value = parseInt(qtyInput.value) + 1;
        updateAlkesInfo();
    });
    
    // Update ketika input berubah
    const nameInput = newField.querySelector('.alkes-name-input');
    nameInput.addEventListener('input', updateAlkesInfo);
    qtyInput.addEventListener('input', updateAlkesInfo);
    
    // Update status tombol hapus
    updateRemoveButtons();
    updateAlkesInfo();
}

function updateRemoveButtons() {
    const fields = document.querySelectorAll('.dynamic-field');
    const removeButtons = document.querySelectorAll('.remove-alkes');
    
    // Jika hanya ada satu field, nonaktifkan tombol hapus
    if (fields.length === 1) {
        removeButtons[0].setAttribute('disabled', 'disabled');
        removeButtons[0].classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        removeButtons.forEach(btn => {
            btn.removeAttribute('disabled');
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        });
    }
}

/* ================= INFO PANEL ================= */
function updateAlkesInfo() {
    const alkesList = document.getElementById('infoAlkes');
    const nameInputs = document.querySelectorAll('.alkes-name-input');
    const qtyInputs = document.querySelectorAll('.alkes-qty-input');
    
    if (nameInputs.length === 0) {
        alkesList.innerHTML = '<li class="text-gray-500 italic">Belum ada data</li>';
        return;
    }
    
    alkesList.innerHTML = '';
    
    nameInputs.forEach((input, index) => {
        const name = input.value.trim();
        const qty = qtyInputs[index].value;
        
        if (name) {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center bg-white p-2 rounded border border-gray-100';
            li.innerHTML = `
                <span class="font-medium">${name}</span>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">${qty}</span>
            `;
            alkesList.appendChild(li);
        }
    });
    
    if (alkesList.children.length === 0) {
        alkesList.innerHTML = '<li class="text-gray-500 italic">Belum ada data</li>';
    }
}

patientName.oninput = e => infoPatient.textContent = e.target.value || '-';
staffName.oninput   = e => infoStaff.textContent   = e.target.value || '-';

/* ================= RESET ================= */
function performFormReset() {
    document.getElementById('loanForm').reset();
    
    // Reset tanggal ke hari ini
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('transactionDate').value = today;
    updateInfoDate(today);
    
    // Reset unit ke Rawat Jalan
    selectUnit(document.querySelector('.unit-option[data-unit=""]'));
    
    // Reset alkes container
    document.getElementById('alkesContainer').innerHTML = '';
    addAlkesField(); // Tambah satu field kosong
    
    // Reset paket dropdown
    document.getElementById('packageSelect').value = '';
    
    // Reset info panel
    document.getElementById('infoPatient').textContent = '-';
    document.getElementById('infoStaff').textContent = '-';
    updateAlkesInfo();
}

resetForm.onclick = () => {
    Swal.fire({
        title: 'Reset Form?',
        text: 'Apakah Anda yakin ingin mereset form? Semua data akan hilang.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Reset!',
        cancelButtonText: 'Batal',
        reverseButtons: true,
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            performFormReset();
            Swal.fire({
                title: 'Berhasil!',
                text: 'Form telah direset.',
                icon: 'success',
                confirmButtonColor: '#3b82f6'
            });
        }
    });
};

/* ================= SUBMIT / CREATE ================= */
loanForm.onsubmit = e => {
    e.preventDefault();

    const alkes = [];
    document.querySelectorAll('.alkes-name-input').forEach((el,i)=>{
        const name = el.value.trim();
        const qty  = document.querySelectorAll('.alkes-qty-input')[i].value;
        if(name) alkes.push({name,qty});
    });

    if(!patientName.value || !selectedUnit.value || !staffName.value || !alkes.length){
        Swal.fire("Data belum lengkap","","warning");
        return;
    }

    Swal.fire({
        title: 'Simpan Transaksi?',
        text: 'Data akan disimpan ke Server',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Simpan',
        cancelButtonText: 'Batal',
        reverseButtons: true,
        confirmButtonColor: '#3b82f6',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowOutsideClick: () => !Swal.isLoading(),

        preConfirm: () => {
            return fetch(WEB_APP_URL,{
                method:"POST",
                body: JSON.stringify({
                    action:"create",
                    tanggal: transactionDate.value,
                    namaPasien: patientName.value,
                    unit: selectedUnit.value,
                    petugas: staffName.value,
                    alkes
                })
            })
            .then(response => {
                if (!response.ok) throw new Error('Gagal menyimpan');
                return response.json();
            })
            .catch(error => {
                Swal.showValidationMessage(`Error: ${error}`);
            });
        }
    }).then((result) => {
        if (!result.isConfirmed) return;

        const res = result.value;

        if (res.status === "success") {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Data berhasil disimpan',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true
            });
            performFormReset();
            loadHistory();
        } else {
            Swal.fire("Error", res.message || "Gagal menyimpan data", "error");
        }
    });
};

/* ================= LOAD / READ ================= */
function formatTanggalIndonesia(tanggalString) {
    const date = new Date(tanggalString);
    if (isNaN(date)) return tanggalString; // fallback jika format tidak dikenali

    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

function loadHistory() {
    fetch(WEB_APP_URL, {
        method: "POST",
        body: JSON.stringify({ action: "read" })
    })
    .then(res => res.json())
    .then(res => {
        if (res.status !== "success") return;

        const historyList = document.getElementById("historyList");
        historyList.innerHTML = "";

        res.data.forEach(trx => {
            const div = document.createElement("div");
            div.className = "pl-10 p-3 bg-white rounded border";
            const tanggalFormatted = formatTanggalIndonesia(trx.tanggal);
            let alkesHTML = '<ul class="list-disc ml-5 text-sm mt-2">';
                if (trx.alkes && trx.alkes.length) {
                    trx.alkes.forEach(item => {
                        alkesHTML += `<li>${item.name} <span class="font-semibold align-middle"> =   ${item.qty} pcs</span></li>`;
                    });
                } else {
                    alkesHTML += '<li class="italic text-gray-500">Tidak ada data alkes</li>';
                }
                alkesHTML += '</ul>';

                div.innerHTML = `
                    ${tanggalFormatted}<br>
                    <b>Nama Pasien: ${trx.namaPasien}</b><br>
                    Petugas: ${trx.petugas} - ${trx.unit}<br>
                    <div class="mt-2">
                        <span class="font-medium text-gray-700">Alkes Dipinjam:</span>
                        ${alkesHTML}
                    </div>
                    <div class="mt-2">
                        <button onclick="editData('${trx.id}')" class="text-blue-600 d-none">Edit</button>
                        <button onclick="deleteData('${trx.id}')" class="text-red-600 ml-2 d-none">Hapus</button>
                    </div>
                `;

                historyList.appendChild(div);
            });
    });
}

document.addEventListener("DOMContentLoaded", loadHistory);

/* ================= DELETE ================= */
function deleteData(id){
    Swal.fire({
        title: "Hapus data?",
        text: "Data yang dihapus tidak dapat dikembalikan",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
        reverseButtons: true,
        confirmButtonColor: "#ef4444",
        allowEscapeKey: false,
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),

        preConfirm: () => {
            return fetch(WEB_APP_URL,{
                method:"POST",
                body: JSON.stringify({action:"delete", id})
            })
            .then(res => {
                if (!res.ok) throw new Error("Gagal menghapus");
                return res.json();
            })
            .catch(err => {
                Swal.showValidationMessage(`Error: ${err.message}`);
            });
        }
    }).then(result => {
        if (!result.isConfirmed) return;

        const res = result.value;

        if (res.status === "success") {
            Swal.fire({
                icon: "success",
                title: "Terhapus",
                text: "Data berhasil dihapus",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true
            });
            loadHistory();
        } else {
            Swal.fire("Error", res.message || "Gagal menghapus data", "error");
        }
    });
}