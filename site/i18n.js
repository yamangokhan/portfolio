/* Site içeriği — iki dil. Metin değiştirmek için sadece bu dosyayı düzenlemek yeterli. */
window.SITE = {
  email: 'yamangokhanyaman01@gmail.com',
  linkedin: 'https://www.linkedin.com/in/yamangokhan/',
  github: 'https://github.com/yamangokhan',
  /** GitHub reposu açılınca adresini yaz (ör. 'https://github.com/yamangokhan/portfolio'); boşken "Kaynak kodu" linkleri gizlenir. */
  repo: 'https://github.com/yamangokhan/portfolio',
  cv: 'Gokhan_Yaman_CV.pdf',
  /** GoatCounter kodu (ör. 'gokhanyaman' → gokhanyaman.goatcounter.com). Boşsa sayaç yüklenmez. */
  goatcounter: 'gokhanyaman',
  url: 'https://gokhanyaman.netlify.app/'
};

window.I18N = {
  tr: {
    meta: {
      title: 'Gökhan Yaman — Test Otomasyon Mühendisi',
      description: 'ISTQB sertifikalı Senior Software Test Automation Engineer. Selenium, Cucumber, REST Assured ve CI/CD ile bir haftalık regresyonu tek geceye indiren test altyapıları.'
    },
    skip: 'İçeriğe geç',
    navLabel: 'Ana menü',
    menu: 'Menü',
    langSwitch: 'Switch to English',
    nav: { approach: 'Yaklaşım', experience: 'Deneyim', projects: 'Projeler', skills: 'Yetenekler', certs: 'Sertifikalar', contact: 'İletişim' },
    hero: {
      kicker: 'Merhaba, ben',
      role: 'Senior Software Test Automation Engineer · ISTQB CTFL',
      summary: 'Web uygulamaları için UI, API ve E2E test otomasyonu kuruyorum. Bir haftalık manuel regresyonu tek geceye indiren altyapılar tasarlıyor, test stratejisini riske göre belirliyor ve suite’i flaky testlerden arındırıyorum.',
      open: 'Yeni fırsatlara açığım',
      rolesLabel: 'Roller',
      roles: ['Senior QA Automation', 'SDET', 'QA / Test Lead'],
      workLabel: 'Çalışma',
      work: ['Remote (TR & yurt dışı)', 'İstanbul / Eskişehir hibrit', 'Taşınmaya açık'],
      ctaContact: 'Benimle iletişime geç',
      ctaCv: 'CV’yi indir',
      terminalLabel: 'Gherkin senaryosu: Gökhan ile çalışmak'
    },
    stats: [
      { value: '4+', label: 'yıl test otomasyonu' },
      { value: '~84', label: 'ekran E2E kapsamında' },
      { value: '1 hafta → 1 gece', label: 'regresyon süresi' }
    ],
    gherkin: {
      lines: [
        { type: 'comment', text: '# language: tr' },
        { type: 'feature', kw: 'Özellik:', text: ' Gökhan ile çalışmak' },
        { type: 'scenario', kw: 'Senaryo:', text: ' Bir işe alımcı bu siteyi ziyaret eder' },
        { type: 'step', kw: 'Diyelim ki', text: ' kaliteli yazılım teslim etmek istiyorsun' },
        { type: 'step', kw: 'Ve', text: ' regresyon testlerin bir hafta sürüyor' },
        { type: 'step', kw: 'Eğer ki', text: ' test otomasyonunu Gökhan’a bırakırsan' },
        { type: 'step', kw: 'O zaman', text: ' regresyon tek gecede biter' },
        { type: 'step', kw: 'Ve', text: ' bug’lar production’a ulaşmaz' }
      ],
      summary: '1 senaryo (1 başarılı) · {n} adım ({n} başarılı)'
    },
    status: {
      loading: 'Test sonuçları yükleniyor…',
      pass: 'Bu site {passed}/{total} otomatik testten geçti',
      fail: '{failed}/{total} test başarısız — düzeltiyorum',
      ago: 'son koşu {time}',
      none: 'Bu site otomatik testlerle korunuyor',
      title: 'Playwright test raporunu aç'
    },
    approach: {
      title: 'Nasıl çalışırım',
      sub: 'Test yazmak işin kolay kısmı. Asıl iş neyi, neden test ettiğini bilmek.',
      items: [
        { icon: '◎', title: 'Risk odaklı strateji', text: 'Her şeyi otomatize etmem. Neyin otomatize edileceğine, neyin manuel kalacağına ve önceliklere riske bakarak karar veririm.' },
        { icon: '◇', title: 'Güvenilir suite', text: 'Güvenilmeyen bir kırmızı, hiç olmayan bir testten kötüdür. Flaky testleri takip edip ortadan kaldırırım; her kırmızı gerçek bir hatayı işaret eder.' },
        { icon: '↗', title: 'Sonuç herkese ulaşır', text: 'Gece koşuları Jenkins’te çalışır; sonuçlar e-posta, Slack ve Telegram ile paydaşlara gider, hatalar Jira’da açılır.' },
        { icon: '✦', title: 'AI destekli test', text: 'Claude Code ile senaryo ve test verisi üretimi, page object iskeleti ve hata triyajı yapıyorum. Her çıktıyı inceleyip framework standartlarına göre sağlamlaştırıyorum.' }
      ]
    },
    experience: {
      title: 'Deneyim',
      titleBug: 'Denyeim',
      sub: 'Kariyerim, bir test koşusu olarak.',
      command: '$ npx career test --reporter=list',
      summary: '{s} suite · {t} test · hepsi geçti',
      present: 'Günümüz',
      jobs: [
        {
          role: 'Senior Software Test Automation Engineer',
          company: 'Birtech Technology',
          place: 'Eskişehir',
          from: ['Kasım', '2024'],
          to: 'Günümüz',
          bugDate: true,
          cases: [
            'Şirketin UI test otomasyon altyapısını Selenium WebDriver, JUnit ve Page Object Pattern ile sıfırdan kurdum; kapsam büyüdükçe suite’i sürdürülebilir tuttum.',
            '~84 ekranlı Angular tabanlı web uygulamasının uçtan uca kapsamını üstlendim. Gece gözetimsiz koşan ~20 E2E senaryosuyla, eskiden bir hafta süren manuel regresyon artık tek gecede bitiyor.',
            'Jenkins’te gece koşularını kurdum; sonuçlar e-posta, Slack ve Telegram entegrasyonlarıyla paydaşlara otomatik ulaşıyor, hatalar Jira’da açılıyor.',
            'Jira/Xray ile test yönetimini kurdum: izlenebilir test case’ler, release test planları ve paydaşlar için test metrikleri.',
            'REST Assured ile API, JMeter ile performans testlerini ekledim. Proje bazında test stratejisini belirliyor, flaky testleri ortadan kaldırarak suite’i güvenilir tutuyorum.',
            'Claude Code ile AI destekli bir test süreci yürütüyorum: senaryo ve test verisi üretimi, page object iskeleti, hata triyajı — her çıktı benim incelememden geçiyor.'
          ]
        },
        {
          role: 'Software Test Automation Engineer',
          company: 'PITON Technology',
          place: 'Eskişehir',
          from: ['Mart', '2023'],
          to: 'Kasım 2024',
          cases: [
            'WebdriverIO ile BDD Mocha framework’ünde yeniden kullanılabilir bir otomasyon altyapısı kurdum; yeni servisler kurulumu baştan yapmadan UI testlerine dahil edilebildi, sonuçlar Allure ile raporlandı.',
            'Backend’i hazır olan tüm servisler için UI ve API test suite’leri yazdım; API case’lerini Swagger kontratlarından türetip günlük olarak çalıştırdım.',
            'YouTrack’te test yönetimini yürüttüm; smoke ve regresyon suite’leri Jenkins’ten koştu.'
          ]
        },
        {
          role: 'QA Test Automation Engineer',
          company: 'Hypnotes Inc.',
          place: 'California, ABD · Remote',
          from: ['Nisan', '2022'],
          to: 'Şubat 2023',
          cases: [
            'ABD merkezli ürün ekibi için BDD Cucumber/Gherkin framework’ünde regresyon senaryolarını otomatize ettim; farklı saat dilimlerinde İngilizce, asenkron çalıştım.',
            'Jira Xray ile test case’leri ve release test planlarını yönettim; API katmanını REST Assured, Postman ve Swagger UI ile, veritabanını SQL ile test ettim.'
          ]
        }
      ]
    },
    projects: {
      title: 'Projeler',
      sub: 'Problem → çözüm → sonuç.',
      labels: { problem: 'Problem', solution: 'Çözüm', result: 'Sonuç' },
      items: [
        {
          meta: 'Birtech Technology',
          title: 'Gece koşan E2E regresyon',
          problem: '~84 ekranlı Angular uygulamasının regresyonu manuel olarak bir hafta sürüyordu.',
          solution: 'Selenium + JUnit + Page Object Pattern ile sıfırdan altyapı. Jenkins’te gece koşusu; sonuçlar e-posta, Slack ve Telegram’a, hatalar Jira’ya.',
          result: '1 hafta → 1 gece',
          tags: ['Selenium', 'JUnit', 'Jenkins', 'Jira Xray', 'REST Assured', 'JMeter']
        },
        {
          meta: 'PITON Technology',
          title: 'Tak-çalıştır otomasyon altyapısı',
          problem: 'Her yeni servis için test kurulumunu baştan yapmak zaman kaybıydı.',
          solution: 'WebdriverIO + Mocha (BDD) boilerplate, Swagger kontratlarından türetilen API testleri, Allure raporları.',
          result: 'Yeni servis, kurulumsuz teste dahil',
          tags: ['WebdriverIO', 'Mocha', 'Swagger', 'Allure', 'YouTrack'],
          bugLink: { buggy: 'Canlı demo ↗', fixed: 'Kod şirkete ait — demo yok 🔒' }
        },
        {
          meta: 'Hypnotes Inc. · Remote',
          title: 'Uzak ekip için BDD regresyon',
          problem: 'ABD’deki ürün ekibi, farklı saat diliminden okunabilir test geri bildirimi istiyordu.',
          solution: 'Cucumber/Gherkin ile herkesin okuyabildiği senaryolar, Jira Xray ile release test planları.',
          result: 'Ekipçe okunabilir senaryolar',
          tags: ['Cucumber', 'Gherkin', 'REST Assured', 'Postman', 'SQL']
        },
        {
          meta: 'Kişisel proje · bu site',
          title: 'Kendini test eden portföy',
          problem: 'Bir test mühendisinin sitesi test edilmemiş olamaz.',
          solution: 'Playwright + TypeScript ile Page Object Model üzerine kurulu suite: masaüstü ve mobil, axe ile erişilebilirlik denetimi. GitHub Actions her push’ta ve her gün tip kontrolü + testleri koşturuyor, sonuç bu sayfada canlı.',
          result: '{passed} test · her gün',
          resultFallback: 'Her gün test ediliyor',
          tags: ['Playwright', 'TypeScript', 'Page Object Model', 'axe-core', 'GitHub Actions'],
          repo: true,
          repoLabel: 'Kaynak kodu ↗'
        }
      ]
    },
    skills: {
      title: 'Yetenekler',
      sub: 'Her gün kullandığım araçlar.',
      groups: [
        { title: 'Otomasyon', items: ['Selenium WebDriver', 'JUnit', 'TestNG', 'Appium', 'WebdriverIO', 'Cucumber (Gherkin)', 'Page Object Model', 'Data Driven', 'Playwright'] },
        { title: 'API & Performans', items: ['REST Assured', 'Postman', 'Swagger UI', 'JMeter'] },
        { title: 'Diller', items: ['Java (OOP)', 'JavaScript', 'TypeScript', 'SQL / MySQL (JDBC)', 'HTML', 'CSS'] },
        { title: 'CI/CD', items: ['Jenkins', 'Git & GitHub', 'GitHub Actions', 'Maven', 'AWS'] },
        { title: 'Süreç & Yönetim', items: ['Jira & Xray', 'YouTrack', 'Trello', 'Allure', 'Agile/Scrum', 'Kanban', 'SDLC & STLC'] },
        { title: 'AI', items: ['Claude Code ile AI destekli test'] }
      ]
    },
    certs: {
      title: 'Sertifikalar & Eğitim',
      sub: 'Hepsi geçti.',
      proof: 'Belgeyi gör ↗',
      items: [
        { name: 'ISTQB Certified Tester Foundation Level (CTFL)', org: 'ISTQB', year: '2022' },
        { name: 'Introduction to Playwright', org: 'Test Automation University · sertifika no 176f2472', year: '2026', proof: 'certs/tau-introduction-to-playwright.jpg' },
        { name: 'Yapay Zekâ ve Makine Öğrenmesi', org: 'YÖK Veri Analizi Okulu · Marmara Üniversitesi koordinasyonunda, ODTÜ, İTÜ ve Boğaziçi katkılarıyla', year: '2026', proof: 'certs/yok-yapay-zeka-makine-ogrenmesi.pdf' },
        { name: 'API Testing With RestAssured', org: 'Test Automation University', year: '' },
        { name: 'Cucumber With Java', org: 'Test Automation University', year: '' },
        { name: 'JUnit 5', org: 'Test Automation University', year: '' }
      ],
      eduTitle: 'Eğitim',
      edu: [
        { name: 'İşletme (Lisans)', org: 'Anadolu Üniversitesi' },
        { name: 'Sağlık Yönetimi (Ön Lisans)', org: 'Anadolu Üniversitesi' }
      ],
      langTitle: 'Diller',
      langs: [
        { name: 'Türkçe', org: 'Ana dil' },
        { name: 'İngilizce', org: 'Profesyonel çalışma düzeyi' }
      ]
    },
    contact: {
      title: 'Birlikte çalışalım',
      sub: 'Sıfırdan bir test altyapısı kurmak, mevcut suite’i güvenilir hale getirmek ya da sadece tanışmak için yaz.',
      name: 'Adın',
      email: 'E-posta adresin',
      message: 'Mesajın',
      send: 'Gönder',
      links: { email: 'E-posta', linkedin: 'LinkedIn', github: 'GitHub', cv: 'CV (PDF)' }
    },
    footer: {
      tested: 'Bu site {n} otomatik testle korunuyor.',
      testedFallback: 'Bu site otomatik testlerle korunuyor.',
      source: 'Kaynak kodu'
    },
    lab: {
      title: '🧪 Oyna:',
      hunt: 'Bug avı',
      terminal: 'Terminal',
      inspect: 'Locator modu',
      chaos: 'Siteyi kır',
      inspectOn: 'Locator modu açık: bir öğeye tıkla, Playwright locator’ı kopyalansın. Çıkmak için Esc.',
      inspectOff: 'Locator modu kapandı.',
      copied: 'Kopyalandı: {loc}',
      coverageLabel: 'Sayfa coverage’ı',
      coverageDone: 'Coverage %100 — sayfanın tamamını gezdin ✓',
      ci: {
        running: 'Deploy sonrası regresyon koşuyor…',
        failed: '{n} test başarısız',
        healing: 'Self-healing: düzeltmeler uygulanıyor…',
        done: '{n} test geçti — site eski haline döndü',
        checks: ['hero › istatistikler hizalı', 'başlıklar › metin okunabilir', 'kartlar › gridin içinde', 'yetenekler › çipler yerinde', 'butonlar › tıklanabilir', 'a11y › kontrast yeterli']
      },
      term: {
        label: 'Terminal',
        placeholder: 'komut yaz — help',
        welcome: 'Hoş geldin! Komutları görmek için help yaz. Kapatmak için Esc ya da exit.',
        notFound: 'komut bulunamadı: {cmd} — help yaz',
        noFile: 'cat: {f}: böyle bir dosya yok',
        binary: 'cat: cv.pdf: ikili dosya — indirmek için cv yaz',
        help: [
          ['whoami', 'ben kimim'],
          ['ls', 'dosyaları listele'],
          ['cat <dosya>', 'dosya oku (ör. cat skills.json)'],
          ['experience', 'deneyim'],
          ['projects', 'projeler'],
          ['contact', 'iletişim'],
          ['cv', 'CV’yi indir'],
          ['npm test', 'bu sitenin gerçek test sonuçları'],
          ['bugs [start]', 'bug avı durumu / başlat'],
          ['lang tr|en', 'dili değiştir'],
          ['chaos', 'siteyi kır'],
          ['inspect', 'locator modunu aç'],
          ['sudo hire-gokhan', '😉'],
          ['clear', 'ekranı temizle'],
          ['exit', 'kapat']
        ],
        bugs: 'Bulunan bug: {n}/5 — sol alttaki 🐞 butonundan ipucu alabilirsin.',
        bugsIdle: 'Bug avı kapalı. Başlatmak için: bugs start',
        noTests: 'Test sonuçları henüz yok. GitHub Actions ilk koşuyu yapınca burada görünecek.',
        testsSummary: '{passed} passed, {failed} failed ({time}s) — son koşu {ago}',
        langDone: 'Dil değiştirildi.',
        cvDone: 'CV indiriliyor…',
        sudo: ['[sudo] gokhan için parola: ********', 'Yetki verildi ✓', 'E-posta taslağı açılıyor…'],
        sudoSubject: 'Merhaba Gökhan, birlikte çalışalım'
      }
    },
    bh: {
      pill: 'Bug avı',
      title: '🐞 Bug avı',
      desc: 'Sitede 5 bug ortaya çıktı. Bulduğun bug’a tıkla.',
      descIdle: 'Bu sitede 5 bug sakladım. Avı başlatınca ortaya çıkarlar; bulduğun bug’a tıklarsın.',
      start: 'Avı başlat',
      stop: 'Avı bitir',
      started: '🐞 Av başladı! Sayfada 5 bug ortaya çıktı.',
      unknown: '???',
      hint: 'İpucu',
      found: 'Bug #{n} bulundu: {name} ({count}/5)',
      allFound: 'Hepsini buldun!',
      bugs: {
        typo: { name: 'Yazım hatası', hint: 'Bölüm başlıklarından biri imla kontrolünden geçmemiş.' },
        flip: { name: 'Ters dönmüş ikon', hint: 'Yeteneklerin arasında bir sebze baş aşağı duruyor.' },
        date: { name: 'Hatalı tarih', hint: 'Deneyimdeki tarihlerden birinde rakam olmayan bir karakter var.' },
        link: { name: 'Kırık link', hint: 'Projelerden birinde hiçbir yere gitmeyen bir link var.' },
        align: { name: 'Hizalama hatası', hint: 'En üstteki sayılardan biri hizasından kaymış.' }
      },
      doneTitle: '🏆 Bug Avcısı',
      doneText: '5 bug’ın hepsini {time} içinde buldun. Ben de projelerde hataları böyle, production’a ulaşmadan yakalıyorum.',
      share: 'LinkedIn’de paylaş',
      write: 'Gökhan’a yaz',
      close: 'Kapat',
      mailSubject: 'Bug avını tamamladım 🐞'
    }
  },

  en: {
    meta: {
      title: 'Gökhan Yaman — Test Automation Engineer',
      description: 'ISTQB-certified Senior Software Test Automation Engineer. Selenium, Cucumber, REST Assured and CI/CD test infrastructure that turns a week of regression into a single night.'
    },
    skip: 'Skip to content',
    navLabel: 'Main menu',
    menu: 'Menu',
    langSwitch: 'Türkçeye geç',
    nav: { approach: 'Approach', experience: 'Experience', projects: 'Projects', skills: 'Skills', certs: 'Certificates', contact: 'Contact' },
    hero: {
      kicker: 'Hi, I’m',
      role: 'Senior Software Test Automation Engineer · ISTQB CTFL',
      summary: 'I build UI, API and E2E test automation for web applications. I design infrastructure that turns a week of manual regression into a single night, drive test strategy by risk, and keep suites free of flaky tests.',
      open: 'Open to new opportunities',
      rolesLabel: 'Roles',
      roles: ['Senior QA Automation', 'SDET', 'QA / Test Lead'],
      workLabel: 'Work',
      work: ['Remote (Turkey & international)', 'Istanbul / Eskişehir hybrid', 'Open to relocation'],
      ctaContact: 'Get in touch',
      ctaCv: 'Download CV',
      terminalLabel: 'Gherkin scenario: working with Gökhan'
    },
    stats: [
      { value: '4+', label: 'years of test automation' },
      { value: '~84', label: 'screens under E2E coverage' },
      { value: '1 week → 1 night', label: 'regression time' }
    ],
    gherkin: {
      lines: [
        { type: 'comment', text: '# language: en' },
        { type: 'feature', kw: 'Feature:', text: ' Working with Gökhan' },
        { type: 'scenario', kw: 'Scenario:', text: ' A recruiter visits this site' },
        { type: 'step', kw: 'Given', text: ' you want to ship quality software' },
        { type: 'step', kw: 'And', text: ' your regression takes a full week' },
        { type: 'step', kw: 'When', text: ' you hand test automation to Gökhan' },
        { type: 'step', kw: 'Then', text: ' regression finishes overnight' },
        { type: 'step', kw: 'And', text: ' bugs never reach production' }
      ],
      summary: '1 scenario (1 passed) · {n} steps ({n} passed)'
    },
    status: {
      loading: 'Loading test results…',
      pass: 'This site passed {passed}/{total} automated tests',
      fail: '{failed}/{total} tests failing — on it',
      ago: 'last run {time}',
      none: 'This site is guarded by automated tests',
      title: 'Open the Playwright test report'
    },
    approach: {
      title: 'How I work',
      sub: 'Writing tests is the easy part. The real work is knowing what to test, and why.',
      items: [
        { icon: '◎', title: 'Risk-driven strategy', text: 'I don’t automate everything. Risk decides what gets automated, what stays manual and what comes first.' },
        { icon: '◇', title: 'A suite you can trust', text: 'A red you can’t trust is worse than no test at all. I track down and eliminate flaky tests so every red points to a real bug.' },
        { icon: '↗', title: 'Results reach everyone', text: 'Nightly runs on Jenkins; results go to stakeholders via email, Slack and Telegram, and defects land in Jira.' },
        { icon: '✦', title: 'AI-assisted testing', text: 'I use Claude Code for scenario and test data generation, page object scaffolding and failure triage — reviewing every output and hardening it to the framework’s standards.' }
      ]
    },
    experience: {
      title: 'Experience',
      titleBug: 'Experiecne',
      sub: 'My career, as a test run.',
      command: '$ npx career test --reporter=list',
      summary: '{s} suites · {t} tests · all passed',
      present: 'Present',
      jobs: [
        {
          role: 'Senior Software Test Automation Engineer',
          company: 'Birtech Technology',
          place: 'Eskişehir, Turkey',
          from: ['Nov', '2024'],
          to: 'Present',
          bugDate: true,
          cases: [
            'Built the company’s UI test automation infrastructure from the ground up with Selenium WebDriver, JUnit and the Page Object Pattern, keeping it maintainable as coverage grew.',
            'Own end-to-end coverage of an Angular web app spanning ~84 screens. ~20 E2E scenarios run unattended overnight — regression that took a week of manual testing now closes in a single night.',
            'Set up nightly runs on Jenkins with results delivered automatically via email, Slack and Telegram, and defects opened in Jira.',
            'Established test management with Jira/Xray: traceable test cases, release test plans and test metrics for stakeholders.',
            'Added API testing with REST Assured and performance testing with JMeter; define test strategy per project and keep the suite trustworthy by eliminating flaky tests.',
            'Run an AI-assisted test process with Claude Code: scenario and test data generation, page object scaffolding, failure triage — every output reviewed by me.'
          ]
        },
        {
          role: 'Software Test Automation Engineer',
          company: 'PITON Technology',
          place: 'Eskişehir, Turkey',
          from: ['Mar', '2023'],
          to: 'Nov 2024',
          cases: [
            'Set up a reusable automation boilerplate in a BDD Mocha framework with WebdriverIO, so new services could be onboarded into UI testing without rebuilding the setup; results reported through Allure.',
            'Wrote UI and API suites for every service whose backend was ready, with API cases derived from Swagger contracts and run on a daily schedule.',
            'Ran test management in YouTrack; smoke and regression suites executed from Jenkins.'
          ]
        },
        {
          role: 'QA Test Automation Engineer',
          company: 'Hypnotes Inc.',
          place: 'California, US · Remote',
          from: ['Apr', '2022'],
          to: 'Feb 2023',
          cases: [
            'Automated regression scenarios in a BDD Cucumber/Gherkin framework for a US-based product team, collaborating asynchronously in English across time zones.',
            'Managed test cases and release test plans with Jira Xray; tested the API layer with REST Assured, Postman and Swagger UI, plus SQL checks against the database.'
          ]
        }
      ]
    },
    projects: {
      title: 'Projects',
      sub: 'Problem → solution → result.',
      labels: { problem: 'Problem', solution: 'Solution', result: 'Result' },
      items: [
        {
          meta: 'Birtech Technology',
          title: 'Overnight E2E regression',
          problem: 'Regression of an Angular app with ~84 screens took a week of manual testing.',
          solution: 'Selenium + JUnit + Page Object Pattern built from scratch. Nightly Jenkins runs; results to email, Slack and Telegram, defects to Jira.',
          result: '1 week → 1 night',
          tags: ['Selenium', 'JUnit', 'Jenkins', 'Jira Xray', 'REST Assured', 'JMeter']
        },
        {
          meta: 'PITON Technology',
          title: 'Plug-and-play automation boilerplate',
          problem: 'Rebuilding the test setup for every new service wasted time.',
          solution: 'WebdriverIO + Mocha (BDD) boilerplate, API tests derived from Swagger contracts, Allure reports.',
          result: 'New services onboarded with zero setup',
          tags: ['WebdriverIO', 'Mocha', 'Swagger', 'Allure', 'YouTrack'],
          bugLink: { buggy: 'Live demo ↗', fixed: 'Company code — no demo 🔒' }
        },
        {
          meta: 'Hypnotes Inc. · Remote',
          title: 'BDD regression for a remote team',
          problem: 'A US product team needed readable test feedback from a different time zone.',
          solution: 'Cucumber/Gherkin scenarios anyone can read, release test plans in Jira Xray.',
          result: 'Scenarios the whole team reads',
          tags: ['Cucumber', 'Gherkin', 'REST Assured', 'Postman', 'SQL']
        },
        {
          meta: 'Side project · this site',
          title: 'A portfolio that tests itself',
          problem: 'A test engineer’s website can’t be untested.',
          solution: 'A Playwright + TypeScript suite built on the Page Object Model: desktop and mobile, accessibility audits with axe. GitHub Actions type-checks and runs it on every push and every day; the result is live on this page.',
          result: '{passed} tests · daily',
          resultFallback: 'Tested every day',
          tags: ['Playwright', 'TypeScript', 'Page Object Model', 'axe-core', 'GitHub Actions'],
          repo: true,
          repoLabel: 'Source code ↗'
        }
      ]
    },
    skills: {
      title: 'Skills',
      sub: 'The tools I use every day.',
      groups: [
        { title: 'Automation', items: ['Selenium WebDriver', 'JUnit', 'TestNG', 'Appium', 'WebdriverIO', 'Cucumber (Gherkin)', 'Page Object Model', 'Data Driven', 'Playwright'] },
        { title: 'API & Performance', items: ['REST Assured', 'Postman', 'Swagger UI', 'JMeter'] },
        { title: 'Languages', items: ['Java (OOP)', 'JavaScript', 'TypeScript', 'SQL / MySQL (JDBC)', 'HTML', 'CSS'] },
        { title: 'CI/CD', items: ['Jenkins', 'Git & GitHub', 'GitHub Actions', 'Maven', 'AWS'] },
        { title: 'Process & Management', items: ['Jira & Xray', 'YouTrack', 'Trello', 'Allure', 'Agile/Scrum', 'Kanban', 'SDLC & STLC'] },
        { title: 'AI', items: ['AI-assisted testing with Claude Code'] }
      ]
    },
    certs: {
      title: 'Certificates & Education',
      sub: 'All passed.',
      proof: 'View certificate ↗',
      items: [
        { name: 'ISTQB Certified Tester Foundation Level (CTFL)', org: 'ISTQB', year: '2022' },
        { name: 'Introduction to Playwright', org: 'Test Automation University · certificate ID 176f2472', year: '2026', proof: 'certs/tau-introduction-to-playwright.jpg' },
        { name: 'Artificial Intelligence and Machine Learning', org: 'CoHE (YÖK) Data Analysis School · coordinated by Marmara University with METU, ITU and Boğaziçi University', year: '2026', proof: 'certs/yok-yapay-zeka-makine-ogrenmesi.pdf' },
        { name: 'API Testing With RestAssured', org: 'Test Automation University', year: '' },
        { name: 'Cucumber With Java', org: 'Test Automation University', year: '' },
        { name: 'JUnit 5', org: 'Test Automation University', year: '' }
      ],
      eduTitle: 'Education',
      edu: [
        { name: 'B.A. Business Administration', org: 'Anadolu University' },
        { name: 'A.A. Healthcare Management', org: 'Anadolu University' }
      ],
      langTitle: 'Languages',
      langs: [
        { name: 'Turkish', org: 'Native' },
        { name: 'English', org: 'Professional working proficiency' }
      ]
    },
    contact: {
      title: 'Let’s work together',
      sub: 'Building test infrastructure from scratch, making an existing suite trustworthy, or just saying hi — drop me a line.',
      name: 'Your name',
      email: 'Your email',
      message: 'Your message',
      send: 'Send',
      links: { email: 'Email', linkedin: 'LinkedIn', github: 'GitHub', cv: 'CV (PDF)' }
    },
    footer: {
      tested: 'This site is guarded by {n} automated tests.',
      testedFallback: 'This site is guarded by automated tests.',
      source: 'Source code'
    },
    lab: {
      title: '🧪 Play:',
      hunt: 'Bug hunt',
      terminal: 'Terminal',
      inspect: 'Locator mode',
      chaos: 'Break the site',
      inspectOn: 'Locator mode on: click any element to copy its Playwright locator. Press Esc to exit.',
      inspectOff: 'Locator mode off.',
      copied: 'Copied: {loc}',
      coverageLabel: 'Page coverage',
      coverageDone: 'Coverage 100% — you explored the whole page ✓',
      ci: {
        running: 'Running post-deploy regression…',
        failed: '{n} tests failed',
        healing: 'Self-healing: applying fixes…',
        done: '{n} tests passed — site restored',
        checks: ['hero › stats are aligned', 'headings › text is readable', 'cards › stay inside the grid', 'skills › chips in place', 'buttons › are clickable', 'a11y › contrast is sufficient']
      },
      term: {
        label: 'Terminal',
        placeholder: 'type a command — help',
        welcome: 'Welcome! Type help to see the commands. Esc or exit to close.',
        notFound: 'command not found: {cmd} — try help',
        noFile: 'cat: {f}: no such file',
        binary: 'cat: cv.pdf: binary file — type cv to download it',
        help: [
          ['whoami', 'who am I'],
          ['ls', 'list files'],
          ['cat <file>', 'read a file (e.g. cat skills.json)'],
          ['experience', 'experience'],
          ['projects', 'projects'],
          ['contact', 'contact'],
          ['cv', 'download my CV'],
          ['npm test', 'this site’s real test results'],
          ['bugs [start]', 'bug hunt progress / start'],
          ['lang tr|en', 'switch language'],
          ['chaos', 'break the site'],
          ['inspect', 'turn on locator mode'],
          ['sudo hire-gokhan', '😉'],
          ['clear', 'clear the screen'],
          ['exit', 'close']
        ],
        bugs: 'Bugs found: {n}/5 — the 🐞 button at the bottom left gives hints.',
        bugsIdle: 'The bug hunt is off. To start it: bugs start',
        noTests: 'No test results yet. They’ll appear here after the first GitHub Actions run.',
        testsSummary: '{passed} passed, {failed} failed ({time}s) — last run {ago}',
        langDone: 'Language switched.',
        cvDone: 'Downloading CV…',
        sudo: ['[sudo] password for gokhan: ********', 'Permission granted ✓', 'Opening an email draft…'],
        sudoSubject: 'Hi Gökhan, let’s work together'
      }
    },
    bh: {
      pill: 'Bug hunt',
      title: '🐞 Bug hunt',
      desc: '5 bugs have appeared on the page. Click a bug when you spot it.',
      descIdle: 'I hid 5 bugs on this site. Start the hunt to make them appear, then click each one you spot.',
      start: 'Start the hunt',
      stop: 'End the hunt',
      started: '🐞 The hunt is on! 5 bugs just appeared on the page.',
      unknown: '???',
      hint: 'Hint',
      found: 'Bug #{n} found: {name} ({count}/5)',
      allFound: 'You found them all!',
      bugs: {
        typo: { name: 'Typo', hint: 'One of the section headings skipped spell-check.' },
        flip: { name: 'Upside-down icon', hint: 'A vegetable is standing on its head among the skills.' },
        date: { name: 'Bad date', hint: 'One of the dates in the experience section contains a character that isn’t a digit.' },
        link: { name: 'Broken link', hint: 'One of the projects has a link that goes nowhere.' },
        align: { name: 'Misalignment', hint: 'One of the numbers at the top slipped out of line.' }
      },
      doneTitle: '🏆 Bug Hunter',
      doneText: 'You found all 5 bugs in {time}. That’s how I catch them in real projects — before they reach production.',
      share: 'Share on LinkedIn',
      write: 'Write to Gökhan',
      close: 'Close',
      mailSubject: 'I finished the bug hunt 🐞'
    }
  }
};
