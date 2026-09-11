// 1. Inisialisasi Peta Leaflet
const map = L.map('map').setView([-6.08, 106.45], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let routeLayer = null;
const pointLayerGroup = L.layerGroup().addTo(map);
let allGpsRows = [];

// 2. Memuat ringkasan.json (Statistik Agregat)
fetch('./K-01_truk-tronton/data/ringkasan.json')
  .then((res) => {
    if (!res.ok) throw new Error('File ringkasan.json tidak ditemukan');
    return res.json();
  })
  .then((data) => {
    document.getElementById('stat-km').innerText = data.total_km;
    document.getElementById('stat-liter').innerText = data.total_liter;
    document.getElementById('stat-cost').innerText = 'Rp ' + Number(data.total_biaya).toLocaleString('id-ID');
    document.getElementById('waste-cost').innerText = 'Rp ' + Number(data.biaya_boros).toLocaleString('id-ID');
    document.getElementById('waste-desc').innerText = 
      `Pemborosan bahan bakar akibat mesin menyala saat berhenti (idle) sebanyak ${data.liter_idle} Liter (${data.catatan}).`;
  })
  .catch((err) => {
    console.warn('Gagal memuat ringkasan.json:', err.message);
  });

// 3. Memuat rute.geojson (LineString Rute & Kartu Trip)
fetch('./K-01_truk-tronton/data/rute.geojson')
  .then((res) => {
    if (!res.ok) throw new Error('File rute.geojson tidak ditemukan');
    return res.json();
  })
  .then((geojsonData) => {
    routeLayer = L.geoJSON(geojsonData, {
      style: {
        color: '#3F00FF',
        weight: 5,
        opacity: 0.9
      }
    }).addTo(map);

    map.fitBounds(routeLayer.getBounds(), { padding: [40, 40] });

    const tripContainer = document.getElementById('trip-container');
    tripContainer.innerHTML = '';

    geojsonData.features.forEach((feat) => {
      const p = feat.properties;
      const card = document.createElement('div');
      card.className = 'trip-card active alert';
      card.innerHTML = `
        <div class="trip-info">
          <h4>${p.nama} — ${p.hari} ${p.tanggal}</h4>
          <span>Berangkat ${p.jam_mulai} · ${p.jarak_km} km · ${p.km_per_liter} km/liter</span>
        </div>
        <div class="trip-price">
          <span class="total-rp">Rp ${Number(p.biaya_rp).toLocaleString('id-ID')}</span>
          <span class="boros-rp">boros Rp ${Number(p.biaya_boros_rp).toLocaleString('id-ID')}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        const center = routeLayer.getBounds().getCenter();
        
        // Estimasi biaya tanpa pemborosan (seandainya efisien)
        const biayaHemat = Number(p.biaya_boros_rp || 0);
        const biayaIdeal = Number(p.biaya_rp) - biayaHemat;

        L.popup({ maxWidth: 320 })
          .setLatLng(center)
          .setContent(`
            <div class="receipt-popup">
              <!-- Header Struk -->
              <div class="receipt-header">
                <div class="receipt-title-box">
                  <b>STRUK BBM: ${p.nama}</b>
                  <span class="badge-code">${p.kode_kendaraan}</span>
                </div>
                <small>${p.hari}, ${p.tanggal} (${p.jam_mulai} – ${p.jam_selesai})</small><br/>
                <small>Trayek: <b>${p.trayek}</b></small>
              </div>

              <!-- Metrik Perjalanan -->
              <div class="receipt-metrics">
                <div><span>Jarak:</span> <b>${p.jarak_km} km</b></div>
                <div><span>Durasi:</span> <b>${p.durasi_menit} mnt</b></div>
                <div><span>Kec. Rata:</span> <b>${p.kecepatan_rata} km/j</b></div>
              </div>

              <div class="receipt-divider"></div>

              <!-- Rincian Bahan Bakar (Berdasarkan Ringkasan & Rute) -->
              <div class="receipt-detail">
                <div class="receipt-row">
                  <span>Jenis BBM</span>
                  <b>${p.jenis_bbm}</b>
                </div>
                <div class="receipt-row">
                  <span>Harga per Liter</span>
                  <b>Rp ${Number(p.harga_per_liter).toLocaleString('id-ID')}</b>
                </div>
                <div class="receipt-row">
                  <span>Konsumsi Riil</span>
                  <b>${p.km_per_liter} km/L</b>
                </div>
                <div class="receipt-row highlight-row">
                  <span>Total BBM Terpakai</span>
                  <b>${p.liter_total} Liter</b>
                </div>
                <div class="receipt-row highlight-row-cost">
                  <span>Total Biaya</span>
                  <b>Rp ${Number(p.biaya_rp).toLocaleString('id-ID')}</b>
                </div>
              </div>

              <!-- Evaluasi Idle & Boros -->
              <div class="receipt-alert">
                <div style="font-weight: 700; margin-bottom: 2px;">⚠️ Evaluasi Idle & Macet:</div>
                • Durasi Berhenti: <b>${p.menit_idle} menit</b><br/>
                • Jumlah BBM yang digunakan saat berhenti: <b>${p.liter_idle} L</b><br/>
                • Total penggunaan BBM inefisien: <b>${p.liter_boros} L</b><br/>
                • Kerugian Finansial: <b>Rp ${Number(p.biaya_boros_rp).toLocaleString('id-ID')}</b>
              </div>

              <!-- Potensi Penghematan -->
              <div class="receipt-saving">
                <span>💡 Estimasi Jika Efisien:</span>
                <b>Rp ${biayaIdeal.toLocaleString('id-ID')} (Hemat Rp ${biayaHemat.toLocaleString('id-ID')})</b>
              </div>
            </div>
          `)
          .openOn(map);
      });

      tripContainer.appendChild(card);
    });
  })
  .catch((err) => {
    console.warn('Gagal memuat rute.geojson:', err.message);
  });

// 4. Memuat titik_ujung.geojson (Marker Asal & Tujuan)
fetch('./K-01_truk-tronton/data/titik_ujung.geojson')
  .then((res) => {
    if (!res.ok) throw new Error('File titik_ujung.geojson tidak ditemukan');
    return res.json();
  })
  .then((endpoints) => {
    L.geoJSON(endpoints, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: 7,
          fillColor: '#ffffff',
          color: '#0f172a',
          weight: 3,
          opacity: 1,
          fillOpacity: 1
        });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`<b>${feature.properties.jenis}</b><br/>Waktu: ${feature.properties.waktu}`);
      }
    }).addTo(map);
  })
  .catch((err) => {
    console.warn('Gagal memuat titik_ujung.geojson:', err.message);
  });

// 5. Memuat gps_mentah.csv via PapaParse & Fungsi Render Titik
Papa.parse('./K-01_truk-tronton/data/gps_mentah.csv', {
  download: true,
  header: true,
  dynamicTyping: true,
  complete: (results) => {
    allGpsRows = results.data.filter((row) => row.latitude && row.longitude);
    renderGpsPoints('all');
  },
  error: (err) => {
    console.warn('Gagal membaca gps_mentah.csv:', err);
  }
});

function renderGpsPoints(mode) {
  pointLayerGroup.clearLayers();
  if (mode === 'none') return;

  allGpsRows.forEach((pt) => {
    const isIdle = pt.kecepatan_kmh === 0;
    if (mode === 'idle' && !isIdle) return;
    if (mode === 'moving' && isIdle) return;

    const marker = L.circleMarker([pt.latitude, pt.longitude], {
      radius: isIdle ? 5 : 3,
      fillColor: isIdle ? '#ef4444' : '#10b981',
      color: isIdle ? '#991b1b' : '#047857',
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.8
    });

    marker.bindPopup(`
      <div style="font-size: 11px;">
        <b>Waktu:</b> ${pt.waktu}<br/>
        <b>Kecepatan:</b> ${pt.kecepatan_kmh} km/jam<br/>
        <b>Status:</b> ${isIdle ? '<span style="color:red; font-weight:bold;">Idle / Macet</span>' : 'Lancar'}
      </div>
    `);

    pointLayerGroup.addLayer(marker);
  });
}

// Handler Dropdown Filter
document.getElementById('filter-select').addEventListener('change', (e) => {
  renderGpsPoints(e.target.value);
});

// Toggle Sidebar Show / Hide
const toggleBtn = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('sidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
  toggleBtn.classList.toggle('collapsed');

  // Ganti ikon tombol antara strip tiga (hamburger) dan panah/silang
  if (sidebar.classList.contains('hidden')) {
    toggleBtn.innerHTML = '☰';
    toggleBtn.title = 'Buka Sidebar';
  } else {
    toggleBtn.innerHTML = '✕';
    toggleBtn.title = 'Tutup Sidebar';
  }

  // Paksa Leaflet mengkalkulasi ulang ukuran layar setelah animasi selesai (300ms)
  setTimeout(() => {
    map.invalidateSize();
  }, 300);
});
