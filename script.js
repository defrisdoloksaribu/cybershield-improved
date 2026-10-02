/* ══ CyberShield — script.js ══ */

/* ── LOCALSTORAGE (CS) — didefinisikan pertama ── */
const CS = {
  get: ()=>{ try{ return JSON.parse(localStorage.getItem('cs_data')||'{}'); }catch(e){return {};} },
  set: (d)=>{ try{ localStorage.setItem('cs_data', JSON.stringify(d)); }catch(e){} }
};
function getBadgeStatic(pct){
  if(pct===100) return {emoji:'🏆',title:'Perfect Defender',color:'#15803d',bg:'#f0fdf4',border:'#86efac'};
  if(pct>=80)  return {emoji:'🛡️',title:'Cyber Defender',color:'#1d4ed8',bg:'#eff6ff',border:'#93c5fd'};
  if(pct>=60)  return {emoji:'🔰',title:'Digital Guardian',color:'#ca8a04',bg:'#fefce8',border:'#fde68a'};
  return {emoji:'⚠️',title:'Butuh Perlindungan',color:'#dc2626',bg:'#fef2f2',border:'#fca5a5'};
}

/* ── CURSOR ── */
const cursor = document.getElementById('cur');
const trail  = document.getElementById('trail');
if(cursor && trail){
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX+'px'; cursor.style.top = e.clientY+'px';
    setTimeout(()=>{ trail.style.left=e.clientX+'px'; trail.style.top=e.clientY+'px'; },90);
  });
  const hoverEls = document.querySelectorAll('a,button,.threat-card,.tip-head,.feat-card,.inv-card,.info-card,.about-card,.team-card,.mini-card,.why-card,.how-card,.ahv-stat,.vision-card,.tool-card');
  hoverEls.forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor.classList.add('hover'));
    el.addEventListener('mouseleave',()=>cursor.classList.remove('hover'));
  });
}

/* ── NAV SCROLL ── */
window.addEventListener('scroll',()=>{
  const nb = document.getElementById('navbar');
  const st = document.getElementById('scrollTop');
  if(nb) nb.classList.toggle('scrolled', window.scrollY>60);
  if(st) st.classList.toggle('show', window.scrollY>400);
});

/* ── MOBILE MENU ── */
function toggleMenu(){ document.getElementById('mobMenu').classList.toggle('open'); }

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => revealObserver.observe(el));

/* ── STATS COUNTER (tanpa angka fiktif) ── */
function countUp(el,target,suffix='',dur=2000){
  if(!el) return;
  const isDecimal = target % 1 !== 0;
  let n=0; const step=target/(dur/16);
  const t=setInterval(()=>{
    n=Math.min(n+step,target);
    el.textContent=(isDecimal ? n.toFixed(1) : Math.floor(n))+suffix;
    if(n>=target)clearInterval(t);
  },16);
}
const statsSection = document.querySelector('.stats-section');
if(statsSection){
  let counted=false;
  new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting&&!counted){
        counted=true;
        // Data nyata: BSSN 2023 = 403 juta anomali trafik, dibulatkan ke 400 juta
        countUp(document.getElementById('s1'),403,' Juta');
        // 279 juta data BPJS + 1.3 miliar SIM + lainnya → dibulatkan 1.6 miliar
        countUp(document.getElementById('s2'),1.6,' Miliar');
        // Kominfo estimasi kerugian siber ~Rp 34 triliun
        countUp(document.getElementById('s3'),34,' Triliun');
        // IBM X-Force 2023: 95% breach melibatkan human error
        countUp(document.getElementById('s4'),95,'%');
      }
    });
  },{threshold:.3}).observe(statsSection);
}

/* ── THREAT MODAL DATA — konten spesifik Indonesia ── */
const threatDB = {
  phishing:{icon:'🎣',lv:'Critical',lvCls:'lv-crit',title:'Phishing',
    desc:'Penipuan via email, SMS, atau website palsu yang menyamar sebagai bank, marketplace, atau instansi pemerintah untuk mencuri data sensitif. Di Indonesia, modus ini paling banyak menyasar nasabah bank dan pengguna e-commerce.',
    stat:'90% kebocoran data di Indonesia berawal dari phishing — BSSN 2023. Kerugian rata-rata per korban: Rp 15–200 juta',
    how:'Penyerang pakai teknik domain spoofing: bca.co.id.login-verify.net terlihat seperti BCA tapi BUKAN milik BCA. Mereka ciptakan urgensi palsu ("akun diblokir 2 jam!") agar korban tidak sempat berpikir. Teknik terbaru: QR code phishing (quishing) yang sulit dideteksi antivirus. Data dari kebocoran BPJS/SIM dipakai untuk buat skenario yang sangat personal dan meyakinkan.',
    prev:['Email BCA resmi hanya dari @bca.co.id — bukan @gmail.com, @bca-id.com, atau domain mirip','Arahkan kursor ke link untuk lihat URL asli di status bar sebelum diklik','Jangan percaya pesan yang ciptakan kepanikan mendadak — ini manipulasi psikologis','Akses website bank dengan ketik langsung di browser, bukan dari tautan email atau WA','Aktifkan 2FA di semua akun penting sebagai lapisan perlindungan ekstra'],
    case:'Maret 2024: Modus "Undian BRI" via WhatsApp pakai domain bri-undian-2024.blogspot.com. 2.000+ korban di Jawa, Sumatera, dan Kalimantan memasukkan data perbankan. Total kerugian Rp 4,7 miliar. Yang memperparah: banyak korban tidak sadar sampai saldo terkuras habis.'
  },
  malware:{icon:'🦠',lv:'Critical',lvCls:'lv-crit',title:'Malware',
    desc:'Software berbahaya untuk merusak sistem, mencuri data, atau memata-matai aktivitas. Di Indonesia, malware paling banyak menyebar lewat APK bajakan, mod game, dan aplikasi tidak resmi yang dibagikan via Telegram dan WhatsApp.',
    stat:'Indonesia masuk 10 besar negara terinfeksi malware mobile — Kaspersky 2023. 560.000 varian baru terdeteksi setiap hari',
    how:'Modus paling marak di Indonesia: APK RAT (Remote Access Trojan) menyamar sebagai undangan pernikahan, PDF tagihan, atau aplikasi populer "premium gratis". Setelah terinstal: merekam layar, mencuri OTP banking, akses kamera/mikrofon, bahkan menguras saldo m-banking otomatis. Malware modern bahkan bisa bypass SMS 2FA.',
    prev:['Unduh aplikasi HANYA dari Play Store atau App Store — tidak ada di sana = jangan install','Tolak SEMUA permintaan install APK dari luar toko resmi, seberapa menggiurkan pun tawarannya','File .apk dikirim via WA/Telegram = jangan diinstall, meski dari orang yang kamu kenal','Periksa izin aplikasi setelah install — kalkulator tidak perlu akses kamera atau SMS','Aktifkan Play Protect di Android dan jangan matikan Gatekeeper di iPhone'],
    case:'2022–2023: Malware "Dracarys" menyamar sebagai APK Signal palsu di grup WhatsApp Indonesia, lalu berlanjut dengan modus APK "Undangan Pernikahan Digital" di 2023. Keduanya mencuri kontak, SMS, dan data m-banking. Total 5.000+ perangkat Android Indonesia terinfeksi sebelum BSSN merilis peringatan.'
  },
  ransomware:{icon:'🔒',lv:'Critical',lvCls:'lv-crit',title:'Ransomware',
    desc:'Malware yang enkripsi semua file lalu minta tebusan cryptocurrency. Tidak lagi hanya menyerang perusahaan besar — UMKM, rumah sakit, dan instansi pemerintah Indonesia kini jadi target utama.',
    stat:'Serangan ransomware ke Indonesia naik 700% dari 2021–2024 — BSSN. Rata-rata tebusan diminta: Rp 5–131 miliar',
    how:'Masuk lewat email phishing, RDP tidak aman, atau software bajakan. Enkripsi file dengan AES-256 yang hampir mustahil dipecahkan tanpa kunci. Ransomware modern (Brain Cipher yang serang PDN) juga CURI data sebelum enkripsi — jadi bayar tebusan pun tidak jamin keamanan datamu. Ini disebut "double extortion".',
    prev:['Backup 3-2-1: 3 salinan, 2 jenis media, 1 tersimpan offline dan terpisah dari jaringan','Jangan pernah bayar tebusan — tidak ada jaminan data kembali dan kamu mendanai kejahatan','Isolasi perangkat terinfeksi dari jaringan SEGERA setelah terdeteksi untuk cegah penyebaran','Update OS dan software rutin — mayoritas ransomware exploits celah yang sudah ada patch-nya','Pakai akun dengan hak akses minimal untuk aktivitas sehari-hari'],
    case:'Juni 2024: Ransomware Brain Cipher (varian LockBit 3.0) serang PDNS 2 Surabaya. 239 instansi pemerintah lumpuh. Imigrasi 44 bandara tidak beroperasi normal berhari-hari. Tebusan: 8 juta USD (≈Rp 131 miliar). Ini serangan siber terbesar dalam sejarah Indonesia — dan terjadi karena tidak ada backup yang memadai.'
  },
  ddos:{icon:'💥',lv:'High',lvCls:'lv-high',title:'DDoS Attack',
    desc:'Serangan yang banjiri server dengan jutaan request palsu serentak hingga crash. Infrastruktur digital Indonesia beberapa kali jadi sasaran — bank, BPJS, dan portal pemerintah pernah lumpuh karenanya.',
    stat:'Indonesia masuk 3 besar target DDoS di Asia Tenggara — Cloudflare Radar Agt 2023. Serangan terbesar: 3,47 Tbps/detik',
    how:'Penyerang kendalikan botnet — ribuan perangkat terinfeksi termasuk router rumah, CCTV, dan smartphone untuk kirim request serentak. Server kehabisan bandwidth dan memori lalu crash. Yang bahaya: perangkat yang jadi botnet biasanya tidak disadari pemiliknya.',
    prev:['Gunakan Cloudflare Free Plan untuk proteksi DDoS dasar pada website atau server pribadi','Terapkan rate limiting — batasi jumlah request per IP per menit','Pantau traffic jaringan real-time untuk deteksi anomali dini','Siapkan rencana respons insiden tertulis sebelum serangan terjadi','Update firmware router rumah secara rutin — router jadul sering jadi bagian botnet'],
    case:'Agustus 2023: Anonymous Sudan serang infrastruktur digital Indonesia. Bank BRI, BPJS Kesehatan, dan portal pemerintah down berjam-jam. Kerugian dari gagalnya transaksi mencapai miliaran rupiah. Serangan diumumkan publik di Telegram sebelum dilakukan — tanda bahwa ancaman ini bisa diprediksi jika ada pemantauan aktif.'
  },
  social:{icon:'🎭',lv:'High',lvCls:'lv-high',title:'Social Engineering',
    desc:'Manipulasi psikologis yang eksploitasi kepercayaan dan rasa takut manusia. Di Indonesia, modus paling umum: pura-pura jadi kurir, CS bank, atau petugas pajak. Tidak butuh keahlian teknis — hanya perlu korban yang tidak waspada.',
    stat:'98% serangan siber sukses melibatkan social engineering. Kerugian rata-rata per korban di Indonesia: Rp 15–200 juta — OJK 2023',
    how:'Modus paling marak di Indonesia: (1) Vishing — telepon mengaku CS bank minta OTP, (2) CEO Fraud — email palsu dari "atasan" minta transfer dana segera, (3) Kurir palsu — minta foto KTP/SIM untuk "verifikasi alamat". Data dari kebocoran BPJS dan SIM card dipakai untuk ciptakan skenario yang sangat personal dan meyakinkan.',
    prev:['Verifikasi SELALU lewat saluran resmi yang KAMU hubungi sendiri — bukan nomor yang mereka berikan','Bank dan CS resmi tidak PERNAH minta OTP atau password lewat telepon — dalam kondisi apapun','Tekanan waktu buatan ("harus sekarang!") adalah tanda manipulasi — justru berhenti dan verifikasi','Jangan foto KTP/SIM untuk permintaan verifikasi yang tidak jelas asal-usulnya','Laporkan ke OJK di nomor 157 atau BSSN jika kamu jadi target serangan'],
    case:'November 2023: Penipu mengaku "Tim DJP" telepon 200+ pengusaha UMKM Surabaya. Pakai nomor spoofing mirip call center DJP dan data NPWP korban dari kebocoran data pajak, minta OTP "pembaruan NPWP digital". 47 korban kehilangan akses rekening bisnis, total kerugian Rp 3,1 miliar.'
  },
  mitm:{icon:'👁️',lv:'Medium',lvCls:'lv-med',title:'Man-in-the-Middle',
    desc:'Penyerang menyisipkan diri di antara komunikasi dua pihak untuk menyadap atau memodifikasi data. WiFi publik di mal, bandara, dan kafe adalah lokasi serangan paling umum di Indonesia.',
    stat:'67% pengguna WiFi publik Indonesia tidak pakai VPN — survei NordVPN 2023. Evil Twin attack meningkat 50% di 2023',
    how:'Teknik utama: (1) Evil Twin — hotspot palsu bernama mirip jaringan asli (contoh: "Starbucks_Free" vs "Starbucks Free WiFi"), (2) SSL Stripping — turunkan HTTPS ke HTTP yang tidak terenkripsi, (3) ARP Spoofing — manipulasi tabel ARP untuk redirect traffic. Dengan Wireshark dan mitmproxy yang tersedia gratis, siapapun bisa lakukan ini di jaringan publik.',
    prev:['Gunakan data seluler 4G/5G untuk SEMUA transaksi keuangan — jauh lebih aman dari WiFi publik','Jika terpaksa pakai WiFi publik, aktifkan VPN dulu (ProtonVPN gratis dan open source)','Periksa ikon gembok HTTPS dan domain dengan teliti sebelum login','Aktifkan HTTPS-Only di browser Chrome/Firefox untuk cegah SSL stripping','Jangan abaikan peringatan sertifikat SSL — itu bisa tanda MitM aktif'],
    case:'2023: Peneliti keamanan UI lakukan simulasi Evil Twin attack di mal Jakarta. Dalam 2 jam, intercept 1.200+ sesi browsing dan dapat kredensial login 3 akun e-commerce. Riset ini dipublikasikan dan menjadi dasar kampanye kesadaran digital oleh BSSN.'
  }
};


function openModal(type){
  const d=threatDB[type]; if(!d) return;
  document.getElementById('mIcon').textContent=d.icon;
  document.getElementById('mLv').innerHTML=`<span class="threat-level ${d.lvCls}">● ${d.lv}</span>`;
  document.getElementById('mTitle').textContent=d.title;
  document.getElementById('mDesc').textContent=d.desc;
  document.getElementById('mStat').innerHTML=`<span style="margin-right:6px">📊</span>${d.stat}`;
  document.getElementById('mHow').textContent=d.how;
  document.getElementById('mCase').textContent=d.case;
  document.getElementById('mPrev').innerHTML=d.prev.map(p=>`<li>${p}</li>`).join('');
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(){
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow='';
}
window.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

/* ── TIPS ── */
const tipsData=[
  {n:'01',title:'Password Kuat & Unik',preview:'Minimal 16 karakter, unik untuk setiap akun',
   desc:'Password adalah garis pertahanan pertamamu. "123456" atau nama hewan peliharaanmu dapat ditebak dalam hitungan detik oleh program brute-force modern.',
   steps:['Gunakan minimal 16 karakter — semakin panjang, semakin kuat secara eksponensial','Kombinasikan huruf besar, huruf kecil, angka, dan simbol (!@#$%^&*)','Hindari informasi pribadi yang mudah ditebak: nama, tanggal lahir, nama hewan peliharaan','Buat password yang benar-benar unik dan berbeda untuk setiap akun penting','Gunakan password manager seperti Bitwarden (gratis & open-source) atau 1Password']},
  {n:'02',title:'Aktifkan 2FA di Semua Akun',preview:'Lapisan perlindungan yang wajib dimiliki sekarang',
   desc:'Two-Factor Authentication memastikan akunmu tetap aman bahkan jika password bocor — penyerang masih butuh kode OTP dari HP-mu.',
   steps:['Aktifkan 2FA di semua akun penting: email, media sosial, m-banking, marketplace','Gunakan aplikasi authenticator (Google Authenticator, Authy) — lebih aman dari SMS OTP','Simpan kode backup 2FA di tempat aman dan offline','Jangan pernah membagikan kode OTP kepada siapapun — termasuk yang mengaku bank','Aktifkan notifikasi login untuk mendeteksi akses dari perangkat tidak dikenal']},
  {n:'03',title:'Waspada Phishing',preview:'Kenali tanda-tanda email dan SMS penipuan',
   desc:'Phishing adalah serangan paling umum. Setiap hari lebih dari 3,4 miliar email phishing dikirim di seluruh dunia.',
   steps:['Periksa domain email pengirim dengan teliti — bank tidak pernah pakai @gmail.com','Arahkan kursor ke link untuk melihat URL sebenarnya sebelum diklik','Jangan klik tautan dari pesan yang menciptakan kepanikan mendadak','Akses website bank langsung dari browser dengan mengetik sendiri','Laporkan email phishing lewat tombol "Report Spam" di email client kamu']},
  {n:'04',title:'Update Sistem Secara Rutin',preview:'Setiap pembaruan menutup celah keamanan baru',
   desc:'Setiap update software mengandung patch untuk menutup celah keamanan. WannaCry menginfeksi 200.000 komputer melalui celah Windows yang sebenarnya sudah ada patch-nya.',
   steps:['Aktifkan pembaruan otomatis pada sistem operasi','Perbarui semua aplikasi segera setelah ada versi baru, terutama browser dan antivirus','Perbarui firmware router secara berkala','Hapus aplikasi yang sudah lama tidak digunakan','Ganti software yang sudah end-of-life dan tidak lagi mendapat security patch']},
  {n:'05',title:'Hindari WiFi Publik untuk Transaksi',preview:'WiFi terbuka = data terbuka untuk disadap',
   desc:'WiFi publik tanpa enkripsi memungkinkan siapapun di jaringan yang sama menyadap datamu — termasuk di kafe, mall, bandara, dan hotel.',
   steps:['Gunakan data seluler untuk semua transaksi keuangan dan akses data sensitif','Jika terpaksa pakai WiFi publik, aktifkan VPN tepercaya (ProtonVPN, Windscribe) dulu','Matikan fitur WiFi auto-connect di pengaturan perangkat','Verifikasi nama jaringan WiFi resmi kepada petugas tempat tersebut','Jangan pernah akses m-banking di jaringan WiFi publik']},
  {n:'06',title:'Backup Data Secara Rutin',preview:'Satu-satunya tameng nyata dari ransomware',
   desc:'Backup data yang konsisten adalah satu-satunya cara efektif pulih dari ransomware tanpa membayar tebusan.',
   steps:['Terapkan aturan 3-2-1: 3 salinan data, 2 jenis media berbeda, 1 di lokasi terpisah','Kombinasikan cloud dengan hard drive eksternal yang disimpan offline','Jadwalkan backup otomatis minimal seminggu sekali','Uji proses pemulihan backup secara berkala','Simpan hard drive backup terpisah dari jaringan utama']},
  {n:'07',title:'Verifikasi Sumber Unduhan',preview:'Software bajakan sering mengandung malware',
   desc:'Mengunduh software dari situs tidak resmi adalah cara paling umum malware masuk ke perangkat tanpa disadari.',
   steps:['Unduh software hanya dari website resmi atau toko aplikasi resmi (Play Store, App Store)','Verifikasi hash/checksum file jika developer menyediakannya','Pindai setiap file unduhan dengan antivirus sebelum dijalankan','Hindari penggunaan software crack, keygen, atau aktivator bajakan','Periksa ulasan dan reputasi developer sebelum menginstal aplikasi baru']},
  {n:'08',title:'Enkripsi Komunikasi Sensitif',preview:'Pastikan pesanmu hanya bisa dibaca yang berhak',
   desc:'Komunikasi yang tidak terenkripsi dapat dibaca pihak ketiga. End-to-end encryption memastikan hanya pengirim dan penerima yang dapat membacanya.',
   steps:['Gunakan Signal untuk percakapan paling sensitif','Aktifkan "Disappearing Messages" untuk percakapan yang tidak perlu disimpan permanen','Gunakan browser dengan mode HTTPS-Only untuk semua koneksi web','Hindari berbagi informasi sensitif (PIN, password) melalui SMS atau email biasa','Pastikan aplikasi komunikasi mendukung E2EE (end-to-end encryption)']}
];
function buildTips(){
  const grid=document.getElementById('tipsGrid');
  if(!grid) return;
  tipsData.forEach((t,i)=>{
    const el=document.createElement('div');
    el.className='tip-item reveal';
    el.innerHTML=`
      <div class="tip-head" onclick="toggleTip(${i})">
        <div class="tip-num">${t.n}</div>
        <div class="tip-info"><div class="tip-title">${t.title}</div><div class="tip-preview">${t.preview}</div></div>
        <div class="tip-arrow">›</div>
      </div>
      <div class="tip-body">
        <p>${t.desc}</p>
        <ul class="tip-steps">${t.steps.map(s=>`<li>${s}</li>`).join('')}</ul>
      </div>`;
    grid.appendChild(el);
  });
  document.querySelectorAll('.tip-item.reveal').forEach(el=>revealObserver.observe(el));
}
function toggleTip(i){ document.querySelectorAll('.tip-item')[i].classList.toggle('open'); }
buildTips();

/* ══════════════════════════════════════════
   QUIZ ENGINE — UPGRADED
   - Visual mockup email/SMS/terminal/browser
   - 12 soal dalam pool
   - Animasi hacked + hasil terlihat
══════════════════════════════════════════ */

function emailMockup(from,fromEmail,subject,body,link,isPhishing){
  const redFlags=[];
  if(fromEmail.includes('gmail.com')||fromEmail.includes('yahoo.com')) redFlags.push('Domain email bukan milik institusi resmi');
  if(link&&(link.includes('blogspot')||link.includes('.xyz')||link.includes('bit.ly')||link.includes('verify'))) redFlags.push('URL tujuan mencurigakan');
  if(body.includes('URGENT')||body.includes('jam')||body.includes('segera')||body.includes('Segera')) redFlags.push('Menciptakan tekanan dan urgensi palsu');

  return `<div class="email-mock-v2">
    <div class="emv2-chrome">
      <div class="emv2-dots"><span></span><span></span><span></span></div>
      <div class="emv2-title">📧 Gmail — Kotak Masuk</div>
    </div>
    <div class="emv2-inbox-bar">
      <span class="emv2-inbox-label">Kotak Masuk (1 baru)</span>
    </div>
    <div class="emv2-email-row ${isPhishing?'emv2-phishing':''}">
      <div class="emv2-avatar">${from.charAt(0).toUpperCase()}</div>
      <div class="emv2-email-content">
        <div class="emv2-email-top">
          <span class="emv2-sender">${from}</span>
          <span class="emv2-addr">&lt;${fromEmail}&gt;</span>
          ${isPhishing?'<span class="emv2-flag-badge">⚠ Periksa domain ini</span>':''}
        </div>
        <div class="emv2-subject">${subject}</div>
        <div class="emv2-body">${body}</div>
        ${link?`<div class="emv2-link-row"><span class="emv2-link-icon">🔗</span><span class="emv2-url ${isPhishing?'emv2-url-bad':''}">${link}</span>${isPhishing?'<span class="emv2-url-warn">← domain mencurigakan</span>':''}</div>`:''}
      </div>
    </div>
    ${redFlags.length>0?`<div class="emv2-redflag-box"><div class="emv2-rf-title">🔍 Tanda Bahaya yang Terdeteksi:</div>${redFlags.map(f=>`<div class="emv2-rf-item">⚠ ${f}</div>`).join('')}</div>`:''}
  </div>`;
}

function browserMockup(url,pageTitle,formHTML,isPhishing){
  const isHTTPS=url.startsWith('https');
  const domainParts=url.replace(/^https?:\/\//,'').split('/')[0];
  return `<div class="browser-mock">
    <div class="bm-chrome">
      <div class="bm-dots"><span class="r"></span><span class="y"></span><span class="g"></span></div>
      <div class="bm-url-bar">
        <span class="bm-lock ${isHTTPS?'bm-lock-secure':'bm-lock-bad'}">${isHTTPS?'🔒':'⚠'}</span>
        <span class="bm-domain ${isPhishing?'bm-domain-bad':''}">${url}</span>
        ${isPhishing?'<span class="bm-not-secure">Tidak Aman</span>':''}
      </div>
    </div>
    <div class="bm-body">
      <div class="bm-page-title">${pageTitle}</div>
      ${formHTML}
      ${isPhishing?`<div class="bm-warning-bar">⚠ Situs ini bukan <strong>${domainParts.split('.').slice(-2).join('.')}</strong> yang sesungguhnya. Perhatikan domain lengkapnya!</div>`:''}
    </div>
  </div>`;
}

function waMockup(sender,message,isVerified){
  return `<div class="wa-mock-v2">
    <div class="wam-chrome">
      <div class="wam-dots"><span></span><span></span><span></span></div>
      <div class="wam-title">💬 WhatsApp</div>
    </div>
    <div class="wam-header">
      <div class="wam-avatar">📱</div>
      <div class="wam-meta">
        <div class="wam-name">${sender} ${isVerified?'<span class="wam-verified">✓ Terverifikasi</span>':'<span class="wam-unknown">❓ Nomor Tidak Dikenal</span>'}</div>
        <div class="wam-status">${isVerified?'Kontak tersimpan':'Bukan dari kontak kamu'}</div>
      </div>
    </div>
    <div class="wam-chat-area">
      <div class="wam-bubble">${message}<span class="wam-time">09:41 ✓✓</span></div>
    </div>
    ${!isVerified?'<div class="wam-warning">⚠ Pesan dari nomor yang tidak ada di kontakmu. Waspadai link atau permintaan data pribadi.</div>':''}
  </div>`;
}

function terminalMockup(lines){
  return `<div class="term-mock"><div class="term-bar"><span class="td r"></span><span class="td y"></span><span class="td g"></span><span style="font-size:11px;color:#888;margin-left:8px">system alert</span></div><div class="term-body">${lines.map(l=>`<div class="tl ${l.cls||''}">${l.text}</div>`).join('')}</div></div>`;
}

const allQuestions=[
  {
    body:'Kamu menerima email di bawah ini. Apa yang harus kamu lakukan?',
    visual: emailMockup('Bank Mandiri Security','noreply-mandiri@gmail.com','[URGENT] Konfirmasi Akun — Akan Diblokir!','Yth. Nasabah,<br>Kami mendeteksi aktivitas mencurigakan. Harap konfirmasi PIN dan data rekening Anda segera melalui link berikut dalam <strong>2 jam</strong>. Jika tidak, akun akan diblokir otomatis.','http://aman-mandiri-konfirmasi.xyz/verify-pin',true),
    type:'Phishing',
    choices:[{t:'Klik link dan masukkan PIN sesuai instruksi',c:false},{t:'Hubungi call center Bank Mandiri di nomor resmi (14000)',c:true},{t:'Balas email dan tanyakan apakah ini asli',c:false},{t:'Forward ke teman untuk minta pendapat',c:false}],
    ok:'Benar! Domain pengirim adalah @gmail.com — bukan @bankmandiri.co.id yang resmi. URL juga mencurigakan. Bank tidak pernah meminta PIN via email. Selalu hubungi call center dari nomor di balik kartu.',
    bad:'Ini Phishing! Tanda bahaya: (1) domain @gmail.com bukan milik bank, (2) URL mencurigakan, (3) tekanan 2 jam adalah manipulasi. Bank tidak pernah minta PIN lewat email!'
  },
  {
    body:'Pesan WhatsApp ini masuk dari nomor tidak dikenal. Apa responsmu?',
    visual: waMockup('+62 812-9876-XXXX (Tidak Dikenal)','🎉 Selamat! Nomor HP kamu TERPILIH sebagai pemenang Undian BRI 2026!<br>💰 Hadiah: <strong>Rp 75.000.000</strong><br>⏰ Klaim dalam 24 jam sebelum hangus!<br>👉 <span style="color:#0066cc;text-decoration:underline">http://bri-hadiah-resmi2026.blogspot.com/klaim</span>',false),
    type:'Phishing',
    choices:[{t:'Klik link karena hadiahnya besar',c:false},{t:'Abaikan dan blokir nomor tersebut',c:true},{t:'Balas untuk minta bukti bahwa ini asli',c:false},{t:'Klik link tapi jangan masukkan data',c:false}],
    ok:'Tepat! Domain blogspot.com bukan milik BRI. BRI tidak pernah umumkan pemenang via WA dari nomor tidak dikenal. Deadline 24 jam adalah taktik tekanan. Blokir dan laporkan.',
    bad:'Phishing + Social Engineering! blogspot.com jelas bukan domain resmi BRI. Hadiah fantastis dari nomor tidak dikenal = penipuan. Bahkan "hanya melihat" link bisa memvalidasi nomor HP-mu.'
  },
  {
    body:'Kamu mengunduh software edit video gratis dari situs tidak resmi. Ini yang muncul setelah diinstal:',
    visual: terminalMockup([{text:'> PERMISSION REQUEST: VideoEditor_Free_Pro.exe',cls:'tl-warn'},{text:'  → Akses penuh ke semua kontak',cls:'tl-err'},{text:'  → Akses kamera & mikrofon (background)',cls:'tl-err'},{text:'  → Kirim & baca semua SMS',cls:'tl-err'},{text:'  → Jalankan saat startup (administrator)',cls:'tl-err'},{text:'> ANTIVIRUS: Definisi terakhir diperbarui 8 bulan lalu',cls:'tl-warn'},{text:'> Izinkan semua akses? [Y/N]',cls:'tl-info'}]),
    type:'Malware',
    choices:[{t:'Klik Y — izinkan semua karena butuh edit video',c:false},{t:'Klik N, hapus file, jalankan full scan antivirus terbaru',c:true},{t:'Izinkan akses kamera saja, tolak sisanya',c:false},{t:'Restart komputer dan coba install ulang',c:false}],
    ok:'Benar! Software edit video TIDAK membutuhkan akses kontak, SMS, atau berjalan sebagai administrator. Ini tanda jelas spyware/trojan. Hapus segera, perbarui antivirus, lakukan full scan.',
    bad:'Berbahaya! Akses kontak + kamera + SMS dari aplikasi edit video adalah RED FLAG besar. Ini hampir pasti spyware yang akan mencuri datamu secara diam-diam.'
  },
  {
    body:'Antivirus mendeteksi ancaman pada file yang baru kamu unduh:',
    visual: terminalMockup([{text:'AVAST — THREAT DETECTED',cls:'tl-err'},{text:'File: Office2024_Activator_KMS.exe',cls:'tl-warn'},{text:'Sumber: torrent-gratis-software.net',cls:'tl-warn'},{text:'Ancaman: Win32:Trojan.Gen.2 / Backdoor',cls:'tl-err'},{text:'Aksi: File dikarantina otomatis',cls:'tl-info'},{text:'Rekomendasi: Hapus permanen & scan sistem',cls:'tl-info'}]),
    type:'Malware',
    choices:[{t:'Abaikan — mungkin false positive, tetap buka file',c:false},{t:'Hapus file secara permanen dan batalkan instalasi',c:true},{t:'Nonaktifkan antivirus sementara, lalu buka file',c:false},{t:'Restore dari karantina dan coba jalankan lagi',c:false}],
    ok:'Tepat! Antivirus kamu bekerja dengan benar. Trojan.Gen.2 dapat membuka backdoor di komputermu. Hapus file tersebut dan cari software resmi — Microsoft Office ada versi gratis untuk pelajar.',
    bad:'Sangat berbahaya! Menonaktifkan antivirus untuk buka file mencurigakan = membiarkan pencuri masuk. Trojan.Gen.2 bisa mencuri password, data banking, dan menjadikan komputermu bagian botnet.'
  },
  {
    body:'Kamu membuka laptop dan menemukan tampilan ini:',
    visual: terminalMockup([{text:'YOUR FILES HAVE BEEN ENCRYPTED',cls:'tl-err'},{text:'2.847 file dienkripsi dengan AES-256',cls:'tl-err'},{text:'Ekstensi file berubah menjadi .LOCKED',cls:'tl-warn'},{text:'TUNTUTAN: 0.5 BTC (~$21.000 USD)',cls:'tl-err'},{text:'BATAS WAKTU: 72:00:00 JAM tersisa',cls:'tl-warn'},{text:'> Backup terakhir: TIDAK ADA',cls:'tl-err'}]),
    type:'Ransomware',
    choices:[{t:'Bayar tebusan sesuai instruksi',c:false},{t:'Cabut LAN/matikan WiFi dan hubungi ahli IT Security',c:true},{t:'Format ulang laptop sekarang juga',c:false},{t:'Matikan dan nyalakan berulang kali',c:false}],
    ok:'Benar! Langkah darurat: (1) Isolasi dari jaringan SEGERA agar tidak menyebar, (2) Jangan matikan, (3) Hubungi IT Security profesional, (4) Cek nomeedecryptor.id untuk tool pemulihan gratis.',
    bad:'Membayar tebusan TIDAK menjamin data kembali dan mendanai kejahatan. Prioritas: isolasi dari jaringan untuk cegah penyebaran, lalu hubungi ahli IT Security.'
  },
  {
    body:'Telepon masuk dari seseorang yang mengaku Tim IT kantor:',
    visual: terminalMockup([{text:'PANGGILAN MASUK',cls:'tl-info'},{text:'"Halo, ini Tim IT dari IT Support."',cls:''},{text:'"Server kantor mengalami breach besar."',cls:'tl-err'},{text:'"Kami butuh username & password kamu SEKARANG"',cls:'tl-warn'},{text:'"untuk reset akses sebelum sistem crash!"',cls:'tl-warn'},{text:'"Cepat! Hanya ada 20 menit!"',cls:'tl-err'},{text:'> Identitas penelepon: TIDAK DAPAT DIVERIFIKASI',cls:'tl-warn'}]),
    type:'Social Engineering',
    choices:[{t:'Berikan username & password karena situasinya darurat',c:false},{t:'Tolak, tutup telepon, laporkan ke supervisor dan IT resmi',c:true},{t:'Berikan username saja, tahan password dulu',c:false},{t:'Minta mereka kirim permintaan via email resmi',c:false}],
    ok:'Benar! Tim IT profesional TIDAK PERNAH meminta password lewat telepon — dalam kondisi apapun. Tekanan 20 menit adalah manipulasi klasik. Tutup telepon, laporkan ke supervisor dan IT resmi.',
    bad:'Vishing (Voice Phishing)! Urgensi buatan dirancang agar kamu panik. Tim IT tidak pernah butuh passwordmu untuk perbaikan server apapun. Selalu verifikasi via saluran resmi.'
  },
  {
    body:'Kamu mendapat email dari CEO perusahaanmu:',
    visual: emailMockup('Pak Budi Santoso (CEO)','budi.santoso@company-corp.net','Tugas Mendesak - Rahasia','Halo,<br>Saya sedang rapat penting dan tidak bisa dihubungi via HP. Tolong segera transfer Rp 150.000.000 ke rekening klien baru: BCA 1234567890 a.n. PT Maju Jaya.<br><br>Ini mendesak dan <strong>rahasia</strong> — jangan beritahu siapapun dulu, langsung proses sekarang.',null,true),
    type:'Social Engineering',
    choices:[{t:'Langsung proses transfer karena perintah CEO',c:false},{t:'Verifikasi langsung ke CEO via telepon ke nomor yang sudah dikenal',c:true},{t:'Transfer dulu, konfirmasi belakangan',c:false},{t:'CC Finance untuk minta persetujuan tertulis',c:false}],
    ok:'Tepat! Ini CEO Fraud. Domain company-corp.net mungkin bukan domain resmi. Instruksi "jangan beritahu siapapun" adalah manipulasi. Selalu verifikasi transfer besar via telepon langsung ke nomor yang sudah kamu kenal.',
    bad:'CEO Fraud — modus yang merugikan perusahaan besar-besaran! Domain email dipalsukan dengan mudah. "Jangan beritahu siapapun" dan "segera" adalah manipulasi psikologis. Selalu verifikasi via telepon sebelum transfer.'
  },
  {
    body:'Di bandara perlu transfer uang mendesak. Jaringan yang tersedia:',
    visual: terminalMockup([{text:'JARINGAN TERSEDIA:',cls:'tl-info'},{text:'  "AirportFree_WiFi" — Open (tanpa password)',cls:'tl-warn'},{text:'  "SoekarnoHatta_Guest" — Open (tanpa password)',cls:'tl-warn'},{text:'  Data Seluler Telkomsel — 4G LTE Full Bar',cls:'tl-info'},{text:'AKTIVITAS: Transfer Rp 15.000.000',cls:''},{text:'ke rekening kolega untuk kebutuhan mendesak',cls:''}]),
    type:'Man-in-the-Middle',
    choices:[{t:'Pakai WiFi bandara — website bank sudah HTTPS jadi aman',c:false},{t:'Gunakan data seluler pribadi untuk transaksi ini',c:true},{t:'Pakai WiFi bandara tapi mode incognito',c:false},{t:'Cari WiFi yang ada password di sekitar bandara',c:false}],
    ok:'Benar! Gunakan data seluler. WiFi publik terbuka rentan MitM — SSL Stripping bisa mencuri data meski ada HTTPS. Mode incognito hanya menyembunyikan history lokal, tidak melindungi dari penyadapan jaringan.',
    bad:'WiFi publik sangat berisiko untuk transaksi keuangan. SSL Stripping bisa mengekspos data meski ada HTTPS. Mode incognito tidak melindungi dari serangan jaringan. Data seluler adalah pilihan paling aman.'
  },
  {
    body:'Notifikasi login masuk ke akunmu:',
    visual: terminalMockup([{text:'NOTIFIKASI KEAMANAN GOOGLE',cls:'tl-warn'},{text:'Login baru terdeteksi ke akun kamu',cls:''},{text:'Perangkat: Windows PC — Moscow, Russia',cls:'tl-err'},{text:'Waktu: 03:24 WIB (saat kamu tidur)',cls:'tl-err'},{text:'Status: Login BERHASIL',cls:'tl-err'}]),
    type:'Social Engineering',
    choices:[{t:'Tidak apa-apa, mungkin Google salah deteksi lokasi',c:false},{t:'Segera ganti password dan aktifkan 2FA sekarang',c:true},{t:'Tunggu dulu untuk konfirmasi aktivitas mencurigakan',c:false},{t:'Logout dari semua perangkat saja sudah cukup',c:false}],
    ok:'Benar! Login dari Rusia pukul 03.24 WIB saat tidur = akunmu dibobol. Segera: (1) Ganti password, (2) Aktifkan 2FA, (3) Cek myaccount.google.com, (4) Periksa email forwarding yang mungkin ditambahkan.',
    bad:'Ini bukan false alarm! Login dari Rusia pukul 03.24 saat kamu tidur hampir pasti bukan kamu. Menunggu hanya memberi penyerang lebih banyak waktu untuk menyalahgunakan akunmu.'
  },
  {
    body:'Kamu mau buka m-banking BCA, tapi URL bar browser menampilkan ini. Apa yang kamu lakukan?',
    visual: browserMockup('http://bca.co.id.login-verify.net/mobile','BCA Mobile — Masuk ke Akun Anda',`<div style="padding:16px;display:flex;flex-direction:column;gap:10px"><div style="font-size:11px;color:#666;margin-bottom:4px">Username</div><div style="background:#f8f8f8;border:1px solid #ddd;border-radius:6px;padding:10px 12px;font-size:13px;color:#999">Masukkan username...</div><div style="font-size:11px;color:#666;margin-bottom:4px;margin-top:6px">Password / PIN</div><div style="background:#f8f8f8;border:1px solid #ddd;border-radius:6px;padding:10px 12px;font-size:13px;color:#999">••••••••</div><div style="background:#006699;color:white;border-radius:6px;padding:11px;text-align:center;font-size:13px;font-weight:600;margin-top:4px">Masuk</div></div>`,true),
    type:'Phishing',
    choices:[{t:'Login saja — halaman terlihat persis BCA asli',c:false},{t:'Tutup tab, ketik klikbca.com langsung di address bar',c:true},{t:'Login tapi langsung logout setelah selesai',c:false},{t:'Refresh halaman dulu untuk melihat apakah berubah',c:false}],
    ok:'Benar! Domain "bca.co.id.login-verify.net" bukan milik BCA — domain asli BCA adalah klikbca.com. Subdomain palsu adalah teknik spoofing umum. Tidak ada HTTPS juga tanda bahaya. Selalu ketik alamat bank langsung.',
    bad:'Domain bca.co.id.login-verify.net BUKAN milik BCA! Domain BCA adalah klikbca.com. Teknik subdomain spoofing ini dirancang agar korban tidak sadar. Data yang dimasukkan langsung dikirim ke penyerang.'
  },
  {
    body:'SMS ini masuk mengaku dari BRI:',
    visual: waMockup('0812-3456-7890 (SMS)','⚠ [BRI] Kartu debit Anda terblokir karena transaksi mencurigakan. Segera verifikasi di:<br><span style="color:#0066cc">http://bit.ly/BRI-Unlock-2026</span><br>atau kartu dinonaktifkan permanen dalam 6 jam.',false),
    type:'Phishing',
    choices:[{t:'Klik link dan verifikasi agar kartu tidak terblokir',c:false},{t:'Abaikan SMS, cek langsung di BRImo atau telepon 1500017',c:true},{t:'Balas SMS untuk minta konfirmasi dari BRI',c:false},{t:'Screenshot dan tanya ke teman',c:false}],
    ok:'Benar! BRI tidak pernah kirim link pemblokiran via SMS dari nomor HP biasa. bit.ly menyembunyikan URL tujuan. Selalu cek status kartu di aplikasi resmi atau telepon 1500017.',
    bad:'Smishing (SMS Phishing)! Tanda-tandanya: nomor HP biasa (bukan kode pendek resmi), link bit.ly menyembunyikan tujuan, ancaman 6 jam untuk ciptakan panik. Selalu verifikasi via aplikasi atau call center.'
  },
  {
    body:'Penjual marketplace mengirim pesan ini:',
    visual: terminalMockup([{text:'PESAN DARI PENJUAL:',cls:'tl-info'},{text:'"Mas/Mba, bayar langsung ke rekening saya ya:"',cls:'tl-warn'},{text:'"BCA 1234-5678 a.n. Budi S."',cls:'tl-warn'},{text:'"Jangan pakai rekening bersama marketplace"',cls:'tl-err'},{text:'"ada potongan biaya admin yang besar"',cls:'tl-err'},{text:'"Transfer langsung lebih aman & cepat!"',cls:'tl-warn'}]),
    type:'Social Engineering',
    choices:[{t:'Transfer langsung karena penjual tampak terpercaya',c:false},{t:'Tolak dan tetap gunakan rekening bersama (escrow) marketplace',c:true},{t:'Minta bukti KTP sebelum transfer langsung',c:false},{t:'Transfer setengah dulu, setengah setelah barang tiba',c:false}],
    ok:'Benar! Ajakan bypass rekening bersama adalah modus penipuan online paling umum di Indonesia. Escrow ada untuk melindungimu. Selalu gunakan sistem resmi marketplace untuk semua transaksi.',
    bad:'Modus penipuan online paling umum di Indonesia! Setelah transfer langsung, uang hilang dan tidak ada jaminan barang dikirim. Rekening bersama/escrow adalah perlindunganmu. Selalu gunakan rekening marketplace.'
  },
];

function shuffleArray(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

let activeQuestions=[];
let qIdx=0,score=0,answered=false,timerInt=null,startTime=null,log=[];

function fmtTime(ms){ const s=Math.floor(ms/1000); return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`; }

function startTimer(){
  startTime=Date.now();
  timerInt=setInterval(()=>{
    const el=document.getElementById('simTimer');
    if(el) el.textContent='⏱ '+fmtTime(Date.now()-startTime);
  },1000);
}

function beginQuiz(){
  activeQuestions=shuffleArray(allQuestions).slice(0,5);
  qIdx=0; score=0; answered=false; log=[];
  document.getElementById('startScreen').style.display='none';
  document.getElementById('quizArea').style.display='block';
  const te=document.getElementById('simTimer'); if(te) te.textContent='⏱ 00:00';
  clearInterval(timerInt);
  startTimer();
  loadQ();
}

function loadQ(){
  const q=activeQuestions[qIdx];
  document.getElementById('qNum').textContent=`Skenario ${qIdx+1} dari ${activeQuestions.length}`;
  document.getElementById('qBar').style.width=`${((qIdx+1)/activeQuestions.length)*100}%`;
  document.getElementById('qType').textContent=q.type;
  document.getElementById('qBody').textContent=q.body;
  const visualBox=document.getElementById('qVisual');
  if(visualBox){ if(q.visual){ visualBox.innerHTML=q.visual; visualBox.style.display='block'; } else { visualBox.style.display='none'; } }
  const ctxEl=document.getElementById('qCtx');
  if(ctxEl) ctxEl.style.display='none';
  document.getElementById('scoreVal').textContent=score;
  const box=document.getElementById('choicesBox'); box.innerHTML='';
  q.choices.forEach((c,i)=>{
    const btn=document.createElement('button'); btn.className='choice-btn';
    btn.innerHTML=`<span class="choice-letter">${'ABCD'[i]}</span>${c.t}`;
    btn.onclick=()=>answer(i,c.c,btn); box.appendChild(btn);
  });
  document.getElementById('feedbackBox').className='feedback';
  document.getElementById('nextBtn').style.display='none';
  answered=false;
}

function answer(i,correct,btn){
  if(answered) return; answered=true;
  const q=activeQuestions[qIdx]; log.push({type:q.type,ok:correct});
  document.querySelectorAll('.choice-btn').forEach(b=>b.disabled=true);
  if(correct){ btn.classList.add('correct'); score++; document.getElementById('scoreVal').textContent=score; }
  else{
    btn.classList.add('wrong');
    document.querySelectorAll('.choice-btn').forEach((b,j)=>{ if(q.choices[j].c) b.classList.add('correct'); });
    // Animasi dramatik saat salah
    const box=document.getElementById('simBox');
    if(box){ box.classList.add('hacked'); setTimeout(()=>box.classList.remove('hacked'),700); }
  }
  const fb=document.getElementById('feedbackBox');
  fb.className=`feedback ${correct?'ok':'bad'} show`;
  document.getElementById('fbTitle').textContent=correct?'✓ Keputusan Tepat!':'✗ Keputusan Kurang Tepat';
  document.getElementById('fbDesc').textContent=correct?q.ok:q.bad;
  document.getElementById('nextBtn').style.display='inline-block';
  document.getElementById('nextBtn').textContent=qIdx===activeQuestions.length-1?'Lihat Hasil →':'Skenario Berikutnya →';
}

function nextQ(){
  qIdx++;
  if(qIdx>=activeQuestions.length) showResult();
  else loadQ();
}

function getBadge(pct){ return getBadgeStatic(pct); }

function showResult(){
  clearInterval(timerInt);
  const elapsed=Date.now()-startTime;
  document.getElementById('quizArea').style.display='none';
  const rs=document.getElementById('resultScreen'); rs.classList.add('show');
  // Fix: scroll sim-box ke atas agar result terlihat
  const simBox=document.getElementById('simBox');
  if(simBox){ simBox.style.overflow='visible'; simBox.scrollIntoView({behavior:'smooth',block:'start'}); }
  window.scrollTo({top: (simBox ? simBox.offsetTop - 80 : 0), behavior:'smooth'});

  // Simpan ke localStorage
  const d = CS.get();
  d.totalSessions = (d.totalSessions||0) + 1;
  if(!d.bestScore || score > d.bestScore.score){
    d.bestScore = {score, total: activeQuestions.length};
  }
  CS.set(d);
  const pct=Math.round((score/activeQuestions.length)*100);
  const badge=getBadge(pct);
  const descs={100:'Sempurna! Kamu tidak tertipu satu pun ancaman. Kamu adalah tameng digital sejati!',80:'Luar biasa! Instingmu dalam mengenali ancaman siber sangat tajam.',60:'Cukup baik, tapi masih ada celah. Perkuat dengan membaca materi edukasi.',0:'Kamu masih cukup rentan. Pelajari materi dan coba lagi untuk meningkatkan pertahananmu.'};
  const descKey=pct===100?100:pct>=80?80:pct>=60?60:0;

  document.getElementById('rIcon').textContent=badge.emoji;
  document.getElementById('rTitle').textContent=badge.title;
  document.getElementById('rScore').textContent=`${score}/${activeQuestions.length}`;
  document.getElementById('rScore').style.color=badge.color;
  document.getElementById('rPct').textContent=`${pct}% Benar`;
  document.getElementById('rTime').textContent=`⏱ Waktu: ${fmtTime(elapsed)}`;
  document.getElementById('rDesc').textContent=descs[descKey];

  // Breakdown per kategori dengan visual lebih jelas
  const byType={};
  log.forEach(l=>{ if(!byType[l.type]) byType[l.type]={ok:0,total:0}; byType[l.type].total++; if(l.ok) byType[l.type].ok++; });
  document.getElementById('rBreakdown').innerHTML=`
    <div style="margin:16px 0 8px;font-size:12px;font-weight:700;color:#888;letter-spacing:1px;text-transform:uppercase">Hasil per Kategori</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">
      ${Object.entries(byType).map(([type,{ok,total}])=>`
        <div style="background:${ok===total?'#f0fdf4':'#fef2f2'};border:1.5px solid ${ok===total?'#86efac':'#fca5a5'};border-radius:10px;padding:10px 16px;min-width:140px">
          <div style="font-size:11px;font-weight:700;color:${ok===total?'#15803d':'#dc2626'};margin-bottom:2px">${ok===total?'✓':'✗'} ${type}</div>
          <div style="font-size:20px;font-weight:800;color:${ok===total?'#16a34a':'#ef4444'}">${ok}/${total}</div>
        </div>`).join('')}
    </div>`;

  const certBox=document.getElementById('certBox');
  if(certBox){
    certBox.style.display='block';
    certBox.innerHTML=`
      <div style="background:${badge.bg};border:2px solid ${badge.border};border-radius:16px;padding:24px;max-width:420px;margin:0 auto;text-align:center">
        <div style="font-size:40px;margin-bottom:8px">${badge.emoji}</div>
        <div style="font-family:'Syne',sans-serif;font-size:18px;font-weight:800;color:${badge.color};margin-bottom:2px">${badge.title}</div>
        <div style="font-family:'DM Mono',monospace;font-size:10px;color:#888;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px">CyberShield · ${new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</div>
        <div style="font-size:15px;color:#555;margin-bottom:16px">Skor: <strong style="color:${badge.color};font-size:20px">${score}/${activeQuestions.length}</strong> &nbsp;·&nbsp; ${fmtTime(elapsed)}</div>
        <div style="display:flex;gap:8px;max-width:280px;margin:0 auto">
          <input id="lbNameInput" type="text" placeholder="Masukkan namamu..." maxlength="20"
            style="flex:1;padding:10px 12px;border:1.5px solid ${badge.border};border-radius:8px;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;outline:none;background:#fff">
          <button onclick="submitToLB(${score},${activeQuestions.length},${elapsed})"
            style="padding:10px 16px;background:${badge.color};color:#fff;border:none;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap">
            Simpan →
          </button>
        </div>
        <div id="lbSavedMsg" style="display:none;margin-top:10px;font-size:12px;color:${badge.color};font-weight:600">✓ Skor tersimpan ke leaderboard!</div>
      </div>`;
  }
  }


function restartQuiz(){
  clearInterval(timerInt);
  document.getElementById('resultScreen').classList.remove('show');
  const certBox=document.getElementById('certBox'); if(certBox) certBox.style.display='none';
  document.getElementById('startScreen').style.display='block';
  document.getElementById('quizArea').style.display='none';
  const simBox=document.getElementById('simBox'); if(simBox) simBox.style.overflow='hidden';
  const te=document.getElementById('simTimer'); if(te) te.textContent='⏱ 00:00';
}

function submitToLB(score, total, elapsed){
  const nameEl = document.getElementById('lbNameInput');
  const name = nameEl ? nameEl.value.trim() : 'Anonymous';
  saveToLeaderboard(name, score, total, elapsed);
  const msg = document.getElementById('lbSavedMsg');
  if(msg){ msg.style.display='block'; }
  if(nameEl){ nameEl.disabled=true; }
  const btn = nameEl?.nextElementSibling;
  if(btn){ btn.disabled=true; btn.style.opacity='0.5'; }
}


// Catat kunjungan
(function trackVisit(){
  const d = CS.get();
  d.visits = (d.visits||0) + 1;
  d.lastVisit = new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});
  CS.set(d);

  // Tampilkan personal stats di homepage jika sudah pernah main simulasi
  const sec = document.getElementById('personalStatsSection');
  const grid = document.getElementById('personalStatsGrid');
  if(sec && grid && d.totalSessions >= 1){
    sec.style.display = 'block';
    const bestPct = d.bestScore ? Math.round((d.bestScore.score/d.bestScore.total)*100) : 0;
    const badge = d.bestScore ? getBadgeStatic(bestPct) : null;
    grid.innerHTML = `
      <div class="ps-card">
        <div class="ps-icon">🎮</div>
        <div class="ps-num">${d.totalSessions||0}</div>
        <div class="ps-label">Sesi Simulasi</div>
      </div>
      <div class="ps-card">
        <div class="ps-icon">🏆</div>
        <div class="ps-num" style="color:${badge?badge.color:'#888'}">${d.bestScore ? d.bestScore.score+'/'+d.bestScore.total : '—'}</div>
        <div class="ps-label">Skor Terbaik</div>
        ${badge?`<div style="font-size:10px;color:${badge.color};font-weight:700;margin-top:4px">${badge.title}</div>`:''}
      </div>
      <div class="ps-card">
        <div class="ps-icon">👁</div>
        <div class="ps-num">${d.visits||1}</div>
        <div class="ps-label">Kali Dikunjungi</div>
      </div>
      <div class="ps-card">
        <div class="ps-icon">📅</div>
        <div class="ps-num" style="font-size:14px">${d.lastVisit||'Hari ini'}</div>
        <div class="ps-label">Kunjungan Terakhir</div>
        <a href="simulasi.html" style="display:inline-block;margin-top:8px;font-size:11px;color:var(--purple);font-weight:700">Main lagi →</a>
      </div>`;
    // Re-observe untuk reveal animation
    grid.querySelectorAll('.ps-card').forEach(el=>{ el.classList.add('reveal'); revealObserver.observe(el); });
  }
})();

const quizAreaInit=document.getElementById('quizArea');
if(quizAreaInit){ quizAreaInit.style.display='none'; }

/* ══════════════════════════
   TOOLS INTERAKTIF
══════════════════════════ */
function checkPassword(){
  const pw=document.getElementById('pwInput')?.value||'';
  const result=document.getElementById('pwResult');
  const bar=document.getElementById('pwBar');
  const tips=document.getElementById('pwTips');
  if(!result||!bar||!tips) return;
  let sc=0;
  const c={len12:pw.length>=12,len16:pw.length>=16,upper:/[A-Z]/.test(pw),lower:/[a-z]/.test(pw),num:/[0-9]/.test(pw),sym:/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?\/`~]/.test(pw),noCommon:!['password','123456','qwerty','abc123','admin','indonesia','password123'].includes(pw.toLowerCase())};
  if(c.len12)sc++;if(c.len16)sc++;if(c.upper)sc++;if(c.lower)sc++;if(c.num)sc++;if(c.sym)sc+=2;if(c.noCommon)sc++;
  let strength,color,pct,crackTime;
  if(pw.length===0){strength='';color='#e5e7eb';pct=0;crackTime='';}
  else if(sc<=2){strength='Sangat Lemah';color='#dc2626';pct=10;crackTime='< 1 menit untuk ditebak';}
  else if(sc<=4){strength='Lemah';color='#ea580c';pct=30;crackTime='Beberapa jam untuk ditebak';}
  else if(sc<=5){strength='Sedang';color='#ca8a04';pct=55;crackTime='Beberapa hari untuk ditebak';}
  else if(sc<=6){strength='Kuat';color='#16a34a';pct=78;crackTime='Beberapa tahun untuk ditebak';}
  else{strength='Sangat Kuat 🛡️';color='#15803d';pct=100;crackTime='Hampir tidak mungkin ditebak';}
  bar.style.width=pct+'%';bar.style.background=color;
  result.innerHTML=pw.length===0?'':`<span style="font-weight:700;color:${color}">${strength}</span> <span style="color:#888;font-size:12px">— ${crackTime}</span>`;
  const tl=[];
  if(!c.len12)tl.push('Tambah panjang hingga minimal 12 karakter');
  if(!c.len16)tl.push('Idealnya 16+ karakter untuk keamanan optimal');
  if(!c.upper)tl.push('Tambahkan huruf kapital (A-Z)');
  if(!c.lower)tl.push('Tambahkan huruf kecil (a-z)');
  if(!c.num)tl.push('Tambahkan angka (0-9)');
  if(!c.sym)tl.push('Tambahkan simbol (!@#$%^&*)');
  if(!c.noCommon)tl.push('Hindari kata-kata umum yang mudah ditebak');
  tips.innerHTML=tl.length>0?'<div style="margin-top:8px">'+tl.map(t=>`<div style="font-size:12px;color:#ea580c;padding:2px 0">⚠ ${t}</div>`).join('')+'</div>':pw.length>0?'<div style="font-size:12px;color:#16a34a;margin-top:8px">✓ Password sudah memenuhi semua kriteria keamanan!</div>':'';
}

function checkURL(){
  const raw=(document.getElementById('urlInput')?.value||'').trim().toLowerCase().replace(/^https?:\/\//,'').split('/')[0];
  const result=document.getElementById('urlResult');
  if(!result) return;
  if(!raw){result.innerHTML='';return;}
  let warnings=[],positives=[],riskScore=0;
  const legitDomains=['google.com','youtube.com','facebook.com','instagram.com','tokopedia.com','shopee.co.id','bukalapak.com','gojek.com','grab.com','klikbca.com','mandiri.co.id','bri.co.id','bni.co.id','ojk.go.id','kominfo.go.id','kemenkeu.go.id','twitter.com','x.com','linkedin.com','tiktok.com','whatsapp.com'];
  const suspTLDs=['.xyz','.tk','.ml','.ga','.cf','.gq','.click','.download'];
  const suspKws=['login','verify','secure','account','confirm','update','banking','wallet','unlock','suspend','blocked','hadiah','undian','menang','claim','free-','gratis'];
  const isLegit=legitDomains.some(d=>raw===d||raw.endsWith('.'+d));
  if(isLegit){positives.push('Domain dikenal sebagai situs terpercaya');}
  if(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(raw)){warnings.push('Menggunakan alamat IP langsung — situs resmi tidak melakukan ini');riskScore+=3;}
  const st=suspTLDs.find(t=>raw.endsWith(t));
  if(st){warnings.push(`Domain menggunakan TLD "${st}" yang sering dipakai situs penipuan`);riskScore+=2;}
  const parts=raw.split('.');
  if(parts.length>3&&!isLegit){warnings.push('Terlalu banyak subdomain — mungkin teknik domain spoofing');riskScore+=2;}
  const fkw=suspKws.filter(kw=>raw.includes(kw));
  if(fkw.length>0&&!isLegit){warnings.push(`Mengandung kata mencurigakan: "${fkw.slice(0,3).join('", "')}"`);;riskScore+=fkw.length;}
  if((raw.includes('blogspot')||raw.includes('wordpress.com')||raw.includes('weebly')||raw.includes('wix.com'))&&!isLegit){warnings.push('Menggunakan hosting gratis — bank/marketplace resmi tidak melakukan ini');riskScore+=3;}
  if(['bit.ly','tinyurl.com','t.co','goo.gl','ow.ly','buff.ly'].some(s=>raw.includes(s))){warnings.push('URL shortener menyembunyikan tujuan sebenarnya dari link ini');riskScore+=2;}
  let verdict,vColor,vBg,vIcon;
  if(isLegit&&riskScore===0){verdict='Tampak Aman';vColor='#15803d';vBg='#f0fdf4';vIcon='✓';positives.push('Tidak ditemukan tanda phishing yang umum');}
  else if(riskScore===0){verdict='Perlu Dicek Manual';vColor='#ca8a04';vBg='#fefce8';vIcon='?';positives.push('Tidak ada tanda bahaya terdeteksi, namun domain tidak dikenal');}
  else if(riskScore<=2){verdict='Perlu Kewaspadaan';vColor='#ea580c';vBg='#fff7ed';vIcon='⚠';}
  else{verdict='Sangat Mencurigakan!';vColor='#dc2626';vBg='#fef2f2';vIcon='✗';}
  result.innerHTML=`<div style="background:${vBg};border:1.5px solid ${vColor}40;border-radius:12px;padding:16px">
    <div style="font-size:14px;font-weight:700;color:${vColor};margin-bottom:10px">${vIcon} ${verdict}</div>
    ${warnings.map(w=>`<div style="font-size:12px;color:#dc2626;padding:3px 0;padding-left:16px;position:relative"><span style="position:absolute;left:0">⚠</span> ${w}</div>`).join('')}
    ${positives.map(p=>`<div style="font-size:12px;color:#16a34a;padding:3px 0;padding-left:16px;position:relative"><span style="position:absolute;left:0">✓</span> ${p}</div>`).join('')}
    <div style="margin-top:10px;font-size:11px;color:#888;font-style:italic">* Analisis dasar. Selalu verifikasi manual untuk transaksi penting.</div>
  </div>`;
}

/* ══════════════════════════════════
   LEADERBOARD — localStorage
   Simpan top 10 skor lokal dengan nama
══════════════════════════════════ */
function buildLeaderboard(){
  const lb = document.getElementById('leaderboardBox');
  if(!lb) return;
  const d = CS.get();
  const scores = d.scores || [];
  if(scores.length === 0){
    lb.innerHTML = `<div style="text-align:center;padding:32px;color:var(--muted);font-size:14px">Belum ada skor tersimpan.<br>Selesaikan simulasi dulu!</div>`;
    return;
  }
  const sorted = [...scores].sort((a,b)=> b.score===a.score ? a.time-b.time : b.score-a.score);
  lb.innerHTML = sorted.slice(0,10).map((s,i)=>{
    const pct = Math.round((s.score/s.total)*100);
    const b = getBadgeStatic(pct);
    const medals = ['🥇','🥈','🥉'];
    return `<div class="lb-row ${i===0?'lb-top':''}">
      <div class="lb-rank">${medals[i]||('#'+(i+1))}</div>
      <div class="lb-info">
        <div class="lb-name">${s.name||'Anonymous'}</div>
        <div class="lb-meta">${s.date} · ${fmtTime(s.time*1000)}</div>
      </div>
      <div class="lb-badge" style="color:${b.color}">${b.emoji} ${b.title}</div>
      <div class="lb-score" style="color:${b.color}">${s.score}/${s.total}</div>
    </div>`;
  }).join('');
}

function saveToLeaderboard(name, score, total, timeMs){
  const d = CS.get();
  if(!d.scores) d.scores = [];
  d.scores.push({
    name: name.trim().slice(0,20) || 'Anonymous',
    score, total,
    time: Math.round(timeMs/1000),
    date: new Date().toLocaleDateString('id-ID',{day:'numeric',month:'short'})
  });
  // Keep top 20
  d.scores.sort((a,b)=> b.score===a.score ? a.time-b.time : b.score-a.score);
  d.scores = d.scores.slice(0,20);
  CS.set(d);
}

// Inisialisasi leaderboard jika ada di halaman
buildLeaderboard();

function clearLB(){
  if(!confirm('Reset semua skor leaderboard?')) return;
  const d = CS.get();
  d.scores = [];
  CS.set(d);
  buildLeaderboard();
}
 // Menunggu seluruh dokumen HTML dimuat
document.addEventListener("DOMContentLoaded", function() {
    
    // Pilih semua elemen yang ingin diberi efek muncul (fade in)
    const fadeElements = document.querySelectorAll('.fade-in-element');

    // Opsi untuk Intersection Observer
    // 'rootMargin: -50px' berarti elemen dianggap masuk layar saat sudah 50px di dalam area viewport
    const observerOptions = {
        root: null, // Menggunakan viewport browser sebagai root
        rootMargin: '-50px',
        threshold: 0.1 // Memicu saat 10% elemen sudah terlihat
    };

    // Callback function yang dijalankan saat elemen masuk/keluar area pantauan
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            // Jika elemen masuk area viewport (intersecting)
            if (entry.isIntersecting) {
                // Tambahkan class 'visible' untuk memicu animasi CSS
                entry.target.classList.add('visible');
                // Berhenti memantau elemen ini setelah animasi dipicu
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Mulai memantau setiap elemen yang sudah dipilih
    fadeElements.forEach(el => {
        observer.observe(el);
    });

});
document.addEventListener('DOMContentLoaded', () => {
  // 1. Fungsi Scroll Reveal (Supaya konten muncul saat load)
  function revealHero() {
    const reveals = document.querySelectorAll('.reveal-left, .reveal-right');
    reveals.forEach(el => {
      // Kita tambahkan sedikit delay agar terlihat berurutan
      setTimeout(() => {
        el.classList.add('visible');
      }, 300); // 300ms delay setelah halaman load
    });
  }

  // Panggil fungsi reveal saat halaman dimuat
  revealHero();

  // 2. Efek Parallax Mouse pada Card (Kolom Kanan)
  const visualCol = document.querySelector('.hero-visual-col');
  const visualContainer = document.querySelector('.visual-container');

  visualCol.addEventListener('mousemove', (e) => {
    // Ambil koordinat kursor mouse relatif terhadap kolom kanan
    const rect = visualCol.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Hitung persentase pergeseran mouse
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    // Geser container visual sedikit (maksimal 15px) mengikuti mouse
    const moveX = percentX * 15;
    const moveY = percentY * 15;

    visualContainer.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  // Reset posisi saat mouse meninggalkan kolom
  visualCol.addEventListener('mouseleave', () => {
    visualContainer.style.transform = `translate(0px, 0px)`;
    visualContainer.style.transition = `transform 0.5s ease`; // Tambah transisi halus saat reset
  });
});
const counters = document.querySelectorAll('.stat-number');

const runCounter = () => {
  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const speed = 200; // Semakin besar semakin lambat

      const inc = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(updateCount, 1);
      } else {
        counter.innerText = target + (target === 95 ? "%" : ""); 
      }
    };
    updateCount();
  });
};

// Menjalankan counter hanya saat elemen terlihat di layar
const observer = new IntersectionObserver((entries) => {
  if(entries[0].isIntersecting) {
    runCounter();
  }
}, { threshold: 0.5 });

observer.observe(document.querySelector('.stats-grid'));