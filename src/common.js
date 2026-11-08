// src/common.js

export function setStatus(text, state) {
  const el = document.getElementById('status');
  if (el) {
    el.textContent = text;
    el.dataset.state = state;
  }
}

// Fungsi bawaan Modul 4 untuk mengecek masalah kamera
export function checkCameraSupport() {
  if (!window.isSecureContext) {
    return 'Halaman bukan secure context. Gunakan localhost atau HTTPS.';
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return 'Browser ini tidak menyediakan akses kamera.';
  }
  return null;
}

export function setupStartButton(startFn) {
  const btn = document.getElementById('startBtn');
  
  // Tambahkan console.log untuk memastikan file ini benar-benar terbaca
  console.log("File common.js berhasil dimuat!"); 

  btn.addEventListener('click', async () => {
    console.log("Tombol mulai diklik!"); // Tanda jika tombol merespons
    
    const problem = checkCameraSupport();
    if (problem) { 
      setStatus('Error: ' + problem, 'error'); 
      alert(problem); // Munculkan pop-up error di layar
      btn.disabled = true; 
      return; 
    }
    
    document.getElementById('consent').style.display = 'none';
    setStatus('Memuat... izinkan kamera jika diminta', 'idle');
    
    try {
      await startFn();
    } catch (err) {
      console.error('Gagal memulai:', err);
      document.getElementById('consent').style.display = 'flex';
      setStatus('Error: gagal memuat. Periksa izin kamera.', 'error');
    }
  });
}