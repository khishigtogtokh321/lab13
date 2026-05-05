import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BookOpen, ClipboardList, Library, LogOut, RotateCcw, Search, ShieldCheck, Users } from "lucide-react";
import "./styles.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const NAV_ITEMS = [
  { id: "dashboard", label: "Хянах самбар", icon: ClipboardList },
  { id: "books", label: "Ном", icon: BookOpen },
  { id: "members", label: "Гишүүд", icon: Users },
  { id: "loans", label: "Зээлэлт", icon: Library }
];

const PAGE_COPY = {
  dashboard: {
    title: "Номын сангийн хянах самбар",
    description: "Ном, гишүүн, зээлэлт, хугацаа хэтэрсэн бүртгэлийн ерөнхий төлөв."
  },
  books: {
    title: "Номын бүртгэл",
    description: "Ном хайх, ангиллаар шүүх, шинэ ном бүртгэх хэсэг."
  },
  members: {
    title: "Гишүүдийн бүртгэл",
    description: "Уншигчийн мэдээлэл нэмэх, идэвхтэй болон идэвхгүй төлөвийг харах хэсэг."
  },
  loans: {
    title: "Зээлэлт ба буцаалт",
    description: "Ном зээлүүлэх, хугацаа хэтэрсэн болон идэвхтэй зээлэлтийг буцаах хэсэг."
  }
};

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.errors?.[0] ?? "Хүсэлт амжилтгүй боллоо.");
    error.status = response.status;
    throw error;
  }

  return data;
}

function App() {
  const [authState, setAuthState] = useState("checking");
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    let isMounted = true;

    apiRequest("/api/auth/me")
      .then(({ user }) => {
        if (!isMounted) return;
        setAdmin(user);
        setAuthState("authenticated");
      })
      .catch(() => {
        if (!isMounted) return;
        setAdmin(null);
        setAuthState("login");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogin(credentials) {
    const { user } = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
    setAdmin(user);
    setAuthState("authenticated");
  }

  async function handleLogout() {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } finally {
      setAdmin(null);
      setAuthState("login");
    }
  }

  function handleSessionExpired() {
    setAdmin(null);
    setAuthState("login");
  }

  if (authState === "checking") {
    return (
      <div className="grid min-h-screen place-items-center bg-white px-4 text-slate-950">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <ShieldCheck className="text-teal-700" size={20} />
          Нэвтрэлтийн төлөв шалгаж байна...
        </div>
      </div>
    );
  }

  if (authState !== "authenticated") {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <LibraryApp admin={admin} onLogout={handleLogout} onSessionExpired={handleSessionExpired} />;
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onLogin({ email, password });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-shell">
      <form className="login-panel" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-700 text-white">
            <Library size={23} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-normal text-slate-950">Админ нэвтрэх</h1>
            <p className="text-sm text-slate-500">Mini Library системийг удирдах эрхээр нэвтэрнэ.</p>
          </div>
        </div>

        <div className="mt-7 space-y-4">
          <div>
            <label className="field-label" htmlFor="email">Имэйл</label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="password">Нууц үг</label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
        </div>

        {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}

        <button className="primary-button mt-6" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Нэвтэрч байна..." : "Нэвтрэх"}
        </button>
      </form>
    </div>
  );
}

function LibraryApp({ admin, onLogout, onSessionExpired }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [summary, setSummary] = useState({
    totalBooks: 0,
    activeMembers: 0,
    availableCopies: 0,
    overdueLoans: 0
  });
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [message, setMessage] = useState("Систем бэлэн байна.");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "Ерөнхий",
    totalCopies: 1,
    availableCopies: 1
  });
  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active"
  });

  const activeMembers = useMemo(() => members.filter((member) => member.status === "active"), [members]);
  const activeLoans = useMemo(() => loans.filter((loan) => loan.status === "active"), [loans]);
  const overdueLoans = useMemo(() => loans.filter((loan) => loan.status === "overdue"), [loans]);
  const openLoans = useMemo(() => loans.filter((loan) => loan.status === "active" || loan.status === "overdue"), [loans]);
  const categories = useMemo(() => {
    const values = allBooks.map((book) => book.category).filter(Boolean);
    return Array.from(new Set(["Ерөнхий", "Software", "Database", ...values]));
  }, [allBooks]);

  const loadData = useCallback(async () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    params.set("category", category);
    params.set("availability", availability);

    setIsLoading(true);
    setError("");

    try {
      const [filteredBookData, allBookData, memberData, loanData, summaryData] = await Promise.all([
        apiRequest(`/api/books?${params.toString()}`),
        apiRequest("/api/books?category=all&availability=all"),
        apiRequest("/api/members"),
        apiRequest("/api/loans"),
        apiRequest("/api/dashboard/summary")
      ]);

      setBooks(filteredBookData);
      setAllBooks(allBookData);
      setMembers(memberData);
      setLoans(loanData);
      setSummary(summaryData);

      setSelectedBookId((current) => {
        if (allBookData.some((book) => String(book.id) === String(current))) return current;
        return allBookData[0]?.id ? String(allBookData[0].id) : "";
      });
      setSelectedMemberId((current) => {
        const activeMemberData = memberData.filter((member) => member.status === "active");
        if (activeMemberData.some((member) => String(member.id) === String(current))) return current;
        return activeMemberData[0]?.id ? String(activeMemberData[0].id) : "";
      });
    } catch (loadError) {
      if (loadError.status === 401) {
        onSessionExpired();
        return;
      }
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }, [availability, category, onSessionExpired, query]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function runWorkflow(action, successMessage) {
    setIsSaving(true);
    setError("");

    try {
      await action();
      await loadData();
      setMessage(successMessage);
    } catch (workflowError) {
      if (workflowError.status === 401) {
        onSessionExpired();
        return false;
      }
      setError(workflowError.message);
      setMessage(workflowError.message);
      return false;
    } finally {
      setIsSaving(false);
    }

    return true;
  }

  function updateBookForm(field, value) {
    setBookForm((current) => ({ ...current, [field]: value }));
  }

  function updateMemberForm(field, value) {
    setMemberForm((current) => ({ ...current, [field]: value }));
  }

  function handleCreateBook(event) {
    event.preventDefault();
    const payload = {
      ...bookForm,
      title: bookForm.title.trim(),
      author: bookForm.author.trim(),
      isbn: bookForm.isbn.trim(),
      category: bookForm.category.trim() || "Ерөнхий",
      totalCopies: Number(bookForm.totalCopies),
      availableCopies: Number(bookForm.availableCopies)
    };

    runWorkflow(
      () =>
        apiRequest("/api/books", {
          method: "POST",
          body: JSON.stringify(payload)
        }),
      `"${payload.title}" ном бүртгэгдлээ.`
    ).then((ok) => {
      if (ok) {
        setBookForm({
          title: "",
          author: "",
          isbn: "",
          category: "Ерөнхий",
          totalCopies: 1,
          availableCopies: 1
        });
      }
    });
  }

  function handleCreateMember(event) {
    event.preventDefault();
    const payload = {
      ...memberForm,
      name: memberForm.name.trim(),
      email: memberForm.email.trim(),
      phone: memberForm.phone.trim()
    };

    runWorkflow(
      () =>
        apiRequest("/api/members", {
          method: "POST",
          body: JSON.stringify(payload)
        }),
      `${payload.name} гишүүнээр бүртгэгдлээ.`
    ).then((ok) => {
      if (ok) {
        setMemberForm({
          name: "",
          email: "",
          phone: "",
          status: "active"
        });
      }
    });
  }

  function handleCreateLoan(event) {
    event.preventDefault();
    const book = allBooks.find((item) => String(item.id) === String(selectedBookId));
    const member = members.find((item) => String(item.id) === String(selectedMemberId));

    runWorkflow(
      () =>
        apiRequest("/api/loans", {
          method: "POST",
          body: JSON.stringify({
            bookId: Number(selectedBookId),
            memberId: Number(selectedMemberId)
          })
        }),
      `${member?.name ?? "Гишүүн"} - "${book?.title ?? "ном"}" зээлэлт үүслээ.`
    );
  }

  function handleReturnLoan(loan) {
    runWorkflow(
      () => apiRequest(`/api/loans/${loan.id}/return`, { method: "PATCH" }),
      `"${loan.book?.title ?? `#${loan.bookId}`}" ном буцаагдлаа.`
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="grid min-h-screen grid-cols-[248px_1fr] max-lg:grid-cols-1">
        <aside className="border-r border-slate-200 bg-white px-5 py-6 max-lg:border-b max-lg:border-r-0">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-teal-700 text-white">
              <Library size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold">Mini Library</p>
              <p className="text-xs text-slate-500">Номын сангийн админ</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1 text-sm">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button key={id} className={`nav-item ${activePage === id ? "nav-item-active" : ""}`} onClick={() => setActivePage(id)}>
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="px-8 py-6 max-md:px-4">
          <header className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5 max-md:flex-col max-md:items-stretch">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">{PAGE_COPY[activePage].title}</h1>
              <p className="mt-1 text-sm text-slate-500">{PAGE_COPY[activePage].description}</p>
              <p className="mt-1 text-xs text-slate-400">Нэвтэрсэн хэрэглэгч: {admin?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="outline-button" type="button" onClick={loadData} disabled={isLoading}>
                <RotateCcw size={17} />
                Шинэчлэх
              </button>
              <button className="outline-button" type="button" onClick={onLogout}>
                <LogOut size={17} />
                Гарах
              </button>
            </div>
          </header>

          {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}
          {message ? <p className="mt-4 rounded-md bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800">{message}</p> : null}

          {activePage === "dashboard" ? (
            <DashboardPage
              summary={summary}
              activeLoans={activeLoans}
              overdueLoans={overdueLoans}
              onGoPage={setActivePage}
              onReturnLoan={handleReturnLoan}
              isSaving={isSaving}
            />
          ) : null}

          {activePage === "books" ? (
            <BooksPage
              books={books}
              categories={categories}
              query={query}
              category={category}
              availability={availability}
              isLoading={isLoading}
              isSaving={isSaving}
              form={bookForm}
              onQueryChange={setQuery}
              onCategoryChange={setCategory}
              onAvailabilityChange={setAvailability}
              onFormChange={updateBookForm}
              onSubmit={handleCreateBook}
            />
          ) : null}

          {activePage === "members" ? (
            <MembersPage
              members={members}
              isSaving={isSaving}
              form={memberForm}
              onFormChange={updateMemberForm}
              onSubmit={handleCreateMember}
            />
          ) : null}

          {activePage === "loans" ? (
            <LoansPage
              books={allBooks}
              activeMembers={activeMembers}
              loans={loans}
              openLoans={openLoans}
              selectedBookId={selectedBookId}
              selectedMemberId={selectedMemberId}
              isSaving={isSaving}
              onBookChange={setSelectedBookId}
              onMemberChange={setSelectedMemberId}
              onCreateLoan={handleCreateLoan}
              onReturnLoan={handleReturnLoan}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}

function DashboardPage({ summary, activeLoans, overdueLoans, onGoPage, onReturnLoan, isSaving }) {
  return (
    <div className="mt-6 space-y-6">
      <section className="grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
        <Metric label="Нийт ном" value={summary.totalBooks} />
        <Metric label="Идэвхтэй гишүүн" value={summary.activeMembers} />
        <Metric label="Бэлэн хувь" value={summary.availableCopies} />
        <Metric label="Хугацаа хэтэрсэн" value={summary.overdueLoans} tone="warning" />
      </section>

      <section className="grid grid-cols-[1fr_360px] gap-6 max-xl:grid-cols-1">
        <div className="panel">
          <h2 className="section-title">Өнөөдрийн анхаарах ажил</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 max-md:grid-cols-1">
            <ActionTile title="Ном бүртгэх" text="Шинэ ном болон хувь ширхэг нэмэх." onClick={() => onGoPage("books")} />
            <ActionTile title="Гишүүн нэмэх" text="Уншигчийн үндсэн мэдээлэл бүртгэх." onClick={() => onGoPage("members")} />
            <ActionTile title="Зээлэлт үүсгэх" text="Бэлэн номыг идэвхтэй гишүүнд зээлүүлэх." onClick={() => onGoPage("loans")} />
          </div>
        </div>

        <div className="panel">
          <h2 className="section-title">Зээлэлтийн төлөв</h2>
          <div className="mt-4 space-y-3 text-sm">
            <StatusLine label="Идэвхтэй зээлэлт" value={activeLoans.length} />
            <StatusLine label="Хугацаа хэтэрсэн" value={overdueLoans.length} tone="warning" />
          </div>
        </div>
      </section>

      <section className="panel">
        <h2 className="section-title">Хугацаа хэтэрсэн зээлэлт</h2>
        <LoanList loans={overdueLoans} isSaving={isSaving} onReturnLoan={onReturnLoan} emptyText="Хугацаа хэтэрсэн зээлэлт алга." />
      </section>
    </div>
  );
}

function BooksPage({
  books,
  categories,
  query,
  category,
  availability,
  isLoading,
  isSaving,
  form,
  onQueryChange,
  onCategoryChange,
  onAvailabilityChange,
  onFormChange,
  onSubmit
}) {
  return (
    <div className="mt-6 grid grid-cols-[1fr_360px] gap-6 max-xl:grid-cols-1">
      <section className="panel">
        <div className="flex items-center justify-between gap-3 max-md:flex-col max-md:items-stretch">
          <h2 className="section-title">Номын жагсаалт</h2>
          <div className="grid grid-cols-[minmax(220px,1fr)_180px_180px] gap-2 max-lg:grid-cols-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input className="input pl-10" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Нэр, зохиогч, ISBN хайх" />
            </div>
            <select className="select" value={category} onChange={(event) => onCategoryChange(event.target.value)}>
              <option value="all">Бүх ангилал</option>
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <select className="select" value={availability} onChange={(event) => onAvailabilityChange(event.target.value)}>
              <option value="all">Бүх төлөв</option>
              <option value="available">Бэлэн байгаа</option>
              <option value="unavailable">Дууссан</option>
            </select>
          </div>
        </div>
        <BooksTable books={books} isLoading={isLoading} />
      </section>

      <BookCreateForm form={form} isSaving={isSaving} onChange={onFormChange} onSubmit={onSubmit} />
    </div>
  );
}

function MembersPage({ members, isSaving, form, onFormChange, onSubmit }) {
  return (
    <div className="mt-6 grid grid-cols-[1fr_360px] gap-6 max-xl:grid-cols-1">
      <section className="panel">
        <h2 className="section-title">Гишүүдийн жагсаалт</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3 pr-4">Нэр</th>
                <th className="py-3 pr-4">Имэйл</th>
                <th className="py-3 pr-4">Утас</th>
                <th className="py-3 pr-4">Төлөв</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="py-3 pr-4 font-medium">{member.name}</td>
                  <td className="py-3 pr-4 text-slate-600">{member.email}</td>
                  <td className="py-3 pr-4 text-slate-600">{member.phone || "-"}</td>
                  <td className="py-3 pr-4">
                    <span className={member.status === "active" ? "status status-ok" : "status status-muted"}>{translateMemberStatus(member.status)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {members.length === 0 ? <p className="py-6 text-sm text-slate-500">Гишүүн бүртгэгдээгүй байна.</p> : null}
        </div>
      </section>

      <MemberCreateForm form={form} isSaving={isSaving} onChange={onFormChange} onSubmit={onSubmit} />
    </div>
  );
}

function LoansPage({
  books,
  activeMembers,
  loans,
  openLoans,
  selectedBookId,
  selectedMemberId,
  isSaving,
  onBookChange,
  onMemberChange,
  onCreateLoan,
  onReturnLoan
}) {
  return (
    <div className="mt-6 grid grid-cols-[380px_1fr] gap-6 max-xl:grid-cols-1">
      <form className="panel" onSubmit={onCreateLoan}>
        <h2 className="section-title">Шинэ зээлэлт үүсгэх</h2>
        <label className="field-label mt-4" htmlFor="loan-book">Ном</label>
        <select id="loan-book" className="select w-full" value={selectedBookId} onChange={(event) => onBookChange(event.target.value)} required>
          {books.map((book) => (
            <option key={book.id} value={book.id}>{book.title} ({book.availableCopies}/{book.totalCopies})</option>
          ))}
        </select>
        <label className="field-label mt-4" htmlFor="loan-member">Гишүүн</label>
        <select id="loan-member" className="select w-full" value={selectedMemberId} onChange={(event) => onMemberChange(event.target.value)} required>
          {activeMembers.map((member) => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
        <button className="primary-button mt-5" type="submit" disabled={isSaving || !selectedBookId || !selectedMemberId}>
          Зээлэлт үүсгэх
        </button>
      </form>

      <section className="space-y-6">
        <div className="panel">
          <h2 className="section-title">Буцаагдаагүй зээлэлт</h2>
          <LoanList loans={openLoans} isSaving={isSaving} onReturnLoan={onReturnLoan} emptyText="Буцаагдаагүй зээлэлт алга." />
        </div>
        <div className="panel">
          <h2 className="section-title">Бүх зээлэлтийн түүх</h2>
          <LoanHistory loans={loans} />
        </div>
      </section>
    </div>
  );
}

function BookCreateForm({ form, isSaving, onChange, onSubmit }) {
  return (
    <form className="panel" onSubmit={onSubmit}>
      <h2 className="section-title">Шинэ ном бүртгэх</h2>
      <div className="mt-4 space-y-3">
        <div>
          <label className="field-label" htmlFor="book-title">Номын нэр</label>
          <input id="book-title" className="input" value={form.title} onChange={(event) => onChange("title", event.target.value)} required />
        </div>
        <div>
          <label className="field-label" htmlFor="book-author">Зохиогч</label>
          <input id="book-author" className="input" value={form.author} onChange={(event) => onChange("author", event.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label" htmlFor="book-isbn">ISBN</label>
            <input id="book-isbn" className="input" value={form.isbn} onChange={(event) => onChange("isbn", event.target.value)} required />
          </div>
          <div>
            <label className="field-label" htmlFor="book-category">Ангилал</label>
            <input id="book-category" className="input" value={form.category} onChange={(event) => onChange("category", event.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label" htmlFor="book-total">Нийт хувь</label>
            <input id="book-total" className="input" type="number" min="1" value={form.totalCopies} onChange={(event) => onChange("totalCopies", event.target.value)} required />
          </div>
          <div>
            <label className="field-label" htmlFor="book-available">Бэлэн хувь</label>
            <input id="book-available" className="input" type="number" min="0" value={form.availableCopies} onChange={(event) => onChange("availableCopies", event.target.value)} required />
          </div>
        </div>
      </div>
      <button className="primary-button mt-5" type="submit" disabled={isSaving}>Ном бүртгэх</button>
    </form>
  );
}

function MemberCreateForm({ form, isSaving, onChange, onSubmit }) {
  return (
    <form className="panel" onSubmit={onSubmit}>
      <h2 className="section-title">Шинэ гишүүн бүртгэх</h2>
      <div className="mt-4 space-y-3">
        <div>
          <label className="field-label" htmlFor="member-name">Овог нэр</label>
          <input id="member-name" className="input" value={form.name} onChange={(event) => onChange("name", event.target.value)} required />
        </div>
        <div>
          <label className="field-label" htmlFor="member-email">Имэйл</label>
          <input id="member-email" className="input" type="email" value={form.email} onChange={(event) => onChange("email", event.target.value)} required />
        </div>
        <div>
          <label className="field-label" htmlFor="member-phone">Утас</label>
          <input id="member-phone" className="input" value={form.phone} onChange={(event) => onChange("phone", event.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="member-status">Төлөв</label>
          <select id="member-status" className="select w-full" value={form.status} onChange={(event) => onChange("status", event.target.value)}>
            <option value="active">Идэвхтэй</option>
            <option value="inactive">Идэвхгүй</option>
          </select>
        </div>
      </div>
      <button className="primary-button mt-5" type="submit" disabled={isSaving}>Гишүүн бүртгэх</button>
    </form>
  );
}

function BooksTable({ books, isLoading }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
          <tr>
            <th className="py-3 pr-4">Номын нэр</th>
            <th className="py-3 pr-4">Зохиогч</th>
            <th className="py-3 pr-4">Ангилал</th>
            <th className="py-3 pr-4">Бэлэн хувь</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {books.map((book) => (
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
      {!isLoading && books.length === 0 ? <p className="py-6 text-sm text-slate-500">Шүүлтэд тохирох ном олдсонгүй.</p> : null}
    </div>
  );
}

function LoanList({ loans, isSaving, onReturnLoan, emptyText }) {
  return (
    <div className="mt-3 space-y-3">
      {loans.map((loan) => (
        <div key={loan.id} className="loan-row">
          <div>
            <p className="font-medium">{loan.book?.title ?? `Ном #${loan.bookId}`}</p>
            <p className="text-xs text-slate-500">{loan.member?.name ?? `Гишүүн #${loan.memberId}`} - дуусах өдөр {formatDate(loan.dueAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={loan.status === "overdue" ? "status status-warn" : "status status-ok"}>{translateLoanStatus(loan.status)}</span>
            <button className="small-button" type="button" onClick={() => onReturnLoan(loan)} disabled={isSaving}>
              Буцаах
            </button>
          </div>
        </div>
      ))}
      {loans.length === 0 ? <p className="text-sm text-slate-500">{emptyText}</p> : null}
    </div>
  );
}

function LoanHistory({ loans }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
          <tr>
            <th className="py-3 pr-4">Ном</th>
            <th className="py-3 pr-4">Гишүүн</th>
            <th className="py-3 pr-4">Дуусах өдөр</th>
            <th className="py-3 pr-4">Төлөв</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td className="py-3 pr-4 font-medium">{loan.book?.title ?? `Ном #${loan.bookId}`}</td>
              <td className="py-3 pr-4 text-slate-600">{loan.member?.name ?? `Гишүүн #${loan.memberId}`}</td>
              <td className="py-3 pr-4 text-slate-600">{formatDate(loan.dueAt)}</td>
              <td className="py-3 pr-4">
                <span className={loan.status === "overdue" ? "status status-warn" : loan.status === "returned" ? "status status-muted" : "status status-ok"}>
                  {translateLoanStatus(loan.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loans.length === 0 ? <p className="py-6 text-sm text-slate-500">Зээлэлтийн түүх алга.</p> : null}
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

function ActionTile({ title, text, onClick }) {
  return (
    <button className="action-tile" type="button" onClick={onClick}>
      <span className="font-semibold text-slate-950">{title}</span>
      <span className="mt-1 block text-sm text-slate-500">{text}</span>
    </button>
  );
}

function StatusLine({ label, value, tone }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2">
      <span className="text-slate-600">{label}</span>
      <span className={tone === "warning" ? "font-semibold text-amber-700" : "font-semibold text-slate-950"}>{value}</span>
    </div>
  );
}

function translateLoanStatus(status) {
  if (status === "returned") return "Буцаасан";
  if (status === "overdue") return "Хэтэрсэн";
  return "Идэвхтэй";
}

function translateMemberStatus(status) {
  return status === "inactive" ? "Идэвхгүй" : "Идэвхтэй";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("mn-MN", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value));
}

createRoot(document.getElementById("root")).render(<App />);
