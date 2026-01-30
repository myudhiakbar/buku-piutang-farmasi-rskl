document.getElementById("year").textContent = new Date().getFullYear();

function updateNowDateTime() {
    const el = document.getElementById('nowDateTime');
    if (!el) return;
    const now = new Date();
    const bulan = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const tgl = now.getDate();
    const bln = bulan[now.getMonth()];
    const thn = now.getFullYear();
    const jam = String(now.getHours()).padStart(2, '0');
    const menit = String(now.getMinutes()).padStart(2, '0');
    const detik = String(now.getSeconds()).padStart(2, '0');
    el.textContent = `${tgl} ${bln} ${thn}, ${jam}:${menit}:${detik} WIB`;
}
setInterval(updateNowDateTime, 1000);
updateNowDateTime();

// Navbar responsive toggle
document.getElementById('nav-toggle').onclick = function() {
    var menu = document.getElementById('nav-menu');
    menu.classList.toggle('hidden');
};