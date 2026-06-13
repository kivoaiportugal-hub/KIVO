import type { CSSProperties } from "react";
import { Icon } from "@/components/ui-icon";
import { ScrollReveal } from "@/components/scroll-reveal";

type IconName = Parameters<typeof Icon>[0]["name"];

const navItems = [
  { label: "Product", href: "#product" },
  { label: "Platforms", href: "#platforms" },
  { label: "WhatsApp", href: "#whatsapp" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const heroCards = [
  {
    className: "action-card",
    label: "Recommended action",
    title: "Raise Truffle Burger by €0.50",
    body: "Estimated impact this week: +€312",
  },
  {
    className: "menu-card",
    label: "Menu score",
    title: "86",
    body: "Strong lunch demand. Margin leak on two items.",
  },
  {
    className: "chat-card",
    label: "Kivo on WhatsApp",
    title: "Daily summary",
    body: "Done. I will include sales, reviews, and next-best actions.",
  },
  {
    className: "digest-card",
    label: "Yesterday",
    title: "€8,642",
    body: "Revenue up 18.6%. Reviews improved, dinner volume softened.",
  },
  {
    className: "review-card",
    label: "Reviews",
    title: "4.7",
    body: "Negative review spike detected on Carbonara pasta.",
  },
];

const featureCards: Array<{
  icon: IconName;
  title: string;
  body: string;
}> = [
  {
    icon: "chart",
    title: "Live performance",
    body: "Revenue, orders, average ticket, reviews and menu movement in one quiet operating view.",
  },
  {
    icon: "trend",
    title: "Pricing intelligence",
    body: "Get price suggestions with estimated euro impact before you change the menu.",
  },
  {
    icon: "star",
    title: "Reviews that move",
    body: "Sentiment analysis, reply drafts and automatic responses when your team is ready.",
  },
  {
    icon: "zap",
    title: "Action engine",
    body: "Promotions, price changes and rules can move from suggestion to execution with approval.",
  },
];

const workflow = [
  "Morning digest with revenue, order changes and review alerts.",
  "Kivo flags the menu items that need pricing, promotion or removal.",
  "You approve actions in chat or let Autopilot execute within your rules.",
];

const automationCards: Array<{ icon: IconName; title: string; body: string }> = [
  {
    icon: "bot",
    title: "Ask",
    body: "Question sales, reviews and menu performance in natural language.",
  },
  {
    icon: "spark",
    title: "Suggest",
    body: "Get actions with expected impact before changing prices or promos.",
  },
  {
    icon: "shield",
    title: "Approve",
    body: "Review changes, set rules and keep every action in a clear log.",
  },
];

const plans = [
  {
    name: "Start",
    price: "39",
    description:
      "For restaurants getting started. Kivo helps you understand what is happening.",
    features: [
      "Chat with Kivo for sales, prices and reviews",
      "Basic analytics: revenue, orders, average ticket",
      "Automatic insights and recommendations",
      "Problem alerts for sales drops and negative reviews",
      "Revenue forecast for the next 7 days",
      "Support for 3 platforms",
      "Up to 100 menu items",
      "90 days of data",
      "50 AI queries per day",
    ],
  },
  {
    name: "Grow",
    price: "99",
    highlighted: true,
    description:
      "For restaurants ready to grow with AI optimization across menu, pricing and reviews.",
    features: [
      "Everything in Start",
      "Menu Intelligence for performance and margins",
      "Pricing Engine with euro impact estimates",
      "Promotion management directly through chat",
      "Review sentiment and automatic reply drafts",
      "Platform data import for complete visibility",
      "Action impact in euros",
      "Support for 5 platforms",
      "Up to 500 menu items",
      "365 days of data",
      "200 AI queries per day",
    ],
  },
  {
    name: "Autopilot",
    price: "199",
    description:
      "For operators who want Kivo to manage the delivery channel automatically.",
    features: [
      "Everything in Grow",
      "Automatic actions without manual prompts",
      "Auto pricing based on demand and competition",
      "Auto promotions when opportunities appear",
      "Auto reviews and customer replies",
      "Custom rules for your restaurant",
      "Full action log",
      "Support for 10 platforms",
      "Unlimited menu",
      "Forever data retention",
      "Unlimited AI queries",
    ],
  },
];

const faqs = [
  {
    question: "Is Kivo only for Uber Eats?",
    answer:
      "The first positioning is Uber Eats, but the platform is structured to support Glovo, Bolt Food and other delivery channels as the restaurant grows.",
  },
  {
    question: "Can I use Kivo without opening the dashboard?",
    answer:
      "Yes. WhatsApp is part of the core product, so daily summaries, questions and approvals can happen from chat.",
  },
  {
    question: "Does Autopilot make changes automatically?",
    answer:
      "Only after rules are configured. Every automatic change is stored in the action log so the team can review what happened and why.",
  },
];

export default function Home() {
  return (
    <main>
      <ScrollReveal />

      <section className="figma-hero" id="top">
        <header className="top-bar">
          <a className="brand" href="#top" aria-label="Kivo home">
            <span className="brand-mark">K</span>
            <span>KIVO</span>
          </a>
          <nav aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <a className="header-cta" href="#signup">
            SignUp
          </a>
        </header>

        <div className="hero-content">
          <div className="ai-pill">
            <Icon name="spark" size={16} />
            <span>AI Powered</span>
          </div>
          <h1 data-word-reveal>Delivery operations copilot for Uber Eats.</h1>
          <a className="hero-cta" href="#signup">
            Start for free
          </a>
          <img
            className="hero-product"
            src="/figma-assets/hero-product.png"
            alt="Kivo dashboard preview"
          />
        </div>
      </section>

      <section className="platforms" id="platforms" data-reveal>
        <p>Integrate your platforms:</p>
        <div className="platform-row" aria-label="Supported platforms">
          <img
            className="platform-logo platform-logo-whatsapp"
            src="/figma-assets/platform-whatsapp.png"
            alt="WhatsApp"
          />
          <img
            className="platform-logo platform-logo-uber"
            src="/figma-assets/platform-uber.png"
            alt="Uber Eats"
          />
          <img
            className="platform-logo platform-logo-bolt"
            src="/figma-assets/platform-bolt.png"
            alt="Bolt Food"
          />
          <img
            className="platform-logo platform-logo-glovo"
            src="/figma-assets/platform-glovo.png"
            alt="Glovo"
          />
        </div>
      </section>

      <section className="statement" data-reveal>
        <p>
          Restaurants do not need another dashboard. They need a calm operator
          that notices what changed, explains why, and helps the team act before
          the next service starts.
        </p>
      </section>

      <section className="hero-card-stage section-shell" aria-label="Kivo product cards">
        {heroCards.map((card, index) => (
          <article
            className={`showcase-card ${card.className}`}
            data-reveal
            style={{ "--delay": `${index * 70}ms` } as CSSProperties}
            key={card.title}
          >
            <span className="mini-label">{card.label}</span>
            <strong>{card.title}</strong>
            {card.className === "digest-card" ? (
              <div className="line-chart" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            ) : null}
            {card.className === "menu-card" ? (
              <div className="score-ring" aria-hidden="true" />
            ) : null}
            {card.className === "chat-card" ? (
              <p className="bubble out">{card.body}</p>
            ) : (
              <p>{card.body}</p>
            )}
            {card.className === "action-card" ? (
              <button type="button">Approve</button>
            ) : null}
          </article>
        ))}
      </section>

      <section className="figma-section feature-section section-shell" id="product">
        <span className="section-number" data-reveal>
          01
        </span>
        <h2 data-word-reveal>Run delivery with a sharper daily rhythm.</h2>
        <div className="flip-grid">
          {featureCards.map((feature, index) => (
            <article
              className="flip-card"
              data-reveal
              style={{ "--delay": `${index * 90}ms` } as CSSProperties}
              key={feature.title}
            >
              <div className="flip-inner">
                <div className="flip-face flip-front">
                  <Icon name={feature.icon} size={24} />
                  <h3>{feature.title}</h3>
                  <div className={`motion-graphic motion-${index + 1}`} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <i />
                  </div>
                </div>
                <div className="flip-face flip-back">
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="section-body" data-word-reveal>
          Kivo combines analytics, reviews, menu intelligence, pricing and
          promotions into one operating layer for restaurants selling through
          delivery platforms.
        </p>
      </section>

      <section className="figma-section whatsapp-section section-shell" id="whatsapp">
        <div className="phone-scene" data-reveal>
          <img
            className="phone-hand-image"
            src="/figma-assets/kivo-phone-hand-transparent.png"
            alt="Hand holding a phone with Kivo WhatsApp conversation"
          />
        </div>

        <div className="whatsapp-copy">
          <span className="section-number" data-reveal>
            02
          </span>
          <h2 data-word-reveal>The agent meets operators where they already are.</h2>
          <p data-word-reveal>
            Daily summaries, alerts and approvals can happen inside WhatsApp.
            The webapp stays available for deeper analysis, but the restaurant
            does not need to live inside it.
          </p>
          <ul className="workflow-list">
            {workflow.map((item, index) => (
              <li
                key={item}
                data-reveal
                style={{ "--delay": `${index * 90}ms` } as CSSProperties}
              >
                <Icon name="check" size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="figma-section automation section-shell">
        <span className="section-number center" data-reveal>
          03
        </span>
        <h2 data-word-reveal>From insight to action, with the right level of control.</h2>
        <p className="section-body center" data-word-reveal>
          Start with recommendations. Grow into approved changes. Move to
          Autopilot when the rules are clear and Kivo can run the repetitive
          work for you.
        </p>
        <div className="automation-stack">
          {automationCards.map((card, index) => (
            <article
              className={`automation-card card-${index + 1}`}
              data-spread
              style={{ "--delay": `${index * 80}ms` } as CSSProperties}
              key={card.title}
            >
              <Icon name={card.icon} size={24} />
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-section" id="pricing">
        <div className="pricing-head" data-reveal>
          <span className="section-number">04</span>
          <h2>Choose the operating mode that fits your restaurant.</h2>
          <p>
            Start with visibility, unlock optimization, then let Kivo execute
            once your team is ready for automation.
          </p>
          <label className="pricing-switch">
            <input type="checkbox" aria-label="Show plan details" />
            <span className="switch-track">
              <span>Overview</span>
              <span>Details</span>
            </span>
          </label>
        </div>
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <article
              className={`price-card ${plan.highlighted ? "highlighted" : ""}`}
              data-reveal
              style={{ "--delay": `${index * 90}ms` } as CSSProperties}
              key={plan.name}
            >
              <div className="price-inner">
                <div className="price-face price-front">
                  <div className="plan-top">
                    <div>
                      <h3>{plan.name}</h3>
                      <p>{plan.description}</p>
                    </div>
                    {plan.highlighted ? <span>Most chosen</span> : null}
                  </div>
                  <div className="price">
                    <span>€</span>
                    {plan.price}
                    <small>/month</small>
                  </div>
                  <a className="button plan-button" href="#signup">
                    Start for free
                  </a>
                  <p className="plan-note">Built by chefs for chefs.</p>
                </div>
                <div className="price-face price-back">
                  <div className="plan-top compact">
                    <div>
                      <h3>{plan.name}</h3>
                      <p>Included in this mode</p>
                    </div>
                  </div>
                  <ul>
                    {plan.features.slice(0, 5).map((feature) => (
                      <li key={feature}>
                        <Icon name="check" size={15} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="faq section-shell">
        <div className="section-copy" data-reveal>
          <span className="section-number">05</span>
          <h2>Questions restaurant teams ask before starting.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <article
              key={faq.question}
              data-reveal
              style={{ "--delay": `${index * 80}ms` } as CSSProperties}
            >
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta" id="contact" data-reveal>
        <div>
          <Icon name="utensils" size={24} />
          <h2>Start with one restaurant. Let Kivo learn the rhythm.</h2>
          <p>
            Connect your delivery data, receive your first daily summary, and
            see which actions can improve revenue this week.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#signup">
              Start for free
            </a>
            <a className="button secondary light" href="mailto:hello@kivo.ai">
              hello@kivo.ai
            </a>
          </div>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top" aria-label="Kivo home">
          <span className="brand-mark">K</span>
          <span>KIVO</span>
        </a>
        <span>Built by chefs for chefs.</span>
        <span>© 2026 Kivo</span>
      </footer>

      <div id="signup" className="signup-anchor" aria-hidden="true" />
    </main>
  );
}
