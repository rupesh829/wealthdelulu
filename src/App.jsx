import { useState, useEffect } from 'react';

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
    @keyframes fillBar {
      from { width: 0; }
      to   { width: var(--fill-width); }
    }

    .fade-up  { animation: fadeUp 0.5s ease forwards; }
    .fade-up2 { animation: fadeUp 0.5s 0.08s ease forwards; opacity:0; }
    .fade-up3 { animation: fadeUp 0.5s 0.16s ease forwards; opacity:0; }
    .fade-up4 { animation: fadeUp 0.5s 0.24s ease forwards; opacity:0; }

    a { color: inherit; text-decoration: none; }

    select option { background: #1c1c1c; color: #f0ece4; }
    
    input, select, textarea {
      font-family: 'Outfit', sans-serif;
    }
  `}</style>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n, d = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(n || 0);
const pct = (v, t) => (t > 0 ? ((v / t) * 100).toFixed(1) : '0.0');

// ─── Google Sheets Configuration ──────────────────────────────────────────────
// SETUP INSTRUCTIONS:
// 1. Create a Google Sheet with columns: Timestamp, FirstName, LastName, Email, AgeRange, CareerLevel, Interests, Suggestions
// 2. Go to Extensions > Apps Script
// 3. Paste the Google Apps Script code (provided in setup instructions below)
// 4. Deploy as Web App and copy the URL
// 5. Replace GOOGLE_SCRIPT_URL below with your deployed script URL

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxxuoj6X-8D11lc0rEWZuJ2O0GSF_RfsIy7nhs46O-NAEB5hG_l3dqqZA_yBl6TftDojg/exec'; // Replace this after setup
const WAITLIST_GOAL = 1000;

// ─── Helper function to fetch current waitlist count ──────────────────────────
async function fetchWaitlistCount() {
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getCount`);
    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error fetching waitlist count:', error);
    return 0; // Fallback to 0 if fetch fails
  }
}

// ─── Helper function to submit to waitlist ────────────────────────────────────
async function submitToWaitlist(formData) {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return { success: true };
  } catch (error) {
    console.error('Error submitting to waitlist:', error);
    return { success: false, error };
  }
}

// ─── Articles Data ─────────────────────────────────────────────────────────────
const ARTICLES = [
  // SPENDING DELULU SERIES
  {
    id: 1,
    tag: 'Spending Delulu',
    emoji: '💸',
    title: '"I deserve this. I work hard."',
    subtitle: "The treat-yourself trap that's quietly wrecking your finances",
    color: '#e8c97a',
    readTime: '4 min',
    content: [
      {
        type: 'hook',
        text: 'You survived another Monday. You deserve that $14 matcha latte, the DoorDash order, the new sneakers, and the spontaneous Amazon haul. Totally valid... until you check your bank account.',
      },
      {
        type: 'delusion',
        label: 'The Delusion',
        text: "Hard work entitles you to spend freely. Every purchase is a 'reward' for surviving the week. You'll start saving when things 'calm down.'",
      },
      {
        type: 'reality',
        label: 'The Reality Check',
        text: "The average person spending $15/day on 'deserved' treats spends $5,475/year — that's $54,750 over a decade. Invested at 7%, that's $76,000 in wealth you traded for momentary dopamine hits.",
      },
      {
        type: 'fix',
        label: 'The Fix: Guilt-Free Spending Money',
        text: "Budget a fixed 'fun money' amount each month — no tracking, no guilt. When it's gone, it's gone. This way you actually deserve it because you planned for it. Try $150–$300/month depending on income.",
      },
      {
        type: 'rule',
        label: 'The 24-Hour Rule',
        text: 'For any non-essential purchase over $50, wait 24 hours. If you still want it tomorrow, buy it guilt-free. 70% of impulse wants disappear overnight.',
      },
    ],
  },

  {
    id: 2,
    tag: 'Income Delulu',
    emoji: '📈',
    title: '"I\'ll save more when I earn more."',
    subtitle: "Why a bigger salary won't fix what budgeting needs to fix",
    color: '#a8c5a0',
    readTime: '5 min',
    content: [
      {
        type: 'hook',
        text: "You tell yourself the problem is income. Once you get that raise, promotion, or side hustle income — THEN you'll start saving. Spoiler: you won't.",
      },
      {
        type: 'delusion',
        label: 'The Delusion',
        text: "Your spending problems are caused by not earning enough. More income = more savings. It's just math.",
      },
      {
        type: 'reality',
        label: 'The Reality Check',
        text: "Lifestyle inflation is real and ruthless. Studies consistently show that most people's expenses rise to meet — and exceed — their income increases. People earning $150k are often just as broke as people earning $50k, just with better furniture.",
      },
      {
        type: 'fix',
        label: 'The Fix: Automate Before You See It',
        text: 'Set up automatic transfers to savings on payday — before you can spend it. Start with even 5% of take-home. You will not miss money you never saw. When you get a raise, immediately increase the auto-transfer by half the raise amount.',
      },
      {
        type: 'rule',
        label: 'The 50% Rule for Raises',
        text: 'Every time your income increases, allocate 50% of the increase to savings/investments, 50% to lifestyle. This way you get to enjoy earning more AND build wealth simultaneously.',
      },
    ],
  },

  {
    id: 3,
    tag: 'Investment Delulu',
    emoji: '🧠',
    title: '"Investing is for rich people."',
    subtitle: 'The belief keeping regular people from becoming the rich people',
    color: '#8fb8c8',
    readTime: '6 min',
    content: [
      {
        type: 'hook',
        text: "The stock market feels like a casino for rich guys in suits. You don't have enough money to invest. You'll start when you have a proper amount saved up. Meanwhile, inflation eats your savings account.",
      },
      {
        type: 'delusion',
        label: 'The Delusion',
        text: "Investing requires significant capital, financial expertise, and a high risk tolerance. It's for people who already have money.",
      },
      {
        type: 'reality',
        label: 'The Reality Check',
        text: "$100/month invested at 25 grows to $349,000 by age 65 at 10% average market returns. The same $100/month starting at 35 grows to only $132,000. The 'right amount to start' is whatever you have right now. A savings account at 4% APY loses to inflation. The market historically returns 10% annually.",
      },
      {
        type: 'fix',
        label: 'The Fix: Index Funds Are Your Best Friend',
        text: 'Start with a simple S&P 500 index fund (VOO, FSKAX, or FXAIX). No stock picking needed. No expertise required. Just buy every month and ignore the noise. Fidelity and Schwab have zero minimum investment accounts.',
      },
      {
        type: 'rule',
        label: "The Beginner's Investment Plan",
        text: "Step 1: Open a Roth IRA or Traditional IRA. Step 2: Set up automatic monthly contributions ($50, $100, whatever you can). Step 3: Buy an S&P 500 index fund. Step 4: Don't touch it for 30 years. That's it. That's the whole plan.",
      },
    ],
  },

  {
    id: 4,
    tag: 'Investing 101',
    emoji: '📊',
    title: 'How to Start Investing with $50/Month',
    subtitle: 'The exact step-by-step plan for beginners',
    color: '#8fb8c8',
    readTime: '7 min',
    content: [
      {
        type: 'hook',
        text: "You don't need $10,000 to start investing. You don't even need $1,000. You can start building real wealth with the cost of a couple streaming subscriptions.",
      },
      {
        type: 'section',
        label: 'Step 1: Choose Your Account Type',
        text: "For most beginners, a Roth IRA is the best starting point. Why? Your money grows tax-free, and you can withdraw contributions (not earnings) anytime without penalty. It's flexible, tax-advantaged, and beginner-friendly. Contribution limit: $6,500/year ($7,500 if you're 50+). That breaks down to $541/month or $125/week.",
      },
      {
        type: 'section',
        label: 'Step 2: Pick a Broker',
        text: "Fidelity, Charles Schwab, and Vanguard all offer zero-fee trading and no account minimums. All three are solid choices. Fidelity has the most user-friendly app. Open your account online — takes 10 minutes. You'll need your SSN, bank account info, and employment details.",
      },
      {
        type: 'section',
        label: 'Step 3: Fund Your Account',
        text: "Set up automatic monthly transfers from your checking account. Even $50/month is enough to start. The key is consistency, not amount. Automate it so you don't have to remember.",
      },
      {
        type: 'section',
        label: 'Step 4: Buy Your First Investment',
        text: 'Search for an S&P 500 index fund. Fidelity: FXAIX. Schwab: SWPPX. Vanguard: VFIAX or VOO. These funds own pieces of the 500 biggest US companies. When you buy one share, you own a tiny slice of Apple, Microsoft, Amazon, Google, and 496 others. No stock-picking required.',
      },
      {
        type: 'section',
        label: 'Step 5: Keep Buying Every Month',
        text: "Don't wait for the 'right time.' Don't try to time the market. Just buy the same fund every month regardless of whether the market is up or down. This is called dollar-cost averaging, and it's your superpower as a beginner. Over time, you buy more shares when prices are low and fewer when prices are high. It averages out.",
      },
      {
        type: 'reality',
        label: 'What $50/Month Becomes',
        text: "At 10% average annual return (the historical S&P 500 average): • After 10 years: $10,274 • After 20 years: $38,109 • After 30 years: $113,024 • After 40 years: $318,447. You invest $24,000 over 40 years. The market grows it to $318,447. That extra $294,447? That's compound interest doing the work.",
      },
      {
        type: 'rule',
        label: 'The Only Rule That Matters',
        text: "Time in the market beats timing the market. Start now. Buy consistently. Ignore the noise. Check your account once a quarter max. That's it.",
      },
    ],
  },

  {
    id: 5,
    tag: 'Retirement',
    emoji: '🏖️',
    title: "401(k), IRA, Roth IRA: What's the Difference?",
    subtitle: 'Retirement accounts explained without the jargon',
    color: '#a8c5a0',
    readTime: '8 min',
    content: [
      {
        type: 'hook',
        text: "Your company offers a 401(k). Your friend swears by their Roth IRA. The internet says you need both. What's the actual difference and which one should you use?",
      },
      {
        type: 'section',
        label: '401(k): The Employer-Sponsored Account',
        text: "A 401(k) is a retirement account offered through your employer. You contribute pre-tax dollars directly from your paycheck. Contribution limit (2023): $22,500/year if you're under 50. $30,000/year if you're 50+. The big advantage: employer match. Many companies match 50%-100% of your contributions up to a certain percentage (commonly 3%-6% of your salary). This is free money. Always contribute at least enough to get the full match.",
      },
      {
        type: 'section',
        label: 'Traditional IRA: The DIY Retirement Account',
        text: "An IRA (Individual Retirement Account) is a retirement account you open yourself — no employer needed. You contribute post-tax dollars and may get a tax deduction. Contribution limit (2023): $6,500/year if you're under 50. $7,500/year if you're 50+. You can open an IRA at Fidelity, Schwab, Vanguard, or any major broker.",
      },
      {
        type: 'section',
        label: 'Roth IRA: The Tax-Free Growth Account',
        text: "A Roth IRA is like a Traditional IRA, but with one critical difference: you pay taxes now, not later. You contribute post-tax dollars (money you've already paid income tax on). Your investments grow tax-free. When you withdraw in retirement, you pay ZERO taxes. Not on the contributions. Not on the growth. Nothing. Contribution limit: same as Traditional IRA ($6,500/year, $7,500 if 50+). Income limit: you can't contribute if you earn over $153,000 (single) or $228,000 (married filing jointly) in 2023.",
      },
      {
        type: 'section',
        label: '401(k) vs IRA vs Roth IRA: The Key Differences',
        text: '401(k): Offered by employer. Higher contribution limit ($22,500). Often has employer match. Limited investment options (your employer picks the funds). Traditional IRA: Open it yourself. Lower contribution limit ($6,500). You pick any investments you want. Tax deduction now, pay taxes on withdrawals later. Roth IRA: Open it yourself. Lower contribution limit ($6,500). You pick any investments. No tax deduction now, but tax-free withdrawals later. Income limits apply.',
      },
      {
        type: 'fix',
        label: 'The Priority Order',
        text: "Here's the optimal strategy for most people: 1. Contribute to 401(k) up to the employer match (free money). 2. Max out your Roth IRA ($6,500/year). 3. Go back to 401(k) and contribute more if you can. Why this order? The employer match is free money (instant 50%-100% return). The Roth IRA gives you tax-free growth and more investment flexibility. Once both are maxed, additional 401(k) contributions reduce your current-year taxes.",
      },
      {
        type: 'reality',
        label: 'Real Example',
        text: 'Say you earn $60,000/year and your employer matches 50% of contributions up to 6% of salary. Step 1: Contribute 6% to 401(k) ($3,600/year). Your employer adds $1,800. Total: $5,400 invested. Step 2: Max out Roth IRA ($6,500/year). Step 3: If you can save more, add to 401(k). Total invested in this example: $10,100/year ($3,600 + $6,500). Total in accounts: $11,900/year (thanks to the $1,800 match).',
      },
      {
        type: 'rule',
        label: 'The Bottom Line',
        text: "Always get the 401(k) match. Prioritize Roth IRA if you're young (decades of tax-free growth). Max the 401(k) if you're in a high tax bracket now and expect lower taxes in retirement. Most people should use both.",
      },
    ],
  },

  {
    id: 6,
    tag: 'Compound Interest',
    emoji: '🚀',
    title: 'The Real Cost of Waiting 10 Years to Invest',
    subtitle: 'Why your 25-year-old self will thank you',
    color: '#e8c97a',
    readTime: '5 min',
    content: [
      {
        type: 'hook',
        text: "You're 25. Investing feels like something Future You will handle. You've got time. Except you don't. Every year you wait costs you tens of thousands of dollars.",
      },
      {
        type: 'reality',
        label: 'The Math That Will Haunt You',
        text: "Person A starts investing $200/month at age 25. Person B waits until 35 and invests the same $200/month. Both invest until age 65. Both earn 7% annual returns. Person A invests for 40 years. Total invested: $96,000. Ending balance: $527,000. Person B invests for 30 years. Total invested: $72,000. Ending balance: $227,000. Person A invested $24,000 more but ended up with $300,000 more. That's not a typo. Waiting 10 years cost Person B $300,000.",
      },
      {
        type: 'section',
        label: 'Why the Difference is So Extreme',
        text: "Compound interest is exponential, not linear. In the first 10 years, Person A's money starts compounding. By year 10, they have $34,000 working for them. That $34,000 then compounds for another 30 years. Person B misses those critical first 10 years of compounding. They're always playing catch-up but never catch up.",
      },
      {
        type: 'section',
        label: "What If You Can't Afford $200/Month?",
        text: "Start with $50. Start with $25. Start with anything. The goal isn't to invest the perfect amount. The goal is to start the compounding clock. You can always increase contributions later. You can never get back lost time.",
      },
      {
        type: 'fix',
        label: 'The Action Plan',
        text: "If you're under 30: Start now with whatever you can afford. If you're 30-40: Start now and increase contributions aggressively. If you're over 40: Start now and max out catch-up contributions when eligible. The best time to start was 10 years ago. The second best time is today.",
      },
      {
        type: 'rule',
        label: 'The 10-Year Rule',
        text: 'Every 10 years you delay investing roughly cuts your retirement account in half. Start at 25 → $527K. Start at 35 → $227K. Start at 45 → $97K. Time is more valuable than money when it comes to investing.',
      },
    ],
  },

  {
    id: 7,
    tag: 'Investing 101',
    emoji: '📈',
    title: 'Stock Market Returns: What 7% Actually Means',
    subtitle: 'Understanding average returns vs real-life volatility',
    color: '#8fb8c8',
    readTime: '6 min',
    content: [
      {
        type: 'hook',
        text: 'Everyone says the stock market returns 7% per year. But your account was up 22% last year and down 18% the year before. What gives?',
      },
      {
        type: 'section',
        label: "What '7% Average Return' Actually Means",
        text: "The S&P 500 has returned about 10% annually over the past 100 years. After adjusting for inflation (~3%), that's roughly 7% real return. But here's what they don't tell you: the market almost never returns exactly 7% in any given year. Some years it's up 30%. Other years it's down 20%. The 7% is an average across decades.",
      },
      {
        type: 'section',
        label: 'Real Returns Year by Year (Last 20 Years)',
        text: "Here's what actual S&P 500 returns looked like: 2003: +28%. 2004: +11%. 2005: +5%. 2006: +16%. 2007: +5%. 2008: -37% (financial crisis). 2009: +26%. 2010: +15%. 2011: +2%. 2012: +16%. 2013: +32%. 2014: +14%. 2015: +1%. 2016: +12%. 2017: +22%. 2018: -4%. 2019: +31%. 2020: +18% (despite COVID). 2021: +29%. 2022: -18%. 2023: +26%. Notice: only two losing years in 20 years. But both were significant drops. The winning years ranged from tiny (+1%) to massive (+32%).",
      },
      {
        type: 'reality',
        label: 'Why This Matters',
        text: "If you invested $10,000 in 2003 and held through 2023, you'd have roughly $68,000 (including reinvested dividends). That's about 10% annually on average. But your account balance swung wildly year to year. This is normal. This is what long-term investing looks like.",
      },
      {
        type: 'fix',
        label: 'How to Handle Volatility',
        text: "Don't check your account daily. Seriously. The more you look, the more likely you are to panic sell. Keep buying during down years. When the market drops 20%, your monthly contribution buys more shares. Ignore predictions. No one knows what the market will do next year. Focus on time horizon. If you won't need the money for 10+ years, short-term drops don't matter.",
      },
      {
        type: 'rule',
        label: 'The Only Guarantee',
        text: "The stock market will go up and down. Over decades, it trends up. If you can't handle seeing your account down 20% in a year, you're either too close to retirement to be fully invested in stocks, or you need to stop checking your account.",
      },
    ],
  },

  {
    id: 8,
    tag: 'Retirement',
    emoji: '💰',
    title: 'How Much Should You Save for Retirement?',
    subtitle: 'The 15% rule and why it actually works',
    color: '#a8c5a0',
    readTime: '7 min',
    content: [
      {
        type: 'hook',
        text: 'Financial advisors say save 15% of your income for retirement. But why 15%? Is that actually enough? What if you started late?',
      },
      {
        type: 'section',
        label: 'Where the 15% Rule Comes From',
        text: "The rule assumes you start saving at age 25 and retire at 67. It assumes 6-7% average annual returns after inflation. It assumes you'll need about 80% of your pre-retirement income to live on. Under those assumptions, 15% gets you to a retirement balance that can sustain you for 30 years.",
      },
      {
        type: 'reality',
        label: 'The Math Behind 15%',
        text: "Let's say you earn $60,000/year. 15% = $9,000/year saved. Invested from age 25 to 67 (42 years) at 7% return: You contribute $378,000 total. It grows to $2.1 million. At a 4% safe withdrawal rate, that gives you $84,000/year in retirement. Add Social Security (~$25,000/year average), and you're at $109,000/year. That's 182% of your pre-retirement income. You're actually over-saving in this scenario.",
      },
      {
        type: 'section',
        label: 'What If You Started Late?',
        text: 'Started at 35? Save 20-25%. Started at 45? Save 30-40%. Started at 55? Save 50%+ or plan to work longer. The later you start, the more aggressively you need to save because you lose compounding time.',
      },
      {
        type: 'section',
        label: 'Does 15% Include Employer Match?',
        text: "Yes. If your employer matches 5% and you contribute 10%, you're at 15% total. If there's no match, you need to contribute the full 15% yourself.",
      },
      {
        type: 'fix',
        label: 'How to Actually Save 15%',
        text: "If 15% feels impossible, start with 5% and increase 1% every year. Or increase your contribution rate by 1% every time you get a raise. Automate it so it comes out before you see your paycheck. You'll adjust your lifestyle around what hits your checking account.",
      },
      {
        type: 'section',
        label: 'When You Can Save Less Than 15%',
        text: "You have a pension (rare but some government/union jobs still offer them). You plan to work part-time in retirement. You'll inherit significant wealth. You're planning to retire much later than 67. You have rental income or other passive income streams.",
      },
      {
        type: 'rule',
        label: 'The Priority Order',
        text: "1. Contribute enough to get full employer match. 2. Build 3-6 month emergency fund. 3. Pay off high-interest debt (>7% APR). 4. Work up to 15% retirement savings. 5. Save for other goals (house, kids' college, etc.).",
      },
    ],
  },

  {
    id: 9,
    tag: 'Compound Interest',
    emoji: '🎯',
    title: 'The Rule of 72: Mental Math for Doubling Money',
    subtitle: 'The fastest way to estimate investment growth',
    color: '#e8c97a',
    readTime: '4 min',
    content: [
      {
        type: 'hook',
        text: "How long does it take your money to double? You don't need a calculator. You just need to know one simple rule.",
      },
      {
        type: 'section',
        label: 'The Rule of 72',
        text: 'Divide 72 by your annual interest rate. The answer is how many years it takes your money to double. Examples: 6% return → 72 ÷ 6 = 12 years to double. 8% return → 72 ÷ 8 = 9 years to double. 10% return → 72 ÷ 10 = 7.2 years to double. 3% savings account → 72 ÷ 3 = 24 years to double.',
      },
      {
        type: 'reality',
        label: 'Why This Matters',
        text: "$10,000 invested at 8% doubles every 9 years: After 9 years: $20,000. After 18 years: $40,000. After 27 years: $80,000. After 36 years: $160,000. You invested $10,000 once. In 36 years it became $160,000. That's the power of compound interest visualized through doubling periods.",
      },
      {
        type: 'section',
        label: 'Rule of 72 for Debt Too',
        text: "This works in reverse for debt. Credit card at 21% APR? 72 ÷ 21 = 3.4 years for your debt to double if you only make minimum payments. $5,000 credit card debt at 21% doubles to $10,000 in about 3.4 years if you don't pay it down.",
      },
      {
        type: 'fix',
        label: 'How to Use This',
        text: 'Compare investment options quickly. A 6% return doubles in 12 years. An 8% return doubles in 9 years. That 2% difference saves you 3 years per doubling. Understand the cost of conservative investing. A 3% savings account takes 24 years to double. The 7% stock market takes ~10 years. Visualize your retirement timeline. If you have $100,000 at age 45 and earn 8%, it doubles to $200,000 by 54, $400,000 by 63, $800,000 by 72.',
      },
      {
        type: 'rule',
        label: 'The Reverse Rule',
        text: 'You can also use this to calculate what return you need. Want to double your money in 10 years? 72 ÷ 10 = 7.2% return needed. Want to double in 5 years? 72 ÷ 5 = 14.4% return needed (extremely aggressive, likely unrealistic for safe investing).',
      },
    ],
  },

  {
    id: 10,
    tag: 'Savings',
    emoji: '🏦',
    title: 'How to Build a 6-Month Emergency Fund',
    subtitle: 'The financial safety net everyone needs',
    color: '#8fb8c8',
    readTime: '6 min',
    content: [
      {
        type: 'hook',
        text: 'Conventional wisdom says you need 6 months of expenses in savings. But where do you even start? And what counts as an expense?',
      },
      {
        type: 'section',
        label: 'What Is a 6-Month Emergency Fund?',
        text: "It's cash savings (not investments) that covers 6 months of essential expenses if you lost your income tomorrow. Key word: expenses, not income. If you earn $5,000/month but only spend $3,500/month on essentials, you need $21,000 saved (6 × $3,500).",
      },
      {
        type: 'section',
        label: 'What Counts as Essential Expenses?',
        text: "Include: rent/mortgage, utilities, groceries, insurance (health, car, renters/homeowners), minimum debt payments, transportation (gas, car payment, public transit). Exclude: dining out, subscriptions, gym memberships, shopping, entertainment, vacations. You're calculating survival mode, not comfortable lifestyle.",
      },
      {
        type: 'reality',
        label: 'Why 6 Months Specifically?',
        text: "The average job search takes 3-5 months. Six months gives you buffer. Medical emergencies often span multiple months. Major home/car repairs can drain savings fast. It's enough to handle most crises without going into debt but not so much that you're missing out on investment returns.",
      },
      {
        type: 'section',
        label: 'Where to Keep Your Emergency Fund',
        text: 'High-yield savings account (currently 4-5% APY). Do NOT invest it in stocks — you need guaranteed access. Do NOT keep it in checking — too easy to spend. Online banks (Ally, Marcus, Discover) offer better rates than traditional banks. Keep it separate from your regular spending account.',
      },
      {
        type: 'fix',
        label: 'How to Build It',
        text: "Start with $1,000 (covers most minor emergencies). Calculate your monthly essential expenses. Multiply by 6 (that's your target). Set up automatic transfers on payday. Start with $50-100/month if that's all you can afford. Increase the amount when you get raises or pay off debt. Use windfalls (tax refunds, bonuses) to boost it.",
      },
      {
        type: 'section',
        label: 'What If 6 Months Feels Impossible?',
        text: "Start with 3 months if you have stable income and dual-earner household. Aim for 9-12 months if you're self-employed or single income household. Focus on $1,000 first (that alone prevents most debt spirals). Something is always better than nothing.",
      },
      {
        type: 'rule',
        label: 'When to Use It',
        text: "Use for: job loss, medical emergencies, major car/home repairs, unexpected essential expenses. Do NOT use for: vacations, gifts, wants vs needs, 'emergencies' that could have been planned for (car registration, annual insurance). Once you use it, pause other savings goals and rebuild it ASAP.",
      },
    ],
  },

  {
    id: 11,
    tag: 'Debt',
    emoji: '💳',
    title: 'Credit Card Debt: The 21% APR Trap',
    subtitle: 'How interest makes you pay double for everything',
    color: '#e8c97a',
    readTime: '5 min',
    content: [
      {
        type: 'hook',
        text: "You bought a $1,000 laptop on your credit card. If you only make minimum payments at 21% APR, you'll pay $2,149 total. You paid for two laptops. You only got one.",
      },
      {
        type: 'reality',
        label: 'How Credit Card Interest Actually Works',
        text: "APR = Annual Percentage Rate. But they charge you daily. 21% APR = ~0.0575% daily rate. On a $5,000 balance, that's $2.88 in interest per day. That's $86.25/month. Your $100 minimum payment? $86.25 goes to interest. Only $13.75 pays down the actual balance.",
      },
      {
        type: 'section',
        label: 'The Minimum Payment Trap',
        text: 'Credit card companies set minimum payments at ~2-3% of your balance. This ensures you pay interest for decades. Example: $5,000 balance at 21% APR. Minimum payment: $100/month. Time to pay off: 7.5 years. Total interest paid: $3,923. You paid $8,923 for $5,000 in purchases.',
      },
      {
        type: 'section',
        label: "The Average American's Credit Card Debt",
        text: "Average credit card debt per household: $6,194. Average APR: 21.59%. Average monthly interest: $111.45. If they paid just $150/month: it would take 8 years to pay off. They'd pay $8,331 in interest. They'd pay nearly $15,000 total for $6,194 in purchases.",
      },
      {
        type: 'fix',
        label: 'How to Escape Credit Card Debt',
        text: 'Stop using the card (freeze it, cut it up, delete from online shopping). Pay more than the minimum. Even $50 extra makes a massive difference. Use the avalanche method: list all cards by interest rate, pay minimums on everything, throw all extra money at the highest rate card. Consider a balance transfer card (0% APR for 12-18 months, but watch the transfer fee, usually 3-5%).',
      },
      {
        type: 'section',
        label: 'The Real Cost Calculator',
        text: '$1,000 at 21% APR: Pay $50/month → 24 months, $213 interest. Pay $100/month → 11 months, $94 interest. Pay $200/month → 6 months, $47 interest. Doubling your payment more than halves the interest. Every extra dollar you pay saves you $1.21 in the long run.',
      },
      {
        type: 'rule',
        label: 'Credit Card Golden Rules',
        text: "Pay statement balance in full every month. Never carry a balance. If you can't afford it in cash, don't put it on the card. Treat credit cards like debit cards with rewards, not as loans.",
      },
    ],
  },

  {
    id: 12,
    tag: 'Budgeting',
    emoji: '📊',
    title: 'The 50/30/20 Budget Rule',
    subtitle: 'The simplest budget framework that actually works',
    color: '#a8c5a0',
    readTime: '5 min',
    content: [
      {
        type: 'hook',
        text: "Budgeting doesn't mean tracking every coffee. It means knowing where your money goes in three simple categories: needs, wants, and savings.",
      },
      {
        type: 'section',
        label: 'The 50/30/20 Breakdown',
        text: '50% of after-tax income → Needs (essentials). 30% of after-tax income → Wants (lifestyle). 20% of after-tax income → Savings & debt payoff. Example: $4,000/month take-home. $2,000 → needs. $1,200 → wants. $800 → savings/debt.',
      },
      {
        type: 'section',
        label: 'What Are Needs? (50%)',
        text: 'Housing (rent/mortgage, property tax, insurance). Utilities (electric, water, gas, internet). Groceries. Transportation (car payment, insurance, gas, public transit). Minimum debt payments. Health insurance. Essentials only. Not the nice-to-haves.',
      },
      {
        type: 'section',
        label: 'What Are Wants? (30%)',
        text: "Dining out, entertainment, subscriptions (Netflix, Spotify, etc.), hobbies, gym membership, shopping (clothes, gadgets, etc.), vacations, anything that improves quality of life but isn't essential.",
      },
      {
        type: 'section',
        label: 'What Are Savings? (20%)',
        text: "Emergency fund, retirement contributions, other investments, extra debt payments above minimums, saving for future goals (house, car, etc.). This is the 'pay yourself first' category.",
      },
      {
        type: 'reality',
        label: "What If Your Numbers Don't Fit?",
        text: "If needs are over 50%, you have a few options: increase income, reduce housing costs (get a roommate, move somewhere cheaper), cut other essentials where possible. If you can't hit 20% savings, start with 10% and work up. If wants are under 30%, you're doing great — redirect excess to savings.",
      },
      {
        type: 'fix',
        label: 'How to Implement This',
        text: 'Calculate your after-tax monthly income. Multiply by 0.50, 0.30, 0.20 to get your targets. Track spending for one month to see where you actually are. Adjust categories to hit the percentages. Automate the 20% savings on payday.',
      },
      {
        type: 'rule',
        label: 'The Flexibility Rule',
        text: "This isn't rigid. High cost of living area? Maybe 60/20/20 is more realistic. Paying off debt aggressively? Maybe 50/20/30 (flip wants and savings). Early in career building emergency fund? Maybe 50/25/25. The principle matters more than the exact percentages.",
      },
    ],
  },

  {
    id: 13,
    tag: 'Retirement',
    emoji: '📅',
    title: "Social Security: What You'll Actually Get",
    subtitle: "Spoiler — it's probably not enough to live on",
    color: '#8fb8c8',
    readTime: '6 min',
    content: [
      {
        type: 'hook',
        text: "You've been paying into Social Security your whole career. So how much will you actually get back? And will it even be there when you retire?",
      },
      {
        type: 'section',
        label: 'How Much Is the Average Check?',
        text: "Average Social Security benefit (2024): $1,907/month or $22,884/year. That's the average. Your amount depends on: how much you earned during your career, how many years you worked (they use your highest 35 years), what age you claim benefits.",
      },
      {
        type: 'section',
        label: 'Full Retirement Age',
        text: 'Born before 1960: full retirement age is 66. Born 1960 or later: full retirement age is 67. You can claim as early as 62, but your benefit is permanently reduced by ~30%. You can delay until 70 and get ~24% more than your full retirement amount.',
      },
      {
        type: 'section',
        label: 'How Much Does Social Security Replace?',
        text: 'For low earners (~$30K/year), Social Security replaces about 55% of pre-retirement income. For average earners (~$60K/year), it replaces about 40%. For high earners (~$150K/year), it replaces about 27%. The more you earned, the lower the replacement percentage.',
      },
      {
        type: 'reality',
        label: 'Can You Live on Social Security Alone?',
        text: "The average benefit is $1,907/month. Median rent in the US: $1,326/month. That leaves $581/month for food, healthcare, utilities, transportation, and everything else. Spoiler: that's not realistic. Social Security was designed to supplement retirement savings, not replace them entirely.",
      },
      {
        type: 'section',
        label: 'Will Social Security Exist When You Retire?',
        text: "Yes, but benefits may be reduced. The Social Security trust fund is projected to run out around 2034. If nothing changes, benefits would be cut to ~77% of scheduled amounts. Congress will likely step in before then (raising taxes, increasing retirement age, or means-testing benefits). You'll get something. Just don't count on 100% of today's promised benefits.",
      },
      {
        type: 'fix',
        label: 'What This Means for Your Retirement Plan',
        text: "Don't plan to retire on Social Security alone. Assume it covers ~40% of your expenses (if you're an average earner). Save for the other 60% through 401(k)s, IRAs, and other investments. Delay claiming until 70 if you can (increases monthly benefit by ~24%). Work longer if needed — every extra year you work increases your benefit.",
      },
      {
        type: 'rule',
        label: 'The Social Security Rule',
        text: "Treat Social Security as a bonus, not your retirement plan. If it's there at full benefits, great. If it's reduced or delayed, you're still covered because you saved independently.",
      },
    ],
  },

  {
    id: 14,
    tag: 'Investing 101',
    emoji: '🎲',
    title: 'Index Funds vs Individual Stocks',
    subtitle: 'Why buying everything beats picking winners',
    color: '#8fb8c8',
    readTime: '7 min',
    content: [
      {
        type: 'hook',
        text: "Should you pick individual stocks or just buy an index fund? The answer depends on whether you think you're smarter than professional investors with PhDs and AI algorithms.",
      },
      {
        type: 'section',
        label: 'What Is an Index Fund?',
        text: 'An index fund owns a basket of stocks that tracks a market index. Example: an S&P 500 index fund owns all 500 companies in the S&P 500. When you buy one share of the fund, you own a tiny piece of Apple, Microsoft, Amazon, Google, Tesla, and 495 others. No stock picking required.',
      },
      {
        type: 'section',
        label: 'What Are Individual Stocks?',
        text: "Buying shares of specific companies. You think Apple will outperform the market, so you buy Apple stock. You think Tesla is overvalued, so you avoid it. You're actively picking winners and losers.",
      },
      {
        type: 'reality',
        label: 'The Performance Data',
        text: "Over 10 years (2013-2023), 85% of actively managed funds underperformed the S&P 500 index. Translation: professional stock pickers with research teams, Bloomberg terminals, and insider access lost to the simple index 85% of the time. If the pros can't beat the index, what makes you think you can?",
      },
      {
        type: 'section',
        label: 'Why Index Funds Usually Win',
        text: "Diversification: one company can go bankrupt (Enron, Lehman Brothers, etc.), but the index keeps going. The S&P 500 drops the losers and adds new winners automatically. Low fees: index funds charge 0.03%-0.15% annually. Actively managed funds charge 0.5%-2%. Those fees compound against you. No emotion: you can't panic sell the index during a crash. You can (and will) panic sell individual stocks.",
      },
      {
        type: 'section',
        label: 'When Individual Stocks Make Sense',
        text: "You have extra money to gamble with after maxing index fund contributions. You work in an industry and have legitimate informational advantages. You enjoy stock research as a hobby. You understand that you're probably going to underperform the index and you're OK with that.",
      },
      {
        type: 'fix',
        label: 'The Recommended Approach',
        text: '80-90% of your portfolio in index funds (S&P 500, total market, international). 10-20% in individual stocks if you want to scratch the stock-picking itch. Never bet your retirement on a handful of stocks.',
      },
      {
        type: 'rule',
        label: 'The Index Fund Rule',
        text: "The best investors in the world — Warren Buffett included — recommend index funds for average investors. His advice for his own wife's inheritance? 90% S&P 500 index, 10% bonds. If it's good enough for Buffett's family, it's good enough for you.",
      },
    ],
  },

  {
    id: 15,
    tag: 'Retirement',
    emoji: '⏰',
    title: 'When Can You Retire? The 4% Rule',
    subtitle: 'How to calculate your retirement freedom number',
    color: '#a8c5a0',
    readTime: '7 min',
    content: [
      {
        type: 'hook',
        text: 'How much money do you need to retire? The answer is simpler than you think: 25 times your annual expenses.',
      },
      {
        type: 'section',
        label: 'What Is the 4% Rule?',
        text: 'The 4% rule says you can withdraw 4% of your retirement portfolio in year one, then adjust for inflation each year, and your money will last 30+ years. Example: $1 million portfolio. Year 1 withdrawal: $40,000 (4%). Year 2 withdrawal: $40,800 (adjusted for 2% inflation). And so on.',
      },
      {
        type: 'section',
        label: 'Where Does 4% Come From?',
        text: 'The Trinity Study (1998) analyzed historical stock/bond returns from 1926-1995. They found that a 4% withdrawal rate had a 95% success rate over 30-year periods with a 50/50 stock/bond portfolio. Recent research suggests 4% may be conservative — 4.5% or even 5% might work depending on your asset allocation.',
      },
      {
        type: 'reality',
        label: 'The 25x Rule',
        text: "If you can safely withdraw 4% per year, you need 25x your annual expenses saved. Annual expenses: $40,000 → need $1 million. Annual expenses: $60,000 → need $1.5 million. Annual expenses: $80,000 → need $2 million. This is your 'freedom number.' Once you hit it, you can theoretically retire.",
      },
      {
        type: 'section',
        label: "What This Doesn't Include",
        text: 'Social Security (treat it as a bonus that reduces how much you withdraw). Pension (if you have one, reduce your needed portfolio size). Part-time work in retirement (reduces withdrawal needs). Inheritances or other windfalls.',
      },
      {
        type: 'section',
        label: 'Example Calculation',
        text: 'Current annual expenses: $50,000. Freedom number: $50,000 × 25 = $1.25 million. Current retirement savings: $200,000. Still need: $1.05 million. Monthly contribution needed: depends on time horizon. 20 years at 7% return: $2,150/month. 30 years at 7% return: $875/month.',
      },
      {
        type: 'fix',
        label: 'How to Use This',
        text: "Calculate your current annual spending. Multiply by 25 (that's your target). Check your current retirement balance. Calculate the gap. Determine how much you need to save monthly to close the gap. Adjust spending or timeline as needed.",
      },
      {
        type: 'section',
        label: 'The Conservative Approach',
        text: 'Some experts suggest 3.5% withdrawal rate (29x expenses) for extra safety. Some suggest 3% (33x expenses) if you want to retire before 60. The 4% rule assumes a 30-year retirement. If you retire at 50, you may need a lower rate.',
      },
      {
        type: 'rule',
        label: 'The Flexibility Rule',
        text: "The 4% rule isn't set in stone. You can adjust withdrawals based on market performance. Withdraw less in down years, more in good years. The goal is a sustainable withdrawal strategy, not a rigid formula.",
      },
    ],
  },

  {
    id: 16,
    tag: 'Compound Interest',
    emoji: '💎',
    title: 'What $500/Month Becomes in 30 Years',
    subtitle: 'The life-changing math of consistent investing',
    color: '#e8c97a',
    readTime: '5 min',
    content: [
      {
        type: 'hook',
        text: "$500 a month doesn't sound life-changing. It's less than most people spend on car payments. But invested for 30 years, it becomes something extraordinary.",
      },
      {
        type: 'reality',
        label: 'The Numbers',
        text: '$500/month for 30 years at 8% return: Total contributed: $180,000. Ending balance: $745,000. Growth from compound interest: $565,000. You invested less than $200K. Compound interest added over half a million dollars.',
      },
      {
        type: 'section',
        label: 'Year-by-Year Breakdown',
        text: 'After 5 years: $36,700 (contributed $30K). After 10 years: $91,500 (contributed $60K). After 15 years: $170,000 (contributed $90K). After 20 years: $290,000 (contributed $120K). After 25 years: $474,000 (contributed $150K). After 30 years: $745,000 (contributed $180K). Notice how growth accelerates in later years. In years 1-10, you gain $31,500. In years 21-30, you gain $455,000.',
      },
      {
        type: 'section',
        label: "What If You Can't Do $500/Month?",
        text: '$250/month for 30 years at 8%: $372,000. $100/month for 30 years at 8%: $149,000. Even $100/month becomes a six-figure portfolio. The key is starting now and staying consistent.',
      },
      {
        type: 'section',
        label: 'What If You Can Do More?',
        text: '$1,000/month for 30 years at 8%: $1.49 million. $1,500/month for 30 years at 8%: $2.24 million. $2,000/month for 30 years at 8%: $2.98 million. This is how ordinary people become millionaires. Not through get-rich-quick schemes. Through consistent investing over decades.',
      },
      {
        type: 'fix',
        label: 'How to Find $500/Month',
        text: "Max out 401(k) match first (that's free money). $200/month to Roth IRA. $300/month to additional 401(k) contributions. Or: $500/month to Roth IRA (almost maxes it out). $300/month to taxable brokerage. Total: $800/month if you can swing it.",
      },
      {
        type: 'rule',
        label: 'The Starting Point Rule',
        text: "Start with whatever you can afford. $50, $100, $250, whatever. Increase contributions by 1% every year or every raise. You won't miss the gradual increases, but they compound dramatically over time.",
      },
    ],
  },

  {
    id: 17,
    tag: 'Debt',
    emoji: '🎓',
    title: 'Student Loans: Avalanche vs Snowball',
    subtitle: 'Two strategies to pay off debt faster',
    color: '#e8c97a',
    readTime: '6 min',
    content: [
      {
        type: 'hook',
        text: 'You have multiple student loans at different interest rates. Should you pay off the highest interest first or the smallest balance first?',
      },
      {
        type: 'section',
        label: 'The Avalanche Method (Best Mathematically)',
        text: "Pay minimums on all loans. Throw all extra money at the highest interest rate loan first. Once that's paid off, move to the next highest rate. Saves the most money in interest. Example: Loan A: $8,000 at 6.8%. Loan B: $5,000 at 4.5%. Loan C: $3,000 at 3.4%. Pay off order: A → B → C.",
      },
      {
        type: 'section',
        label: 'The Snowball Method (Best Psychologically)',
        text: "Pay minimums on all loans. Throw all extra money at the smallest balance first. Once that's paid off, move to the next smallest. Gives quick wins and momentum. Example: same loans as above. Pay off order: C → B → A (despite C having the lowest interest rate).",
      },
      {
        type: 'reality',
        label: 'Which Method Saves More?',
        text: "Let's say you have: Loan A: $10,000 at 7%. Loan B: $8,000 at 5%. Loan C: $5,000 at 4%. You pay an extra $500/month toward loans. Avalanche method: paid off in 32 months, $2,345 total interest. Snowball method: paid off in 33 months, $2,480 total interest. Difference: 1 month, $135. Avalanche saves money. But snowball gets you a 'win' (Loan C paid off) in month 10 vs month 21.",
      },
      {
        type: 'section',
        label: 'When to Use Avalanche',
        text: "You're disciplined and motivated by math. You have several loans with significantly different interest rates. You want to save the most money. You won't get discouraged by slow progress.",
      },
      {
        type: 'section',
        label: 'When to Use Snowball',
        text: "You need quick wins to stay motivated. You've tried paying off debt before and failed. The interest rate differences are small (all within 1-2% of each other). You have a lot of small loans.",
      },
      {
        type: 'fix',
        label: 'The Hybrid Approach',
        text: 'Use snowball for small balances under $2,000 (clear them out fast for psychological wins). Switch to avalanche for remaining larger loans. This gives you early momentum without sacrificing too much in interest.',
      },
      {
        type: 'rule',
        label: 'The Most Important Rule',
        text: "The best method is the one you'll actually stick with. Avalanche saves more money mathematically. But if snowball keeps you motivated and prevents you from giving up, it's the better choice. Consistency beats optimization.",
      },
    ],
  },

  {
    id: 18,
    tag: 'Savings',
    emoji: '🏡',
    title: 'Saving for a House: The 20% Down Payment Myth',
    subtitle: "You don't always need 20% down (but here's when you should)",
    color: '#8fb8c8',
    readTime: '6 min',
    content: [
      {
        type: 'hook',
        text: "Everyone says you need 20% down to buy a house. But plenty of people buy homes with 3-5% down. So what's the truth?",
      },
      {
        type: 'section',
        label: 'Why 20% Down Is Recommended',
        text: "No PMI (Private Mortgage Insurance) required. PMI costs 0.5%-1% of loan amount annually. On a $300K loan, that's $1,500-$3,000/year in extra costs. Lower monthly payment. Better interest rates. More equity from day one (protects you if home values drop).",
      },
      {
        type: 'section',
        label: 'Low Down Payment Options',
        text: 'Conventional loans: 3% down for first-time buyers. FHA loans: 3.5% down. VA loans (veterans): 0% down. USDA loans (rural areas): 0% down. These programs exist specifically to help people buy homes without massive down payments.',
      },
      {
        type: 'reality',
        label: 'The Real Cost of Less Than 20% Down',
        text: '$300,000 home. 20% down ($60,000): Loan: $240,000. Monthly payment (30-year at 7%): $1,596. PMI: $0. Total monthly: $1,596. 5% down ($15,000): Loan: $285,000. Monthly payment: $1,896. PMI: ~$237/month. Total monthly: $2,133. Difference: $537/month or $6,444/year.',
      },
      {
        type: 'section',
        label: 'When Less Than 20% Makes Sense',
        text: "You'd be renting for years trying to save 20%. Rents are rising faster than your ability to save. You have stable income and can afford the higher payment. Home prices are rising fast in your market (delaying costs you more than PMI). You're disciplined about building equity and can refinance to remove PMI later.",
      },
      {
        type: 'section',
        label: 'When to Wait for 20%',
        text: "Your budget is tight and you can't afford PMI. You're in a volatile job situation. Home prices are flat or falling in your market. You're unsure you'll stay in the area long-term. You'd be house-poor with less than 20% down.",
      },
      {
        type: 'fix',
        label: 'How to Save for a Down Payment',
        text: "Open a high-yield savings account (4-5% APY). Calculate your target: 3%, 5%, 10%, or 20% of home price. Divide by months until you want to buy. Automate monthly transfers. Keep it separate from emergency fund. Don't invest it — you need guaranteed access.",
      },
      {
        type: 'rule',
        label: 'The PMI Removal Rule',
        text: 'Most loans let you remove PMI once you reach 20% equity. You can get there through: paying down principal, home value appreciation, or refinancing. Set a goal to remove PMI within 3-5 years even if you start with less down.',
      },
    ],
  },

  {
    id: 19,
    tag: 'Budgeting',
    emoji: '🍕',
    title: 'The Latte Factor Is a Lie',
    subtitle: "Small spending isn't the problem — big fixed costs are",
    color: '#a8c5a0',
    readTime: '5 min',
    content: [
      {
        type: 'hook',
        text: "Personal finance gurus love to blame your daily $5 latte for your money problems. But that latte isn't why you're broke.",
      },
      {
        type: 'section',
        label: 'The Latte Factor Myth',
        text: "The idea: cutting $5 daily lattes saves $1,825/year. Invested at 7%, that's $87,000 in 30 years! The reality: your latte is 1.5% of a $100K income. Your rent is 30%. Your car payment is 10%. Cutting the latte saves $150/month. Reducing rent by one tier saves $500/month.",
      },
      {
        type: 'reality',
        label: 'Where Your Money Actually Goes',
        text: 'Average American spending breakdown: Housing: 33% ($1,800/month on $65K income). Transportation: 16% ($875/month). Food: 13% ($710/month, half of that is groceries). Insurance: 11% ($600/month). Healthcare: 8% ($435/month). Entertainment: 5% ($275/month). Everything else: 14%. Your daily coffee is buried in that 5% entertainment category.',
      },
      {
        type: 'section',
        label: 'The Big Three: Housing, Transportation, Food',
        text: "These three categories are 62% of spending. If you want to save serious money, optimize these: Rent with roommates or move to a cheaper area (saves $300-800/month). Buy a used car instead of new (saves $200-400/month). Meal prep instead of eating out (saves $200-400/month). That's $700-$1,600/month. That's real money.",
      },
      {
        type: 'fix',
        label: 'What Actually Matters',
        text: "Optimize your big fixed costs first. Get a roommate, drive a paid-off car, negotiate your rent. THEN optimize the small stuff if you want. But don't skip the $5 latte while paying $2,000/month for a one-bedroom you can't afford.",
      },
      {
        type: 'section',
        label: 'When Small Spending Does Matter',
        text: "You've already optimized the big three. You're drowning in consumer debt from lots of small purchases. You literally have no idea where your money goes. In these cases, tracking every expense for 30 days is eye-opening. But start with the big wins first.",
      },
      {
        type: 'rule',
        label: 'The 80/20 Rule for Money',
        text: '80% of your financial improvement comes from 20% of your decisions. That 20%: where you live, what you drive, your savings rate, your career choices. The latte is in the other 80%.',
      },
    ],
  },

  {
    id: 20,
    tag: 'Investing 101',
    emoji: '🌍',
    title: 'Should You Invest Internationally?',
    subtitle: 'The case for (and against) international index funds',
    color: '#8fb8c8',
    readTime: '6 min',
    content: [
      {
        type: 'hook',
        text: 'Your S&P 500 index fund only invests in US companies. Should you also own international stocks? The experts disagree.',
      },
      {
        type: 'section',
        label: 'The Case FOR International Investing',
        text: 'Diversification: the US is only 60% of global stock market value. If US growth slows, international markets might outperform. Historically, international and US stocks take turns outperforming. From 2000-2010, international beat US. From 2010-2020, US crushed international. No one knows which will win the next decade.',
      },
      {
        type: 'section',
        label: 'The Case AGAINST International Investing',
        text: 'US stocks have dominated for the last 15 years. S&P 500 companies are already global (Apple, Google, Microsoft earn 50%+ revenue overseas). Currency risk: international stocks expose you to fluctuating exchange rates. Higher fees: international funds often charge more than US index funds. Political/regulatory risk in developing markets.',
      },
      {
        type: 'reality',
        label: 'What the Data Shows (Last 20 Years)',
        text: 'S&P 500 (US): ~9.8% annually (2003-2023). MSCI EAFE (developed international): ~6.5% annually. MSCI Emerging Markets: ~7.2% annually. US won. But this is just one 20-year period. In other periods, international won.',
      },
      {
        type: 'section',
        label: 'Common Allocation Strategies',
        text: '100% US: simple, has worked well recently. 70% US / 30% international: balanced global exposure. 60% US / 40% international: matches global market cap weights. 50% US / 30% international / 20% emerging markets: aggressive global diversification.',
      },
      {
        type: 'fix',
        label: 'The Beginner-Friendly Approach',
        text: 'Start with a total world stock fund (VT, VTWAX). It owns US and international stocks at market cap weights (~60% US / 40% international). One fund, instant global diversification, no rebalancing needed.',
      },
      {
        type: 'section',
        label: 'When to Skip International',
        text: "You're just starting out and want simplicity (S&P 500 is fine). You have a very long time horizon (40+ years) and can ride out US market volatility. You work for a US company and already have international revenue exposure through your job. You don't want to deal with rebalancing multiple funds.",
      },
      {
        type: 'rule',
        label: 'The Diversification Rule',
        text: "More diversification is generally better, but don't overcomplicate. 100% S&P 500 is fine. 70/30 US/international is also fine. Just pick one and stick with it. The choice matters less than investing consistently.",
      },
    ],
  },
];

// ─── Components ────────────────────────────────────────────────────────────────

function Nav({ active, setActive }) {
  return (
    <>
      <div style={s.ticker}>
        <div style={s.tickerInner}>
          <span style={s.tickerText}>
            |||     🎯 SET GOALS → 💰 EMERGENCY FUND → 🏖️ RETIREMENT → 📈 INVESTMENTS →
            🔄 REPEAT → 💡 EDUCATE YOURSELF → 📊 TRACK PROGRESS → 🚀 STAY
            DISCIPLINED    |||    🎯 SET GOALS → 💰 EMERGENCY FUND → 🏖️ RETIREMENT → 📈 INVESTMENTS →
            🔄 REPEAT → 💡 EDUCATE YOURSELF → 📊 TRACK PROGRESS → 🚀 STAY
            DISCIPLINED 
          </span>
        </div>
      </div>
      <nav style={s.nav}>
        <div
          style={{ ...s.navLogo, cursor: 'pointer' }}
          onClick={() => setActive('home')}
        >
          <span style={{ fontSize: 36 }}>💰</span> WealthDelulu
        </div>
        <div style={s.navTabs}>
          {['home', 'articles', 'budget', 'calcs', 'waitlist'].map((t) => (
            <div
              key={t}
              style={{ ...s.navTab, ...(active === t ? s.navTabOn : {}) }}
              onClick={() => setActive(t)}
            >
              {t === 'home'
                ? 'Home'
                : t === 'articles'
                ? 'Articles'
                : t === 'budget'
                ? 'Budget'
                : t === 'calcs'
                ? 'Calculators'
                : 'Join Waitlist'}
            </div>
          ))}
        </div>
        <div style={s.navRight}>
          <SocialLinks />
        </div>
      </nav>
    </>
  );
}

// ─── Footer Component ──────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '48px 48px 32px',
        background: 'var(--dark)',
        marginTop: '64px',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 40,
        }}
      >
        {/* Brand Column */}
        <div>
          <div
            style={{
              fontFamily: "'Bebas Neue',display",
              fontSize: 22,
              letterSpacing: '0.08em',
              color: 'var(--white)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span>💸</span> WEALTHDELULU
          </div>
          <p
            style={{
              fontSize: 13,
              color: 'var(--muted)',
              lineHeight: 1.7,
              marginBottom: 20,
            }}
          >
            No judgment. No BS. Just honest talk about the money delusions
            keeping you broke.
          </p>
          <SocialLinks />
        </div>

        {/* Quick Links */}
        <div>
          <h4
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--white)',
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Explore
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Articles', value: 'articles' },
              { label: 'Budget Tool', value: 'budget' },
              { label: 'Calculators', value: 'calcs' },
              { label: 'Join Waitlist', value: 'waitlist' },
            ].map((link) => (
              <a
                key={link.value}
                href={`#${link.value}`}
                style={{
                  fontSize: 13,
                  color: 'var(--muted)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--yellow)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--muted)')}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Connect */}
        <div>
          <h4
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--white)',
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Connect
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              Follow{' '}
              <span style={{ color: 'var(--yellow)', fontWeight: 600 }}>
                @wealthdelulu
              </span>{' '}
              on social media for daily money tips and financial reality checks.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          maxWidth: 1100,
          margin: '32px auto 0',
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>
          © {new Date().getFullYear()} WealthDelulu. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── Social Links Component ────────────────────────────────────────────────────
function SocialLinks({
  platforms = ['youtube', 'instagram', 'tiktok', 'x', 'facebook'],
}) {
  const allSocials = {
    youtube: {
      name: 'YouTube',
      icon: '▶',
      url: 'https://youtube.com/@wealthdelulu',
      color: '#FF0000',
    },
    instagram: {
      name: 'Instagram',
      icon: '📷',
      url: 'https://instagram.com/wealthdelulu',
      color: '#E4405F',
    },
    tiktok: {
      name: 'TikTok',
      icon: '🎵',
      url: 'https://tiktok.com/@wealthdelulu',
      color: '#00D9FF',
    },
    x: {
      name: 'X',
      icon: '𝕏',
      url: 'https://x.com/wealthdelulu',
      color: '#fff',
    },
    facebook: {
      name: 'Facebook',
      icon: 'f',
      url: 'https://facebook.com/wealthdelulu',
      color: '#1877F2',
    },
  };

  const socials = platforms.map((p) => allSocials[p]).filter(Boolean);

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background:
              s.name === 'X'
                ? 'rgba(255,255,255,0.15)'
                : 'rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            color: s.name === 'X' ? '#000' : s.color,
            border:
              s.name === 'X'
                ? '2px solid #fff'
                : '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.2s',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = s.color;
            e.currentTarget.style.color = s.name === 'X' ? '#fff' : '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              s.name === 'X'
                ? 'rgba(255,255,255,0.15)'
                : 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = s.name === 'X' ? '#000' : s.color;
          }}
          title={s.name}
        >
          {s.icon}
        </a>
      ))}
    </div>
  );
}

function WaitlistModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    ageRange: '',
    careerLevel: '',
    interests: [],
    suggestions: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Submit to Google Sheets
    const result = await submitToWaitlist({
      ...formData,
      timestamp: new Date().toISOString(),
      interests: formData.interests.join(', '), // Convert array to comma-separated string
    });

    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess(); // Refresh count on parent component
      }, 10000); // 10 seconds
    } else {
      alert(
        'There was an error submitting your registration. Please try again.'
      );
    }
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  if (submitted) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.92)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ ...s.card, maxWidth: 420, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ ...s.calcH, marginBottom: 12, color: 'var(--yellow)' }}>
            You're on the list!
          </h2>
          <p
            style={{
              fontSize: 14,
              color: 'var(--muted)',
              lineHeight: 1.7,
              marginBottom: 16,
            }}
          >
            Thank you for your interest! We'll notify you as soon as we reach{' '}
            <span style={{ color: 'var(--yellow)', fontWeight: 600 }}>
              1,000 signups
            </span>{' '}
            and launch user accounts with budget tracking and net worth
            monitoring.
          </p>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            Follow{' '}
            <span style={{ color: 'var(--yellow)', fontWeight: 600 }}>
              @wealthdelulu
            </span>{' '}
            on social media for updates!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.92)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...s.card,
          maxWidth: 560,
          position: 'relative',
          margin: '40px auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            cursor: 'pointer',
            fontSize: 28,
            color: 'var(--muted)',
            lineHeight: 1,
          }}
          onClick={onClose}
        >
          ×
        </div>

        <h2 style={{ ...s.calcH, marginBottom: 8 }}>Join the Waitlist</h2>
        <p
          style={{
            fontSize: 13,
            color: 'var(--muted)',
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          We're building user accounts, budget tracking, and net worth
          monitoring. Join the waitlist to get early access when we hit 1,000
          sign-ups.
        </p>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div>
              <label style={s.inputLabel}>First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                style={s.input}
                placeholder="Optional"
              />
            </div>
            <div>
              <label style={s.inputLabel}>Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                style={s.input}
                placeholder="Optional"
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={s.inputLabel}>Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={s.input}
              placeholder="you@example.com"
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div>
              <label style={s.inputLabel}>Age Range *</label>
              <select
                required
                value={formData.ageRange}
                onChange={(e) =>
                  setFormData({ ...formData, ageRange: e.target.value })
                }
                style={s.input}
              >
                <option value="">Select...</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55+">55+</option>
              </select>
            </div>
            <div>
              <label style={s.inputLabel}>Career Level *</label>
              <select
                required
                value={formData.careerLevel}
                onChange={(e) =>
                  setFormData({ ...formData, careerLevel: e.target.value })
                }
                style={s.input}
              >
                <option value="">Select...</option>
                <option value="student">Student</option>
                <option value="job-search">Job Search</option>
                <option value="first-job">In First Job (0-3 years)</option>
                <option value="early-career">Early Career (3-7 years)</option>
                <option value="mid-career">Mid Career (7-15 years)</option>
                <option value="senior">Senior (15+ years)</option>
                <option value="self-employed">Self-Employed</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={s.inputLabel}>
              Content You're Interested In (select all that apply)
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                marginTop: 8,
              }}
            >
              {[
                'Investing',
                'Retirement',
                'Budgeting',
                'Debt Payoff',
                'Savings',
                'Real Estate',
              ].map((interest) => (
                <label
                  key={interest}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    padding: '8px 12px',
                    background: formData.interests.includes(interest)
                      ? 'rgba(232,201,122,0.12)'
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${
                      formData.interests.includes(interest)
                        ? 'var(--yellow)'
                        : 'var(--border)'
                    }`,
                    borderRadius: 8,
                    fontSize: 13,
                    transition: 'all 0.2s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    style={{ accentColor: 'var(--yellow)' }}
                  />
                  <span
                    style={{
                      color: formData.interests.includes(interest)
                        ? 'var(--yellow)'
                        : 'var(--white)',
                    }}
                  >
                    {interest}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={s.inputLabel}>
              What features would you like to see? (Optional)
            </label>
            <textarea
              value={formData.suggestions}
              onChange={(e) =>
                setFormData({ ...formData, suggestions: e.target.value })
              }
              style={{ ...s.input, minHeight: 80, resize: 'vertical' }}
              placeholder="Budget tracking, net worth charts, investment portfolio analysis..."
            ></textarea>
          </div>

          <button
            type="submit"
            style={{ ...s.heroCta, width: '100%' }}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Join Waitlist →'}
          </button>

          <p
            style={{
              fontSize: 11,
              color: 'var(--muted)',
              marginTop: 12,
              lineHeight: 1.5,
              textAlign: 'center',
            }}
          >
            We'll never spam you or share your email. Promise.
          </p>
        </form>
      </div>
    </div>
  );
}

function ArticleReader({ article, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--black)',
        zIndex: 999,
        overflowY: 'auto',
      }}
    >
      <div
        style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 100px' }}
      >
        <button style={{ ...s.outlineBtn, marginBottom: 24 }} onClick={onClose}>
          ← Back to Articles
        </button>
        <div style={{ marginBottom: 16 }}>
          <span
            style={{
              ...s.tag,
              borderColor: article.color,
              color: article.color,
            }}
          >
            {article.emoji} {article.tag}
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Bebas Neue',display",
            fontSize: 56,
            lineHeight: 1.1,
            color: 'var(--white)',
            marginBottom: 12,
          }}
        >
          {article.title}
        </h1>
        <p
          style={{
            fontSize: 18,
            color: 'var(--muted)',
            lineHeight: 1.6,
            marginBottom: 32,
          }}
        >
          {article.subtitle}
        </p>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 40 }}>
          {article.readTime} read
        </div>

        {article.content.map((block, i) => {
          if (block.type === 'hook') {
            return (
              <div
                key={i}
                style={{
                  background: 'rgba(232,201,122,0.08)',
                  border: '1px solid rgba(232,201,122,0.2)',
                  borderRadius: 12,
                  padding: 24,
                  marginBottom: 32,
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.9)',
                  fontStyle: 'italic',
                }}
              >
                {block.text}
              </div>
            );
          } else if (
            block.type === 'delusion' ||
            block.type === 'reality' ||
            block.type === 'fix' ||
            block.type === 'rule' ||
            block.type === 'section'
          ) {
            return (
              <div key={i} style={{ marginBottom: 32 }}>
                <h3
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color:
                      block.type === 'delusion'
                        ? '#ff6b6b'
                        : block.type === 'reality'
                        ? '#4ecdc4'
                        : block.type === 'fix'
                        ? '#95e1d3'
                        : 'var(--yellow)',
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {block.type === 'delusion' && '🚫'}
                  {block.type === 'reality' && '📊'}
                  {block.type === 'fix' && '✅'}
                  {block.type === 'rule' && '⚡'}
                  {block.type === 'section' && '▸'}
                  {block.label}
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: 'rgba(255,255,255,0.85)',
                  }}
                >
                  {block.text}
                </p>
              </div>
            );
          }
          return null;
        })}

        <div
          style={{
            marginTop: 48,
            padding: 24,
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
          }}
        >
          <h3
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--white)',
              marginBottom: 12,
            }}
          >
            Share This Article
          </h3>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>
            Found this helpful? Share it with someone who needs to hear it.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              style={s.outlineBtn}
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    article.title
                  )}&url=${encodeURIComponent(window.location.href)}`,
                  '_blank'
                )
              }
            >
              Share on X
            </button>
            <button
              style={s.outlineBtn}
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    window.location.href
                  )}`,
                  '_blank'
                )
              }
            >
              Share on Facebook
            </button>
            <button
              style={s.outlineBtn}
              onClick={() =>
                navigator.clipboard
                  .writeText(window.location.href)
                  .then(() => alert('Link copied!'))
              }
            >
              Copy Link
            </button>
          </div>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>
            Follow us for more financial education:
          </p>
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}

// [Continue with HomePage, ArticlesPage, BudgetPage, CalcsPage, WaitlistPage components...]
// [Keeping the code structure but replacing NetWorthPage with WaitlistPage]

function HomePage({ setActive }) {
  const [waitlistCount, setWaitlistCount] = useState(0);

  useEffect(() => {
    fetchWaitlistCount().then((count) => setWaitlistCount(count));
  }, []);

  return (
    <>
      <div style={s.hero}>
        <div style={s.heroBg} />
        <div style={s.heroContent} className="fade-up">
          <span style={s.heroBadge}>Financial Education for Real People</span>
          <h1 style={s.heroTitle}>
            The Math They
            <span style={s.heroTitlePink}> Never Taught You</span>
          </h1>
          <p style={s.heroSub}>
            Personal finance, investing, and retirement planning — explained in
            plain English, without the jargon or gatekeeping. Start building
            wealth at any age.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button style={s.heroCta} onClick={() => setActive('articles')}>
              Read Free Articles
            </button>
            <button style={s.heroCtaGhost} onClick={() => setActive('calcs')}>
              Try Calculators
            </button>
          </div>
        </div>
        <div style={s.heroRight} className="fade-up2">
          <div style={{ ...s.heroCard, borderColor: 'var(--borderpink)' }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--yellow)',
                marginBottom: 8,
              }}
            >
              Your Future Wealth
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue'",
                fontSize: 48,
                color: 'var(--white)',
                marginBottom: 8,
              }}
            >
              $1,000,000+
            </div>
            <div
              style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}
            >
              What $500/month becomes in 30 years at 8% return. The math works —
              if you start now.
            </div>
          </div>
        </div>
      </div>

      <div style={s.section}>
        <span style={s.sectionTag} className="fade-up">
          Latest Articles
        </span>
        <h2 style={s.sectionTitle} className="fade-up2">
          Start Here
        </h2>
        <div style={s.articlePreviewGrid} className="fade-up3">
          {ARTICLES.slice(0, 6).map((a) => (
            <div
              key={a.id}
              style={{ ...s.articlePreviewCard, borderColor: a.color }}
              onClick={() => setActive('articles')}
            >
              <div style={{ marginBottom: 12 }}>
                <span
                  style={{ ...s.tag, borderColor: a.color, color: a.color }}
                >
                  {a.emoji} {a.tag}
                </span>
              </div>
              <h3 style={s.articlePreviewTitle}>{a.title}</h3>
              <p style={s.articlePreviewSub}>{a.subtitle}</p>
              <div
                style={{ fontSize: 11, color: 'var(--muted)', marginTop: 12 }}
              >
                {a.readTime} read
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button style={s.heroCta} onClick={() => setActive('articles')}>
            View All Articles →
          </button>
        </div>
      </div>

      <div style={s.section}>
        <span style={s.sectionTag}>Free Tools</span>
        <h2 style={s.sectionTitle}>Calculators & Planners</h2>
        <div style={s.toolsCtaGrid}>
          {[
            {
              emoji: '📊',
              title: 'Compound Interest',
              desc: 'See how your money grows over time',
            },
            {
              emoji: '🏠',
              title: 'Mortgage Calculator',
              desc: 'Compare loan scenarios',
            },
            {
              emoji: '💰',
              title: 'Retirement Planner',
              desc: 'Calculate your freedom number',
            },
            {
              emoji: '📈',
              title: 'Budget Tracker',
              desc: 'Track income and expenses',
            },
          ].map((tool, i) => (
            <div
              key={i}
              style={{
                ...s.toolCard,
                borderColor: i === 0 ? 'var(--yellow)' : 'var(--border)',
              }}
              onClick={() => setActive('calcs')}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{tool.emoji}</div>
              <h3
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--white)',
                  marginBottom: 6,
                }}
              >
                {tool.title}
              </h3>
              <p
                style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}
              >
                {tool.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon CTA */}
      <div style={{ ...s.section, paddingTop: 0 }}>
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(232,201,122,0.12), rgba(22,22,22,0.9))',
            border: '1px solid rgba(232,201,122,0.2)',
            borderRadius: 16,
            padding: 40,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <h3
            style={{
              fontFamily: "'Bebas Neue'",
              fontSize: 36,
              color: 'var(--white)',
              letterSpacing: '0.02em',
              marginBottom: 12,
            }}
          >
            Coming Soon: Track Your Progress
          </h3>
          <p
            style={{
              fontSize: 15,
              color: 'var(--muted)',
              lineHeight: 1.7,
              maxWidth: 560,
              margin: '0 auto 24px',
            }}
          >
            We're building user accounts with budget tracking, net worth
            monitoring, and personalized financial insights. Join the waitlist
            to get early access when we hit{' '}
            <span style={{ color: 'var(--yellow)', fontWeight: 700 }}>
              1,000 sign-ups
            </span>
            .
          </p>
          <button style={s.heroCta} onClick={() => setActive('waitlist')}>
            Join Waitlist →
          </button>
          <div style={{ marginTop: 24, fontSize: 13, color: 'var(--muted)' }}>
            <span style={{ color: 'var(--yellow)', fontWeight: 700 }}>
              {waitlistCount || '...'}
            </span>{' '}
            / {WAITLIST_GOAL} people registered
          </div>
        </div>
      </div>
    </>
  );
}

function ArticlesPage() {
  const [reading, setReading] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'all'
      ? ARTICLES
      : ARTICLES.filter((a) =>
          a.tag.toLowerCase().includes(filter.toLowerCase())
        );

  if (reading)
    return <ArticleReader article={reading} onClose={() => setReading(null)} />;

  return (
    <div style={s.page}>
      <h1 style={s.pageTitle}>Articles</h1>
      <p style={s.pageSub}>
        Financial education explained clearly — no jargon, no gatekeeping, just
        the fundamentals that work.
      </p>

      <div
        style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}
      >
        {[
          'all',
          'spending',
          'income',
          'investment',
          'compound',
          'retirement',
          'savings',
          'debt',
        ].map((f) => (
          <div
            key={f}
            style={{ ...s.filterTag, ...(filter === f ? s.filterTagOn : {}) }}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </div>
        ))}
      </div>

      <div style={s.articlesGrid}>
        {filtered.map((a) => (
          <div
            key={a.id}
            style={{ ...s.articleCard, borderColor: a.color }}
            onClick={() => setReading(a)}
          >
            <div style={{ marginBottom: 12 }}>
              <span style={{ ...s.tag, borderColor: a.color, color: a.color }}>
                {a.emoji} {a.tag}
              </span>
            </div>
            <h3 style={s.articleTitle}>{a.title}</h3>
            <p style={s.articleDesc}>{a.subtitle}</p>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 12 }}>
              {a.readTime} read
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetPage() {
  const [income, setIncome] = useState(5000);
  const [housing, setHousing] = useState(1500);
  const [utilities, setUtilities] = useState(200);
  const [groceries, setGroceries] = useState(400);
  const [transport, setTransport] = useState(300);
  const [insurance, setInsurance] = useState(250);
  const [debt, setDebt] = useState(200);
  const [dining, setDining] = useState(300);
  const [entertainment, setEntertainment] = useState(150);
  const [shopping, setShopping] = useState(200);
  const [savings, setSavings] = useState(500);
  const [investments, setInvestments] = useState(500);

  const needs = housing + utilities + groceries + transport + insurance + debt;
  const wants = dining + entertainment + shopping;
  const saveInvest = savings + investments;
  const total = needs + wants + saveInvest;
  const remaining = income - total;

  const needsPct = pct(needs, income);
  const wantsPct = pct(wants, income);
  const savePct = pct(saveInvest, income);

  return (
    <div style={s.page}>
      <h1 style={s.pageTitle}>Budget Planner</h1>
      <p style={s.pageSub}>
        Track your income and expenses with the 50/30/20 rule: 50% needs, 30%
        wants, 20% savings/investments.
      </p>

      <div style={s.card}>
        <label
          style={{
            fontSize: 13,
            color: 'var(--muted)',
            marginBottom: 8,
            display: 'block',
          }}
        >
          Monthly Take-Home Income
        </label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(+e.target.value)}
          style={{
            width: '100%',
            padding: 12,
            background: 'var(--card2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            color: 'var(--white)',
            fontFamily: "'Outfit',sans-serif",
            fontSize: 16,
            marginBottom: 20,
          }}
        />
      </div>

      <div style={{ ...s.budgetSection, borderColor: '#ff6b6b' }}>
        <h3
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: '#ff6b6b',
            marginBottom: 16,
          }}
        >
          🏠 Needs ({needsPct}%) — Target 50%
        </h3>
        <div style={s.budgetGrid}>
          {[
            { label: 'Housing', val: housing, set: setHousing },
            { label: 'Utilities', val: utilities, set: setUtilities },
            { label: 'Groceries', val: groceries, set: setGroceries },
            { label: 'Transportation', val: transport, set: setTransport },
            { label: 'Insurance', val: insurance, set: setInsurance },
            { label: 'Debt Payments', val: debt, set: setDebt },
          ].map((item) => (
            <div key={item.label} style={s.budgetItem}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                {item.label}
              </span>
              <input
                type="number"
                value={item.val}
                onChange={(e) => item.set(+e.target.value)}
                style={{
                  width: 100,
                  padding: '4px 8px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  color: 'var(--white)',
                  fontSize: 13,
                  textAlign: 'right',
                }}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 14,
            color: 'var(--white)',
            fontWeight: 600,
          }}
        >
          Total Needs: {fmt(needs)}
        </div>
      </div>

      <div style={{ ...s.budgetSection, borderColor: '#4ecdc4' }}>
        <h3
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: '#4ecdc4',
            marginBottom: 16,
          }}
        >
          🎉 Wants ({wantsPct}%) — Target 30%
        </h3>
        <div style={s.budgetGrid}>
          {[
            { label: 'Dining Out', val: dining, set: setDining },
            {
              label: 'Entertainment',
              val: entertainment,
              set: setEntertainment,
            },
            { label: 'Shopping', val: shopping, set: setShopping },
          ].map((item) => (
            <div key={item.label} style={s.budgetItem}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                {item.label}
              </span>
              <input
                type="number"
                value={item.val}
                onChange={(e) => item.set(+e.target.value)}
                style={{
                  width: 100,
                  padding: '4px 8px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  color: 'var(--white)',
                  fontSize: 13,
                  textAlign: 'right',
                }}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 14,
            color: 'var(--white)',
            fontWeight: 600,
          }}
        >
          Total Wants: {fmt(wants)}
        </div>
      </div>

      <div style={{ ...s.budgetSection, borderColor: 'var(--yellow)' }}>
        <h3
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--yellow)',
            marginBottom: 16,
          }}
        >
          💰 Savings & Investments ({savePct}%) — Target 20%
        </h3>
        <div style={s.budgetGrid}>
          {[
            { label: 'Emergency Fund', val: savings, set: setSavings },
            { label: 'Investments', val: investments, set: setInvestments },
          ].map((item) => (
            <div key={item.label} style={s.budgetItem}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                {item.label}
              </span>
              <input
                type="number"
                value={item.val}
                onChange={(e) => item.set(+e.target.value)}
                style={{
                  width: 100,
                  padding: '4px 8px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  color: 'var(--white)',
                  fontSize: 13,
                  textAlign: 'right',
                }}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 14,
            color: 'var(--white)',
            fontWeight: 600,
          }}
        >
          Total Savings: {fmt(saveInvest)}
        </div>
      </div>

      <div style={s.summaryRow}>
        <div style={{ ...s.summaryCard, borderColor: 'var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
            Total Expenses
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--white)' }}>
            {fmt(total)}
          </div>
        </div>
        <div
          style={{
            ...s.summaryCard,
            borderColor: remaining >= 0 ? 'var(--lime)' : '#ff6b6b',
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
            {remaining >= 0 ? 'Remaining' : 'Over Budget'}
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: remaining >= 0 ? 'var(--lime)' : '#ff6b6b',
            }}
          >
            {fmt(Math.abs(remaining))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CalcsPage() {
  const [calc, setCalc] = useState('compound');
  const [principal, setPrincipal] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(8);

  const monthlyRate = rate / 100 / 12;
  const months = years * 12;
  const futureValue =
    principal * Math.pow(1 + monthlyRate, months) +
    (monthly * (Math.pow(1 + monthlyRate, months) - 1)) / monthlyRate;
  const totalContributed = principal + monthly * months;
  const totalGains = futureValue - totalContributed;

  return (
    <div style={s.page}>
      <h1 style={s.pageTitle}>Calculators</h1>
      <p style={s.pageSub}>
        Run the numbers on compound interest, retirement, mortgages, and more.
      </p>

      <div style={s.tabBar}>
        {['compound', 'retirement', 'mortgage', 'debt'].map((t) => (
          <button
            key={t}
            style={{ ...s.tabBtn, ...(calc === t ? s.tabBtnOn : {}) }}
            onClick={() => setCalc(t)}
          >
            {t === 'compound'
              ? 'Compound Interest'
              : t === 'retirement'
              ? 'Retirement'
              : t === 'mortgage'
              ? 'Mortgage'
              : 'Debt Payoff'}
          </button>
        ))}
      </div>

      {calc === 'compound' && (
        <div style={s.card}>
          <h3 style={s.calcH}>Compound Interest Calculator</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 20,
              marginBottom: 24,
            }}
          >
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: 'var(--muted)',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                Initial Investment
              </label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(+e.target.value)}
                style={{
                  width: '100%',
                  padding: 10,
                  background: 'var(--card2)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--white)',
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: 14,
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: 'var(--muted)',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                Monthly Contribution
              </label>
              <input
                type="number"
                value={monthly}
                onChange={(e) => setMonthly(+e.target.value)}
                style={{
                  width: '100%',
                  padding: 10,
                  background: 'var(--card2)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--white)',
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: 14,
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: 'var(--muted)',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                Years
              </label>
              <input
                type="range"
                min={1}
                max={50}
                value={years}
                onChange={(e) => setYears(+e.target.value)}
              />
              <div
                style={{ fontSize: 13, color: 'var(--white)', marginTop: 4 }}
              >
                {years} years
              </div>
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: 'var(--muted)',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                Annual Return (%)
              </label>
              <input
                type="range"
                min={1}
                max={15}
                step={0.5}
                value={rate}
                onChange={(e) => setRate(+e.target.value)}
              />
              <div
                style={{ fontSize: 13, color: 'var(--white)', marginTop: 4 }}
              >
                {rate}%
              </div>
            </div>
          </div>

          <div style={s.summaryRow}>
            <div style={{ ...s.summaryCard, borderColor: 'var(--cyan)' }}>
              <div
                style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}
              >
                Total Contributed
              </div>
              <div
                style={{ fontSize: 20, fontWeight: 700, color: 'var(--cyan)' }}
              >
                {fmt(totalContributed)}
              </div>
            </div>
            <div style={{ ...s.summaryCard, borderColor: 'var(--lime)' }}>
              <div
                style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}
              >
                Investment Gains
              </div>
              <div
                style={{ fontSize: 20, fontWeight: 700, color: 'var(--lime)' }}
              >
                {fmt(totalGains)}
              </div>
            </div>
            <div style={{ ...s.summaryCard, borderColor: 'var(--yellow)' }}>
              <div
                style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}
              >
                Future Value
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--yellow)',
                }}
              >
                {fmt(futureValue)}
              </div>
            </div>
          </div>

          <div style={s.insight}>
            <strong>Insight:</strong> You'd contribute {fmt(totalContributed)}{' '}
            over {years} years. Compound interest adds {fmt(totalGains)} in
            growth. Your money does the work for you.
          </div>
        </div>
      )}

      {calc !== 'compound' && (
        <div style={s.card}>
          <p
            style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center' }}
          >
            More calculators coming soon...
          </p>
        </div>
      )}
    </div>
  );
}

function WaitlistPage() {
  const [showModal, setShowModal] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch waitlist count on component mount
  useEffect(() => {
    loadWaitlistCount();
  }, []);

  const loadWaitlistCount = async () => {
    setLoading(true);
    const count = await fetchWaitlistCount();
    setWaitlistCount(count);
    setLoading(false);
  };

  const progressPct = ((waitlistCount / WAITLIST_GOAL) * 100).toFixed(1);

  return (
    <div style={s.page}>
      <h1 style={s.pageTitle}>Join the Waitlist</h1>
      <p style={s.pageSub}>
        Be the first to get access to user accounts, budget tracking, and net
        worth monitoring.
      </p>

      {/* Progress Card */}
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(232,201,122,0.12), rgba(22,22,22,0.9))',
          border: '1px solid rgba(232,201,122,0.2)',
          borderRadius: 16,
          padding: 32,
          marginBottom: 32,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🎯</div>
          <h2
            style={{
              fontFamily: "'Bebas Neue'",
              fontSize: 42,
              color: 'var(--white)',
              letterSpacing: '0.02em',
              marginBottom: 8,
            }}
          >
            {loading ? '...' : waitlistCount} / {WAITLIST_GOAL}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            People registered •{' '}
            {loading ? '...' : (WAITLIST_GOAL - waitlistCount).toLocaleString()}{' '}
            to go
          </p>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: 12,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 20,
            overflow: 'hidden',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: loading ? '0%' : `${progressPct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--yellow), var(--lime))',
              borderRadius: 20,
              transition: 'width 0.5s ease',
            }}
          ></div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: 15,
              color: 'var(--muted)',
              marginBottom: 20,
              lineHeight: 1.7,
            }}
          >
            We'll launch user accounts and tracking features when we reach 1,000
            registered users. Join now to get early access and help shape the
            features we build.
          </p>
          <button
            style={{ ...s.heroCta, fontSize: 16 }}
            onClick={() => setShowModal(true)}
          >
            Join Waitlist Now →
          </button>
        </div>
      </div>

      {/* Features Preview */}
      <h3
        style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--white)',
          marginBottom: 20,
        }}
      >
        What We're Building
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {[
          {
            emoji: '📊',
            title: 'Budget Tracking',
            desc: 'Automatically categorize expenses and track spending against your 50/30/20 targets. See exactly where your money goes.',
          },
          {
            emoji: '💎',
            title: 'Net Worth Monitoring',
            desc: 'Track all your assets and liabilities in one place. Watch your net worth grow month over month.',
          },
          {
            emoji: '📉',
            title: 'Debt Payoff Tracker',
            desc: 'Track all your debts in one place. Compare avalanche vs snowball payoff strategies and see your progress toward becoming debt-free.',
          },
          {
            emoji: '🎯',
            title: 'Goal Setting',
            desc: 'Set savings goals for emergency funds, down payments, retirement, and track progress automatically.',
          },
          {
            emoji: '💳',
            title: 'Credit Card Tracking',
            desc: "Monitor credit card spending, track balances, set spending limits, and get alerts when you're approaching your budget.",
          },
          {
            emoji: '🔔',
            title: 'Smart Alerts',
            desc: "Get notified when you're over budget, when bills are due, or when you hit savings milestones.",
          },
        ].map((feature, i) => (
          <div
            key={i}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: 24,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>
              {feature.emoji}
            </div>
            <h4
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: 17,
                fontWeight: 700,
                color: 'var(--white)',
                marginBottom: 8,
              }}
            >
              {feature.title}
            </h4>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Social Proof */}
      <div style={{ marginTop: 48, textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>
          Follow us for updates and daily financial tips:
        </p>
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}
        >
          <SocialLinks />
        </div>
      </div>

      {showModal && (
        <WaitlistModal
          onClose={() => setShowModal(false)}
          onSuccess={loadWaitlistCount}
        />
      )}
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const s = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 48px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--dark)',
  },
  navLogo: {
    fontFamily: "'Bebas Neue',display",
    fontSize: 20,
    letterSpacing: '0.08em',
    color: 'var(--white)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  navTabs: { display: 'flex', gap: 6 },
  navTab: {
    padding: '8px 16px',
    borderRadius: 20,
    color: 'var(--muted)',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  navTabOn: { color: 'var(--white)', background: 'rgba(255,255,255,0.07)' },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 0',
  },
  outlineBtn: {
    padding: '7px 16px',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 20,
    color: 'var(--muted)',
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: "'Outfit',sans-serif",
    transition: 'all 0.2s',
  },

  ticker: {
    background: '#1e1e1e',
    borderBottom: '1px solid var(--border)',
    overflow: 'hidden',
    padding: '8px 0',
  },
  tickerInner: { overflow: 'hidden' },
  tickerText: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    fontFamily: "'Bebas Neue'",
    fontSize: 13,
    color: 'var(--yellow)',
    letterSpacing: '0.1em',
    animation: 'marquee 25s linear infinite',
  },

  hero: {
    minHeight: '88vh',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 40,
    alignItems: 'center',
    padding: '60px 48px',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(ellipse 60% 70% at 20% 50%, rgba(232,201,122,0.15) 0%, rgba(0,0,0,0.95) 75%), radial-gradient(ellipse 50% 60% at 80% 50%, rgba(143,184,200,0.12) 0%, rgba(0,0,0,0.95) 75%)',
    pointerEvents: 'none',
  },
  heroContent: { position: 'relative' },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(232,201,122,0.10)',
    border: '1px solid rgba(232,201,122,0.25)',
    borderRadius: 20,
    padding: '6px 14px',
    fontSize: 12,
    color: 'var(--yellow)',
    fontWeight: 600,
    letterSpacing: '0.04em',
    marginBottom: 24,
  },
  heroTitle: {
    fontFamily: "'Bebas Neue',display",
    fontSize: 88,
    lineHeight: 0.95,
    color: 'var(--white)',
    letterSpacing: '0.01em',
    marginBottom: 24,
  },
  heroTitlePink: { color: 'var(--yellow)', display: 'block' },
  heroSub: {
    fontSize: 16,
    color: 'var(--muted)',
    lineHeight: 1.75,
    maxWidth: 480,
    marginBottom: 32,
  },
  heroCta: {
    padding: '14px 28px',
    background: 'var(--yellow)',
    border: 'none',
    borderRadius: 10,
    color: 'var(--black)',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Outfit',sans-serif",
  },
  heroCtaGhost: {
    padding: '13px 28px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(232,201,122,0.5)',
    borderRadius: 10,
    color: 'var(--white)',
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: "'Outfit',sans-serif",
    transition: 'all 0.2s',
  },
  heroRight: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  },
  heroCard: {
    background: 'var(--card)',
    border: '1px solid rgba(232,201,122,0.15)',
    borderRadius: 20,
    padding: 32,
    maxWidth: 280,
    position: 'relative',
  },

  section: { padding: '64px 48px' },
  sectionTag: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--yellow)',
    marginBottom: 12,
    display: 'block',
  },
  sectionTitle: {
    fontFamily: "'Bebas Neue',display",
    fontSize: 52,
    color: 'var(--white)',
    letterSpacing: '0.01em',
    lineHeight: 1.05,
    marginBottom: 32,
  },

  articlePreviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))',
    gap: 16,
  },
  articlePreviewCard: {
    background: 'var(--card)',
    border: '1px solid',
    borderRadius: 14,
    padding: 20,
    cursor: 'pointer',
    transition: 'transform 0.2s',
    display: 'flex',
    flexDirection: 'column',
  },
  articlePreviewTitle: {
    fontFamily: "'Syne',sans-serif",
    fontWeight: 700,
    fontSize: 15,
    color: 'var(--white)',
    margin: '10px 0 6px',
    lineHeight: 1.3,
  },
  articlePreviewSub: {
    fontSize: 12,
    color: 'var(--muted)',
    lineHeight: 1.5,
    flex: 1,
  },

  articlesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
    gap: 20,
  },
  articleCard: {
    background: 'var(--card)',
    border: '1px solid',
    borderRadius: 14,
    padding: 24,
    cursor: 'pointer',
    transition: 'transform 0.2s',
    display: 'flex',
    flexDirection: 'column',
  },
  articleTitle: {
    fontFamily: "'Syne',sans-serif",
    fontWeight: 700,
    fontSize: 17,
    color: 'var(--white)',
    margin: '12px 0 8px',
    lineHeight: 1.3,
  },
  articleDesc: {
    fontSize: 13,
    color: 'var(--muted)',
    lineHeight: 1.6,
    flex: 1,
  },
  tag: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    border: '1px solid',
  },
  filterTag: {
    padding: '6px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    color: 'var(--muted)',
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: "'Outfit',sans-serif",
    transition: 'all 0.2s',
  },
  filterTagOn: {
    background: 'rgba(232,201,122,0.12)',
    borderColor: 'var(--pink)',
    color: 'var(--pink)',
  },

  toolsCtaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
    gap: 16,
  },
  toolCard: {
    background: 'var(--card)',
    border: '1px solid',
    borderRadius: 14,
    padding: 24,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  page: { padding: '48px 48px', maxWidth: 1100, margin: '0 auto' },
  pageTitle: {
    fontFamily: "'Bebas Neue',display",
    fontSize: 72,
    lineHeight: 1.0,
    color: 'var(--white)',
    letterSpacing: '0.01em',
    marginBottom: 16,
    marginTop: 8,
  },
  pageSub: {
    fontSize: 16,
    color: 'var(--muted)',
    lineHeight: 1.7,
    maxWidth: 560,
    marginBottom: 36,
  },
  card: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    padding: 28,
    marginBottom: 24,
  },

  budgetSection: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 24,
    marginBottom: 20,
  },
  budgetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
    gap: 8,
  },
  budgetItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: '10px 12px',
  },
  summaryRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
    gap: 14,
    marginBottom: 28,
  },
  summaryCard: {
    background: 'var(--card)',
    border: '1px solid',
    borderRadius: 12,
    padding: '16px 18px',
  },

  tabBar: { display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' },
  tabBtn: {
    padding: '7px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)',
    borderRadius: 30,
    color: 'var(--muted)',
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: "'Outfit',sans-serif",
    transition: 'all 0.2s',
  },
  tabBtnOn: {
    background: 'rgba(143,184,200,0.12)',
    borderColor: 'var(--cyan)',
    color: 'var(--cyan)',
  },
  calcH: {
    fontFamily: "'Syne',sans-serif",
    fontWeight: 700,
    fontSize: 18,
    color: 'var(--white)',
    marginBottom: 20,
  },
  insight: {
    marginTop: 14,
    padding: 12,
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    fontSize: 13,
    color: 'rgba(248,248,248,0.8)',
    lineHeight: 1.6,
    borderLeft: '3px solid var(--yellow)',
  },

  // Form styles
  inputLabel: {
    fontSize: 12,
    color: 'var(--muted)',
    display: 'block',
    marginBottom: 6,
    fontWeight: 600,
  },
  input: {
    width: '100%',
    padding: 10,
    background: 'var(--card2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--white)',
    fontFamily: "'Outfit',sans-serif",
    fontSize: 14,
  },
};

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('home');

  return (
    <>
      <GlobalStyle />
      <div
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Nav active={tab} setActive={setTab} />
        <div style={{ flex: 1 }}>
          {tab === 'home' && <HomePage setActive={setTab} />}
          {tab === 'articles' && <ArticlesPage />}
          {tab === 'budget' && <BudgetPage />}
          {tab === 'calcs' && <CalcsPage />}
          {tab === 'waitlist' && <WaitlistPage />}
        </div>
        <Footer />
      </div>
    </>
  );
}
