import { useState } from "react";

// ─── Global Styles ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --black:   #080808;
      --dark:    #111111;
      --card:    #161616;
      --card2:   #1c1c1c;
      --pink:    #e8c97a;
      --hot:     #d4a843;
      --lime:    #a8c5a0;
      --yellow:  #e8c97a;
      --cyan:    #8fb8c8;
      --white:   #f0ece4;
      --muted:   rgba(240,236,228,0.45);
      --border:  rgba(240,236,228,0.09);
      --borderpink: rgba(232,201,122,0.25);
    }

    html, body { height: 100%; }
    body {
      font-family: 'Outfit', sans-serif;
      background: var(--black);
      color: var(--white);
      min-height: 100vh;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--black); }
    ::-webkit-scrollbar-thumb { background: #3a3a3a; border-radius: 2px; }

    input[type=range] {
      -webkit-appearance: none; width: 100%; height: 3px;
      border-radius: 2px; background: #333; outline: none;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none; width: 18px; height: 18px;
      border-radius: 50%; background: var(--yellow); cursor: pointer;
      border: 2px solid var(--white);
    }
    input[type=number] { -moz-appearance: textfield; }
    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
    @keyframes glitch {
      0%,100% { text-shadow: 2px 0 var(--pink), -2px 0 var(--cyan); }
      25%      { text-shadow: -2px 0 var(--pink),  2px 0 var(--cyan); }
      50%      { text-shadow:  2px 2px var(--lime), -2px -2px var(--pink); }
    }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }

    .fade-up  { animation: fadeUp 0.5s ease forwards; }
    .fade-up2 { animation: fadeUp 0.5s 0.08s ease forwards; opacity:0; }
    .fade-up3 { animation: fadeUp 0.5s 0.16s ease forwards; opacity:0; }
    .fade-up4 { animation: fadeUp 0.5s 0.24s ease forwards; opacity:0; }

    a { color: inherit; text-decoration: none; }

    select option { background: #1c1c1c; color: #f0ece4; }
  `}</style>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n, d = 0) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD",
    minimumFractionDigits: d, maximumFractionDigits: d }).format(n || 0);
const pct = (v, t) => (t > 0 ? ((v / t) * 100).toFixed(1) : "0.0");

// ─── Articles Data ─────────────────────────────────────────────────────────────
const ARTICLES = [
  {
    id: 1,
    tag: "Spending Delulu",
    emoji: "💸",
    title: "\"I deserve this. I work hard.\"",
    subtitle: "The treat-yourself trap that's quietly wrecking your finances",
    color: "#e8c97a",
    readTime: "4 min",
    content: [
      { type: "hook", text: "You survived another Monday. You deserve that $14 matcha latte, the DoorDash order, the new sneakers, and the spontaneous Amazon haul. Totally valid... until you check your bank account." },
      { type: "delusion", label: "The Delusion", text: "Hard work entitles you to spend freely. Every purchase is a 'reward' for surviving the week. You'll start saving when things 'calm down.'" },
      { type: "reality", label: "The Reality Check", text: "The average person spending $15/day on 'deserved' treats spends $5,475/year — that's $54,750 over a decade. Invested at 7%, that's $76,000 in wealth you traded for momentary dopamine hits." },
      { type: "fix", label: "The Fix: Guilt-Free Spending Money", text: "Budget a fixed 'fun money' amount each month — no tracking, no guilt. When it's gone, it's gone. This way you actually deserve it because you planned for it. Try $150–$300/month depending on income." },
      { type: "rule", label: "The 24-Hour Rule", text: "For any non-essential purchase over $50, wait 24 hours. If you still want it tomorrow, buy it guilt-free. 70% of impulse wants disappear overnight." },
    ]
  },
  {
    id: 2,
    tag: "Income Delulu",
    emoji: "📈",
    title: "\"I'll save more when I earn more.\"",
    subtitle: "Why a bigger salary won't fix what budgeting needs to fix",
    color: "#a8c5a0",
    readTime: "5 min",
    content: [
      { type: "hook", text: "You tell yourself the problem is income. Once you get that raise, promotion, or side hustle income — THEN you'll start saving. Spoiler: you won't." },
      { type: "delusion", label: "The Delusion", text: "Your spending problems are caused by not earning enough. More income = more savings. It's just math." },
      { type: "reality", label: "The Reality Check", text: "Lifestyle inflation is real and ruthless. Studies consistently show that most people's expenses rise to meet — and exceed — their income increases. People earning $150k are often just as broke as people earning $50k, just with better furniture." },
      { type: "fix", label: "The Fix: Automate Before You See It", text: "Set up automatic transfers to savings on payday — before you can spend it. Start with even 5% of take-home. You will not miss money you never saw. When you get a raise, immediately increase the auto-transfer by half the raise amount." },
      { type: "rule", label: "The 50% Rule for Raises", text: "Every time your income increases, allocate 50% of the increase to savings/investments, 50% to lifestyle. This way you get to enjoy earning more AND build wealth simultaneously." },
    ]
  },
  {
    id: 3,
    tag: "Investment Delulu",
    emoji: "🧠",
    title: "\"Investing is for rich people.\"",
    subtitle: "The belief keeping regular people from becoming the rich people",
    color: "#8fb8c8",
    readTime: "6 min",
    content: [
      { type: "hook", text: "The stock market feels like a casino for rich guys in suits. You don't have enough money to invest. You'll start when you have a proper amount saved up. Meanwhile, inflation eats your savings account." },
      { type: "delusion", label: "The Delusion", text: "Investing requires significant capital, financial expertise, and a high risk tolerance. It's for people who already have money." },
      { type: "reality", label: "The Reality Check", text: "$100/month invested at 25 grows to $349,000 by age 65 at 10% average market returns. The same $100/month starting at 35 grows to only $132,000. The 'right amount to start' is whatever you have right now. A savings account at 4% APY loses to inflation. The market historically returns 10% annually." },
      { type: "fix", label: "The Fix: Index Funds Are Your Best Friend", text: "Start with a simple S&P 500 index fund (VOO, FSKAX, or FXAIX). No stock picking needed. No expertise required. Just buy every month and ignore the noise. Fidelity and Schwab have zero minimum investment accounts." },
      { type: "rule", label: "The Order of Operations", text: "1) 401k up to employer match (free money), 2) Pay off high-interest debt, 3) Max Roth IRA ($7,000/year), 4) Max 401k ($23,500/year), 5) Taxable brokerage. Follow this order and you're already ahead of 80% of people." },
    ]
  },
  {
    id: 4,
    tag: "Retirement Delulu",
    emoji: "⏰",
    title: "\"I'm too young to think about retirement.\"",
    subtitle: "The most expensive delusion you can have in your 20s",
    color: "#e8c97a",
    readTime: "5 min",
    content: [
      { type: "hook", text: "Retirement is for old people. You're young, you have time, you'll figure it out later. There are more important things to spend money on right now. Later-you can deal with it." },
      { type: "delusion", label: "The Delusion", text: "Retirement planning in your 20s is unnecessary and premature. You have decades — there's no urgency." },
      { type: "reality", label: "The Reality Check", text: "If you invest $5,000 at age 22 and never invest another dollar, it grows to $160,000 by retirement at 10% returns. If you wait until 32 to start and invest $5,000 every year for 33 years ($165,000 total), you end up with less. This is compound interest — time is your most valuable asset and you're burning it." },
      { type: "fix", label: "The Fix: Start Ugly, Start Now", text: "Open a Roth IRA today. Put in $50. That's it. The account is open, the habit is started. Increase contributions as you can. A Roth IRA gives you tax-free growth and tax-free withdrawals in retirement — it's the single best financial account for young people." },
      { type: "rule", label: "The \"Future You\" Framework", text: "Every retirement contribution is a gift to your future self. Future-you doesn't have to stress about money, work a job they hate to survive, or depend on anyone. Current-you spends $5 less on food delivery per day to make that happen. That's the trade." },
    ]
  },
  {
    id: 5,
    tag: "Debt Delulu",
    emoji: "💳",
    title: "\"I'll pay it off next month.\"",
    subtitle: "How minimum payments turn small purchases into year-long debt traps",
    color: "#e8c97a",
    readTime: "4 min",
    content: [
      { type: "hook", text: "You put $800 on the credit card, paid the minimum, and told yourself you'd clear it next month. That was 14 months ago. The balance is now $920 and you're not totally sure how." },
      { type: "delusion", label: "The Delusion", text: "Credit card debt is manageable as long as you make minimum payments. You'll pay it off when things slow down." },
      { type: "reality", label: "The Reality Check", text: "The average credit card APR in 2026 is 24.5%. A $3,000 balance making only minimum payments takes 14 years to pay off and costs $4,200 in interest — more than the original purchase. You are renting money at a 24.5% fee." },
      { type: "fix", label: "The Fix: Avalanche or Snowball — Pick One", text: "Avalanche: Pay minimums on all cards, throw every extra dollar at the highest interest rate first. Saves the most money. Snowball: Pay minimums on all cards, throw every extra dollar at the smallest balance first. Feels better psychologically. Both work. The best method is whichever one you'll actually stick to." },
      { type: "rule", label: "The Credit Card Golden Rule", text: "Never carry a balance. Use credit cards like a debit card — only spend what you have in checking. Pay the full statement balance every single month. The rewards points are not worth 24% interest." },
    ]
  },
  {
    id: 6,
    tag: "Budget Delulu",
    emoji: "🙈",
    title: "\"I don't need a budget, I know where my money goes.\"",
    subtitle: "You don't. Nobody does. Here's the proof.",
    color: "#a8c5a0",
    readTime: "4 min",
    content: [
      { type: "hook", text: "Budgets are for people who can't control themselves. You're responsible, you roughly know your spending, things are generally fine. Except... where did your paycheck go exactly?" },
      { type: "delusion", label: "The Delusion", text: "You're self-aware enough about your finances that a formal budget is unnecessary overhead. You'd know if something was wrong." },
      { type: "reality", label: "The Reality Check", text: "Studies show people underestimate their discretionary spending by 20–40% on average. Small recurring charges (subscriptions, apps, auto-renewals) often add up to $200–$500/month that people genuinely cannot account for. You can't improve what you don't measure." },
      { type: "fix", label: "The Fix: The 15-Minute Monthly Audit", text: "Once a month, export your bank/credit card statement and categorize every transaction. Takes 15 minutes. What you find will shock you. After 3 months you'll have accurate data on your actual spending patterns — not the version you imagine." },
      { type: "rule", label: "The Anti-Budget Budget", text: "If traditional budgets feel restrictive: calculate your monthly savings goal, auto-transfer it on payday, then spend whatever's left guilt-free. No tracking, no categories. Just one number: the savings transfer. Everything else is yours to spend." },
    ]
  },
  {
    id: 7,
    tag: "Housing Delulu",
    emoji: "🏠",
    title: "\"Renting is throwing money away.\"",
    subtitle: "The homeownership myth that's pressuring people into bad financial decisions",
    color: "#8fb8c8",
    readTime: "6 min",
    content: [
      { type: "hook", text: "Your parents say renting is flushing money down the drain. You should buy as soon as possible. Real estate always goes up. Renting is for people who haven't figured it out yet." },
      { type: "delusion", label: "The Delusion", text: "Renting is financially inferior to owning. Homeownership always builds wealth. You're 'wasting' rent money." },
      { type: "reality", label: "The Reality Check", text: "Buying a home costs 2–5% in closing costs upfront plus property taxes, insurance, maintenance (~1% of home value per year), and HOA fees. In many markets, renting and investing the difference outperforms owning over 5–7 year periods. The break-even point varies massively by city, interest rate, and market." },
      { type: "fix", label: "The Fix: Run the Numbers for YOUR City", text: "Use the NYT Rent vs Buy calculator for your specific city and timeline. The answer is genuinely different in Austin vs San Francisco vs Detroit. Homeownership can be great — but buy because the math works, not because of societal pressure." },
      { type: "rule", label: "The 5-Year Rule", text: "If you're not planning to stay in a city for at least 5 years, renting is almost always the better financial choice when you account for transaction costs. Flexibility has real monetary value in your 20s and 30s." },
    ]
  },
  {
    id: 8,
    tag: "Income Delulu",
    emoji: "🎰",
    title: "\"I'll just make more money instead of budgeting.\"",
    subtitle: "Why hustle culture is a cope for people avoiding the real work",
    color: "#e8c97a",
    readTime: "5 min",
    content: [
      { type: "hook", text: "You don't have a spending problem, you have an income problem. The solution isn't cutting back — it's hustling harder. Side gigs, freelancing, monetizing your passion. Budget culture is for people with a scarcity mindset." },
      { type: "delusion", label: "The Delusion", text: "Increasing income is always a better use of energy than reducing expenses. Frugality is limiting. Earning more solves everything." },
      { type: "reality", label: "The Reality Check", text: "Earning more is excellent advice — but without spending discipline, lifestyle inflation consumes every raise. The highest earners in America have some of the lowest savings rates. Earning more AND spending wisely is the actual formula. Replacing budgeting with hustle culture just means you earn more to spend more." },
      { type: "fix", label: "The Fix: Do Both, In Order", text: "Step 1: Get your current income under control with a basic budget. Step 2: Then aggressively pursue income growth. Extra income on top of a solid base = actual wealth building. Extra income with no base = upgraded lifestyle, same financial stress." },
      { type: "rule", label: "The Wealth Formula", text: "Wealth = (Income - Expenses) × Time × Returns. All four variables matter. Optimizing income while ignoring expenses is like pressing the accelerator while dragging the parking brake." },
    ]
  },
];

// ─── Auth Modal ───────────────────────────────────────────────────────────────
function AuthModal({ onLogin, onClose }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["","","","","",""]);
  const [genOtp, setGenOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const sendOtp = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email."); return; }
    setLoading(true);
    setTimeout(() => {
      const c = String(Math.floor(100000 + Math.random() * 900000));
      setGenOtp(c); setNotice(`Demo code: ${c}`);
      setStep("otp"); setLoading(false); setError("");
    }, 1000);
  };

  const verifyOtp = () => {
    const v = otp.join("");
    if (v.length < 6) { setError("Enter all 6 digits."); return; }
    if (v !== genOtp) { setError("Wrong code. Try again."); return; }
    setLoading(true);
    setTimeout(() => { onLogin(email); onClose(); }, 700);
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const n = [...otp]; n[i] = val.slice(-1); setOtp(n);
    if (val && i < 5) document.getElementById(`d-otp-${i+1}`)?.focus();
  };

  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modal} className="fade-up">
        <button style={S.modalX} onClick={onClose}>✕</button>
        <div style={S.modalLogo}>
          <span style={S.logoIcon}>💸</span>
          <div>
            <div style={S.modalBrand}>WealthDelulu</div>
            <div style={S.modalTagline}>no password needed. just vibes + email.</div>
          </div>
        </div>
        {step === "email" ? (
          <>
            <p style={S.modalSub}>Drop your email, get a code, get in. No passwords stored, ever.</p>
            <label style={S.lbl}>your email</label>
            <input style={S.inp} type="email" placeholder="you@example.com" value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && sendOtp()} />
            {error && <p style={S.err}>{error}</p>}
            <button style={S.btnP} onClick={sendOtp} disabled={loading}>
              {loading ? <span style={S.spin}/> : "send me the code →"}
            </button>
          </>
        ) : (
          <>
            <p style={S.modalSub}>6-digit code sent to <strong style={{color:"var(--pink)"}}>{email}</strong></p>
            {notice && <div style={S.noticeBox}>🔐 {notice}<span style={{display:"block",fontSize:11,marginTop:3,opacity:0.6}}>(demo — no real backend)</span></div>}
            <div style={S.otpRow}>
              {otp.map((d,i) => (
                <input key={i} id={`d-otp-${i}`} style={S.otpBox} type="text" inputMode="numeric"
                  maxLength={1} value={d} onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => e.key==="Backspace" && !otp[i] && i>0 && document.getElementById(`d-otp-${i-1}`)?.focus()} />
              ))}
            </div>
            {error && <p style={S.err}>{error}</p>}
            <button style={S.btnP} onClick={verifyOtp} disabled={loading}>
              {loading ? <span style={S.spin}/> : "verify & enter →"}
            </button>
            <button style={S.btnG} onClick={() => { setStep("email"); setOtp(["","","","","",""]); setError(""); }}>← change email</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Article Modal ────────────────────────────────────────────────────────────
function ArticleModal({ article, onClose }) {
  if (!article) return null;
  const icons = { hook: "💬", delusion: "🌀", reality: "💡", fix: "🛠️", rule: "📌" };
  const colors = { delusion: "rgba(232,201,122,0.08)", reality: "rgba(143,184,200,0.08)", fix: "rgba(168,197,160,0.09)", rule: "rgba(255,230,0,0.08)" };
  const borders = { delusion: "var(--pink)", reality: "var(--cyan)", fix: "var(--lime)", rule: "var(--yellow)" };

  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.articleModal }} className="fade-up">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
          <div>
            <span style={{ ...S.tag, background: article.color + "22", color: article.color, borderColor: article.color + "44" }}>{article.tag}</span>
            <div style={{ fontSize: 11, color:"var(--muted)", marginTop:8 }}>{article.readTime} read</div>
          </div>
          <button style={S.modalX} onClick={onClose}>✕</button>
        </div>
        <h2 style={{ fontFamily:"'Bebas Neue',display", fontSize:36, letterSpacing:"0.02em", color:"var(--white)", marginBottom:8, lineHeight:1.1 }}>{article.emoji} {article.title}</h2>
        <p style={{ fontSize:15, color:"var(--muted)", marginBottom:32, lineHeight:1.6 }}>{article.subtitle}</p>
        {article.content.map((block, i) => (
          <div key={i} style={{
            marginBottom: 20,
            padding: block.type === "hook" ? "16px 20px" : "16px 20px",
            background: block.type === "hook" ? "rgba(255,255,255,0.04)" : (colors[block.type] || "rgba(255,255,255,0.04)"),
            borderRadius: 12,
            borderLeft: block.type !== "hook" ? `3px solid ${borders[block.type] || "var(--pink)"}` : "none",
          }}>
            {block.label && <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color: borders[block.type], marginBottom:8 }}>{icons[block.type]} {block.label}</div>}
            <p style={{ fontSize:14, color: block.type === "hook" ? "var(--white)" : "rgba(248,248,248,0.85)", lineHeight:1.7 }}>{block.text}</p>
          </div>
        ))}
        <button style={{ ...S.btnP, marginTop:8 }} onClick={onClose}>← back to articles</button>
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ user, active, setActive, onLogout, onOpenAuth }) {
  const tabs = [
    { id:"home",      label:"Home",        icon:"⌂" },
    { id:"articles",  label:"Articles",    icon:"✦" },
    { id:"budget",    label:"Budget",      icon:"◈" },
    { id:"calcs",     label:"Calculators", icon:"∑" },
    { id:"networth",  label:"Net Worth",   icon:"◉" },
  ];
  return (
    <nav style={S.nav}>
      <div style={S.navBrand} onClick={() => setActive("home")}>
        <span style={{ fontSize:20 }}>💸</span>
        <span style={S.navBrandText}>WealthDelulu</span>
        <span style={S.navDot}>.com</span>
      </div>
      <div style={S.navTabs}>
        {tabs.map(t => (
          <button key={t.id} style={{ ...S.navTab, ...(active===t.id ? S.navTabOn : {}) }} onClick={() => setActive(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={S.navRight}>
        {user ? (
          <>
            <div style={S.avatar}>{user[0].toUpperCase()}</div>
            <button style={S.outlineBtn} onClick={onLogout}>sign out</button>
          </>
        ) : (
          <button style={S.pinkBtn} onClick={onOpenAuth}>sign in</button>
        )}
      </div>
    </nav>
  );
}

// ─── Ticker ───────────────────────────────────────────────────────────────────
function Ticker() {
  const items = ["DELULU IS THE SOLULU ✦", "STACK YOUR COINS ✦", "BUDGET > BROKE ✦", "WEALTH IS A MINDSET ✦", "NO MORE FINANCIAL DELUSIONS ✦", "INVEST IN YOURSELF ✦", "COMPOUNDING IS MAGIC ✦", "SAVE NOW, FLEX LATER ✦"];
  const text = items.join("   ");
  return (
    <div style={S.ticker}>
      <div style={S.tickerInner}>
        <span style={S.tickerText}>{text}&nbsp;&nbsp;&nbsp;{text}</span>
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ setActive, user, onOpenAuth }) {
  const stats = [
    { n:"78%",   d:"of people live paycheck to paycheck", c:"var(--pink)" },
    { n:"$90k",  d:"average American's net worth at 50", c:"var(--lime)" },
    { n:"24.5%", d:"average credit card APR in 2026",    c:"var(--cyan)" },
    { n:"$0",    d:"what most people invest monthly at 25", c:"var(--yellow)" },
  ];
  return (
    <div>
      {/* Hero */}
      <div style={S.hero}>
        <div style={S.heroBg} />
        <div style={S.heroContent}>
          <div className="fade-up" style={S.heroBadge}>✦ the finance site that tells it like it is</div>
          <h1 className="fade-up2" style={S.heroTitle}>
            Stop Being<br />
            <span style={S.heroTitlePink}>Financially</span><br />
            Delusional.
          </h1>
          <p className="fade-up3" style={S.heroSub}>
            Real talk about money, budgets & wealth building — no sugarcoating, no judgment. Just the delusions holding you back and exactly how to fix them.
          </p>
          <div className="fade-up4" style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <button style={S.heroCta} onClick={() => setActive("articles")}>read the delusions →</button>
            <button style={S.heroCtaGhost} onClick={() => setActive("budget")}>try the budget calc</button>
          </div>
        </div>
        <div style={S.heroRight} className="fade-up3">
          <div style={S.heroCard}>
            <div style={{ fontSize:12, color:"var(--muted)", marginBottom:6 }}>if you invested instead of</div>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:42, color:"var(--pink)", lineHeight:1 }}>$15/day</div>
            <div style={{ fontSize:12, color:"var(--muted)", margin:"6px 0" }}>on "treat yourself" for 30 years</div>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:52, color:"var(--lime)", lineHeight:1 }}>$1.7M</div>
            <div style={{ fontSize:11, color:"var(--muted)", marginTop:6 }}>at 10% avg market return</div>
            <div style={{ height:1, background:"var(--border)", margin:"16px 0" }} />
            <div style={{ fontSize:12, color:"rgba(248,248,248,0.6)" }}>delulu is the solulu 💸</div>
          </div>
        </div>
      </div>

      <Ticker />

      {/* Stats */}
      <div style={S.section}>
        <div style={S.sectionTag}>the hard truth</div>
        <h2 style={S.sectionTitle}>The Numbers Are <span style={{color:"var(--pink)"}}>Not OK.</span></h2>
        <div style={S.statsGrid}>
          {stats.map(s => (
            <div key={s.n} style={{ ...S.statCard, borderColor: s.c + "33" }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:52, color:s.c, lineHeight:1, marginBottom:8 }}>{s.n}</div>
              <div style={{ fontSize:14, color:"var(--muted)", lineHeight:1.5 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Articles Preview */}
      <div style={S.section}>
        <div style={S.sectionTag}>popular delusions</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:28, flexWrap:"wrap", gap:12 }}>
          <h2 style={{ ...S.sectionTitle, marginBottom:0 }}>Which Delusion<br />Do You Have?</h2>
          <button style={S.outlineBtn} onClick={() => setActive("articles")}>see all 8 →</button>
        </div>
        <div style={S.articlePreviewGrid}>
          {ARTICLES.slice(0, 4).map(a => (
            <div key={a.id} style={{ ...S.articlePreviewCard, borderColor: a.color + "33" }} onClick={() => setActive("articles")}>
              <div style={{ fontSize:28, marginBottom:12 }}>{a.emoji}</div>
              <span style={{ ...S.tag, background: a.color+"22", color:a.color, borderColor: a.color+"44" }}>{a.tag}</span>
              <h3 style={S.articlePreviewTitle}>{a.title}</h3>
              <p style={S.articlePreviewSub}>{a.subtitle}</p>
              <div style={{ fontSize:12, color:"var(--muted)", marginTop:"auto", paddingTop:12 }}>{a.readTime} read →</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tools CTA */}
      <div style={S.section}>
        <div style={S.toolsCtaGrid}>
          {[
            { icon:"◈", label:"Budget Planner", desc:"50/30/20 rule with every human need & want tracked", tab:"budget", c:"var(--pink)" },
            { icon:"∑", label:"Finance Calculators", desc:"Compound interest, loans, retirement & more", tab:"calcs", c:"var(--lime)" },
            { icon:"◉", label:"Net Worth Tracker", desc:"Assets vs liabilities — your real number", tab:"networth", c:"var(--cyan)" },
          ].map(t => (
            <div key={t.tab} style={{ ...S.toolCard, borderColor: t.c+"33" }} onClick={() => setActive(t.tab)}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:36, color:t.c, marginBottom:8 }}>{t.icon}</div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, color:"var(--white)", marginBottom:6 }}>{t.label}</h3>
              <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.6, marginBottom:16 }}>{t.desc}</p>
              <span style={{ fontSize:13, color:t.c }}>open tool →</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sign-in CTA if not logged in */}
      {!user && (
        <div style={S.section}>
          <div style={S.signInCta}>
            <div>
              <h3 style={{ fontFamily:"'Bebas Neue'", fontSize:36, color:"var(--white)", marginBottom:6 }}>Save Your Progress. Track Your Glow-Up.</h3>
              <p style={{ fontSize:14, color:"var(--muted)" }}>Sign in with just your email — no passwords, no BS.</p>
            </div>
            <button style={S.pinkBtn} onClick={onOpenAuth}>sign in free →</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Articles Page ─────────────────────────────────────────────────────────────
function ArticlesPage() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const tags = ["All", ...Array.from(new Set(ARTICLES.map(a => a.tag)))];
  const filtered = filter === "All" ? ARTICLES : ARTICLES.filter(a => a.tag === filter);

  return (
    <div style={S.page}>
      {selected && <ArticleModal article={selected} onClose={() => setSelected(null)} />}
      <div className="fade-up" style={S.sectionTag}>the delusion library</div>
      <h1 className="fade-up2" style={S.pageTitle}>
        8 Financial Delusions<br /><span style={{color:"var(--pink)"}}>Keeping You Broke.</span>
      </h1>
      <p className="fade-up3" style={S.pageSub}>We all have at least one. Find yours, fix it, get rich. Or at least less broke.</p>

      {/* Filter tags */}
      <div className="fade-up4" style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:32 }}>
        {tags.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            ...S.filterTag, ...(filter===t ? S.filterTagOn : {})
          }}>{t}</button>
        ))}
      </div>

      <div style={S.articlesGrid}>
        {filtered.map((a, i) => (
          <div key={a.id} className={i<2?"fade-up":""} style={{ ...S.articleCard, borderColor: a.color+"33" }}
            onClick={() => setSelected(a)}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
              <span style={{ fontSize:32 }}>{a.emoji}</span>
              <span style={{ ...S.tag, background: a.color+"22", color:a.color, borderColor: a.color+"44" }}>{a.tag}</span>
            </div>
            <h3 style={S.articleTitle}>{a.title}</h3>
            <p style={S.articleDesc}>{a.subtitle}</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"auto", paddingTop:16 }}>
              <span style={{ fontSize:12, color:"var(--muted)" }}>{a.readTime} read</span>
              <span style={{ fontSize:13, color: a.color, fontWeight:600 }}>read fix →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Budget Calculator ─────────────────────────────────────────────────────────
const NEEDS = [
  { key:"rent",      label:"Rent / Mortgage",    default:1200, emoji:"🏠" },
  { key:"utilities", label:"Utilities",           default:150,  emoji:"💡" },
  { key:"groceries", label:"Groceries",           default:400,  emoji:"🛒" },
  { key:"transport", label:"Transportation",      default:300,  emoji:"🚗" },
  { key:"healthIns", label:"Health Insurance",    default:200,  emoji:"🏥" },
  { key:"carIns",    label:"Car Insurance",       default:120,  emoji:"🛡️" },
  { key:"lifeIns",   label:"Life Insurance",      default:50,   emoji:"🔒" },
  { key:"minDebt",   label:"Min Debt Payments",   default:250,  emoji:"📋" },
  { key:"childcare", label:"Childcare / School",  default:0,    emoji:"👶" },
  { key:"phone",     label:"Phone Bill",          default:60,   emoji:"📱" },
  { key:"internet",  label:"Internet",            default:60,   emoji:"📡" },
  { key:"medical",   label:"Medical / Rx",        default:50,   emoji:"💊" },
];
const WANTS = [
  { key:"dining",      label:"Dining Out",         default:200, emoji:"🍽️" },
  { key:"entertain",   label:"Entertainment",      default:100, emoji:"🎬" },
  { key:"subs",        label:"Subscriptions",      default:50,  emoji:"📺" },
  { key:"shopping",    label:"Shopping / Clothing",default:150, emoji:"🛍️" },
  { key:"hobbies",     label:"Hobbies",            default:80,  emoji:"🎯" },
  { key:"travel",      label:"Travel / Vacations", default:100, emoji:"✈️" },
  { key:"care",        label:"Personal Care",      default:60,  emoji:"💅" },
  { key:"fitness",     label:"Gym / Fitness",      default:50,  emoji:"🏋️" },
  { key:"gifts",       label:"Gifts / Donations",  default:50,  emoji:"🎁" },
  { key:"pets",        label:"Pets",               default:60,  emoji:"🐾" },
];
const SAVINGS = [
  { key:"emergency",   label:"Emergency Fund",         default:100, emoji:"🆘" },
  { key:"retirement",  label:"Retirement (401k/IRA)",  default:300, emoji:"🏦" },
  { key:"invest",      label:"Investments / Brokerage",default:100, emoji:"📈" },
  { key:"extraDebt",   label:"Extra Debt Payoff",      default:100, emoji:"💳" },
  { key:"edu",         label:"Education Savings",      default:0,   emoji:"🎓" },
  { key:"goal",        label:"Short-term Goal",        default:50,  emoji:"🎯" },
];

function BudgetPage() {
  const [income, setIncome] = useState(5000);
  const init = arr => Object.fromEntries(arr.map(x => [x.key, x.default]));
  const [needs, setNeeds]   = useState(init(NEEDS));
  const [wants, setWants]   = useState(init(WANTS));
  const [savgs, setSavgs]   = useState(init(SAVINGS));

  const sumObj = o => Object.values(o).reduce((a,b) => a+(Number(b)||0), 0);
  const tN = sumObj(needs), tW = sumObj(wants), tS = sumObj(savgs);
  const total = tN+tW+tS, rem = income-total;

  const Section = ({ title, col, items, vals, setVals, total: tot, ideal }) => (
    <div style={{ ...S.budgetSection, borderColor: col+"44" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div>
          <h3 style={{ fontFamily:"'Syne'", fontWeight:700, fontSize:18, color:col, margin:0 }}>{title}</h3>
          <span style={{ fontSize:11, color:"var(--muted)" }}>ideal ~{ideal}% of income</span>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:26, color:col }}>{fmt(tot)}</div>
          <div style={{ fontSize:11, color:"var(--muted)" }}>{pct(tot,income)}%</div>
        </div>
      </div>
      <div style={{ height:4, borderRadius:2, background:"#222", marginBottom:20, position:"relative" }}>
        <div style={{ height:"100%", borderRadius:2, background:col, width:`${Math.min(100,pct(tot,income))}%`, transition:"width 0.4s" }} />
        <div style={{ position:"absolute", top:-4, left:`${ideal}%`, width:2, height:12, background:"rgba(255,255,255,0.2)", borderRadius:1 }} />
      </div>
      <div style={S.budgetGrid}>
        {items.map(item => (
          <div key={item.key} style={S.budgetItem}>
            <span style={{ fontSize:13, color:"var(--white)", display:"flex", alignItems:"center", gap:6 }}>
              {item.emoji} {item.label}
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontFamily:"'Bebas Neue'", fontSize:15, color:col, minWidth:55, textAlign:"right" }}>{fmt(vals[item.key])}</span>
              <input style={{ ...S.inp, width:85, padding:"5px 10px", fontSize:13 }} type="number" min={0}
                value={vals[item.key]} onChange={e => setVals(v => ({ ...v, [item.key]: Number(e.target.value) }))} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.sectionTag} className="fade-up">50/30/20 Budget Calculator</div>
      <h1 style={S.pageTitle} className="fade-up2">Budget Like You<br /><span style={{color:"var(--lime)"}}>Actually Mean It.</span></h1>

      <div style={{ ...S.card, background:"linear-gradient(135deg, rgba(168,197,160,0.07), rgba(22,22,22,0.9))", marginBottom:32 }} className="fade-up3">
        <h3 style={{ fontFamily:"'Syne'", fontWeight:700, color:"var(--lime)", marginBottom:16 }}>Monthly Take-Home Income</h3>
        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <div style={{ flex:1 }}>
            <input type="range" min={500} max={20000} step={100} value={income} onChange={e => setIncome(Number(e.target.value))} />
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--muted)", marginTop:4 }}><span>$500</span><span>$20,000</span></div>
          </div>
          <input style={{ ...S.inp, width:120, fontFamily:"'Bebas Neue'", fontSize:22, color:"var(--lime)", textAlign:"center" }}
            type="number" value={income} onChange={e => setIncome(Number(e.target.value))} />
        </div>
      </div>

      <div style={S.summaryRow} className="fade-up4">
        {[
          { l:"Needs",   v:tN, c:"var(--pink)",   ideal:50 },
          { l:"Wants",   v:tW, c:"var(--yellow)",  ideal:30 },
          { l:"Savings", v:tS, c:"var(--lime)",    ideal:20 },
          { l:"Remaining", v:rem, c: rem>=0 ? "var(--cyan)" : "var(--pink)", ideal:null },
        ].map(s => (
          <div key={s.l} style={{ ...S.summaryCard, borderColor: s.c+"44" }}>
            <div style={{ fontSize:12, color:"var(--muted)", marginBottom:4 }}>{s.l}</div>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:30, color:s.c }}>{fmt(s.v)}</div>
            <div style={{ fontSize:11, color:"var(--muted)" }}>{pct(s.v, income)}%{s.ideal ? ` / ideal ${s.ideal}%` : (rem>=0 ? " ✓ on track" : " ⚠ over")}</div>
          </div>
        ))}
      </div>

      <Section title="🏠 Needs"         col="var(--pink)"   items={NEEDS}   vals={needs} setVals={setNeeds} total={tN} ideal={50} />
      <Section title="✨ Wants"         col="var(--yellow)" items={WANTS}   vals={wants} setVals={setWants} total={tW} ideal={30} />
      <Section title="💰 Savings & Debt" col="var(--lime)"  items={SAVINGS} vals={savgs} setVals={setSavgs} total={tS} ideal={20} />
    </div>
  );
}

// ─── Finance Calculators ───────────────────────────────────────────────────────
function CalcsPage() {
  const [tab, setTab] = useState("compound");
  const tabs = [
    { id:"compound", l:"Compound Interest" },
    { id:"loan",     l:"Loan / Mortgage" },
    { id:"savings",  l:"Savings Goal" },
    { id:"emergency",l:"Emergency Fund" },
    { id:"retire",   l:"Retirement" },
  ];
  return (
    <div style={S.page}>
      <div style={S.sectionTag} className="fade-up">financial calculators</div>
      <h1 style={S.pageTitle} className="fade-up2">Run The Numbers.<br /><span style={{color:"var(--cyan)"}}>Face Reality.</span></h1>
      <div style={S.tabBar} className="fade-up3">
        {tabs.map(t => <button key={t.id} style={{ ...S.tabBtn, ...(tab===t.id?S.tabBtnOn:{}) }} onClick={() => setTab(t.id)}>{t.l}</button>)}
      </div>
      <div className="fade-up4">
        {tab==="compound"  && <CompoundCalc />}
        {tab==="loan"      && <LoanCalc />}
        {tab==="savings"   && <SavingsCalc />}
        {tab==="emergency" && <EmergencyCalc />}
        {tab==="retire"    && <RetireCalc />}
      </div>
    </div>
  );
}

function CalcGrid({ children }) {
  return <div style={{ ...S.card, display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"start" }}>{children}</div>;
}
function F({ label, children }) {
  return <div style={{ marginBottom:16 }}><label style={S.lbl}>{label}</label>{children}</div>;
}
function RRow({ label, value, hi }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
      <span style={{ fontSize:13, color:"var(--muted)" }}>{label}</span>
      <span style={{ fontFamily:"'Bebas Neue'", fontSize:18, color: hi?"var(--pink)":"var(--white)" }}>{value}</span>
    </div>
  );
}
function Bar({ a, b, ca, cb, la, lb }) {
  const total = a+b; if (!total) return null;
  return (
    <div style={{ marginTop:16, padding:14, background:"rgba(255,255,255,0.03)", borderRadius:10, border:"1px solid var(--border)" }}>
      <div style={{ height:12, borderRadius:6, overflow:"hidden", display:"flex", marginBottom:8 }}>
        <div style={{ width:`${(a/total)*100}%`, background:ca, transition:"width 0.5s" }} />
        <div style={{ flex:1, background:cb }} />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--muted)" }}>
        <span style={{color:ca}}>{la} ({pct(a,total)}%)</span>
        <span style={{color:cb}}>{lb} ({pct(b,total)}%)</span>
      </div>
    </div>
  );
}

function CompoundCalc() {
  const [p, setP] = useState(10000);
  const [r, setR] = useState(7);
  const [y, setY] = useState(20);
  const [c, setC] = useState(200);
  const [f, setF] = useState(12);

  const rate = r/100/f, n = y*f;
  const fv = p*Math.pow(1+rate,n) + c*((Math.pow(1+rate,n)-1)/rate);
  const contrib = p+c*n, growth = fv-contrib;

  return (
    <CalcGrid>
      <div>
        <h3 style={S.calcH}>Compound Interest</h3>
        <F label="Initial Investment"><input style={S.inp} type="number" value={p} onChange={e=>setP(+e.target.value)}/></F>
        <F label="Annual Rate (%)"><input style={S.inp} type="number" step={0.1} value={r} onChange={e=>setR(+e.target.value)}/></F>
        <F label="Years"><input style={S.inp} type="number" value={y} onChange={e=>setY(+e.target.value)}/></F>
        <F label="Monthly Contribution"><input style={S.inp} type="number" value={c} onChange={e=>setC(+e.target.value)}/></F>
        <F label="Compounding">
          <select style={S.inp} value={f} onChange={e=>setF(+e.target.value)}>
            <option value={1}>Annually</option><option value={4}>Quarterly</option>
            <option value={12}>Monthly</option><option value={365}>Daily</option>
          </select>
        </F>
      </div>
      <div>
        <h3 style={S.calcH}>Results</h3>
        <RRow label="Total Contributed" value={fmt(contrib)} />
        <RRow label="Interest Earned" value={fmt(growth)} />
        <RRow label="Future Value" value={fmt(fv)} hi />
        <Bar a={contrib} b={growth} ca="var(--cyan)" cb="var(--pink)" la="Contributed" lb="Growth" />
        <div style={S.insight}>📈 Money grows <strong style={{color:"var(--pink)"}}>{(fv/p).toFixed(1)}×</strong> in {y} years at {r}% — that's compound interest working for you.</div>
      </div>
    </CalcGrid>
  );
}

function LoanCalc() {
  const [loan, setLoan]   = useState(300000);
  const [down, setDown]   = useState(60000);
  const [rate, setRate]   = useState(6.5);
  const [term, setTerm]   = useState(30);

  const p = loan-down, r = rate/100/12, n = term*12;
  const mo = r===0 ? p/n : (p*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
  const total = mo*n, interest = total-p;

  return (
    <CalcGrid>
      <div>
        <h3 style={S.calcH}>Loan / Mortgage</h3>
        <F label="Loan Amount"><input style={S.inp} type="number" value={loan} onChange={e=>setLoan(+e.target.value)}/></F>
        <F label="Down Payment"><input style={S.inp} type="number" value={down} onChange={e=>setDown(+e.target.value)}/></F>
        <F label="Interest Rate (%)"><input style={S.inp} type="number" step={0.1} value={rate} onChange={e=>setRate(+e.target.value)}/></F>
        <F label="Loan Term">
          <select style={S.inp} value={term} onChange={e=>setTerm(+e.target.value)}>
            {[5,10,15,20,25,30].map(y=><option key={y} value={y}>{y} years</option>)}
          </select>
        </F>
      </div>
      <div>
        <h3 style={S.calcH}>Results</h3>
        <RRow label="Principal" value={fmt(p)} />
        <RRow label="Monthly Payment" value={fmt(mo,2)} hi />
        <RRow label="Total Payments" value={fmt(total)} />
        <RRow label="Total Interest" value={fmt(interest)} />
        <Bar a={p} b={interest} ca="var(--cyan)" cb="#c47a6a" la="Principal" lb="Interest" />
        <div style={S.insight}>💡 You pay <strong style={{color:"var(--pink)"}}>{fmt(interest)}</strong> in interest — {pct(interest,total)}% of all payments go to the bank.</div>
      </div>
    </CalcGrid>
  );
}

function SavingsCalc() {
  const [goal, setGoal]   = useState(50000);
  const [saved, setSaved] = useState(5000);
  const [mo, setMo]       = useState(500);
  const [rate, setRate]   = useState(4.5);

  const r = rate/100/12;
  const months = r>0 ? Math.log((goal*r+mo)/(saved*r+mo))/Math.log(1+r) : (goal-saved)/mo;
  const yrs = months/12;
  const contrib = mo*Math.max(0,months);

  return (
    <CalcGrid>
      <div>
        <h3 style={S.calcH}>Savings Goal</h3>
        <F label="Savings Goal"><input style={S.inp} type="number" value={goal} onChange={e=>setGoal(+e.target.value)}/></F>
        <F label="Already Saved"><input style={S.inp} type="number" value={saved} onChange={e=>setSaved(+e.target.value)}/></F>
        <F label="Monthly Contribution"><input style={S.inp} type="number" value={mo} onChange={e=>setMo(+e.target.value)}/></F>
        <F label="Expected Return (%)"><input style={S.inp} type="number" step={0.1} value={rate} onChange={e=>setRate(+e.target.value)}/></F>
      </div>
      <div>
        <h3 style={S.calcH}>Results</h3>
        <RRow label="Remaining to Save" value={fmt(goal-saved)} />
        <RRow label="Time to Goal" value={yrs>=1 ? `${yrs.toFixed(1)} yrs` : `${Math.round(months)} mos`} hi />
        <RRow label="Total Contributions" value={fmt(contrib)} />
        <RRow label="Interest Earned" value={fmt(goal-saved-contrib)} />
        <div style={{ marginTop:16 }}>
          <div style={{ fontSize:11, color:"var(--muted)", marginBottom:6 }}>Progress so far</div>
          <div style={{ height:8, borderRadius:4, background:"#222", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${Math.min(100,(saved/goal)*100)}%`, background:"var(--lime)", transition:"width 0.5s" }} />
          </div>
          <div style={{ fontSize:11, color:"var(--muted)", marginTop:4 }}>{fmt(saved)} of {fmt(goal)} ({pct(saved,goal)}%)</div>
        </div>
        <div style={S.insight}>🎯 Add $100/mo more and you reach your goal ~{(100/mo*12).toFixed(1)} months sooner.</div>
      </div>
    </CalcGrid>
  );
}

function EmergencyCalc() {
  const [exp,  setExp]  = useState(4000);
  const [mos,  setMos]  = useState(6);
  const [have, setHave] = useState(5000);
  const [add,  setAdd]  = useState(300);

  const target = exp*mos, gap = Math.max(0,target-have);
  const toGoal = gap>0 ? Math.ceil(gap/add) : 0;

  return (
    <CalcGrid>
      <div>
        <h3 style={S.calcH}>Emergency Fund</h3>
        <F label="Monthly Expenses"><input style={S.inp} type="number" value={exp} onChange={e=>setExp(+e.target.value)}/></F>
        <F label="Months of Coverage">
          <select style={S.inp} value={mos} onChange={e=>setMos(+e.target.value)}>
            {[3,4,5,6,9,12].map(m=><option key={m} value={m}>{m} months</option>)}
          </select>
        </F>
        <F label="Currently Saved"><input style={S.inp} type="number" value={have} onChange={e=>setHave(+e.target.value)}/></F>
        <F label="Monthly Contribution"><input style={S.inp} type="number" value={add} onChange={e=>setAdd(+e.target.value)}/></F>
      </div>
      <div>
        <h3 style={S.calcH}>Results</h3>
        <RRow label="Target Fund" value={fmt(target)} hi />
        <RRow label="Currently Have" value={fmt(have)} />
        <RRow label="Gap Remaining" value={fmt(gap)} />
        <RRow label="Months to Funded" value={gap>0 ? `${toGoal} months` : "✓ FUNDED!"} />
        <div style={{ marginTop:16, height:8, borderRadius:4, background:"#222", overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${Math.min(100,(have/target)*100)}%`, background: have>=target?"var(--lime)":"var(--pink)", transition:"width 0.5s" }} />
        </div>
        <div style={{ fontSize:11, color:"var(--muted)", marginTop:6 }}>{pct(have,target)}% funded</div>
        <div style={S.insight}>🛡️ Keep this in a high-yield savings account earning 4–5% APY.</div>
      </div>
    </CalcGrid>
  );
}

function RetireCalc() {
  const [age,    setAge]    = useState(30);
  const [ret,    setRet]    = useState(65);
  const [saved,  setSaved]  = useState(20000);
  const [mo,     setMo]     = useState(500);
  const [rate,   setRate]   = useState(7);
  const [wd,     setWd]     = useState(4);

  const yrs = ret-age, n = yrs*12, r = rate/100/12;
  const fv = saved*Math.pow(1+r,n) + mo*((Math.pow(1+r,n)-1)/r);
  const annIncome = fv*(wd/100);

  return (
    <CalcGrid>
      <div>
        <h3 style={S.calcH}>Retirement Planner</h3>
        <F label="Current Age"><input style={S.inp} type="number" value={age} onChange={e=>setAge(+e.target.value)}/></F>
        <F label="Retirement Age"><input style={S.inp} type="number" value={ret} onChange={e=>setRet(+e.target.value)}/></F>
        <F label="Current Savings"><input style={S.inp} type="number" value={saved} onChange={e=>setSaved(+e.target.value)}/></F>
        <F label="Monthly Contribution"><input style={S.inp} type="number" value={mo} onChange={e=>setMo(+e.target.value)}/></F>
        <F label="Expected Return (%)"><input style={S.inp} type="number" step={0.1} value={rate} onChange={e=>setRate(+e.target.value)}/></F>
        <F label="Withdrawal Rate (%)"><input style={S.inp} type="number" step={0.1} value={wd} onChange={e=>setWd(+e.target.value)}/></F>
      </div>
      <div>
        <h3 style={S.calcH}>At Retirement</h3>
        <RRow label="Years Until Retirement" value={`${yrs} years`} />
        <RRow label="Projected Portfolio" value={fmt(fv)} hi />
        <RRow label="Annual Income" value={fmt(annIncome)} />
        <RRow label="Monthly Income" value={fmt(annIncome/12)} />
        <Bar a={saved+mo*n} b={fv-(saved+mo*n)} ca="var(--cyan)" cb="var(--pink)" la="Contributions" lb="Growth" />
        <div style={S.insight}>🏦 The 4% rule suggests your portfolio can sustain withdrawals for 30+ years.</div>
      </div>
    </CalcGrid>
  );
}

// ─── Net Worth ─────────────────────────────────────────────────────────────────
function NetWorthPage() {
  const [assets, setAssets] = useState({
    checking:5000, savings:15000, investments:25000,
    retirement:40000, realEstate:0, vehicle:20000, other:0
  });
  const [liabs, setLiabs] = useState({
    mortgage:0, carLoan:8000, studentLoan:15000,
    creditCard:2000, personal:0, other:0
  });

  const aDefs = [
    {k:"checking",l:"Checking",e:"🏦"},{k:"savings",l:"Savings",e:"💰"},
    {k:"investments",l:"Investments",e:"📈"},{k:"retirement",l:"Retirement",e:"🏛️"},
    {k:"realEstate",l:"Real Estate",e:"🏠"},{k:"vehicle",l:"Vehicles",e:"🚗"},{k:"other",l:"Other",e:"📦"},
  ];
  const lDefs = [
    {k:"mortgage",l:"Mortgage",e:"🏠"},{k:"carLoan",l:"Car Loan",e:"🚗"},
    {k:"studentLoan",l:"Student Loans",e:"🎓"},{k:"creditCard",l:"Credit Cards",e:"💳"},
    {k:"personal",l:"Personal Loans",e:"💵"},{k:"other",l:"Other",e:"📋"},
  ];

  const tA = Object.values(assets).reduce((a,b)=>a+(+b||0),0);
  const tL = Object.values(liabs).reduce((a,b)=>a+(+b||0),0);
  const nw = tA-tL;

  const level = nw<0?"Focus on debt payoff — you've got this"
    :nw<10000?"Foundation stage — keep stacking"
    :nw<50000?"Building momentum — stay consistent"
    :nw<250000?"Growing — on the path 🔥"
    :nw<1000000?"Thriving — real wealth is happening"
    :"Wealthy — now sustain and grow 👑";

  const NWSection = ({ title, color, defs, vals, setVals, total }) => (
    <div style={{ ...S.budgetSection, borderColor: color+"44", flex:1 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
        <h3 style={{ fontFamily:"'Syne'", fontWeight:700, fontSize:18, color, margin:0 }}>{title}</h3>
        <span style={{ fontFamily:"'Bebas Neue'", fontSize:26, color }}>{fmt(total)}</span>
      </div>
      {defs.map(d => (
        <div key={d.k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <label style={{ fontSize:13, color:"var(--white)", display:"flex", gap:6 }}>{d.e} {d.l}</label>
          <input style={{ ...S.inp, width:110, fontSize:13, padding:"5px 10px" }} type="number"
            value={vals[d.k]} onChange={e => setVals(v => ({ ...v, [d.k]:+e.target.value }))} />
        </div>
      ))}
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.sectionTag} className="fade-up">net worth calculator</div>
      <h1 style={S.pageTitle} className="fade-up2">What Are You<br /><span style={{color:"var(--cyan)"}}>Actually Worth?</span></h1>

      <div style={{ ...S.card, textAlign:"center", marginBottom:32, background:"linear-gradient(135deg, rgba(143,184,200,0.07), rgba(22,22,22,0.95))" }} className="fade-up3">
        <div style={{ fontSize:13, color:"var(--muted)", marginBottom:4 }}>Total Net Worth</div>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:72, lineHeight:1,
          color: nw>=0 ? "var(--lime)" : "var(--pink)" }}>{fmt(nw)}</div>
        <div style={{ fontSize:14, color:"var(--cyan)", marginTop:4 }}>{level}</div>
        <div style={{ display:"flex", justifyContent:"center", gap:40, marginTop:20 }}>
          <div><div style={{ fontSize:11, color:"var(--muted)" }}>Assets</div>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:22, color:"var(--lime)" }}>{fmt(tA)}</div></div>
          <div style={{ width:1, background:"var(--border)" }}/>
          <div><div style={{ fontSize:11, color:"var(--muted)" }}>Liabilities</div>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:22, color:"var(--pink)" }}>{fmt(tL)}</div></div>
        </div>
      </div>

      <div className="fade-up4" style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
        <NWSection title="✦ Assets"      color="var(--lime)" defs={aDefs} vals={assets} setVals={setAssets} total={tA} />
        <NWSection title="▼ Liabilities" color="var(--pink)" defs={lDefs} vals={liabs}  setVals={setLiabs}  total={tL} />
      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const S = {
  // Overlay / Modal
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", backdropFilter:"blur(10px)",
    WebkitBackdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center",
    zIndex:300, padding:16 },
  modal: { width:"100%", maxWidth:420, background:"#111", border:"1px solid rgba(232,201,122,0.25)",
    borderRadius:16, padding:36, position:"relative" },
  modalX: { position:"absolute", top:14, right:14, background:"transparent", border:"none",
    color:"rgba(248,248,248,0.4)", fontSize:18, cursor:"pointer" },
  modalLogo: { display:"flex", alignItems:"center", gap:12, marginBottom:24 },
  logoIcon: { fontSize:30 },
  modalBrand: { fontFamily:"'Bebas Neue',display", fontSize:24, color:"var(--white)", letterSpacing:"0.02em" },
  modalTagline: { fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.06em" },
  modalSub: { fontSize:14, color:"var(--muted)", marginBottom:20, lineHeight:1.6 },
  noticeBox: { background:"rgba(232,201,122,0.08)", border:"1px solid rgba(232,201,122,0.25)",
    borderRadius:8, padding:"10px 14px", fontSize:13, color:"var(--white)", marginBottom:16 },
  otpRow: { display:"flex", gap:8, marginBottom:16 },
  otpBox: { flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid var(--border)",
    borderRadius:8, padding:"12px 0", color:"var(--white)", fontSize:20, fontFamily:"'Bebas Neue'",
    textAlign:"center", outline:"none" },
  lbl: { display:"block", fontSize:11, fontWeight:600, color:"rgba(248,248,248,0.5)",
    letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:7 },
  inp: { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid var(--border)",
    borderRadius:8, padding:"11px 14px", color:"var(--white)", fontSize:14,
    fontFamily:"'Outfit',sans-serif", outline:"none", marginBottom:4 },
  err: { color:"var(--pink)", fontSize:12, marginBottom:10 },
  btnP: { width:"100%", padding:"13px", background:"var(--yellow)", border:"none",
    borderRadius:10, color:"var(--black)", fontSize:14, fontWeight:700, cursor:"pointer",
    fontFamily:"'Outfit',sans-serif", marginTop:8, display:"flex", alignItems:"center",
    justifyContent:"center", gap:8, letterSpacing:"0.02em" },
  btnG: { width:"100%", padding:"9px", background:"transparent", border:"none",
    color:"var(--muted)", fontSize:13, cursor:"pointer", fontFamily:"'Outfit',sans-serif", marginTop:6 },
  spin: { display:"inline-block", width:16, height:16, border:"2px solid rgba(255,255,255,0.3)",
    borderTopColor:"white", borderRadius:"50%", animation:"spin 0.7s linear infinite" },

  // Article Modal
  articleModal: { width:"100%", maxWidth:640, maxHeight:"88vh", overflowY:"auto",
    background:"#111", border:"1px solid var(--border)", borderRadius:16, padding:36 },

  // Nav
  nav: { position:"sticky", top:0, zIndex:200, display:"flex", alignItems:"center", gap:8,
    background:"rgba(8,8,8,0.95)", borderBottom:"1px solid var(--border)",
    backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", padding:"0 24px", flexWrap:"wrap" },
  navBrand: { display:"flex", alignItems:"center", gap:8, padding:"14px 0", marginRight:16, cursor:"pointer" },
  navBrandText: { fontFamily:"'Bebas Neue',display", fontSize:20, color:"var(--white)", letterSpacing:"0.04em" },
  navDot: { fontSize:12, color:"var(--yellow)", fontWeight:700 },
  navTabs: { display:"flex", flex:1, gap:2 },
  navTab: { padding:"13px 14px", background:"transparent", border:"none", color:"var(--muted)",
    fontSize:13, cursor:"pointer", fontFamily:"'Outfit',sans-serif", borderRadius:6,
    transition:"all 0.2s", whiteSpace:"nowrap" },
  navTabOn: { color:"var(--white)", background:"rgba(255,255,255,0.07)" },
  navRight: { display:"flex", alignItems:"center", gap:10, padding:"8px 0" },
  avatar: { width:30, height:30, borderRadius:"50%", background:"var(--yellow)",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:12, fontWeight:700, color:"var(--white)" },
  pinkBtn: { padding:"8px 18px", background:"var(--yellow)", border:"none", borderRadius:20,
    color:"var(--black)", fontSize:13, fontWeight:700, cursor:"pointer",
    fontFamily:"'Outfit',sans-serif" },
  outlineBtn: { padding:"7px 16px", background:"transparent", border:"1px solid var(--border)",
    borderRadius:20, color:"var(--muted)", fontSize:12, cursor:"pointer",
    fontFamily:"'Outfit',sans-serif", transition:"all 0.2s" },

  // Ticker
  ticker: { background:"#1e1e1e", borderBottom:"1px solid var(--border)", overflow:"hidden", padding:"8px 0" },
  tickerInner: { overflow:"hidden" },
  tickerText: { display:"inline-block", whiteSpace:"nowrap", fontFamily:"'Bebas Neue'",
    fontSize:13, color:"var(--yellow)", letterSpacing:"0.1em",
    animation:"marquee 25s linear infinite" },

  // Hero
  hero: { minHeight:"88vh", display:"grid", gridTemplateColumns:"1fr 1fr", gap:40,
    alignItems:"center", padding:"60px 48px", position:"relative", overflow:"hidden" },
  heroBg: { position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 70% at 20% 50%, rgba(232,201,122,0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 50%, rgba(143,184,200,0.06) 0%, transparent 60%)", pointerEvents:"none" },
  heroContent: { position:"relative" },
  heroBadge: { display:"inline-block", background:"rgba(232,201,122,0.10)", border:"1px solid rgba(232,201,122,0.25)",
    borderRadius:20, padding:"6px 14px", fontSize:12, color:"var(--yellow)", fontWeight:600,
    letterSpacing:"0.04em", marginBottom:24 },
  heroTitle: { fontFamily:"'Bebas Neue',display", fontSize:88, lineHeight:0.95,
    color:"var(--white)", letterSpacing:"0.01em", marginBottom:24 },
  heroTitlePink: { color:"var(--yellow)", display:"block" },
  heroSub: { fontSize:16, color:"var(--muted)", lineHeight:1.75, maxWidth:480, marginBottom:32 },
  heroCta: { padding:"14px 28px", background:"var(--yellow)", border:"none", borderRadius:10,
    color:"var(--black)", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'Outfit',sans-serif" },
  heroCtaGhost: { padding:"13px 28px", background:"transparent", border:"1px solid var(--border)",
    borderRadius:10, color:"var(--white)", fontSize:14, cursor:"pointer", fontFamily:"'Outfit',sans-serif" },
  heroRight: { display:"flex", justifyContent:"center", position:"relative" },
  heroCard: { background:"var(--card)", border:"1px solid rgba(232,201,122,0.15)", borderRadius:20,
    padding:32, maxWidth:280, position:"relative" },

  // Sections
  section: { padding:"64px 48px" },
  sectionTag: { fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
    color:"var(--yellow)", marginBottom:12, display:"block" },
  sectionTitle: { fontFamily:"'Bebas Neue',display", fontSize:52, color:"var(--white)",
    letterSpacing:"0.01em", lineHeight:1.05, marginBottom:32 },
  statsGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 },
  statCard: { background:"var(--card)", border:"1px solid", borderRadius:14, padding:24 },

  // Articles
  articlesGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 },
  articlePreviewGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:16 },
  articleCard: { background:"var(--card)", border:"1px solid", borderRadius:14, padding:24,
    cursor:"pointer", transition:"transform 0.2s", display:"flex", flexDirection:"column" },
  articlePreviewCard: { background:"var(--card)", border:"1px solid", borderRadius:14, padding:20,
    cursor:"pointer", transition:"transform 0.2s", display:"flex", flexDirection:"column" },
  articleTitle: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:17, color:"var(--white)",
    margin:"12px 0 8px", lineHeight:1.3 },
  articlePreviewTitle: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:"var(--white)",
    margin:"10px 0 6px", lineHeight:1.3 },
  articleDesc: { fontSize:13, color:"var(--muted)", lineHeight:1.6, flex:1 },
  articlePreviewSub: { fontSize:12, color:"var(--muted)", lineHeight:1.5, flex:1 },
  tag: { display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:10,
    fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase", border:"1px solid" },
  filterTag: { padding:"6px 16px", background:"rgba(255,255,255,0.05)", border:"1px solid var(--border)",
    borderRadius:20, color:"var(--muted)", fontSize:12, cursor:"pointer",
    fontFamily:"'Outfit',sans-serif", transition:"all 0.2s" },
  filterTagOn: { background:"rgba(232,201,122,0.12)", borderColor:"var(--pink)", color:"var(--pink)" },

  // Tools
  toolsCtaGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:16 },
  toolCard: { background:"var(--card)", border:"1px solid", borderRadius:14, padding:24,
    cursor:"pointer", transition:"all 0.2s" },

  // Sign-in CTA
  signInCta: { display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:20,
    background:"linear-gradient(135deg, rgba(232,201,122,0.08), rgba(22,22,22,0.8))",
    border:"1px solid rgba(232,201,122,0.15)", borderRadius:16, padding:32 },

  // Page layout
  page: { padding:"48px 48px", maxWidth:1100, margin:"0 auto" },
  pageTitle: { fontFamily:"'Bebas Neue',display", fontSize:72, lineHeight:1.0,
    color:"var(--white)", letterSpacing:"0.01em", marginBottom:16, marginTop:8 },
  pageSub: { fontSize:16, color:"var(--muted)", lineHeight:1.7, maxWidth:560, marginBottom:36 },
  card: { background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:28, marginBottom:24 },

  // Budget
  budgetSection: { background:"rgba(255,255,255,0.03)", border:"1px solid", borderRadius:14, padding:24, marginBottom:20 },
  budgetGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:8 },
  budgetItem: { display:"flex", justifyContent:"space-between", alignItems:"center",
    background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"7px 10px" },
  summaryRow: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:14, marginBottom:28 },
  summaryCard: { background:"var(--card)", border:"1px solid", borderRadius:12, padding:"16px 18px" },

  // Calcs
  tabBar: { display:"flex", gap:8, marginBottom:28, flexWrap:"wrap" },
  tabBtn: { padding:"7px 16px", background:"rgba(255,255,255,0.05)", border:"1px solid var(--border)",
    borderRadius:30, color:"var(--muted)", fontSize:12, cursor:"pointer",
    fontFamily:"'Outfit',sans-serif", transition:"all 0.2s" },
  tabBtnOn: { background:"rgba(143,184,200,0.12)", borderColor:"var(--cyan)", color:"var(--cyan)" },
  calcH: { fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, color:"var(--white)", marginBottom:20 },
  insight: { marginTop:14, padding:12, background:"rgba(255,255,255,0.03)", borderRadius:8,
    fontSize:13, color:"rgba(248,248,248,0.8)", lineHeight:1.6, borderLeft:"3px solid var(--yellow)" },
};

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [user,      setUser]      = useState(null);
  const [tab,       setTab]       = useState("home");
  const [authOpen,  setAuthOpen]  = useState(false);

  return (
    <>
      <GlobalStyle />
      <div style={{ minHeight:"100vh" }}>
        <Nav user={user} active={tab} setActive={setTab}
          onLogout={() => setUser(null)}
          onOpenAuth={() => setAuthOpen(true)} />
        {tab==="home"     && <HomePage     setActive={setTab} user={user} onOpenAuth={() => setAuthOpen(true)} />}
        {tab==="articles" && <ArticlesPage />}
        {tab==="budget"   && <BudgetPage   />}
        {tab==="calcs"    && <CalcsPage    />}
        {tab==="networth" && <NetWorthPage />}
      </div>
      {authOpen && <AuthModal onLogin={e => setUser(e)} onClose={() => setAuthOpen(false)} />}
    </>
  );
}
