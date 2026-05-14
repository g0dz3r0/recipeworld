import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render-time crashes so a broken component doesn't blank the whole
 * app. Logs to the console and shows a friendly fallback with a reset button
 * that re-mounts the children. The fallback also offers to clear localStorage
 * for the common case where a bad value (e.g. malformed myRecipes JSON) is
 * what's actually crashing the render.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
    this.reset = this.reset.bind(this);
    this.clearStorageAndReset = this.clearStorageAndReset.bind(this);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset() {
    this.setState({ error: null });
  }

  clearStorageAndReset() {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('recipeworld:'))
        .forEach((key) => localStorage.removeItem(key));
    } catch {
      // ignore
    }
    this.reset();
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) {
      return this.props.fallback(error, this.reset);
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f5] dark:bg-[#1a0a00] px-6">
        <div className="max-w-md w-full bg-white dark:bg-[#241410] border border-orange-100/60 dark:border-orange-900/30 rounded-[32px] p-10 text-center shadow-2xl shadow-orange-900/5">
          <div className="text-6xl mb-4" aria-hidden="true">🍳</div>
          <h1 className="font-display text-2xl font-bold text-[#1a0a00] dark:text-orange-50 mb-3">
            Что-то пошло не так
          </h1>
          <p className="text-sm text-[#78716c] dark:text-[#b5a89f] mb-6 leading-relaxed">
            Произошла неожиданная ошибка. Можно попробовать перезагрузить или сбросить локальные данные, если проблема не уходит.
          </p>
          <pre className="text-[11px] text-left bg-slate-50 dark:bg-[#1a0a00] border border-orange-50 dark:border-orange-900/30 rounded-2xl p-4 mb-6 max-h-32 overflow-auto text-red-600 dark:text-red-400">
            {error.message || 'Unknown error'}
          </pre>
          <div className="flex flex-col gap-3">
            <button
              onClick={this.reset}
              className="bg-[#D85A30] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-lg shadow-orange-900/20 transition-all cursor-pointer"
            >
              Перезагрузить экран
            </button>
            <button
              onClick={this.clearStorageAndReset}
              className="text-[#78716c] dark:text-[#b5a89f] px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors cursor-pointer"
            >
              Сбросить локальные данные и попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }
}
