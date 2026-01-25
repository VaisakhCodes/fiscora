import ThreeHero from '../components/ThreeHero';

// ... (existing imports, but ThreeHero is added)

// ...

<div className="lg:w-1/2 h-[500px] lg:h-[600px] relative w-full">
    <div className="absolute inset-0">
        <ThreeHero />
    </div>
</div>
import { ArrowRight, CheckCircle, Smartphone, PieChart } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Landing() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Background Gradient wrapper to avoid conflicting classes */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 opacity-80 pointer-events-none transition-opacity duration-300" />

            <div className="relative z-10 font-sans text-slate-900 dark:text-white selection:bg-blue-500 selection:text-white">
                {/* Navbar */}
                <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                            ₹
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Fiscora</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link
                            to="/login"
                            className="px-6 py-2.5 bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-semibold rounded-full transition-all flex items-center gap-2"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full transition-all shadow-lg shadow-blue-600/30 hidden sm:flex"
                        >
                            Get Started
                        </Link>
                    </div>
                </nav>

                {/* Hero Section */}
                <header className="px-6 py-12 lg:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                            Master your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">financial future</span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-blue-100/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Track spending, visualize habits, and achieve freedom with Fiscora. The intelligent expense tracker designed for the modern era.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                            <Link
                                to="/register"
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg rounded-full transition-all hover:-translate-y-1 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25"
                            >
                                Start Your Journey <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-4 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 backdrop-blur-md text-slate-900 dark:text-white font-bold text-lg rounded-full border border-slate-200 dark:border-slate-700 transition-colors"
                            >
                                Log In
                            </Link>
                        </div>
                    </div>

                    <div className="lg:w-1/2 h-[400px] lg:h-[600px] relative w-full perspective-1000">
                        {/* 3D Hero Scene */}
                        <div className="absolute inset-0 z-10">
                            <ThreeHero />
                        </div>

                        {/* Decorative Background for fallback/depth */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>
                    </div>
                </header>

                {/* Features Section */}
                <section className="px-6 py-24 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Why choose Fiscora?</h2>
                            <p className="text-slate-500 dark:text-blue-200/60">Built for clarity, speed, and privacy.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="p-8 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-3xl hover:bg-white dark:hover:bg-slate-800/60 transition-colors group shadow-sm hover:shadow-md">
                                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <CheckCircle className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Smart Categorization</h3>
                                <p className="text-slate-600 dark:text-blue-100/60 leading-relaxed">
                                    Automatically organize your expenses into clear categories. See exactly where your money goes at a glance.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-8 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-3xl hover:bg-white dark:hover:bg-slate-800/60 transition-colors group shadow-sm hover:shadow-md">
                                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <PieChart className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Visual Insights</h3>
                                <p className="text-slate-600 dark:text-blue-100/60 leading-relaxed">
                                    Beautiful charts and graphs turn raw numbers into actionable insights. Makes budgeting actually saving fun.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-8 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-3xl hover:bg-white dark:hover:bg-slate-800/60 transition-colors group shadow-sm hover:shadow-md">
                                <div className="w-14 h-14 bg-pink-100 dark:bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Smartphone className="w-7 h-7 text-pink-600 dark:text-pink-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Expense Tracking</h3>
                                <p className="text-slate-600 dark:text-blue-100/60 leading-relaxed">
                                    Add expenses in seconds, on any device. Keep your financial records up to date without the hassle.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
