Siap 👍
Aku bikinkan **README integrasi Leaflet + OpenStreetMap + CRUD Store** yang **langsung relevan dengan ERD stores kamu** dan **siap dipakai di project Laravel / Vue / web biasa**.

---

# 📍 Store Management

**Leaflet.js + OpenStreetMap (OSM) + CRUD Stores**

Sistem ini digunakan untuk:

* Menyimpan data toko (stores)
* Menentukan lokasi toko lewat peta
* Search lokasi
* Mengambil lokasi GPS user (sales)
* Digunakan dalam flow distribusi barang sales → toko

---

## 1️⃣ ERD – `stores`

```text
stores
- id (PK)
- name
- owner_name (optional)
- phone (optional)
- address
- latitude
- longitude
- created_by_sales_id (FK users.id)
- image (optional)
- created_at
- updated_at
```

📌 **Catatan**

* `latitude` & `longitude` diambil dari map
* `created_by_sales_id` untuk audit siapa sales yang input toko

---

## 2️⃣ Teknologi yang Digunakan

| Komponen           | Teknologi           |
| ------------------ | ------------------- |
| Map                | Leaflet.js          |
| Map Tile           | OpenStreetMap       |
| Geocoding (Search) | Nominatim (OSM)     |
| Geolocation        | Browser API         |
| Backend            | Laravel (API)       |
| Frontend           | Blade / Vue / React |

💡 **Semua GRATIS, tanpa billing**

---

## 3️⃣ Instalasi Leaflet + OSM (Frontend)

### Tambahkan di HTML

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

### Container Map

```html
<div id="map" style="height: 400px;"></div>
```

---

## 4️⃣ Inisialisasi Map

```js
const map = L.map('map').setView([-6.200000, 106.816666], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker;
```

---

## 5️⃣ Ambil Lokasi User (GPS Sales)

```js
function locateUser() {
  map.locate({ setView: true, maxZoom: 17 });
}

map.on('locationfound', function (e) {
  if (marker) map.removeLayer(marker);

  marker = L.marker(e.latlng).addTo(map);
  document.getElementById('latitude').value = e.latlng.lat;
  document.getElementById('longitude').value = e.latlng.lng;
});
```

📌 **Digunakan saat sales berada di toko**

---

## 6️⃣ Pilih Titik Manual di Map

```js
map.on('click', function (e) {
  if (marker) map.removeLayer(marker);

  marker = L.marker(e.latlng).addTo(map);
  document.getElementById('latitude').value = e.latlng.lat;
  document.getElementById('longitude').value = e.latlng.lng;
});
```

---

## 7️⃣ Search Lokasi (Nominatim – Gratis)

```js
async function searchLocation(query) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
  );
  const data = await res.json();

  if (!data.length) return alert('Lokasi tidak ditemukan');

  const lat = data[0].lat;
  const lon = data[0].lon;

  map.setView([lat, lon], 16);
  if (marker) map.removeLayer(marker);
  marker = L.marker([lat, lon]).addTo(map);

  document.getElementById('latitude').value = lat;
  document.getElementById('longitude').value = lon;
  document.getElementById('address').value = data[0].display_name;
}
```

📌 **Gunakan untuk search alamat toko**

---

## 8️⃣ Form Create Store

```html
<input name="name" placeholder="Nama Toko" />
<input name="owner_name" placeholder="Pemilik" />
<input name="phone" placeholder="No HP" />
<textarea name="address" id="address"></textarea>

<input type="hidden" id="latitude" name="latitude" />
<input type="hidden" id="longitude" name="longitude" />

<button onclick="locateUser()">📍 Ambil Lokasi Sekarang</button>
```

---


## 🔐 Validasi Penting (WAJIB)

✔ latitude & longitude **tidak boleh null**
✔ sales hanya bisa create store
✔ store tidak boleh duplikat (nama + jarak dekat)
✔ simpan GPS **saat input pertama**

---


---

## ✅ Kesimpulan

✔ Gratis (Leaflet + OSM)
✔ Akurat (GPS + map click)
✔ Aman (tidak melanggar TOS Google)
✔ Cocok untuk sistem **sales lapangan**

---

