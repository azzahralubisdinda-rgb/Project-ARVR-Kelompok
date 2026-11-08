# Alur Status Interaksi (State Machine)

1. **Idle / Memuat**: Kamera belum aktif. Menunggu user menekan tombol Mulai.
2. **Searching**: Kamera aktif mencari target. Objek 3D dan UI panel tersembunyi.
3. **Found**: Target gambar terdeteksi. Panel JSON muncul, tombol HUD muncul, dan model 3D memutar animasi. Terjadi umpan balik getar (vibrate).
4. **Lost**: Target keluar dari jangkauan kamera. UI kembali tersembunyi, kembali ke state *Searching*.