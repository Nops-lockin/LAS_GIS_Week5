Dataset: K-01\_truk-tronton



* Spesifikasi \& Parameter Data:


&#x20;  	Koridor / Trayek: Jakarta – Cilegon ;



&#x20;   	Bahan Bakar: Biosolar (Rp 6.800 / Liter) ;



&#x20;   	Target Efisiensi Acuan: 3.0 km/L ;



&#x20;   	Total Jarak: 126,8 km ;



&#x20;   	Konsumsi Riil: \~2,86 km/L (Total: 44,4 L) ; 



&#x20;   	Evaluasi Idling: 42 menit berhenti dengan kerugian BBM sebesar 1,8 L (pemborosan total \~2,1 L / Rp 14.275).



* Languange \& Library:



&#x09;HTML5 \& CSS3: Desain antarmuka dark telemetry dashboard responsif ; 

&#x20;

&#x09;Leaflet.js (v1.9.4): Peta interaktif berbasis OpenStreetMap ;

&#x20; 

&#x09;PapaParse (v5.4.1): Parser CSV klien untuk membaca data log koordinat GPS ;

&#x20; 

&#x09;Vanilla JavaScript (ES6+)/JavaScript: Manipulasi DOM, integrasi GeoJSON, dan kalkulasi metrik perjalanan.



* Features:



&#x09;Peta Interaktif (Leaflet JS): 

&#x09;	Visualisasi rute perjalanan koridor tol dan arteri Jakarta – Cilegon via GeoJSON LineString.  

&#x09;	Penandaan titik awal keberangkatan dan titik tujuan akhir (waypoints).  

&#x09;	Tampilan breadcrumb titik telematika GPS dengan kode warna:  

&#x09;		🔴 Merah: Titik berhenti / Idle ($0\\text{ km/jam}$).  

&#x09;		🟢 Hijau: Titik berjalan ($>0\\text{ km/jam}$).  

&#x09;

&#x09;Panel Telematika \& KPI Dashboard:Ringkasan statistik agregat: 

&#x09;	total jarak tempuh (km), volume BBM (liter), dan total estimasi biaya BBM.  

&#x09;	Kartu evaluasi pemborosan BBM (Fuel Waste Card) akibat idling \& kemacetan.

&#x20; 

&#x09;Filter Titik GPS Interaktif:Opsi filter: 

&#x09;	Semua Titik, Titik Idle (0 km/jam), Titik Bergerak (>0 km/jam), atau Sembunyikan Titik.  



&#x09;Struk Digital BBM (Trip Receipt):

&#x09;	Klik kartu trip untuk memunculkan struk digital interaktif berisi rincian tarif BBM, durasi idle, volume BBM inefisien, kerugian finansial, serta estimasi penghematan biaya 		jika armada berjalan efisien.  



&#x09;Responsive \& Collapsible Sidebar:

&#x09;	Sidebar panel kontrol modern bertema dark mode yang dapat dibuka/tutup (toggle) dengan penyesuaian otomatis kanvas peta Leaflet (map.invalidateSize()).



* Directory Files:



&#x09;Folder-Proyek/

&#x09;├── HTML.html  (atau index.html)

&#x09;├── Main.js

&#x09;├── CSS.css

&#x09;└── K-01\_truk-tronton/

&#x20;   		└── data/

&#x20;       		├── gps\_mentah.csv

&#x20;       		├── ringkasan.json

&#x20;       		├── rute.geojson

&#x20;       		└── titik\_ujung.geojson



* How to Use:

&#x09;

&#x09;Taruh folder sesuai dengan petunjuk directory files. Setelah itu buka file HTML lalu jalankan menggunakan extension Open Live Server di VS Code.

