# Mini Library Management System

F.CSM311 Лаборатори 13-д зориулсан AI-assisted software construction төсөл.

Төсөл нь даалгаврын гурван үндсэн хэсэгт хуваагдсан:

- `partA/` - төлөвлөлтийн document-ууд, архитектур, stack шийдвэр, ADR, AI planning log
- `partB/` - implementation, test-үүд, OpenAPI spec, AI build log
- `partC/` - reflection, AI usage report, хоёр дахь ADR, self-evaluation

## Сонгосон topic

Номын inventory, гишүүний удирдлага, зээлэлт/буцаалтын workflow, хугацаа хэтэрсэн бүртгэл, search/filter dashboard бүхий mini library management system.

## Сонгосон stack

- Frontend: React + Tailwind CSS
- Backend: Node.js + Express REST API
- Database: PostgreSQL + Prisma ORM
- Testing: domain logic-д зориулсан Node.js built-in test runner

## Командууд

```bash
npm install
npm run dev:frontend
npm run dev:backend
npm test
npm run test:api-smoke
npm run build
```

## Орчны тохиргоо

Backend эсвэл Prisma command ажиллуулахаас өмнө `.env.example`-оос локал `.env` файл үүсгэнэ.

Бүтээгдэхүүний орчинд шаардлагатай хувьсагчид:

- `DATABASE_URL` - Prisma-д ашиглагдах PostgreSQL connection string.
- `JWT_SECRET` - admin/auth token sign хийх урт random secret.
- `ADMIN_EMAIL` - initial administrator email address.
- `ADMIN_PASSWORD` - initial administrator password; development-ээс гадуур хүчтэй secret ашиглана.
- `PORT` - backend API port, ихэвчлэн `4000`.

Development үед backend `PORT=4000` default утгатай боловч production startup бүх шаардлагатай variable байгаа эсэхийг шалгана.

## Бүтээгдэхүүний орчинд ажиллуулах

Энэ baseline нь Express API ажиллуулж, React frontend-ийг static asset болгон build хийнэ. Үүссэн frontend файлууд `dist/frontend` дотор бичигдэнэ. Тэдгээрийг static host эсвэл reverse proxy-оор serve хийнэ.

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
NODE_ENV=production node partB/backend/src/server.js
```

Windows PowerShell дээр:

```powershell
$env:NODE_ENV="production"
node partB/backend/src/server.js
```

## Docker

Docker Compose ашиглан full local stack ажиллуулах:

```bash
docker compose up --build
```

Энэ нь дараах container-уудыг үүсгэнэ:

- `mini-library` - React, Vite, Express болон project dependency-тэй Node.js app container
- `mini-library-postgres` - Prisma schema sync-ээр удирдагдах PostgreSQL container

Local URL-ууд:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:4000/api/health`
- Host-оос PostgreSQL: `localhost:5433`
- Prisma Studio: `http://localhost:5555`

App container дотор дараах internal database URL ашиглагдана:

```bash
postgres://postgres:postgres@db:5432/mini_library
```

Stack зогсоох:

```bash
docker compose down
```

PostgreSQL data volume reset хийж schema initialization дахин ажиллуулах:

```bash
docker compose down -v
docker compose up --build
```

Node package өөрчилсний дараа Vite/Rollup native dependency error гарвал app image-ийг cache-гүй rebuild хийнэ:

```bash
docker compose build --no-cache app
docker compose up
```

## Prisma

Prisma нь `prisma/schema.prisma` дотор тохируулагдсан бөгөөд ижил PostgreSQL database ашиглана.

Host дээрээс command ажиллуулах бол `.env` дотор:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5433/mini_library
```

Development үед schema-г шууд sync хийж database UI нээх:

```bash
npx prisma db push
npx prisma studio
```

Backend ажиллаж байх үед API smoke check ажиллуулах:

```bash
npm run test:api-smoke
```

Энэ script `API_BASE_URL` өгөгдвөл түүнийг, үгүй бол `http://localhost:4000` ашиглана. Login хийхдээ `ADMIN_EMAIL` / `ADMIN_PASSWORD` ашиглана.

`prisma db push`-ийг зөвхөн schema reset зөвшөөрөгдөх local development database дээр ашиглана.

Бүтээгдэхүүний орчинд migration-style flow ашиглана:

```bash
npx prisma migrate dev --name describe_schema_change
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: add production database constraints"
npx prisma migrate deploy
```

Бүтээгдэхүүний deployment үед `npx prisma db push` биш, `npx prisma migrate deploy` ажиллуулах ёстой. Үүссэн migration SQL-ийг commit хийхээс өмнө review хийж, database change хийхээс өмнө production data backup авна. Deployment хийх үед `DATABASE_URL` зөв production database руу зааж байгаа эсэхийг нягтална.

Docker дотроос Prisma Studio ажиллуулах:

```bash
npm run docker:studio
```

## Runbook

Энэ runbook нь local development болон demo operation-д зориулагдсан.

### Setup

1. Dependency суулгана:

```bash
npm install
```

2. `.env.example`-оос `.env` үүсгэнэ:

```bash
cp .env.example .env
```

Docker Compose-д default database `docker-compose.yml` дотор аль хэдийн тохируулагдсан. Docker database руу host-side Prisma command ажиллуулах бол:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5433/mini_library
JWT_SECRET=dev-only-mini-library-auth-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin12345
PORT=4000
```

3. Full stack ажиллуулна:

```bash
docker compose up --build
```

4. Нээх URL:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:4000/api/health`

### Seed

Тусдаа seed script байхгүй. `ADMIN_EMAIL` болон `ADMIN_PASSWORD` ашиглан анх амжилттай login хийхэд admin user автоматаар үүснэ.

API-гаар demo book, member, loan flow үүсгэхийн тулд backend ажиллаж байх үед smoke script ажиллуулна:

```bash
npm run test:api-smoke
```

Smoke script нь unique нэртэй book/member record үүсгээд create, extend, return, list, dashboard endpoint-уудыг шалгана.

### Login

Development үеийн default нэвтрэх мэдээлэл:

- Email: `admin@example.com`
- Password: `admin12345`

Эдгээрийг `.env` эсвэл `docker-compose.yml` дотор `ADMIN_EMAIL`, `ADMIN_PASSWORD`-оор өөрчилж болно. Хэрэв тухайн email-тэй admin row аль хэдийн байгаа бол database-д хадгалагдсан password hash ашиглагдана; `.env` өөрчлөх нь existing database row-г автоматаар шинэчлэхгүй.

### Prisma Studio

Docker дотроос:

```bash
npm run docker:studio
```

Дараа нь `http://localhost:5555` нээнэ.

Host machine-оос ажиллуулах бол `.env` нь `localhost:5433` руу зааж байгаа эсэхийг шалгаад:

```bash
npm run prisma:studio
```

### DB reset

Full local Docker reset хийх бол Postgres volume-ийг устгаад rebuild хийнэ:

```bash
docker compose down -v
docker compose up --build
```

Энэ нь бүх local data-г устгана. Schema нь app container startup command-аар дахин үүснэ.

Docker volume устгахгүйгээр schema sync хийх:

```bash
npm run prisma:push
```

`prisma db push`-ийг зөвхөн local development database дээр ашиглана.

### Backup

Docker Postgres container-оос compressed local backup үүсгэх:

```bash
docker compose exec -T db pg_dump -U postgres -d mini_library -Fc > mini_library.backup
```

Plain SQL backup үүсгэх:

```bash
docker compose exec -T db pg_dump -U postgres -d mini_library > mini_library.sql
```

Backup нь real data агуулж байвал repo-оос гадуур хадгалах эсвэл `.gitignore`-д нэмнэ.

### Restore

Custom-format backup restore хийх:

```bash
docker compose exec -T db pg_restore -U postgres -d mini_library --clean --if-exists < mini_library.backup
```

Plain SQL backup restore хийх:

```bash
docker compose exec -T db psql -U postgres -d mini_library < mini_library.sql
```

Active connection-оос болж restore амжилтгүй бол app container-ийг түр зогсооно:

```bash
docker compose stop app
docker compose exec -T db pg_restore -U postgres -d mini_library --clean --if-exists < mini_library.backup
docker compose start app
```

### Troubleshooting

- Login дээр `401 Unauthorized`: `ADMIN_EMAIL`, `ADMIN_PASSWORD` зөв эсэхийг шалгана. Admin old password-тойгоор аль хэдийн үүссэн бол DB reset хийх эсвэл Prisma Studio-оор row-г шинэчилнэ.
- Login хийсний дараа `401 Unauthorized`: browser-ийн `localhost` cookie-г цэвэрлээд дахин login хийнэ.
- `P2002` эсвэл duplicate error: book ISBN эсвэл member email аль хэдийн байна; unique утга ашиглана.
- API database-тэй холбогдохгүй бол `mini-library-postgres` healthy эсэх болон `DATABASE_URL` Docker дотор `db:5432`, host дээр `localhost:5433` ашиглаж байгаа эсэхийг шалгана.
- Prisma Studio нээгдэхгүй бол `npm run docker:studio` ажиллуулаад `http://localhost:5555` ашиглана; `5555` port өөр process ашиглаж байгаа эсэхийг шалгана.
- Vite/Rollup native dependency error гарвал app image-ийг cache-гүй rebuild хийнэ:

```bash
docker compose build --no-cache app
docker compose up
```

- Restricted shell дээр test эсвэл build `spawn EPERM` гэж унавал ижил command-ыг normal terminal session дээр дахин ажиллуулна.

## AI ашигласан тухай мэдэгдэл

AI туслалцааг planning, architecture бичих, code generation, test draft хийх, reflection draft хийхэд ашигласан. Бүх generated output-ыг submission-ээс өмнө review хийх ёстой.
