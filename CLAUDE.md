# CLAUDE.md

## Төсөл

F.CSM311 Лаборатори 13-д зориулсан Mini Library Management System.

## Технологийн стек

- React + Tailwind CSS frontend
- Node.js Express REST API
- PostgreSQL өгөгдлийн сан
- Node.js-ийн built-in test runner

## Командууд

```bash
npm install
npm run dev:frontend
npm run dev:backend
npm test
npm run build
```

## Баримтлах зарчим

- Conventional Commits ашиглана: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`.
- Part A-г зөвхөн төлөвлөлтийн хэсэг байлгана; production код байрлуулахгүй.
- Дахин ашиглагдах бизнес дүрмүүдийг `partB/shared/` дотор хадгална.
- Өгөгдлийн санд бичихээс өмнө request body-г шалгана.
- Өгөгдлийн сангийн хандалтыг repository функцүүдийн ард нууж хадгална.
- Давхардсан state-ээс илүү жижиг React component болон derived state ашиглана.
- Зээлэх боломж, хугацаа хэтэрсэн төлөв, validation, хайлт/шүүлтийн behavior-д тест бичнэ.

## Хийж болохгүй зүйлс

- `.env` эсвэл өгөгдлийн сангийн credential commit хийхгүй.
- Хэрэглэгчийн input ашиглан raw SQL string залгахгүй.
- Implementation дууссаны дараа даалгаврын бичиг баримтуудыг устгахгүй.
- AI-аар үүсгэсэн ажлыг бүрэн гараар хийсэн мэт мэдүүлэхгүй.
- AI session log-уудыг алгасахгүй.

## AI workflow

Дараах урсгалыг ашиглана: spec -> generate -> review -> integrate. AI output-ыг package API hallucination, security issue, даалгаврын шаардлагатай нийцэл талаас нь заавал шалгана.
