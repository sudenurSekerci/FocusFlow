# FocusFlow

Günlük görevlerinizi yönetebileceğiniz, önem ve aciliyete göre kategorize edebildiğiniz web uygulaması.

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Canlıya Alma (Deploy)

### Tek komutla Vercel üzerinden deploy

```bash
npm run deploy
```

İlk çalıştırmada Vercel hesabınıza giriş yapmanız ve projeyi bağlamanız istenir.

### GitHub ile otomatik deploy

1. Projeyi GitHub'a push edin
2. Repo ayarlarından **Settings → Pages** bölümüne gidin
3. **Build and deployment** altında **Source** olarak **GitHub Actions** seçin
4. `main` veya `master` branch'e her push'ta otomatik build alınır ve yayına çıkar

### Diğer platformlar

- **Netlify:** Projeyi bağlayın, `netlify.toml` otomatik kullanılır
- **GitHub Pages (manuel):** `npm run build` sonrası `dist` klasörünü yükleyin

## Proje Yapısı

```
focusflow/
├── src/
│   ├── components/    # UI bileşenleri
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API ve veri servisleri
│   ├── types/         # TypeScript tip tanımları
│   ├── utils/         # Yardımcı fonksiyonlar
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
└── index.html
```

## Görev Veri Yapısı

Her görev (`Task`) şu alanlara sahiptir:

- `id`: Benzersiz kimlik
- `title`: Görev başlığı
- `importance`: Önem seviyesi (`low` | `medium` | `high`)
- `urgency`: Aciliyet seviyesi (`low` | `medium` | `high`)
- `createdAt`: Oluşturulma zamanı (ISO 8601)
