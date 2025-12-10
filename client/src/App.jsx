import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { ReportDetail } from "./pages/ReportDetail.jsx";
import { Reports } from "./pages/Reports.jsx";

const App = () => (
  <div className="min-h-screen bg-cloud text-ink">
    <Header />
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/:id" element={<ReportDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  </div>
);

export default App;

