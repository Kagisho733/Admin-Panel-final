import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = {error: null};

  static getDerivedStateFromError(error: Error): State {
    return {error};
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Admin panel render failed", error, info);
  }

  render() {
    if (this.state.error) {
      return <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <section className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-red-700">Admin panel could not start</h1>
          <p className="mt-3 text-slate-600">{this.state.error.message}</p>
          <button className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-white" onClick={() => window.location.reload()}>Reload</button>
        </section>
      </main>;
    }

    return this.props.children;
  }
}
