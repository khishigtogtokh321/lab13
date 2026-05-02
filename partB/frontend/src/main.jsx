import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BookOpen, ClipboardList, Library, Search, Users } from "lucide-react";
import "./styles.css";

const initialBooks = [
  { id: 1, title: "Clean Architecture", author: "Robert C. Martin", isbn: "978-0134494166", category: "Software", totalCopies: 5, availableCopies: 3 },
  { id: 2, title: "Database Design", author: "C. J. Date", isbn: "978-0321197849", category: "Database", totalCopies: 4, availableCopies: 0 },
  { id: 3, title: "Refactoring", author: "Martin Fowler", isbn: "978-0134757599", category: "Software", totalCopies: 6, availableCopies: 5 },
  { id: 4, title: "The Pragmatic Programmer", author: "Andrew Hunt", isbn: "978-0135957059", category: "Software", totalCopies: 3, availableCopies: 1 }
];

const members = [
  { id: 1, name: "Anudari Bold", email: "anudari@example.com", status: "active" },
  { id: 2, name: "Temuulen Gan", email: "temuulen@example.com", status: "active" },
  { id: 3, name: "Saruul Enkh", email: "saruul@example.com", status: "inactive" }
];

const loans = [
  { id: 1, bookTitle: "Database Design", memberName: "Anudari Bold", dueAt: "2026-05-01", status: "overdue" },
  { id: 2, bookTitle: "Clean Architecture", memberName: "Temuulen Gan", dueAt: "2026-05-15", status: "active" }
];

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedBookId, setSelectedBookId] = useState(initialBooks[0].id);
  const [selectedMemberId, setSelectedMemberId] = useState(members[0].id);
  const [books, setBooks] = useState(initialBooks);
  const [activity, setActivity] = useState("Ready to create a loan.");

  const filteredBooks = useMemo(() => {
    const normalized = query.toLowerCase();
    return books.filter((book) => {
      const matchesQuery = [book.title, book.author, book.isbn].some((value) => value.toLowerCase().includes(normalized));
      const matchesCategory = category === "all" || book.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [books, category, query]);

  const summary = useMemo(
    () => ({
      books: books.length,
      members: members.filter((member) => member.status === "active").length,
      available: books.reduce((sum, book) => sum + book.availableCopies, 0),
      overdue: loans.filter((loan) => loan.status === "overdue").length
    }),
    [books]
  );

  function handleLoan() {
    const book = books.find((item) => item.id === Number(selectedBookId));
    const member = members.find((item) => item.id === Number(selectedMemberId));
    if (!book || book.availableCopies < 1) {
      setActivity("Loan blocked: selected book has no available copies.");
      return;
    }
    setBooks((current) =>
      current.map((item) => (item.id === book.id ? { ...item, availableCopies: item.availableCopies - 1 } : item))
    );
    setActivity(`Loan created for ${member.name}: ${book.title}.`);
  }

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <div className="grid min-h-screen grid-cols-[240px_1fr] max-lg:grid-cols-1">
        <aside className="border-r border-slate-200 px-5 py-6 max-lg:border-b max-lg:border-r-0">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-teal-600 text-white">
              <Library size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold">Mini Library</p>
              <p className="text-xs text-slate-500">Circulation desk</p>
            </div>
          </div>
          <nav className="mt-8 space-y-1 text-sm">
            {[
              ["Dashboard", ClipboardList],
              ["Books", BookOpen],
              ["Members", Users],
              ["Loans", Library]
            ].map(([label, Icon], index) => (
              <button key={label} className={`nav-item ${index === 0 ? "nav-item-active" : ""}`}>
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="px-8 py-6 max-md:px-4">
          <header className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5 max-md:flex-col max-md:items-stretch">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">Library operations dashboard</h1>
              <p className="mt-1 text-sm text-slate-500">Manage inventory, members, active loans, and overdue returns.</p>
            </div>
            <div className="relative w-80 max-md:w-full">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input className="input pl-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search inventory" />
            </div>
          </header>

          <section className="mt-6 grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
            <Metric label="Books" value={summary.books} />
            <Metric label="Active members" value={summary.members} />
            <Metric label="Available copies" value={summary.available} />
            <Metric label="Overdue" value={summary.overdue} tone="warning" />
          </section>

          <section className="mt-6 grid grid-cols-[1fr_360px] gap-6 max-xl:grid-cols-1">
            <div className="panel">
              <div className="flex items-center justify-between gap-3">
                <h2 className="section-title">Book inventory</h2>
                <select className="select" value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option value="all">All categories</option>
                  <option value="Software">Software</option>
                  <option value="Database">Database</option>
                </select>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="py-3 pr-4">Title</th>
                      <th className="py-3 pr-4">Author</th>
                      <th className="py-3 pr-4">Category</th>
                      <th className="py-3 pr-4">Available copies</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBooks.map((book) => (
                      <tr key={book.id}>
                        <td className="py-3 pr-4 font-medium">{book.title}</td>
                        <td className="py-3 pr-4 text-slate-600">{book.author}</td>
                        <td className="py-3 pr-4 text-slate-600">{book.category}</td>
                        <td className="py-3 pr-4">
                          <span className={book.availableCopies > 0 ? "status status-ok" : "status status-warn"}>
                            {book.availableCopies} / {book.totalCopies}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <div className="panel">
                <h2 className="section-title">Create loan</h2>
                <label className="field-label">Book</label>
                <select className="select w-full" value={selectedBookId} onChange={(event) => setSelectedBookId(event.target.value)}>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>{book.title}</option>
                  ))}
                </select>
                <label className="field-label mt-4">Member</label>
                <select className="select w-full" value={selectedMemberId} onChange={(event) => setSelectedMemberId(event.target.value)}>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
                <button className="primary-button mt-5" onClick={handleLoan}>Create loan</button>
                <p className="mt-3 text-sm text-slate-600">{activity}</p>
              </div>

              <div className="panel">
                <h2 className="section-title">Overdue loans</h2>
                <div className="mt-3 space-y-3">
                  {loans.map((loan) => (
                    <div key={loan.id} className="loan-row">
                      <div>
                        <p className="font-medium">{loan.bookTitle}</p>
                        <p className="text-xs text-slate-500">{loan.memberName} · due {loan.dueAt}</p>
                      </div>
                      <span className={loan.status === "overdue" ? "status status-warn" : "status status-ok"}>{loan.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }) {
  return (
    <div className="panel">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${tone === "warning" ? "text-amber-700" : "text-slate-950"}`}>{value}</p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
