# AI ашиглалтын тайлан

## 1. AI юу хийсэн, би юу хийсэн

Энэ төсөлд AI-г төлөвлөлт, draft бичих, review хийх туслах болгон ашигласан. AI-ийн эхний том хувь нэмэр нь Mini Library Management System-ийн бодитой scope сонгоход тусалсан явдал. Даалгаварт Mini Library нь албан ёсны topic-ийн нэг байсан боловч би React, Tailwind CSS, REST API, PostgreSQL ашигласан арай advanced full-stack төсөл хийхийг хүссэн. AI энэ зорилгыг номын inventory, гишүүний удирдлага, зээлэлт/буцаалт, хугацаа хэтэрсэн бүртгэл, search/filter, dashboard summary гэсэн хязгаарлагдсан систем болгон буулгахад тусалсан. Ингэснээр stack-д хэт жижиг эсвэл даалгаврын хугацаанд хэт том төсөл болохоос сэргийлсэн.

AI мөн React + Express + PostgreSQL, React + NestJS + PostgreSQL, React + Django REST Framework + PostgreSQL гэсэн гурван technology stack-ийг харьцуулахад тусалсан. Энэ харьцуулалтыг шууд сохроор хүлээж аваагүй. Би даалгаврын шаардлага болон эцсийн кодыг өөрөө тайлбарлаж чадах эсэхтэй харьцуулж шалгасан. Сонгосон stack нь React + Tailwind CSS + Express + PostgreSQL. Учир нь энэ нь бодит full-stack архитектур өгч, төслийг дуусгах хэмжээнд жижиг байлгана. NestJS нь enterprise түвшний харагдах боловч жижиг системд хэрэггүй boilerplate болон decorator нэмнэ. Django REST Framework хүчтэй боловч төслийг хоёр хэлтэй болгож, тайлбарлахад удаашруулна.

AI Part A төлөвлөлтийн document-уудын эхний draft-уудыг үүсгэсэн: project brief, architecture, stack comparison, ADR-001, AI planning session summary. Миний үүрэг нь topic-ийг сонгох, Express backend сонголтыг батлах, scope-ийг хязгаарлах, шаардлагатай бүх assignment file байгаа эсэхийг шалгах байсан. Мөн Part A production code агуулаагүй, architecture нь төлөвлөсөн implementation-тэй нийцэж байгаа эсэхийг шалгасан.

Part B үед AI initial project structure, React dashboard, Express API route-ууд, PostgreSQL schema, OpenAPI document, slash command-ууд, AI session log, test-үүд үүсгэхэд тусалсан. Би бүтэц нь тайлбарлахад ойлгомжтой эсэх дээр төвлөрч review хийсэн. Нэг чухал шийдвэр нь дахин ашиглагдах бизнес дүрмүүдийг `partB/shared/libraryRules.js` дотор байрлуулах байсан. Ингэснээр тестүүд Express, React, PostgreSQL-оос хамаарахгүй болсон. Энэ тусгаарлалт нь практик шалгалтын үед төслийг хамгаалахад хялбар болгосон, учир нь хамгийн чухал logic-ийг database ажиллуулахгүйгээр тайлбарлаж болно.

Миний ажил зөвхөн accept дарах байгаагүй. Би topic сонгож, stack баталж, гурван тусдаа commit хүсэж, assignment requirements шалгаж, test ажиллуулж, Git history-г Part A, Part B, Part C гэж салгасан. Мөн `.env` ignore хийгдсэн, database query-үүд parameter placeholder ашигласан, AI usage үнэн зөв баримтжуулагдсан эсэхийг шалгасан. App-ийг жинхэнэ PostgreSQL database-тэй ажиллуулах бол final submission-ээс өмнө human review дахин хэрэгтэй боловч бүтэц болон artifact-ууд даалгаварт нийцэж байна.

## 2. Hallucination-ийн жишээ

Эхний hallucination эрсдэл нь package version болон tooling assumption-тэй холбоотой байсан. AI modern React, Vite, Tailwind, Express, PostgreSQL dependency санал болгосон. Эдгээр нь боломжийн боловч яг latest version өөрчлөгдөж болно, мөн бүгд local орчинд суусан байх албагүй. AI command заавал ажиллана гэж шалгахгүй мэдэгдэх нь hallucination эрсдэл. Би unit test-үүдийг Node.js built-in test runner ашигладаг, third-party package суулгах шаардлагагүй байхаар төлөвлөж эрсдэлийг бууруулсан. Frontend/backend package dependency-үүд бодит build-д хэрэгтэй хэвээр боловч core business logic шууд тестлэгдэх боломжтой.

Хоёр дахь hallucination эрсдэл нь GitHub remote гэж таамаглах явдал байсан. Local workspace эхэндээ өөр parent repository-д харьяалагдаж байсан, харин хүссэн target repository нь `https://github.com/khishigtogtokh321/lab13` байсан. Git root шалгаагүй бол AI буруу parent repository-д commit хийх эрсдэлтэй. Үүнийг Git inspection command ажиллуулж, дараа нь `lab13` folder дотор тусдаа repository initialize хийснээр илрүүлсэн. Энэ нь AI output-ыг prompt-оор биш бодит environment-тэй тулгаж шалгах хэрэгтэйг харуулна.

Гурав дахь эрсдэл нь assignment file naming байсан. Даалгаврын текстэд `partA/adr/0001-stack.md` гэж дурдагдсан боловч tree дээр `partA/adr/0001-stack-decision.md` гэж байсан. AI аль нэгийг нь санамсаргүй сонгоод expected structure-ийг алдах боломжтой. Би илүү тодорхой, plan-д хэрэглэгчийн хүссэн нэртэй нийцсэн `0001-stack-decision.md`-ийг ашигласан. Энэ нь зөвшөөрөгдөхүйц байх ёстой боловч instructor checker байгаа бол дахин шалгах зүйл.

## 3. Security болон license concern

Гол security concern нь SQL injection. PostgreSQL-backed REST API нь user input-оор SQL statement залгаж үүсгэх ёсгүй. Repository layer parameterized query болон Prisma ORM ашигласнаар raw string concatenation-оос зайлсхийсэн. Ирээдүйд database search нэмэх бол мөн parameterized query ашиглах ёстой.

Өөр нэг security concern нь secret leakage. PostgreSQL connection string ихэвчлэн username/password агуулдаг тул `.env` нь `.gitignore` дотор байна. README-д `DATABASE_URL`-ийг local-д үүсгэж commit хийхгүй байхыг тайлбарласан. Public GitHub repository-ууд exposed credential хайдаг тул энэ чухал.

Input validation мөн чухал. Одоогийн validation нь номын шаардлагатай field-үүд, ISBN хэлбэр, copy count, member email, member status-ыг шалгана. Энэ нь production-grade бүрэн validation биш боловч илт буруу өгөгдөл системд орохоос сэргийлнэ. Бодит application-д validation-ийг database constraint, API request, UI түвшинд илүү хүчтэй давхар хэрэгжүүлэх хэрэгтэй.

AI-generated code-той холбоотой license concern бас бий. Энэ төслийн код жижиг, custom, нийтлэг pattern дээр үндэслэсэн боловч AI output public example-тэй төстэй байж болно. Эрсдэлийг бууруулахын тулд implementation-ийг энгийн байлгаж, том unknown snippet хуулбарлахаас зайлсхийсэн. Төсөл open-source package ашигладаг тул production version-д package бүрийн license-ийг шалгах хэрэгтэй.

## 4. AI юуг хурдан болгосон

AI planning-ийг илүү хурдан болгосон. AI байхгүй бол stack comparison, ADR, architecture document, session summary бичихэд илүү их хугацаа орох байсан. AI нь rough requirement-ийг зохион байгуулалттай Markdown document болгоход онцгой хэрэгтэй байсан. Мөн library system-д natural feature set болох books, members, loans, returns, overdue status, dashboard summary-г тодорхойлоход тусалсан.

AI boilerplate үүсгэхийг мөн хурдасгасан. Express route, PostgreSQL schema, React layout, OpenAPI path, test case бүгд давтагдсан хэсэгтэй. AI эдгээрийг хурдан draft хийж чадна. Гол ашиг нь ойлголтыг орлохдоо биш, хоосон хуудаснаас эхлэх саадыг багасгасандаа байсан. File-ууд үүссэний дараа би шалгаж, засаж чадсан.

Testing мөн AI-ийн тусламжтай хурдан болсон. Unit test-үүд validation, loan eligibility, loan creation, return behavior, overdue calculation, filtering, dashboard summary-г хамардаг. AI inactive member, unavailable book гэх мэт амархан мартагдах edge case-үүдийг жагсаахад тусалсан. Ингэснээр test suite зөвхөн happy path шалгахаас илүү ашигтай болсон.

## 5. AI юуг удаашруулсан

AI-ийн suggestion-уудыг шалгах шаардлагатай байсан тул зарим хэсэг удааширсан. Жишээлбэл environment-д parent Git repository байсан бөгөөд бодит хүссэн GitHub repository өөр байсан. AI-ийн repository assumption-д итгэсэн бол commit буруу газар очих байсан. Git root, remote, status, staged file шалгах нь цаг авсан ч ноцтой workflow алдаанаас хамгаалсан.

AI заримдаа хэрэгтэйгээс илүү код үүсгэх хандлагатай. Жижиг даалгаварт санал болгосон feature бүрийг хүлээж авбал төсөл хэт том болно. Authentication, roles, fines, deployment, barcode scanning нь бодит library feature байж болох ч scope-оос гадуур. Би төслийг хэрэгжүүлж, тодорхой тайлбарлаж чадах feature-үүдээр хязгаарласан.

Generated documentation-ийн consistency шалгах нь бас цаг авсан. AI polish-той зөв мэт text бичиж чаддаг боловч жижиг mismatch агуулж болно. Planned API path, database entity, README command, OpenAPI file бүгд нэг системийг тайлбарлах ёстой. Эдгээр холбоосыг review хийх нь шаардлагатай, учир нь document mismatch нь энэ даалгаварт code bug шиг хор нөлөөтэй.

## 6. Skill atrophy эрсдэл

Хамгийн том skill atrophy эрсдэл нь AI-д architectural decision гаргуулаад өөрөө ойлгохгүй байх явдал. Үүнээс зайлсхийхийн тулд архитектурыг энгийн, тайлбарлахад хялбар байлгасан. React UI state болон interaction-ийг барина. Express REST route гаргана. PostgreSQL relational data хадгална. Shared domain function validation болон loan rule-үүдийг хариуцна. Энэ бол AI-гүйгээр тайлбарлаж чадах бүтэц.

Өөр нэг эрсдэл нь debugging-д AI-д хэт найдах явдал. Би test ажиллуулж, бодит output уншиж энэ эрсдэлийг бууруулсан. Эхний test run sandbox нь Node test worker process-ийг блоклосноос унасан. Test эвдэрсэн гэж таамаглахын оронд хэрэгтэй permission-той дахин ажиллуулж pass болсон эсэхийг баталгаажуулсан. Бодит engineering нь AI-аас таамаг асуухаас гадна tool output-ыг зөв тайлбарлах шаардлагатай.

Мөн хамгийн чухал logic-ийг жижиг pure function-уудад хадгалсан. Энэ нь суралцахад тусална, учир нь `canLoanBook`, `createLoanRecord`, `computeLoanStatus` зэрэг функцүүдийг мөр мөрөөр уншиж ойлгож болно. Код том framework эсвэл generated service дотор нуугдсан бол ойлгоход хэцүү байх байсан.

Ирээдүйд нэг эсвэл хоёр feature-ийг AI-гүйгээр дахин бүтээх цаг гаргана. Жишээлбэл return-loan endpoint-ийг гараар бичих эсвэл шинэ validation rule нэмэх. Энэ нь системийг ойлгож байгаа эсэхээ батлахад тусална.

## Дүгнэлт

AI нь төлөвлөх, draft бичих, зохион байгуулах, давтагдсан implementation ажлыг хурдасгахад ашигтай байсан. Хүний хамгийн чухал үүрэг нь scope сонгох, environment fact шалгах, security risk шалгах, test ажиллуулах, commit-үүдийг зохион байгуулах, AI usage-ийг үнэн зөв баримтжуулах байв. Эцсийн төсөл production library system биш боловч planning, build, reflection phase бүхий AI-assisted software construction-ийн даалгаврын хэмжээтэй бүрэн жишээ юм.
