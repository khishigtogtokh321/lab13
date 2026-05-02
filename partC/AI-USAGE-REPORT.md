# AI Usage Report

## 1. What AI Did And What I Did

AI was used as a planning, drafting, and review assistant for this project. The first major AI contribution was helping choose a realistic scope for the Mini Library Management System. The assignment allowed Mini Library as one of the official topics, but I wanted a more advanced full-stack project using React, Tailwind CSS, a REST API, and PostgreSQL. AI helped turn that goal into a bounded system: book inventory, member management, loan and return workflow, overdue tracking, search/filter, and dashboard summary. This helped avoid a project that was either too small for the stack or too large for the assignment timeline.

AI also helped compare three technology stacks: React + Express + PostgreSQL, React + NestJS + PostgreSQL, and React + Django REST Framework + PostgreSQL. The comparison was not accepted blindly. I reviewed it against the assignment requirements and my own ability to explain the final code. The selected stack was React + Tailwind CSS + Express + PostgreSQL because it gives a realistic full-stack architecture while keeping the project small enough to finish. NestJS would have looked more enterprise-level, but it would add boilerplate and decorators that are not necessary for a small system. Django REST Framework is strong, but it would make the project two-language and slower to explain.

AI generated first drafts for the Part A planning documents: project brief, architecture, stack comparison, ADR-001, and AI planning session summary. My role was to decide the actual topic, accept the Express backend choice, keep the scope limited, and check whether every required assignment file existed. I also checked that Part A did not contain production code and that the architecture matched the planned implementation.

During Part B, AI helped create the initial project structure, React dashboard, Express API routes, PostgreSQL schema, OpenAPI document, slash commands, AI session logs, and tests. I reviewed the structure and focused on whether the code was explainable. One important decision was to put reusable business rules in `partB/shared/libraryRules.js`. This made tests independent from Express, React, and PostgreSQL. That separation also made the project easier to defend during a practical check, because the most important logic can be explained without needing a database running.

My work was not only pressing accept. I chose the topic, confirmed the stack, requested three separate commits, reviewed the assignment requirements, verified the tests, and kept the Git history split by Part A, Part B, and Part C. I also checked that `.env` was ignored, that database queries used parameter placeholders, and that AI usage was documented honestly. The project still needs human review before final submission, especially if the app is run with a real PostgreSQL database, but the structure and artifacts follow the assignment.

## 2. Hallucination Examples

The first hallucination risk was around package versions and tooling assumptions. AI suggested modern React, Vite, Tailwind, Express, and PostgreSQL dependencies. These are reasonable, but the exact latest versions can change and may not all be installed locally. If AI claims a command will definitely run without checking the environment, that is a hallucination risk. I handled this by designing the unit tests so they run with the Node.js built-in test runner and do not require installing third-party packages. The frontend and backend package dependencies are still listed for the real build, but the core business logic can be tested immediately.

The second hallucination risk was assuming a GitHub remote. The local workspace originally belonged to a different parent repository, while the requested target repository was `https://github.com/khishigtogtokh321/lab13`. AI could have committed into the wrong parent repository if the Git root was not checked. This was caught by running Git inspection commands and then initializing a separate repository inside the `lab13` folder. This is a good example of why AI output must be verified against the real environment, not just the prompt.

The third risk was assignment file naming. The assignment text mentioned both `partA/adr/0001-stack.md` and the tree showed `partA/adr/0001-stack-decision.md`. AI could choose one randomly and miss the expected structure. I used the clearer tree name, `0001-stack-decision.md`, because it is more descriptive and matched the user's requested file name in the plan. This should be acceptable, but it is still something to verify against the instructor's checker if one exists.

## 3. Security And License Concerns

The main security concern is SQL injection. A REST API backed by PostgreSQL must not create SQL statements by concatenating user input. The repository layer uses parameterized queries such as `$1`, `$2`, and parameter arrays. This reduces SQL injection risk compared to building SQL strings manually. Search/filter is handled in application logic in the current implementation, and any future database search should also use parameterized queries.

Another security concern is secret leakage. PostgreSQL connection strings often contain usernames and passwords, so `.env` is included in `.gitignore`. The README explains that `DATABASE_URL` should be created locally and not committed. This is important because public GitHub repositories are often scanned for exposed credentials.

Input validation is also important. The current validation checks required book fields, ISBN shape, copy counts, member email, and member status. This is not complete production-grade validation, but it prevents obvious invalid data from entering the system. In a real application, validation would be stronger and duplicated at the database constraint level, API request level, and UI level.

There is also a license concern with AI-generated code. The code here is small, custom, and based on common patterns, but AI output can resemble public examples. To reduce risk, I kept the implementation straightforward and avoided copying large unknown snippets. The project uses known open-source packages, so a production version should check each package license before deployment.

## 4. What AI Made Faster

AI made planning much faster. Without AI, writing the stack comparison, ADR, architecture document, and session summary would take more time. AI was especially useful for turning rough requirements into organized Markdown documents. It also helped identify the natural feature set for a library system: books, members, loans, returns, overdue status, and dashboard summary.

AI also accelerated boilerplate creation. Express routes, PostgreSQL schema, React layout, OpenAPI paths, and test cases all have repetitive parts. AI can draft those quickly. The important benefit was not that AI replaced understanding, but that it reduced the blank-page problem. Once the files existed, I could inspect and adjust them.

Testing was also faster with AI. The unit tests cover validation, loan eligibility, loan creation, return behavior, overdue calculation, filtering, and dashboard summary. AI helped list edge cases that are easy to forget, such as inactive members and unavailable books. This made the test suite more useful than only testing the happy path.

## 5. What AI Made Slower

AI made some parts slower because its suggestions had to be verified. For example, the environment had a parent Git repository, and the actual requested GitHub repository was different. If I had trusted AI's assumption about the repository, the commits could have gone to the wrong place. Verifying Git root, remote, status, and staged files took extra time, but it prevented a serious workflow mistake.

AI also tends to create more code than necessary. A small assignment can become too large if every suggested feature is accepted. Authentication, roles, fines, deployment, and barcode scanning would be realistic library features, but they are out of scope. I had to keep the project limited to features that can be implemented and explained clearly.

Another slow area is checking generated documentation for consistency. AI can write polished text that looks correct but contains small mismatches. The planned API paths, database entities, README commands, and OpenAPI file need to describe the same system. Reviewing those connections takes time, but it is necessary because a document mismatch can be as damaging as a code bug in this assignment.

## 6. Skill Atrophy Risk

The biggest skill atrophy risk is allowing AI to make architectural decisions without understanding them. To avoid that, I kept the architecture simple and explainable. React handles UI state and interaction. Express exposes REST routes. PostgreSQL stores relational data. Shared domain functions handle validation and loan rules. This is a structure I can explain without AI.

Another risk is relying on AI for debugging. I reduced that risk by running tests and reading the actual output. The first test run failed because the sandbox blocked Node's test worker process. Instead of assuming the tests were broken, I reran them with the needed permission and confirmed that 11 tests passed. This matters because real engineering requires interpreting tool output, not only asking AI to guess.

I also kept the most important logic in small pure functions. This supports learning because functions like `canLoanBook`, `createLoanRecord`, and `computeLoanStatus` can be read line by line. If the code were hidden inside a large framework or generated service, it would be harder to understand.

For future work, I would reserve time to rebuild one or two features without AI: for example, writing the return-loan endpoint manually or adding a new validation rule from scratch. That would help confirm that I understand the system and am not only editing generated text.

## Conclusion

AI was useful for planning, drafting, organizing, and accelerating repetitive implementation work. The most important human responsibilities were choosing scope, verifying environment facts, checking security risks, running tests, keeping commits organized, and documenting AI usage honestly. The final project is not a production library system, but it is a complete assignment-sized example of AI-assisted software construction with planning, build, and reflection phases.
