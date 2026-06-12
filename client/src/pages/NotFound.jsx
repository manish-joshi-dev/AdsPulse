import { Link } from "react-router-dom";

export const NotFound = () => (
  <section className="panel p-8 text-center">
    <h1 className="text-3xl font-semibold text-ink">Page not found</h1>
    <p className="mt-2 text-sm text-zinc-500">The requested route does not exist.</p>
    <Link to="/" className="focus-ring mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-ink px-4 text-sm font-semibold text-white">
      Dashboard
    </Link>
  </section>
);

export default NotFound;
