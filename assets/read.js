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
            div.className = "pl-10 py-3 bg-white rounded border";
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
                    <b>${trx.namaPasien}</b><br>
                    ${trx.petugas} - ${trx.unit}<br>
                    <div class="mt-2">
                        <span class="font-medium text-gray-700">Alkes Dipinjam:</span>
                        ${alkesHTML}
                    </div>
                    <div class="mt-2">
                        <button onclick="editData('${trx.id}')" class="text-blue-600">Edit</button>
                        <button onclick="deleteData('${trx.id}')" class="text-red-600 ml-2">Hapus</button>
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