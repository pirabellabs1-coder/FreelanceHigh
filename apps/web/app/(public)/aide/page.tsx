"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/toast";

// ============================================================
// Chat message type
// ============================================================

interface ChatMsg {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

function timeNow() {
  return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

// ============================================================
// Component
// ============================================================

export default function AidePage() {
  const t = useTranslations("help");
  const addToast = useToastStore((s) => s.addToast);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // FAQ accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Live chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { id: "1", sender: "bot", text: t("chat_welcome"), time: timeNow() },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Ticket modal
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: t("ticket_cat_technical"),
    description: "",
    priority: "moyenne",
  });

  // Data
  const CATEGORIES = [
    { id: "start", titleKey: "cat_getting_started", icon: "rocket_launch", count: 12, descKey: "cat_getting_started_desc" },
    { id: "orders", titleKey: "cat_orders", icon: "shopping_cart", count: 15, descKey: "cat_orders_desc" },
    { id: "payments", titleKey: "cat_payments", icon: "payments", count: 10, descKey: "cat_payments_desc" },
    { id: "disputes", titleKey: "cat_disputes", icon: "gavel", count: 8, descKey: "cat_disputes_desc" },
    { id: "account", titleKey: "cat_account", icon: "person", count: 9, descKey: "cat_account_desc" },
    { id: "security", titleKey: "cat_security", icon: "shield", count: 7, descKey: "cat_security_desc" },
    { id: "formations", titleKey: "cat_formations", icon: "school", count: 10, descKey: "cat_formations_desc" },
    { id: "instructors", titleKey: "cat_instructors", icon: "record_voice_over", count: 6, descKey: "cat_instructors_desc" },
    { id: "certificates", titleKey: "cat_certificates", icon: "workspace_premium", count: 5, descKey: "cat_certificates_desc" },
    { id: "products", titleKey: "cat_products", icon: "inventory_2", count: 5, descKey: "cat_products_desc" },
  ];

  const POPULAR_ARTICLES = [
    { titleKey: "article_create_account", icon: "person_add", categoryKey: "cat_getting_started" },
    { titleKey: "article_publish_service", icon: "add_circle", categoryKey: "cat_getting_started" },
    { titleKey: "article_escrow", icon: "account_balance", categoryKey: "cat_payments" },
    { titleKey: "article_withdraw", icon: "account_balance_wallet", categoryKey: "cat_payments" },
    { titleKey: "article_dispute", icon: "gavel", categoryKey: "cat_disputes" },
    { titleKey: "article_2fa", icon: "verified_user", categoryKey: "cat_security" },
    { titleKey: "article_track_orders", icon: "local_shipping", categoryKey: "cat_orders" },
    { titleKey: "article_optimize_profile", icon: "trending_up", categoryKey: "cat_account" },
    { titleKey: "article_enroll_formation", icon: "school", categoryKey: "cat_formations" },
    { titleKey: "article_become_instructor", icon: "record_voice_over", categoryKey: "cat_instructors" },
    { titleKey: "article_get_certificate", icon: "workspace_premium", categoryKey: "cat_certificates" },
    { titleKey: "article_buy_product", icon: "shopping_bag", categoryKey: "cat_products" },
    { titleKey: "article_join_cohort", icon: "groups", categoryKey: "cat_formations" },
    { titleKey: "article_instructor_revenue", icon: "monetization_on", categoryKey: "cat_instructors" },
    { titleKey: "article_formation_refund", icon: "replay", categoryKey: "cat_formations" },
    { titleKey: "article_promo_codes", icon: "confirmation_number", categoryKey: "cat_formations" },
  ];

  const FAQ_ITEMS = [
    { qKey: "faq_signup_q", aKey: "faq_signup_a", category: "start" },
    { qKey: "faq_payment_methods_q", aKey: "faq_payment_methods_a", category: "payments" },
    { qKey: "faq_delivery_q", aKey: "faq_delivery_a", category: "orders" },
    { qKey: "faq_open_dispute_q", aKey: "faq_open_dispute_a", category: "disputes" },
    { qKey: "faq_commissions_q", aKey: "faq_commissions_a", category: "payments" },
    { qKey: "faq_withdraw_q", aKey: "faq_withdraw_a", category: "payments" },
    { qKey: "faq_cancel_order_q", aKey: "faq_cancel_order_a", category: "orders" },
    { qKey: "faq_2fa_q", aKey: "faq_2fa_a", category: "security" },
    { qKey: "faq_agency_q", aKey: "faq_agency_a", category: "start" },
    { qKey: "faq_contact_support_q", aKey: "faq_contact_support_a", category: "account" },
    { qKey: "faq_kyc_q", aKey: "faq_kyc_a", category: "security" },
    { qKey: "faq_boost_q", aKey: "faq_boost_a", category: "account" },
    // Formations
    { qKey: "faq_enroll_formation_q", aKey: "faq_enroll_formation_a", category: "formations" },
    { qKey: "faq_formation_access_duration_q", aKey: "faq_formation_access_duration_a", category: "formations" },
    { qKey: "faq_formation_refund_q", aKey: "faq_formation_refund_a", category: "formations" },
    { qKey: "faq_what_is_cohort_q", aKey: "faq_what_is_cohort_a", category: "formations" },
    { qKey: "faq_complete_formation_q", aKey: "faq_complete_formation_a", category: "formations" },
    { qKey: "faq_promo_code_q", aKey: "faq_promo_code_a", category: "formations" },
    { qKey: "faq_formation_mobile_q", aKey: "faq_formation_mobile_a", category: "formations" },
    // Instructors
    { qKey: "faq_become_instructor_q", aKey: "faq_become_instructor_a", category: "instructors" },
    { qKey: "faq_instructor_revenue_q", aKey: "faq_instructor_revenue_a", category: "instructors" },
    { qKey: "faq_instructor_approval_q", aKey: "faq_instructor_approval_a", category: "instructors" },
    { qKey: "faq_create_publish_formation_q", aKey: "faq_create_publish_formation_a", category: "instructors" },
    // Certificates
    { qKey: "faq_get_certificate_q", aKey: "faq_get_certificate_a", category: "certificates" },
    { qKey: "faq_certificate_value_q", aKey: "faq_certificate_value_a", category: "certificates" },
    { qKey: "faq_verify_certificate_q", aKey: "faq_verify_certificate_a", category: "certificates" },
    // Products
    { qKey: "faq_what_is_digital_product_q", aKey: "faq_what_is_digital_product_a", category: "products" },
    { qKey: "faq_buy_digital_product_q", aKey: "faq_buy_digital_product_a", category: "products" },
    { qKey: "faq_return_digital_product_q", aKey: "faq_return_digital_product_a", category: "products" },
    // Other
    { qKey: "faq_ai_search_q", aKey: "faq_ai_search_a", category: "start" },
  ];

  const TICKET_CATEGORIES = [
    t("ticket_cat_technical"),
    t("ticket_cat_payment"),
    t("ticket_cat_dispute"),
    t("ticket_cat_account"),
    t("ticket_cat_formations"),
    t("ticket_cat_report_user"),
    t("ticket_cat_suggestion"),
    t("ticket_cat_other"),
  ];

  const TICKET_PRIORITIES = [
    { value: "basse", labelKey: "priority_low" },
    { value: "moyenne", labelKey: "priority_medium" },
    { value: "haute", labelKey: "priority_high" },
  ];

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Filter FAQ by search and category
  const filteredFaq = FAQ_ITEMS.filter((item) => {
    const question = t(item.qKey);
    const answer = t(item.aKey);
    const matchesSearch =
      !searchQuery ||
      question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Send chat message
  const handleSendChat = useCallback(() => {
    const text = chatInput.trim();
    if (!text) return;
    const userMsg: ChatMsg = {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: timeNow(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    // Simulated bot response
    setTimeout(() => {
      const botMsg: ChatMsg = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: t("chat_auto_reply"),
        time: timeNow(),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 1200);
  }, [chatInput, t]);

  // Submit ticket
  function handleSubmitTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      addToast("error", t("ticket_error_required"));
      return;
    }
    addToast("success", t("ticket_success"));
    setTicketModalOpen(false);
    setTicketForm({ subject: "", category: TICKET_CATEGORIES[0], description: "", priority: "moyenne" });
  }

  return (
    <div className="min-h-screen bg-background-dark text-white">
      {/* ================================================================ */}
      {/* Hero + Search */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden px-6 lg:px-8 pt-16 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider border border-primary/25">
            <span className="material-symbols-outlined text-base">support_agent</span>
            {t("hero_badge")}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            {t("hero_title_prefix")}{" "}
            <span className="text-primary">{t("hero_title_highlight")}</span> ?
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {t("hero_subtitle")}
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center bg-neutral-dark border border-border-dark rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <span className="material-symbols-outlined text-slate-400 px-4 text-xl">search</span>
              <input
                type="text"
                placeholder={t("search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-500 text-base py-4 pr-4"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-3 text-slate-400 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* Categories Grid */}
      {/* ================================================================ */}
      <section className="px-6 lg:px-8 pb-20">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">
            {t("explore_by_category")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={cn(
                  "group text-left p-6 rounded-xl border transition-all duration-200",
                  activeCategory === cat.id
                    ? "bg-primary/15 border-primary/40 shadow-lg shadow-primary/10"
                    : "bg-neutral-dark border-border-dark hover:border-primary/30 hover:bg-neutral-dark/80"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      activeCategory === cat.id
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary group-hover:bg-primary/20"
                    )}
                  >
                    <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg mb-1">{t(cat.titleKey)}</h3>
                    <p className="text-sm text-slate-400 mb-2">{t(cat.descKey)}</p>
                    <span className="text-xs text-primary font-semibold">{t("articles_count", { count: cat.count })}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {activeCategory && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setActiveCategory(null)}
                className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
                {t("clear_filter")}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* Popular Articles */}
      {/* ================================================================ */}
      <section className="px-6 lg:px-8 pb-20">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">
            {t("popular_articles")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {POPULAR_ARTICLES.map((article) => (
              <div
                key={article.titleKey}
                className="group bg-neutral-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-xl">{article.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm leading-snug mb-1.5 group-hover:text-primary transition-colors">
                      {t(article.titleKey)}
                    </h4>
                    <span className="text-xs text-slate-500">{t(article.categoryKey)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FAQ Accordion */}
      {/* ================================================================ */}
      <section className="px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center">
            {t("faq_title")}
          </h2>

          {filteredFaq.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-slate-500 mb-4 block">search_off</span>
              <p className="text-slate-400 text-lg">{t("no_results")}</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory(null);
                }}
                className="mt-4 text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
              >
                {t("reset_filters")}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaq.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "border rounded-xl overflow-hidden transition-all duration-200",
                      isOpen
                        ? "bg-neutral-dark border-primary/30"
                        : "bg-neutral-dark/60 border-border-dark hover:border-border-dark/80"
                    )}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-semibold text-base leading-snug">{t(item.qKey)}</span>
                      <span
                        className={cn(
                          "material-symbols-outlined text-xl text-slate-400 shrink-0 transition-transform duration-200",
                          isOpen && "rotate-180 text-primary"
                        )}
                      >
                        expand_more
                      </span>
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-200",
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed">
                          {t(item.aKey)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* Support Tickets Section */}
      {/* ================================================================ */}
      <section className="px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-neutral-dark border border-border-dark rounded-xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">confirmation_number</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {t("support_title")}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">
              {t("support_desc")}{" "}
              <a href="mailto:support@freelancehigh.com" className="text-primary hover:underline font-semibold">
                support@freelancehigh.com
              </a>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setTicketModalOpen(true)}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-8 py-4 font-bold transition-all shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-xl">add</span>
                {t("create_ticket")}
              </button>
              <a
                href="mailto:support@freelancehigh.com"
                className="inline-flex items-center gap-2 bg-border-dark hover:bg-border-dark/80 text-slate-300 rounded-xl px-8 py-4 font-semibold transition-all"
              >
                <span className="material-symbols-outlined text-xl">mail</span>
                {t("send_email")}
              </a>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">schedule</span>
                {t("support_hours")}
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">mail</span>
                support@freelancehigh.com
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">avg_pace</span>
                {t("support_response_time")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* Ticket Modal */}
      {/* ================================================================ */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setTicketModalOpen(false)}
          />
          <div className="relative bg-background-dark border border-border-dark rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">confirmation_number</span>
                </div>
                <h3 className="text-lg font-bold">{t("ticket_modal_title")}</h3>
              </div>
              <button
                onClick={() => setTicketModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-5">
              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  {t("ticket_subject")} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder={t("ticket_subject_placeholder")}
                  className="w-full bg-neutral-dark border border-border-dark rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  {t("ticket_category")}
                </label>
                <div className="relative">
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full appearance-none bg-neutral-dark border border-border-dark rounded-xl px-4 py-3 pr-10 text-sm text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                  >
                    {TICKET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined text-slate-400 text-sm absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  {t("ticket_priority")}
                </label>
                <div className="flex gap-3">
                  {TICKET_PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setTicketForm({ ...ticketForm, priority: p.value })}
                      className={cn(
                        "flex-1 py-2.5 text-sm font-semibold rounded-xl border transition-all",
                        ticketForm.priority === p.value
                          ? "bg-primary/15 border-primary/40 text-primary"
                          : "bg-neutral-dark border-border-dark text-slate-400 hover:border-border-dark/80"
                      )}
                    >
                      {t(p.labelKey)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  {t("ticket_description")} <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  placeholder={t("ticket_description_placeholder")}
                  rows={5}
                  className="w-full bg-neutral-dark border border-border-dark rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setTicketModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200 bg-border-dark rounded-xl transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors shadow-lg shadow-primary/20"
                >
                  {t("submit_ticket")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* Live Chat Widget */}
      {/* ================================================================ */}

      {/* Chat panel */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-[80] w-full sm:w-96 max-w-[calc(100vw-2rem)] bg-background-dark border border-border-dark rounded-xl shadow-2xl flex flex-col overflow-hidden animate-scale-in"
          style={{ height: "480px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-primary text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">support_agent</span>
              </div>
              <div>
                <p className="font-bold text-sm">{t("chat_header_title")}</p>
                <p className="text-xs text-white/70">{t("chat_header_status")}</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] px-4 py-2.5 rounded-xl text-sm leading-relaxed",
                    msg.sender === "user"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-neutral-dark border border-border-dark text-slate-300 rounded-bl-sm"
                  )}
                >
                  <p>{msg.text}</p>
                  <p
                    className={cn(
                      "text-[10px] mt-1",
                      msg.sender === "user" ? "text-white/60" : "text-slate-500"
                    )}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 px-4 py-3 border-t border-border-dark">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
                placeholder={t("chat_input_placeholder")}
                className="flex-1 bg-neutral-dark border border-border-dark rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button
                onClick={handleSendChat}
                disabled={!chatInput.trim()}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                  chatInput.trim()
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-border-dark text-slate-500 cursor-not-allowed"
                )}
              >
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating chat button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-[80] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all",
          chatOpen
            ? "bg-border-dark text-slate-300 hover:bg-border-dark/80"
            : "bg-primary text-white hover:bg-primary/90 shadow-primary/30"
        )}
        title={t("chat_button_title")}
      >
        <span className="material-symbols-outlined text-2xl">
          {chatOpen ? "close" : "chat"}
        </span>
      </button>
    </div>
  );
}
