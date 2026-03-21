"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/toast";

// ---------------------------------------------------------------------------
// Types & Data
// ---------------------------------------------------------------------------

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  iconBg: string;
  balance: number;
  valueUSD: number;
  network: string;
  networkIcon: string;
}

interface Web3Transaction {
  id: string;
  type: "received" | "withdrawn" | "gas" | "swapped";
  description: string;
  amount: string;
  token: string;
  date: string;
  icon: string;
  iconColor: string;
}

const CRYPTO_ASSETS: CryptoAsset[] = [
  {
    id: "usdc",
    symbol: "USDC",
    name: "USD Coin",
    icon: "paid",
    iconBg: "bg-blue-500/15 text-blue-400",
    balance: 0,
    valueUSD: 0,
    network: "Ethereum",
    networkIcon: "token",
  },
  {
    id: "usdt",
    symbol: "USDT",
    name: "Tether",
    icon: "currency_exchange",
    iconBg: "bg-emerald-500/15 text-emerald-400",
    balance: 0,
    valueUSD: 0,
    network: "Polygon",
    networkIcon: "hexagon",
  },
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    icon: "diamond",
    iconBg: "bg-purple-500/15 text-purple-400",
    balance: 0,
    valueUSD: 0,
    network: "Ethereum",
    networkIcon: "token",
  },
];

const DEMO_TRANSACTIONS: Web3Transaction[] = [];

const WALLET_ADDRESS_PLACEHOLDER = "";

const TOKEN_OPTIONS = [
  { value: "USDC", label: "USDC (USD Coin)" },
  { value: "USDT", label: "USDT (Tether)" },
  { value: "ETH", label: "ETH (Ethereum)" },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function NetworkPulse() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
    </span>
  );
}

function ModalBackdrop({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function PortefeuilleWeb3Page() {
  const addToast = useToastStore((s) => s.addToast);

  const [activeModal, setActiveModal] = useState<
    "deposit" | "withdraw" | "swap" | null
  >(null);

  // Withdraw form state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawToken, setWithdrawToken] = useState("USDC");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

  // Swap form state
  const [swapFrom, setSwapFrom] = useState("USDC");
  const [swapTo, setSwapTo] = useState("USDT");
  const [swapAmount, setSwapAmount] = useState("");
  const [swapping, setSwapping] = useState(false);

  // Total balance
  const totalBalance = CRYPTO_ASSETS.reduce((s, a) => s + a.valueUSD, 0);

  const handleCopyAddress = useCallback(() => {
    navigator.clipboard
      .writeText(WALLET_ADDRESS_PLACEHOLDER)
      .then(() => {
        addToast("success", "Adresse copiee dans le presse-papiers");
      })
      .catch(() => {
        addToast("error", "Erreur lors de la copie");
      });
  }, [addToast]);

  function handleWithdraw() {
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      addToast("error", "Veuillez entrer un montant valide");
      return;
    }
    if (!withdrawAddress || withdrawAddress.length < 10) {
      addToast("error", "Veuillez entrer une adresse de destination valide");
      return;
    }
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      setActiveModal(null);
      setWithdrawAmount("");
      setWithdrawAddress("");
      addToast(
        "success",
        `Retrait de ${amount} ${withdrawToken} initie avec succes`
      );
    }, 1200);
  }

  function handleSwap() {
    const amount = Number(swapAmount);
    if (!amount || amount <= 0) {
      addToast("error", "Veuillez entrer un montant valide");
      return;
    }
    if (swapFrom === swapTo) {
      addToast("error", "Veuillez selectionner deux tokens differents");
      return;
    }
    setSwapping(true);
    setTimeout(() => {
      setSwapping(false);
      setActiveModal(null);
      setSwapAmount("");
      addToast(
        "success",
        `Echange de ${amount} ${swapFrom} vers ${swapTo} effectue`
      );
    }, 1200);
  }

  return (
    <div className="max-w-full space-y-4 sm:space-y-6 lg:space-y-8">
      {/* ------------------------------------------------------------------ */}
      {/* Hero */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-background-dark/50 border border-primary/30 rounded-xl p-6 md:p-8 relative overflow-hidden">
        {/* Decorative bg icon */}
        <span
          className="material-symbols-outlined absolute -top-4 -right-4 text-[160px] text-primary/5 select-none pointer-events-none"
          aria-hidden="true"
        >
          account_balance_wallet
        </span>

        <div className="relative z-10">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary/30">
              <span className="material-symbols-outlined text-sm">
                verified
              </span>
              Securise par Blockchain
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Portefeuille Web3 & Stablecoins
          </h2>
          <p className="text-slate-400 mt-2 max-w-2xl text-sm md:text-base">
            Gerez vos actifs numeriques en toute securite. Recevez des paiements
            en stablecoins, effectuez des retraits vers votre portefeuille
            externe ou echangez entre tokens.
          </p>

          {/* Network status */}
          <div className="flex items-center gap-2 mt-4">
            <NetworkPulse />
            <span className="text-xs font-semibold text-emerald-400">
              Statut Reseau: Operationnel
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Balance Cards */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="bg-background-dark/50 border border-primary/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-primary uppercase tracking-wider">
              Solde Total
            </p>
            <span className="material-symbols-outlined text-primary">
              account_balance_wallet
            </span>
          </div>
          <p className="text-3xl font-extrabold">
            ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-emerald-400 text-sm">
              trending_up
            </span>
            <span className="text-xs font-bold text-emerald-400">+12.5%</span>
            <span className="text-xs text-slate-500 ml-1">ce mois</span>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-background-dark/50 border border-border-dark rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Paiements en Attente
            </p>
            <span className="material-symbols-outlined text-amber-400">
              schedule
            </span>
          </div>
          <p className="text-3xl font-extrabold">1,200.00</p>
          <p className="text-xs text-slate-500 mt-1">USDC</p>
        </div>

        {/* Gas Fees */}
        <div className="bg-background-dark/50 border border-border-dark rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Frais Reseau (Gas)
            </p>
            <span className="material-symbols-outlined text-purple-400">
              local_gas_station
            </span>
          </div>
          <p className="text-3xl font-extrabold">0.0042</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-500">ETH</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Optimise
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Crypto Assets Table */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-background-dark/50 border border-border-dark rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border-dark">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              toll
            </span>
            Actifs Crypto
          </h3>
        </div>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-border-dark">
          <span>Actif</span>
          <span className="text-right">Solde</span>
          <span className="text-right">Valeur USD</span>
          <span className="text-center">Reseau</span>
          <span className="text-right">Action</span>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-border-dark">
          {CRYPTO_ASSETS.map((asset) => (
            <div
              key={asset.id}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 items-center px-6 py-4 hover:bg-primary/5 transition-colors"
            >
              {/* Asset */}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    asset.iconBg
                  )}
                >
                  <span className="material-symbols-outlined text-lg">
                    {asset.icon}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-sm">{asset.symbol}</p>
                  <p className="text-xs text-slate-500">{asset.name}</p>
                </div>
              </div>

              {/* Balance */}
              <div className="md:text-right">
                <span className="md:hidden text-xs text-slate-500 mr-2">
                  Solde:
                </span>
                <span className="font-semibold text-sm">
                  {asset.balance.toLocaleString("en-US", {
                    minimumFractionDigits: asset.symbol === "ETH" ? 3 : 2,
                    maximumFractionDigits: asset.symbol === "ETH" ? 3 : 2,
                  })}
                </span>
              </div>

              {/* Value USD */}
              <div className="md:text-right">
                <span className="md:hidden text-xs text-slate-500 mr-2">
                  Valeur:
                </span>
                <span className="font-semibold text-sm text-emerald-400">
                  $
                  {asset.valueUSD.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Network */}
              <div className="md:text-center">
                <span className="md:hidden text-xs text-slate-500 mr-2">
                  Reseau:
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-neutral-dark px-2.5 py-1 rounded-full border border-border-dark">
                  <span className="material-symbols-outlined text-xs">
                    {asset.networkIcon}
                  </span>
                  {asset.network}
                </span>
              </div>

              {/* Action */}
              <div className="md:text-right">
                <button
                  onClick={() => setActiveModal("deposit")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/30 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    qr_code_2
                  </span>
                  Recevoir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Wallet Actions */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveModal("deposit")}
          className="flex items-center justify-center gap-2 px-5 py-3.5 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          Deposer
        </button>
        <button
          onClick={() => setActiveModal("withdraw")}
          className="flex items-center justify-center gap-2 px-5 py-3.5 bg-background-dark/50 border border-border-dark text-slate-200 font-bold rounded-xl text-sm hover:border-primary/50 transition-all"
        >
          <span className="material-symbols-outlined text-lg">upload</span>
          Retirer
        </button>
        <button
          onClick={() => setActiveModal("swap")}
          className="flex items-center justify-center gap-2 px-5 py-3.5 bg-background-dark/50 border border-border-dark text-slate-200 font-bold rounded-xl text-sm hover:border-primary/50 transition-all"
        >
          <span className="material-symbols-outlined text-lg">swap_horiz</span>
          Echanger
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Features Info (2 columns) */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security */}
        <div className="bg-background-dark/50 border border-border-dark rounded-xl p-6 flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl">
              shield
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-1">Securite Blockchain</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vos actifs sont proteges par la technologie blockchain. Toutes les
              transactions sont immuables, transparentes et verifiables sur la
              chaine.
            </p>
          </div>
        </div>

        {/* Withdrawal */}
        <div className="bg-background-dark/50 border border-border-dark rounded-xl p-6 flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl">
              currency_exchange
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-1">Retrait Facile</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Retirez vos stablecoins vers votre portefeuille externe ou
              convertissez-les en monnaie fiat via nos partenaires de paiement
              integres.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Transaction History */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-background-dark/50 border border-border-dark rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border-dark flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              receipt_long
            </span>
            Historique des Transactions
          </h3>
          {DEMO_TRANSACTIONS.length > 0 && (
            <span className="text-xs text-slate-500">
              {DEMO_TRANSACTIONS.length} derniere{DEMO_TRANSACTIONS.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {DEMO_TRANSACTIONS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">
                receipt_long
              </span>
            </div>
            <p className="font-semibold text-sm text-slate-300 mb-1">
              Aucune transaction
            </p>
            <p className="text-xs text-slate-500 text-center max-w-xs">
              Vos transactions crypto apparaitront ici une fois que vous aurez
              effectue des depots, retraits ou echanges de tokens.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border-dark">
            {DEMO_TRANSACTIONS.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-primary/5 transition-colors"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    tx.iconColor
                  )}
                >
                  <span className="material-symbols-outlined">{tx.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {tx.description}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(tx.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    · {tx.token}
                  </p>
                </div>
                <p
                  className={cn(
                    "text-sm font-bold whitespace-nowrap",
                    tx.amount.startsWith("+")
                      ? "text-emerald-400"
                      : tx.amount.startsWith("-")
                        ? "text-red-400"
                        : "text-slate-300"
                  )}
                >
                  {tx.amount} {tx.token.split(" ")[0]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* MODALS */}
      {/* ================================================================== */}

      {/* ---------- Deposit Modal ---------- */}
      {activeModal === "deposit" && (
        <ModalBackdrop onClose={() => setActiveModal(null)}>
          <div className="bg-neutral-dark border border-border-dark rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  download
                </span>
                Deposer des Fonds
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-slate-400">
                  close
                </span>
              </button>
            </div>

            <p className="text-sm text-slate-400">
              Envoyez des stablecoins (USDC, USDT) ou de l&apos;ETH a l&apos;adresse
              ci-dessous. Les fonds apparaitront dans votre portefeuille apres
              confirmation sur la blockchain.
            </p>

            {/* Wallet Address */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Votre adresse de depot
              </label>
              <div className="flex items-center gap-2 bg-background-dark/80 border border-border-dark rounded-lg p-3">
                <span className="material-symbols-outlined text-primary text-lg flex-shrink-0">
                  wallet
                </span>
                <code className="text-sm text-slate-300 font-mono truncate flex-1">
                  {WALLET_ADDRESS_PLACEHOLDER}
                </code>
                <button
                  onClick={handleCopyAddress}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/30 transition-colors flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-sm">
                    content_copy
                  </span>
                  Copier
                </button>
              </div>
            </div>

            {/* Supported Networks */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Reseaux supportes
              </label>
              <div className="flex gap-2">
                {["Ethereum", "Polygon", "Base"].map((network) => (
                  <span
                    key={network}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 bg-background-dark/80 px-3 py-1.5 rounded-full border border-border-dark"
                  >
                    <span className="material-symbols-outlined text-xs text-primary">
                      token
                    </span>
                    {network}
                  </span>
                ))}
              </div>
            </div>

            {/* Warning */}
            <div className="flex gap-3 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
              <span className="material-symbols-outlined text-amber-400 text-lg flex-shrink-0 mt-0.5">
                warning
              </span>
              <p className="text-xs text-amber-300/80 leading-relaxed">
                Assurez-vous d&apos;envoyer uniquement des tokens sur les reseaux
                supportes. Les fonds envoyes sur un mauvais reseau pourraient
                etre perdus definitivement.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
            >
              Fermer
            </button>
          </div>
        </ModalBackdrop>
      )}

      {/* ---------- Withdraw Modal ---------- */}
      {activeModal === "withdraw" && (
        <ModalBackdrop onClose={() => setActiveModal(null)}>
          <div className="bg-neutral-dark border border-border-dark rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  upload
                </span>
                Retirer des Fonds
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-slate-400">
                  close
                </span>
              </button>
            </div>

            {/* Token selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Token
              </label>
              <select
                value={withdrawToken}
                onChange={(e) => setWithdrawToken(e.target.value)}
                className="w-full px-4 py-3 bg-background-dark/80 border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
              >
                {TOKEN_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Montant
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-background-dark/80 border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="text-xs text-slate-500">
                Solde disponible:{" "}
                {CRYPTO_ASSETS.find((a) => a.symbol === withdrawToken)
                  ?.balance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  }) || "0.00"}{" "}
                {withdrawToken}
              </p>
            </div>

            {/* Destination Address */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Adresse de destination
              </label>
              <input
                type="text"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 bg-background-dark/80 border border-border-dark rounded-lg text-sm font-mono outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Gas estimate */}
            <div className="flex items-center justify-between text-xs text-slate-500 bg-background-dark/80 border border-border-dark rounded-lg p-3">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  local_gas_station
                </span>
                Frais estimes
              </span>
              <span className="font-semibold text-slate-300">~0.001 ETH</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleWithdraw}
                disabled={withdrawing}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20 transition-all"
              >
                {withdrawing && (
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                )}
                {withdrawing ? "Traitement..." : "Confirmer le retrait"}
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-3 text-sm font-semibold text-slate-400 hover:text-slate-200 border border-border-dark rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}

      {/* ---------- Swap Modal ---------- */}
      {activeModal === "swap" && (
        <ModalBackdrop onClose={() => setActiveModal(null)}>
          <div className="bg-neutral-dark border border-border-dark rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  swap_horiz
                </span>
                Echanger des Tokens
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-slate-400">
                  close
                </span>
              </button>
            </div>

            {/* From token */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                De
              </label>
              <div className="flex gap-3">
                <select
                  value={swapFrom}
                  onChange={(e) => setSwapFrom(e.target.value)}
                  className="flex-1 px-4 py-3 bg-background-dark/80 border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
                >
                  {TOKEN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.value}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 px-4 py-3 bg-background-dark/80 border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Swap icon */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  const temp = swapFrom;
                  setSwapFrom(swapTo);
                  setSwapTo(temp);
                }}
                className="p-2 rounded-full bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors"
              >
                <span className="material-symbols-outlined text-primary">
                  swap_vert
                </span>
              </button>
            </div>

            {/* To token */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Vers
              </label>
              <div className="flex gap-3">
                <select
                  value={swapTo}
                  onChange={(e) => setSwapTo(e.target.value)}
                  className="flex-1 px-4 py-3 bg-background-dark/80 border border-border-dark rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary"
                >
                  {TOKEN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.value}
                    </option>
                  ))}
                </select>
                <div className="flex-1 px-4 py-3 bg-background-dark/50 border border-border-dark rounded-lg text-sm text-slate-500">
                  {swapAmount
                    ? `~${Number(swapAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                    : "0.00"}
                </div>
              </div>
            </div>

            {/* Rate info */}
            <div className="flex items-center justify-between text-xs text-slate-500 bg-background-dark/80 border border-border-dark rounded-lg p-3">
              <span>Taux de change</span>
              <span className="font-semibold text-slate-300">
                1 {swapFrom} = 1.00 {swapTo}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSwap}
                disabled={swapping}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20 transition-all"
              >
                {swapping && (
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                )}
                {swapping ? "Echange en cours..." : "Confirmer l'echange"}
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-3 text-sm font-semibold text-slate-400 hover:text-slate-200 border border-border-dark rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </ModalBackdrop>
      )}
    </div>
  );
}
