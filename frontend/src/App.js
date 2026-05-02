import React, { useState } from "react";
import CategoryList from "./components/categories/CategoryList";
import SubcategoryList from "./components/subcategories/SubcategoryList";
import ProductList from "./components/products/ProductList";
import "./App.css";

const GridIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
const ListIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);
const BoxIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const TABS = [
  {
    key: "categories",
    label: "Categories",
    Icon: GridIcon,
    desc: "Manage product categories",
  },
  {
    key: "subcategories",
    label: "Subcategories",
    Icon: ListIcon,
    desc: "Manage subcategories",
  },
  {
    key: "products",
    label: "Products",
    Icon: BoxIcon,
    desc: "Manage product master",
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("categories");
  const active = TABS.find((t) => t.key === activeTab);

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div>
            <div className="brand-name">Neophron</div>
            <div className="brand-sub">Product Suite</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">MODULES</div>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className={`nav-icon-wrap ${isActive ? "active" : ""}`}>
                  <tab.Icon />
                </span>
                <div className="nav-text">
                  <span className="nav-title">{tab.label}</span>
                  <span className="nav-desc">{tab.desc}</span>
                </div>
                {isActive && <span className="nav-active-bar" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="footer-status">
            <span className="badge-dot" />
            <span className="footer-status-text">API Connected</span>
          </div>
          <div className="footer-stack">
            <span className="stack-tag">Laravel 12</span>
            <span className="stack-sep">·</span>
            <span className="stack-tag">React</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">{active.label}</h1>
            <span className="page-breadcrumb">Dashboard / {active.label}</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-user">
              <div className="user-avatar">G</div>
              <div>
                <div className="user-name">Gangatharan</div>
                <div className="user-role">Developer</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {activeTab === "categories" && <CategoryList />}
          {activeTab === "subcategories" && <SubcategoryList />}
          {activeTab === "products" && <ProductList />}
        </div>
      </main>
    </div>
  );
}
