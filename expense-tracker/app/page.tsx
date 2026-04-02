import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 ">
        <div className="space-y-2 ">
          <h1 className="text-4xl font-semibold text-gray-900 sm:text-5xl">
            Smart Expense Tracker
          </h1>
          <p className="text-gray-500 text-lg sm:text-xl">
            Record expenses Financial analysis with AI
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link
            href="/login"
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
