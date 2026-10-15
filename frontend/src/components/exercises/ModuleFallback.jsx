import { ArrowLeft, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const getModuleName = (pathname) => {
  const segment = pathname.split('/').filter(Boolean).at(-1) || 'learning module';
  return segment
    .replace(/-adaptive|-5papers|-3papers/g, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const ModuleFallback = () => {
  const { pathname } = useLocation();

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-5 py-12">
      <section className="w-full border-y border-slate-200 py-10 sm:py-14">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
          <BookOpen aria-hidden="true" size={24} />
        </div>
        <p className="mb-2 text-sm font-semibold uppercase text-emerald-800">Learning module</p>
        <h1 className="text-3xl font-bold text-slate-900">{getModuleName(pathname)}</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
          This activity is not available in this build yet. Your dashboard and saved progress remain available.
        </p>
        <Link
          to="/dashboard"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back to dashboard
        </Link>
      </section>
    </main>
  );
};

export default ModuleFallback;