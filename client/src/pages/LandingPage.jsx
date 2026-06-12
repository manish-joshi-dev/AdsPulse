import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  Zap,
  AlertCircle,
  CheckCircle2,
  GitBranch,
  ArrowRight,
  Menu,
  X,
  BarChart3,
  Target,
  Brain,
  Github,
  Twitter
} from 'lucide-react';
import { PerformanceGauge } from '../components/landing/PerformanceGauge.jsx';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inViewSections, setInViewSections] = useState({});

  // Intersection observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInViewSections((prev) => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-section]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F1F5F9] overflow-hidden">
      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-screen flex flex-col bg-[#0A0E1A] overflow-hidden">
        {/* Animated gradient orb background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40 blur-3xl"
            style={{
              background: 'linear-gradient(135deg, #A78BFA 0%, #4F8EF7 100%)',
              animation: 'float 6s ease-in-out infinite'
            }}
          />
        </div>

        {/* Navigation */}
        <nav className="relative z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#A78BFA] flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">AdsPulse</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-[#4F8EF7] text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 font-semibold"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden z-50"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-[#111827] border-b border-[#1E2D45] flex flex-col gap-4 p-6 z-40"
          >
            <button
              onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }}
              className="text-left text-[#94A3B8] hover:text-[#F1F5F9]"
            >
              Login
            </button>
            <button
              onClick={() => {
                navigate('/register');
                setMobileMenuOpen(false);
              }}
              className="px-6 py-2 bg-[#4F8EF7] text-white rounded-lg hover:bg-blue-600 font-semibold w-full"
            >
              Get Started Free
            </button>
          </motion.div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Diagnose.
              <br />
              <span className="bg-gradient-to-r from-[#4F8EF7] to-[#A78BFA] bg-clip-text text-transparent">
                Optimize.
              </span>
              <br />
              Outperform.
            </h1>

            <p className="text-xl md:text-2xl text-[#94A3B8] mb-8 leading-relaxed">
              Upload your Google Ads export and get an AI-powered performance analysis in under 60 seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-[#4F8EF7] text-white rounded-lg font-bold text-lg hover:bg-blue-600 transition-all shadow-lg"
              >
                Analyze My Campaigns
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 border-2 border-[#4F8EF7] text-[#4F8EF7] rounded-lg font-bold text-lg hover:bg-[#4F8EF7]/10 transition-all"
              >
                See a Sample Report
              </motion.button>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm md:text-base text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#34D399]" />
                10+ Diagnostic Checks
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#A78BFA]" />
                Gemini AI Powered
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#4F8EF7]" />
                0-100 Performance Score
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative z-10 flex justify-center pb-8"
        >
          <div className="text-[#94A3B8] text-sm">Scroll to explore</div>
        </motion.div>
      </section>

      {/* ============ HOW IT WORKS SECTION ============ */}
      <section
        id="how-it-works"
        data-section
        className="py-20 md:py-32 px-6 md:px-12 bg-[#0A0E1A]"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={inViewSections['how-it-works'] ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-[#94A3B8]">
              Get actionable insights in three simple steps
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inViewSections['how-it-works'] ? 'visible' : 'hidden'}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: 1,
                icon: Activity,
                title: 'Upload Your CSV',
                desc: 'Export your Google Ads campaign data and drop it here'
              },
              {
                step: 2,
                icon: Zap,
                title: 'Run Diagnostics',
                desc: 'Our engine runs 10+ checks automatically in seconds'
              },
              {
                step: 3,
                icon: TrendingUp,
                title: 'Get Recommendations',
                desc: 'Receive your score, flags, and AI-powered fixes instantly'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative group"
              >
                {/* Step badge */}
                <div className="absolute -top-6 -left-6 w-14 h-14 bg-gradient-to-br from-[#4F8EF7] to-[#A78BFA] rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                  {item.step}
                </div>

                {/* Card */}
                <div className="pt-8 px-6 py-8 bg-[#111827] border border-[#1E2D45] rounded-xl hover:border-[#4F8EF7] transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#4F8EF7]/20">
                  <item.icon className="w-12 h-12 text-[#4F8EF7] mb-4" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-[#94A3B8]">{item.desc}</p>
                </div>

                {/* Connector line (except last) */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-12 w-12 h-0.5 bg-gradient-to-r from-[#4F8EF7] to-transparent" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ============ DIAGNOSTIC FEATURES GRID ============ */}
      <section
        id="features"
        data-section
        className="py-20 md:py-32 px-6 md:px-12 bg-[#111827]"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={inViewSections['features'] ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Diagnostic Features</h2>
            <p className="text-xl text-[#94A3B8]">
              Comprehensive checks to optimize every aspect of your campaigns
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inViewSections['features'] ? 'visible' : 'hidden'}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: BarChart3,
                title: 'CTR Benchmark Analysis',
                desc: 'Compare your click-through rates against industry benchmarks'
              },
              {
                icon: Target,
                title: 'CPC vs Conversion Rate',
                desc: 'Identify high-cost keywords with low conversion performance'
              },
              {
                icon: AlertCircle,
                title: 'Impression Share Loss',
                desc: 'Detect budget and rank-based impression share losses'
              },
              {
                icon: Activity,
                title: 'Zero-Impression Detection',
                desc: 'Find underperforming ad groups getting no impressions'
              },
              {
                icon: CheckCircle2,
                title: 'Quality Score Anomalies',
                desc: 'Spot keywords with declining quality scores'
              },
              {
                icon: TrendingUp,
                title: 'Week-over-Week Anomalies',
                desc: 'Detect unusual metric changes week to week'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-6 bg-[#0A0E1A] border border-[#1E2D45] rounded-xl hover:border-[#4F8EF7] hover:shadow-lg hover:shadow-[#4F8EF7]/10 transition-all duration-300"
              >
                <feature.icon className="w-10 h-10 text-[#4F8EF7] mb-3" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-[#94A3B8] text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ============ PERFORMANCE SCORE SHOWCASE ============ */}
      <section
        id="score-showcase"
        data-section
        className="py-20 md:py-32 px-6 md:px-12 bg-[#0A0E1A]"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={inViewSections['score-showcase'] ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              One Number That Tells You Everything
            </h2>
            <p className="text-xl text-[#94A3B8] mb-4">
              Your performance score combines four key metrics into a single, actionable score
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Gauge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inViewSections['score-showcase'] ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <PerformanceGauge score={72} size={240} animated={true} />
            </motion.div>

            {/* Score breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inViewSections['score-showcase'] ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h3 className="font-bold text-lg mb-4">Score Breakdown</h3>
                <p className="text-[#94A3B8] mb-6">
                  Each component is scored 0-25 points, totaling 100
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: 'CTR Score',
                    desc: 'Click-through rate vs benchmark',
                    color: 'bg-[#4F8EF7]'
                  },
                  {
                    label: 'ROAS Score',
                    desc: 'Return on ad spend performance',
                    color: 'bg-[#34D399]'
                  },
                  {
                    label: 'Conversion Score',
                    desc: 'Conversion rate efficiency',
                    color: 'bg-[#A78BFA]'
                  },
                  {
                    label: 'Impression Share Score',
                    desc: 'Search impression share gains',
                    color: 'bg-[#FBBF24]'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#111827] p-4 rounded-lg border border-[#1E2D45]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="font-semibold">{item.label}</span>
                    </div>
                    <p className="text-sm text-[#94A3B8] ml-6">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Score bands */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inViewSections['score-showcase'] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 pt-8 border-t border-[#1E2D45]"
          >
            <p className="text-center text-[#94A3B8] mb-6">Score bands</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { band: 'Critical', range: '0-19', color: 'bg-[#F87171]' },
                { band: 'Poor', range: '20-39', color: 'bg-[#FB923C]' },
                { band: 'Average', range: '40-59', color: 'bg-[#FBBF24]' },
                { band: 'Good', range: '60-79', color: 'bg-[#34D399]' },
                { band: 'Excellent', range: '80-100', color: 'bg-[#10B981]' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`${item.color} px-4 py-3 rounded-lg text-center text-white font-semibold`}
                >
                  <div className="text-sm">{item.band}</div>
                  <div className="text-xs opacity-90">{item.range}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============ AI RECOMMENDATIONS PREVIEW ============ */}
      <section
        id="ai-preview"
        data-section
        className="py-20 md:py-32 px-6 md:px-12 bg-[#111827]"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={inViewSections['ai-preview'] ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              AI-Powered Recommendations
            </h2>
            <p className="text-xl text-[#94A3B8]">
              Gemini generates specific, actionable optimization steps for your account
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inViewSections['ai-preview'] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#0A0E1A] border border-[#1E2D45] rounded-xl p-8 shadow-xl hover:border-[#4F8EF7]/50 transition-all"
          >
            {/* Header with badges */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Increase bids on high-intent keywords
                </h3>
                <p className="text-[#94A3B8]">bidding</p>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-[#F87171] text-white text-xs font-bold rounded-full">
                  HIGH
                </div>
                <div className="px-3 py-1 bg-[#4F8EF7] text-white text-xs font-bold rounded-full">
                  Bidding
                </div>
              </div>
            </div>

            <p className="text-[#94A3B8] mb-6">
              Your account is losing 30% impression share due to low Ad Rank. Increasing bids on keywords with high intent signals could recover up to 150K monthly impressions and potentially 3-5% CTR uplift based on your current performance metrics.
            </p>

            <div className="bg-[#111827] rounded-lg p-4 mb-6">
              <p className="font-semibold text-[#34D399] mb-2">✨ Expected Impact</p>
              <p>15-25% improvement in impression share, estimated +2.3M monthly impressions</p>
            </div>

            <div>
              <p className="font-semibold mb-4">Action Steps</p>
              <div className="space-y-2">
                {[
                  'Review search term report to identify high-intent keywords',
                  'Create a new bidding strategy using Target CPA based on your conversions',
                  'Test 10-15% bid increases on converting keywords over 2 weeks'
                ].map((step, idx) => (
                  <label key={idx} className="flex items-start gap-3 p-2 hover:bg-[#1A2235] rounded transition-colors cursor-pointer">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-[#F1F5F9]">{step}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#1E2D45] text-sm text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                <span>Powered by Gemini AI · Specific to your data · Instant generation</span>
              </div>
            </div>
          </motion.div>

          <p className="text-center text-[#94A3B8] mt-8">
            You'll receive 5-8 recommendations like this, tailored to your specific account issues
          </p>
        </motion.div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-[#0A0E1A]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Optimize Your Campaigns?
          </h2>
          <p className="text-xl text-[#94A3B8] mb-8">
            Start with a free analysis. No credit card required.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-[#4F8EF7] text-white rounded-lg font-bold text-lg hover:bg-blue-600 transition-all shadow-lg inline-flex items-center gap-2"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-[#1E2D45] bg-[#111827] py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#A78BFA] flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-bold">AdsPulse</span>
              </div>
              <p className="text-[#94A3B8] text-sm">
                AI-powered Google Ads diagnostics engine
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-[#94A3B8] text-sm">
                <li>
                  <a href="#features" className="hover:text-[#F1F5F9] transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-[#F1F5F9] transition">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#score-showcase" className="hover:text-[#F1F5F9] transition">
                    Scoring
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-[#94A3B8] text-sm">
                <li>
                  <a href="#" className="hover:text-[#F1F5F9] transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F1F5F9] transition">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-[#0A0E1A] border border-[#1E2D45] rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#4F8EF7] hover:border-[#4F8EF7] transition-all"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-[#0A0E1A] border border-[#1E2D45] rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#4F8EF7] hover:border-[#4F8EF7] transition-all"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-[#1E2D45] pt-8 text-center text-[#94A3B8] text-sm">
            <p>© 2024 AdsPulse. Built for Google Ads professionals.</p>
          </div>
        </div>
      </footer>

      {/* CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0px, 0px); }
          33% { transform: translate(30px, -30px); }
          66% { transform: translate(-20px, 20px); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

