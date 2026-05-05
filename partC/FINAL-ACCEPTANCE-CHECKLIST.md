# Эцсийн acceptance checklist

Энэ checklist нь submission хийхээс өмнө AI Usage Report болон reflection artifact-ууд шаардлага хангаж байгаа эсэхийг шалгахад зориулагдсан.

## AI Usage Report шаардлага

- [x] `partC/AI-USAGE-REPORT.md` файл байгаа.
- [x] Тайлан Монгол хэлээр бичигдсэн.
- [x] Тайлан 1500-аас дээш үгтэй байхаар өргөтгөсөн.
- [x] 1-р асуулт буюу “Юуг AI хийсэн, юуг өөрөө хийсэн?” хэсэг нь planning, Part A document, Part B implementation, Part C reflection тус бүрийн жишээтэй.
- [x] 2-р асуулт буюу hallucination хэсэг нь 2-оос дээш жишээтэй: Git/repository assumption, package/tooling assumption, file naming, return endpoint edge case.
- [x] Hallucination бүр дээр яаж илрүүлж, яаж зассан тухай тайлбарласан.
- [x] 3-р асуулт буюу security/license хэсэг нь secret leakage, SQL injection, auth cookie, package license concern-ийг дурдсан.
- [x] AI-аас гарсан эсвэл AI-аар draft хийсэн кодод ямар security risk байж болохыг тодорхой тайлбарласан.
- [x] 4-р асуулт буюу AI-аар хурдан болсон зүйлс хэсэг нь documentation, boilerplate, testing, API smoke script-ийн production benefit-ийг тайлбарласан.
- [x] 5-р асуулт буюу AI-аар удаан болсон зүйлс хэсэг нь environment verification, scope creep, documentation consistency, encoding/review зэрэг бэрхшээлийг тайлбарласан.
- [x] 6-р асуулт буюу skill atrophy хэсэг нь AI-д хэт найдах эрсдэлийг хэрхэн бууруулсан, “AI байхгүй” цаг ямар байдлаар гаргасан тухай тайлбарласан.

## Төслийн artifact шалгалт

- [x] Part A төлөвлөлтийн document-ууд байгаа: project brief, architecture, stack comparison, ADR, AI planning log.
- [x] Part B implementation document, OpenAPI spec, test suite, AI session log-ууд байгаа.
- [x] Part C reflection document-ууд байгаа: AI Usage Report, Self Evaluation, ADR-002, Final Acceptance Checklist.
- [x] README runbook нь setup, seed, login, Prisma Studio, reset DB, backup/restore, troubleshooting хэсгүүдтэй.
- [x] Project-ийн өөрийн markdown файлууд Монгол хэл рүү хөрвүүлэгдсэн.

## Verification checklist

- [x] Unit test suite өргөтгөсөн: auth rules, validation, loan transaction, dashboard summary.
- [x] API smoke test script нэмсэн: `npm run test:api-smoke`.
- [x] Loan flow-д зээлэх хугацаа болон сунгах боломж нэмсэн.
- [x] Return endpoint-ийн body байхгүй үед гарч байсан 500 error зассан.
- [x] README болон Part B README-д smoke test болон operational command-ууд тусгагдсан.

## Submission өмнөх гар ажиллагаатай шалгалт

- [ ] `npm test` ажиллуулж бүх test pass эсэхийг шалгах.
- [ ] `npm run build` ажиллуулж frontend build pass эсэхийг шалгах.
- [ ] Backend болон database ажиллаж байх үед `npm run test:api-smoke` ажиллуулж API smoke flow pass эсэхийг шалгах.
- [ ] `.env` commit-д ороогүй эсэхийг `git status --short`-оор шалгах.
- [ ] Final PDF эсвэл repository submission хийхээс өмнө README command-уудыг дахин уншиж шалгах.
