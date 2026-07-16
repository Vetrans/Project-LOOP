import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, Users, MessageSquare, FileBarChart, ShieldCheck, Layers,
  Check, ArrowRight, Boxes, GitBranch, Lock,
} from "lucide-react";
import LoopMark from "../components/LoopMark";

const TABS = [
  { id: "product", label: "Product" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "resources", label: "Resources" },
];

export default function Landing() {
  const [tab, setTab] = useState("product");

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <LoopMark size={26} />
            <span>LOOP</span>
          </div>

          <div className="landing-tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`landing-tab${tab === t.id ? " active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="row gap-3">
            <Link to="/login" className="landing-login">Login</Link>
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      <header className="landing-hero">
        <div className="landing-hero-glow" aria-hidden="true" />
        <span className="landing-eyebrow-pill">
          <Sparkles size={13} /> AI-powered customer feedback intelligence
        </span>
        <h1 className="landing-h1">
          Understand <em>every voice.</em>
          <br />
          Build better products.
        </h1>
        <p className="landing-sub">
          LOOP turns scattered support tickets, reviews, and survey replies into a ranked,
          evidence-backed list of what to build next — grounded in your real customer data,
          never invented.
        </p>
        <div className="row gap-3 landing-hero-cta">
          <Link to="/signup" className="btn btn-primary">
            Start free <ArrowRight size={15} />
          </Link>
          <button className="btn btn-secondary" onClick={() => setTab("product")}>
            See how it works
          </button>
        </div>
        <p className="landing-trusted-label">Built for multi-tenant SaaS teams</p>
        <div className="landing-trusted-row">
          {["Acme", "ByteScale", "Spherule", "Cloudsoft", "Penta"].map((name) => (
            <span key={name} className="landing-trusted-chip">{name}</span>
          ))}
        </div>
      </header>

      <main className="landing-panel-wrap">
        <div className="panel landing-panel">
          {tab === "product" && <ProductSection />}
          {tab === "features" && <FeaturesSection />}
          {tab === "pricing" && <PricingSection />}
          {tab === "resources" && <ResourcesSection />}
        </div>
      </main>

      <footer className="landing-footer">
        <div className="row gap-2">
          <LoopMark size={18} />
          <span className="text-meta">LOOP — close the loop on customer feedback.</span>
        </div>
        <Link to="/signup" className="link-quiet">Create a workspace <ArrowRight size={13} /></Link>
      </footer>
    </div>
  );
}

function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="landing-section-head">
      <p className="text-eyebrow">{eyebrow}</p>
      <h2 className="landing-h2">{title}</h2>
      {sub && <p className="landing-section-sub">{sub}</p>}
    </div>
  );
}

function ProductSection() {
  const steps = [
    { icon: Boxes, title: "Feedback in", body: "Support tickets, app reviews, NPS replies, sales notes, and social mentions — every channel, one inbox." },
    { icon: Sparkles, title: "LOOP engine", body: "Claude classifies sentiment, clusters items into named themes, and tracks what's spiking week over week." },
    { icon: FileBarChart, title: "Insights out", body: "A live dashboard, grounded Q&A, and a shareable Voice-of-Customer report — backed by real citations." },
  ];
  return (
    <div>
      <SectionHead
        eyebrow="Product"
        title="One inbox for every channel your customers use"
        sub="LOOP is built like the internal tools real product teams already pay for — not a to-do list with a chatbot bolted on."
      />
      <div className="landing-steps">
        {steps.map((s, i) => (
          <div key={s.title} className="landing-step">
            <div className="landing-step-icon"><s.icon size={18} /></div>
            <p className="text-eyebrow">Step {i + 1}</p>
            <p className="landing-step-title">{s.title}</p>
            <p className="landing-step-body">{s.body}</p>
          </div>
        ))}
      </div>
      <div className="landing-callout">
        <Lock size={16} />
        <p>Every company gets its own isolated workspace — one login, zero shared data, enforced on every request.</p>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const ai = [
    { icon: Sparkles, title: "Auto-classification", body: "Every new item is tagged with sentiment and theme the moment it lands — no manual triage." },
    { icon: Layers, title: "Theme clustering & trends", body: "Similar feedback groups itself into named themes, with spikes flagged automatically." },
    { icon: MessageSquare, title: "Ask LOOP", body: "Ask a plain-English question, get an answer grounded in real feedback — with citations, never invention." },
    { icon: FileBarChart, title: "Voice-of-Customer reports", body: "One click turns a period of feedback into a digest you could forward to leadership as-is." },
  ];
  const core = [
    { icon: ShieldCheck, title: "Role-based access", body: "Admin, Analyst, and Viewer — enforced server-side, not just hidden buttons." },
    { icon: GitBranch, title: "Full status workflow", body: "New → Reviewed → Actioned, with search, filters, and pagination built in." },
  ];
  return (
    <div>
      <SectionHead eyebrow="Features" title="AI where it earns its place" sub="Four AI features that need genuine understanding, not cosmetic ones." />
      <div className="landing-feature-grid">
        {ai.map((f) => (
          <div key={f.title} className="landing-feature-card">
            <div className="landing-step-icon"><f.icon size={17} /></div>
            <p className="landing-step-title" style={{ fontSize: 14.5 }}>{f.title}</p>
            <p className="landing-step-body">{f.body}</p>
          </div>
        ))}
      </div>
      <p className="text-eyebrow" style={{ marginTop: 28, marginBottom: 12 }}>Also included</p>
      <div className="landing-feature-grid">
        {core.map((f) => (
          <div key={f.title} className="landing-feature-card">
            <div className="landing-step-icon"><f.icon size={17} /></div>
            <p className="landing-step-title" style={{ fontSize: 14.5 }}>{f.title}</p>
            <p className="landing-step-body">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingSection() {
  const tiers = [
    { name: "Starter", price: "$0", tag: "One workspace, up to 3 seats", cta: "Start free", features: ["500 feedback items / mo", "Core dashboard & inbox", "Manual CSV import"] },
    { name: "Team", price: "$79", tag: "Per workspace / month", cta: "Start free trial", featured: true, features: ["Unlimited feedback items", "All 4 AI features", "Role-based access control", "Voice-of-Customer reports"] },
    { name: "Enterprise", price: "Custom", tag: "For multi-brand orgs", cta: "Talk to us", features: ["Multiple workspaces", "SSO / SAML", "Dedicated support"] },
  ];
  return (
    <div>
      <SectionHead eyebrow="Pricing" title="Simple, per-workspace pricing" sub="Every company gets its own isolated workspace, however many teammates it has." />
      <div className="landing-pricing-grid">
        {tiers.map((t) => (
          <div key={t.name} className={`landing-price-card${t.featured ? " featured" : ""}`}>
            {t.featured && <span className="landing-price-badge">Most popular</span>}
            <p className="landing-step-title" style={{ fontSize: 15 }}>{t.name}</p>
            <p className="landing-price-value">{t.price}</p>
            <p className="text-meta">{t.tag}</p>
            <ul className="landing-price-features">
              {t.features.map((f) => (
                <li key={f}><Check size={14} /> {f}</li>
              ))}
            </ul>
            <Link to="/signup" className={`btn ${t.featured ? "btn-primary" : "btn-secondary"} btn-block`}>
              {t.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResourcesSection() {
  const items = [
    { title: "Documentation", body: "Setup guides for the frontend, backend, and AI service." },
    { title: "API reference", body: "Every REST endpoint LOOP's dashboard itself calls." },
    { title: "Architecture", body: "How multi-tenancy, RBAC, and grounded AI fit together." },
    { title: "Support", body: "Reach the team building LOOP directly." },
  ];
  return (
    <div>
      <SectionHead eyebrow="Resources" title="Everything to get running" />
      <div className="landing-feature-grid">
        {items.map((r) => (
          <div key={r.title} className="landing-feature-card">
            <p className="landing-step-title" style={{ fontSize: 14.5 }}>{r.title}</p>
            <p className="landing-step-body">{r.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
