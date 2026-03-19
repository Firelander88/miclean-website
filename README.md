# MI CLEAN GROUP MMC — Website & Backend

5 ulduzlu otel sektoru üçün kimyəvi məhsul kataloqu və sifariş platforması.

## Quraşdırma

### Tələblər
- Node.js v18+
- npm v9+

### 1. Asılılıqları yükləyin
```bash
npm install
```

### 2. Mühit dəyişənlərini qurun
```bash
cp .env.example .env
# .env faylını redaktə edin
```

### 3. Serveri işə salın
```bash
# Development
npm run dev

# Production
npm start
```

Server `http://localhost:3000` ünvanında işləyir.

---

## API Endpointlər

### Məhsullar
| Method | URL | Açıqlama |
|--------|-----|----------|
| `GET` | `/api/products` | Bütün məhsullar (filter: `?category=kimyevi&search=dezenfektan`) |
| `GET` | `/api/products/categories` | Kateqoriya siyahısı |
| `GET` | `/api/products/services` | Xidmətlər siyahısı |
| `GET` | `/api/products/:id` | Tək məhsul |

### Əlaqə
| Method | URL | Açıqlama |
|--------|-----|----------|
| `POST` | `/api/contact` | Əlaqə formu göndər |
| `POST` | `/api/quotes` | Qiymət sorğusu göndər |
| `GET` | `/api/quotes` | Sorğuları gör (admin key lazım) |

### Sistem
| Method | URL | Açıqlama |
|--------|-----|----------|
| `GET` | `/api/health` | Server statusu |

---

## Deployment

### Render.com (tövsiyə olunur — pulsuz)
1. GitHub repo yaradın və kodu push edin
2. render.com-da "New Web Service" yaradın
3. Environment variables əlavə edin
4. Deploy edin — avtomatik HTTPS

### Railway
```bash
railway login
railway init
railway up
```

### VPS (Ubuntu)
```bash
# PM2 install
npm install -g pm2
pm2 start server.js --name miclean
pm2 startup
pm2 save

# Nginx reverse proxy
server {
    listen 80;
    server_name micleangroup.az;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

---

## Email Bildirişlər (.env)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password   # Gmail App Password
CONTACT_EMAIL=info@micleangroup.az
```

**Gmail App Password**: Google Account → Security → 2FA → App Passwords

---

## Sorğular harada saxlanılır?
- `data/messages.json` — əlaqə formu mesajları
- `data/quotes.json` — qiymət sorğuları

Production-da MongoDB/PostgreSQL ilə əvəzləyin.
