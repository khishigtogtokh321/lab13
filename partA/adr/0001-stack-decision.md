# ADR-001: Stack сонголтын шийдвэр

## Төлөв

Зөвшөөрсөн

## Нөхцөл байдал

Даалгавар нь AI-assisted planning, implementation, testing, reflection бүхий жижиг төсөл шаарддаг. Сонгосон mini library topic нь хэрэглэгчийн interface, REST API, relational data, тестлэхэд хангалттай бизнес дүрэм шаарддаг.

## Шийдвэр

Frontend-д React + Tailwind CSS, REST API-д Node.js Express, өгөгдлийн санд PostgreSQL ашиглана.

## Харгалзсан өөр хувилбарууд

- React + NestJS + PostgreSQL: enterprise app-д илүү сайн бүтэцтэй боловч boilerplate их.
- React + Django REST Framework + PostgreSQL: backend нь төлөвшсөн боловч хоёр дахь хэл болон нэмэлт setup шаарддаг.

## Үр дагавар

Эерэг:

- Нэгдсэн JavaScript ecosystem
- Хурдан implementation
- OpenAPI ашиглан REST API documentation хийхэд хялбар
- PostgreSQL schema нь ном, гишүүн, зээлэлттэй байгалийн байдлаар тохирно

Сөрөг:

- Express structure-ийг convention-оор сахиулах шаардлагатай
- Validation, error handling, security check-үүдийг санаатайгаар хэрэгжүүлэх хэрэгтэй
