# ADR-002: Зээлийн дүрмүүдийг shared domain function-д хадгалах

## Төлөв

Зөвшөөрсөн

## Нөхцөл байдал

Номын сангийн системд loan eligibility, available copies, return behavior, overdue status, filtering, dashboard count зэрэг дүрмүүд хэрэгтэй. Эдгээр дүрмийг шууд Express route эсвэл React component дотор байрлуулж болох боловч тэгвэл тестлэх, тайлбарлахад хэцүү болно.

## Шийдвэр

Гол бизнес дүрмүүдийг `partB/shared/libraryRules.js` дотор хадгална. Express route-ууд эдгээр функцийг дуудна, unit test-үүд шууд import хийж шалгана.

## Үр дагавар

Эерэг:

- Unit test ажиллуулахад database эсвэл web server шаардлагагүй.
- Үнэлгээний үед хамгийн чухал logic-ийг тайлбарлахад хялбар.
- Frontend, backend, tests шаардлагатай үед нэг rule definition-ийг хуваалцаж чадна.

Сөрөг:

- Shared module framework-independent хэвээр байх ёстой.
- Ирээдүйн database-level constraint-үүд эдгээр rule-тэй нийцтэй байх шаардлагатай.
