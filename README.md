# gokhanyaman.netlify.app — kendini test eden portföy

Statik site (`site/`), derleme adımı yok. Playwright testleri (`tests/`) siteyi masaüstü ve mobilde test eder;
GitHub Actions her push'ta ve her gün testleri koşup sonucu `site/test-status.json` olarak siteye yazar ve Netlify'a deploy eder.
Ana sayfadaki yeşil rozet bu dosyayı okur.

## Yerelde çalıştırma

```bash
npm install
npm start          # http://localhost:4173
npm run typecheck  # TypeScript tip kontrolü (strict)
npm test           # tüm testler (desktop + mobile)
npm run test:ui    # Playwright UI modu
```

## Test mimarisi

Playwright + TypeScript (strict), Page Object Model:

```
tests/
  fixtures.ts               # test.extend → her test hazır bir `portfolio` alır
  pages/PortfolioPage.ts    # sayfa nesnesi; bileşenleri birleştirir
  pages/components/         # Navigation, BugHunt, Terminal, Lab, ContactForm, StatusBadge
  data/status.ts            # test-status.json şeması + test verisi fabrikası
  *.spec.ts                 # home, i18n, bughunt, lab, quality
```

## İçerik düzenleme

Bütün metinler `site/i18n.js` içinde, Türkçe (`tr`) ve İngilizce (`en`) olarak. Bir dile anahtar eklersen diğerine de ekle —
`every rendered string exists in both languages` testi eksikleri yakalar.

## Bug avı

Sitede bilerek bırakılmış 5 bug var (`data-bug` niteliği): `align` (hero istatistiği), `typo` (Deneyim başlığı),
`date` (Birtech tarihi), `link` (PITON projesi), `flip` (Cucumber ikonu). Mantık `site/bughunt.js` içinde.

## Laboratuvar (`site/extras.js`, `site/lab.css`)

- **Terminal** — Ctrl+K veya ` tuşu. `help`, `whoami`, `cat skills.json`, `npm test` (gerçek test sonuçları), `sudo hire-gokhan`…
- **Locator modu** — öğenin Playwright locator'ını gösterir, tıklayınca kopyalar.
- **Siteyi kır** — sayfayı dağıtır, sahte CI paneli kırmızıdan yeşile dönerken site toparlanır.
- **Coverage ölçer** — ziyaretçi bölümleri gezdikçe üstteki çubuk %100'e dolar.

## Yayına alma (bir kerelik kurulum)

1. GitHub'da `portfolio` adında bir repo aç ve bu klasörü push et (repo adı farklıysa `site/i18n.js` içindeki `repo` adresini güncelle).
2. Netlify → mevcut site → **Site configuration → Site details** → *Site ID*'yi kopyala.
3. Netlify → **User settings → Applications → Personal access tokens** → yeni token oluştur.
4. GitHub repo → **Settings → Secrets and variables → Actions** → `NETLIFY_SITE_ID` ve `NETLIFY_AUTH_TOKEN` ekle.
5. **Actions** sekmesinden *Test & Deploy*'u bir kez elle çalıştır.

Netlify'da repoyu ayrıca "Import from Git" ile bağlama; deploy'u Actions yapıyor.
İletişim formu Netlify Forms ile çalışır: gelen mesajlar Netlify → **Forms** altında görünür, oradan e-posta bildirimi açılabilir.

## Ziyaretçi sayacı (GoatCounter — çerezsiz, ücretsiz)

1. https://www.goatcounter.com/signup adresinden hesap aç; kod olarak ör. `gokhanyaman` seç.
2. `site/i18n.js` içinde `goatcounter: 'gokhanyaman'` yaz ve yayına al.
3. Panelden sayfa görüntülemeleri ve olayları izle: `cv-download`, `cta-contact`, `contact-linkedin`,
   `contact-submit`, `lab-*`, `cert-*`, `bug-hunt-complete`.

Çerez kullanmadığı için çerez onay bandı gerekmez. Kod boşken dışarıya hiçbir istek gitmez (testle doğrulanıyor).

## Kendi alan adın (ör. gokhanyaman.dev)

1. Alan adını bir kayıt firmasından al (Netlify'dan da alınabilir).
2. Netlify → **Domain management → Add a domain** → alan adını ekle, DNS kayıtlarını gösterildiği gibi gir.
   HTTPS sertifikası otomatik gelir.
3. Şu adreslerdeki `https://gokhanyaman.netlify.app/` ifadesini yeni alan adıyla değiştir:
   `site/index.html` (canonical, og:url, og:image, JSON-LD) ve `site/i18n.js` (`url`).
4. Eski netlify.app adresi otomatik olarak yeni alan adına yönlenir.
