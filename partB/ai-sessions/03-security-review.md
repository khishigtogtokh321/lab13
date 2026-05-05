# AI Session 03: Security review

## Зорилго

Part B-г эцэслэхээс өмнө нийтлэг security болон reliability асуудлуудыг шалгах.

## AI output

AI нь SQL injection, validation дутуу байх, secret leakage, unhandled error зэрэг асуудлыг онцолсон.

## Хүний review

Backend нь parameterized query ашигладаг, `.env` ignore хийгдсэн, request validation нэмэгдсэн, API error-ууд structured JSON буцаадаг.
