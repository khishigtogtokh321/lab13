# Part B Implementation

## Боломжууд

- Номын inventory жагсаалт, хайлт, ангиллын шүүлт
- Гишүүний data model болон API endpoint-ууд
- Зээлэлт үүсгэх болон буцаах workflow
- Хугацаа хэтэрсэн зээлэлтийн төлөв хянах
- Dashboard summary metric-үүд
- JWT-г httpOnly cookie-д хадгалдаг admin authentication API
- Prisma ORM schema болон Prisma Studio database UI

## Бүтэц

- `src/frontend/` - React + Tailwind UI
- `src/backend/` - Express API болон PostgreSQL schema
- `../prisma/schema.prisma` - backend-д ашиглагдах Prisma database model
- `src/shared/` - тестлэх боломжтой domain logic
- `tests/` - Node.js unit test-үүд
- `openapi.yaml` - REST API specification
- `ai-sessions/` - AI build session-үүдийн хураангуй

## Командууд

```bash
npm install
npm run dev:frontend
npm run dev:backend
npm test
npm run test:api-smoke
npx prisma studio
```

## Орчны тохиргоо

Backend-д зориулж локал `.env` үүсгэнэ:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/mini_library
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin12345
PORT=4000
```

Authentication endpoint-ууд:

- `POST /api/auth/login` request body: `{ "email": "admin@example.com", "password": "admin12345" }`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Development үед `ADMIN_EMAIL` болон `ADMIN_PASSWORD` ашиглан анх амжилттай login хийхэд backend нь bcrypt password hash-тэй admin row үүсгэнэ.

API smoke check:

```bash
npm run test:api-smoke
```

Backend ажиллаж байх үед ажиллуулна. Энэ нь health, auth login/me/logout, book/member creation, loan creation, loan extension, loan return, loan list, dashboard summary-г шалгана.
