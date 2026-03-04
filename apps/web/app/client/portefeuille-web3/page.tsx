"use client";

import { useState } from "react";
import { useToastStore } from "@/store/dashboard";
import { cn } from "@/lib/utils";

// ============================================================
// Types
// ============================================================
interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  eurValue: number;
  icon: string;
  change24h: number;
  networks: string[];
}

interface WalletTransaction {
  id: string;
  type: "paiement" | "depot" | "conversion" | "retrait";
  asset: string;
  amount: number;
  eurValue: number;
  date: string;
  description: string;
  status: "confirme" | "en_attente" | "echoue";
  txHash: string;
  network: string;
}

// ============================================================
// Demo data
// ============================================================
const CRYPTO_ASSETS: CryptoAsset[] = [
  {
    id: "usdc",
    symbol: "USDC",
    name: "USD Coin",
    balance: 5200,
    eurValue: 4814.81,
    icon: "paid",
    change24h: 0.02,
    networks: ["Ethereum", "Polygon", "Base"],
  },
  {
    id: "usdt",
    symbol: "USDT",
    name: "Tether",
    balance: 2800,
    eurValue: 2592.59,
    icon: "currency_exchange",
    change24h: -0.01,
    networks: ["Ethereum", "Polygon"],
  },
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    balance: 0.45,
    eurValue: 1350.00,
    icon: "diamond",
    change24h: 2.35,
    networks: ["Ethereum", "Base"],
  },
];

const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "TX-W001",
    type: "paiement",
    asset: "USDC",
    amount: 1500,
    eurValue: 1388.89,
    date: "2026-03-02",
    description: "Paiement commande #CMD-4521 - Refonte dashboard",
    status: "confirme",
    txHash: "0x8a3f...e7b2",
    network: "Base",
  },
  {
    id: "TX-W002",
    type: "depot",
    asset: "USDC",
    amount: 3000,
    eurValue: 2777.78,
    date: "2026-02-28",
    description: "Depot depuis MetaMask",
    status: "confirme",
    txHash: "0x1c4d...a9f0",
    network: "Ethereum",
  },
  {
    id: "TX-W003",
    type: "conversion",
    asset: "USDT",
    amount: 800,
    eurValue: 740.74,
    date: "2026-02-25",
    description: "Conversion 800 USDT vers USDC",
    status: "confirme",
    txHash: "0x7e2a...b5c3",
    network: "Polygon",
  },
  {
    id: "TX-W004",
    type: "paiement",
    asset: "ETH",
    amount: 0.15,
    eurValue: 450.00,
    date: "2026-02-20",
    description: "Paiement commande #CMD-4498 - Audit smart contract",
    status: "confirme",
    txHash: "0x3b9c...d1e4",
    network: "Ethereum",
  },
  {
    id: "TX-W005",
    type: "depot",
    asset: "USDT",
    amount: 2000,
    eurValue: 1851.85,
    date: "2026-02-15",
    description: "Depot depuis WalletConnect",
    status: "confirme",
    txHash: "0x5f8e...c2a7",
    network: "Polygon",
  },
  {
    id: "TX-W006",
    type: "paiement",
    asset: "USDC",
    amount: 650,
    eurValue: 601.85,
    date: "2026-02-10",
    description: "Paiement commande #CMD-4472 - Logo 3D",
    status: "en_attente",
    txHash: "0x9d1f...e8b6",
    network: "Base",
  },
];

const TX_TYPE_MAP: Record<string, { label: string; icon: string; cls: string }> = {
  paiement: { label: "Paiement", icon: "arrow_upward", cls: "bg-red-500/10 text-red-400" },
  depot: { label: "Depot", icon: "arrow_downward", cls: "bg-primary/10 text-primary" },
  conversion: { label: "Conversion", icon: "swap_horiz", cls: "bg-blue-500/10 text-blue-400" },
  retrait: { label: "Retrait", icon: "arrow_upward", cls: "bg-amber-500/10 text-amber-400" },
};

const TX_STATUS_MAP: Record<string, { label: string; cls: string }> = {
  confirme: { label: "Confirme", cls: "bg-primary/20 text-primary" },
  en_attente: { label: "En attente", cls: "bg-amber-500/20 text-amber-400" },
  echoue: { label: "Echoue", cls: "bg-red-500/20 text-red-400" },
};

const NETWORKS = [
  { name: "Ethereum", icon: "diamond", color: "text-blue-400", bgColor: "bg-blue-500/10" },
  { name: "Polygon", icon: "hexagon", color: "text-purple-400", bgColor: "bg-purple-500/10" },
  { name: "Base", icon: "circle", color: "text-blue-300", bgColor: "bg-blue-400/10" },
];

// ============================================================
// Component
// ============================================================
export default function ClientWeb3Wallet() {
  const [walletConnected, setWalletConnected] = useState(true);
  const [walletAddress] = useState("0x7a3B...4f2E");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState("USDC");
  const [actionAmount, setActionAmount] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("Ethereum");
  const [convertFrom, setConvertFrom] = useState("USDT");
  const [convertTo, setConvertTo] = useState("USDC");
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [assets, setAssets] = useState(CRYPTO_ASSETS);
  const { addToast } = useToastStore();

  // Total in EUR
  const totalEurValue = assets.reduce((sum, a) => sum + a.eurValue, 0);

  // Disconnect wallet
  function handleDisconnect() {
    setWalletConnected(false);
    addToast("info", "Wallet deconnecte");
  }

  // Connect wallet
  function handleConnect(method: string) {
    setWalletConnected(true);
    setShowConnectModal(false);
    addToast("success", `Wallet connecte via ${method}`);
  }

  // Deposit
  function handleDeposit() {
    if (!actionAmount || parseFloat(actionAmount) <= 0) {
      addToast("error", "Veuillez saisir un montant valide");
      return;
    }
    const amount = parseFloat(actionAmount);
    const asset = assets.find((a) => a.symbol === selectedAsset);
    if (!asset) return;

    const eurRate = selectedAsset === "ETH" ? 3000 : 1 / 1.08;
    const eurValue = selectedAsset === "ETH" ? amount * eurRate : amount * eurRate;

    setAssets((prev) =>
      prev.map((a) =>
        a.symbol === selectedAsset
          ? { ...a, balance: a.balance + amount, eurValue: a.eurValue + eurValue }
          : a
      )
    );

    const newTx: WalletTransaction = {
      id: "TX-W" + String(transactions.length + 1).padStart(3, "0"),
      type: "depot",
      asset: selectedAsset,
      amount,
      eurValue,
      date: new Date().toISOString().slice(0, 10),
      description: `Depot ${amount} ${selectedAsset} depuis wallet externe`,
      status: "confirme",
      txHash: "0x" + Math.random().toString(16).slice(2, 6) + "..." + Math.random().toString(16).slice(2, 6),
      network: selectedNetwork,
    };
    setTransactions((prev) => [newTx, ...prev]);

    setActionAmount("");
    setShowDepositModal(false);
    addToast("success", `Depot de ${amount} ${selectedAsset} effectue`);
  }

  // Withdraw
  function handleWithdraw() {
    if (!actionAmount || parseFloat(actionAmount) <= 0) {
      addToast("error", "Veuillez saisir un montant valide");
      return;
    }
    const amount = parseFloat(actionAmount);
    const asset = assets.find((a) => a.symbol === selectedAsset);
    if (!asset || asset.balance < amount) {
      addToast("error", "Solde insuffisant");
      return;
    }

    const eurRate = selectedAsset === "ETH" ? 3000 : 1 / 1.08;
    const eurValue = selectedAsset === "ETH" ? amount * eurRate : amount * eurRate;

    setAssets((prev) =>
      prev.map((a) =>
        a.symbol === selectedAsset
          ? { ...a, balance: a.balance - amount, eurValue: a.eurValue - eurValue }
          : a
      )
    );

    const newTx: WalletTransaction = {
      id: "TX-W" + String(transactions.length + 1).padStart(3, "0"),
      type: "retrait",
      asset: selectedAsset,
      amount,
      eurValue,
      date: new Date().toISOString().slice(0, 10),
      description: `Retrait ${amount} ${selectedAsset} vers wallet externe`,
      status: "en_attente",
      txHash: "0x" + Math.random().toString(16).slice(2, 6) + "..." + Math.random().toString(16).slice(2, 6),
      network: selectedNetwork,
    };
    setTransactions((prev) => [newTx, ...prev]);

    setActionAmount("");
    setShowWithdrawModal(false);
    addToast("success", `Retrait de ${amount} ${selectedAsset} initie`);
  }

  // Convert
  function handleConvert() {
    if (!actionAmount || parseFloat(actionAmount) <= 0) {
      addToast("error", "Veuillez saisir un montant valide");
      return;
    }
    if (convertFrom === convertTo) {
      addToast("error", "Selectionnez deux actifs differents");
      return;
    }
    const amount = parseFloat(actionAmount);
    const fromAsset = assets.find((a) => a.symbol === convertFrom);
    if (!fromAsset || fromAsset.balance < amount) {
      addToast("error", "Solde insuffisant");
      return;
    }

    // Conversion rates (simplified)
    let convertedAmount = amount;
    if (convertFrom === "ETH") {
      convertedAmount = amount * 3240; // ETH to stablecoin
    } else if (convertTo === "ETH") {
      convertedAmount = amount / 3240; // stablecoin to ETH
    }
    // USDC <-> USDT is 1:1

    const eurRate = convertFrom === "ETH" ? 3000 : 1 / 1.08;
    const eurValue = convertFrom === "ETH" ? amount * eurRate : amount * eurRate;

    setAssets((prev) =>
      prev.map((a) => {
        if (a.symbol === convertFrom) {
          return { ...a, balance: a.balance - amount, eurValue: a.eurValue - eurValue };
        }
        if (a.symbol === convertTo) {
          return { ...a, balance: a.balance + convertedAmount, eurValue: a.eurValue + eurValue };
        }
        return a;
      })
    );

    const newTx: WalletTransaction = {
      id: "TX-W" + String(transactions.length + 1).padStart(3, "0"),
      type: "conversion",
      asset: convertFrom,
      amount,
      eurValue,
      date: new Date().toISOString().slice(0, 10),
      description: `Conversion ${amount} ${convertFrom} vers ${convertedAmount.toFixed(convertTo === "ETH" ? 6 : 2)} ${convertTo}`,
      status: "confirme",
      txHash: "0x" + Math.random().toString(16).slice(2, 6) + "..." + Math.random().toString(16).slice(2, 6),
      network: "Polygon",
    };
    setTransactions((prev) => [newTx, ...prev]);

    setActionAmount("");
    setShowConvertModal(false);
    addToast("success", `Conversion effectuee : ${amount} ${convertFrom} vers ${convertedAmount.toFixed(convertTo === "ETH" ? 6 : 2)} ${convertTo}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Portefeuille Web3</h1>
          <p className="text-slate-400 text-sm mt-1">
            Gerez vos actifs crypto et payez vos commandes en stablecoins.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {walletConnected ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">Connecte</span>
                <span className="text-xs text-slate-500 font-mono">{walletAddress}</span>
              </div>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-border-dark text-slate-400 text-sm font-semibold rounded-xl hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Deconnecter
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConnectModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-lg">link</span>
              Connecter wallet
            </button>
          )}
        </div>
      </div>

      {/* Total balance card */}
      <div className="bg-neutral-dark rounded-2xl border border-border-dark p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-xl">account_balance_wallet</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Solde total</p>
            <p className="text-3xl font-black text-white">{totalEurValue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-primary">trending_up</span>
            Equivalent {(totalEurValue * 655.957).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} FCFA
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span>
            Mis a jour il y a 2 min
          </span>
        </div>
      </div>

      {/* Crypto Assets */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">token</span>
          Actifs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-neutral-dark rounded-xl border border-border-dark p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">{asset.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-white">{asset.symbol}</p>
                    <p className="text-[11px] text-slate-500">{asset.name}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-1 rounded-full",
                    asset.change24h >= 0 ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-400"
                  )}
                >
                  {asset.change24h >= 0 ? "+" : ""}
                  {asset.change24h.toFixed(2)}%
                </span>
              </div>
              <p className="text-2xl font-black text-white">
                {asset.balance.toLocaleString("fr-FR", {
                  minimumFractionDigits: asset.symbol === "ETH" ? 4 : 2,
                  maximumFractionDigits: asset.symbol === "ETH" ? 4 : 2,
                })}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {asset.eurValue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR
              </p>
              <div className="flex flex-wrap gap-1 mt-3">
                {asset.networks.map((n) => {
                  const net = NETWORKS.find((nw) => nw.name === n);
                  return (
                    <span
                      key={n}
                      className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", net?.bgColor, net?.color)}
                    >
                      {n}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => {
            if (!walletConnected) { addToast("error", "Connectez votre wallet d'abord"); return; }
            setActionAmount("");
            setSelectedAsset("USDC");
            setSelectedNetwork("Ethereum");
            setShowDepositModal(true);
          }}
          className="bg-neutral-dark rounded-xl border border-border-dark p-5 text-left hover:border-primary/40 transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-primary text-xl">arrow_downward</span>
          </div>
          <p className="font-bold text-white">Deposer</p>
          <p className="text-xs text-slate-500 mt-1">Deposer des crypto depuis un wallet externe</p>
        </button>
        <button
          onClick={() => {
            if (!walletConnected) { addToast("error", "Connectez votre wallet d'abord"); return; }
            setActionAmount("");
            setSelectedAsset("USDC");
            setSelectedNetwork("Ethereum");
            setShowWithdrawModal(true);
          }}
          className="bg-neutral-dark rounded-xl border border-border-dark p-5 text-left hover:border-primary/40 transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3 group-hover:bg-amber-500/20 transition-colors">
            <span className="material-symbols-outlined text-amber-400 text-xl">arrow_upward</span>
          </div>
          <p className="font-bold text-white">Retirer</p>
          <p className="text-xs text-slate-500 mt-1">Envoyer des crypto vers un wallet externe</p>
        </button>
        <button
          onClick={() => {
            if (!walletConnected) { addToast("error", "Connectez votre wallet d'abord"); return; }
            setActionAmount("");
            setConvertFrom("USDT");
            setConvertTo("USDC");
            setShowConvertModal(true);
          }}
          className="bg-neutral-dark rounded-xl border border-border-dark p-5 text-left hover:border-primary/40 transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
            <span className="material-symbols-outlined text-blue-400 text-xl">swap_horiz</span>
          </div>
          <p className="font-bold text-white">Convertir</p>
          <p className="text-xs text-slate-500 mt-1">Convertir entre USDC, USDT et ETH</p>
        </button>
      </div>

      {/* Network info */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">hub</span>
          Reseaux supportes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {NETWORKS.map((net) => (
            <div
              key={net.name}
              className="flex items-center gap-3 p-4 bg-neutral-dark rounded-xl border border-border-dark"
            >
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", net.bgColor)}>
                <span className={cn("material-symbols-outlined", net.color)}>{net.icon}</span>
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{net.name}</p>
                <p className="text-[11px] text-slate-500">
                  {net.name === "Ethereum" ? "Mainnet L1" : net.name === "Polygon" ? "PoS L2" : "Optimistic L2"}
                </p>
              </div>
              <span className="ml-auto w-2 h-2 rounded-full bg-primary" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">receipt_long</span>
            Transactions recentes
          </h2>
          <button
            onClick={() => addToast("success", "Export en cours...")}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-dark border border-border-dark rounded-lg text-sm font-semibold text-white hover:bg-border-dark transition-colors"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Exporter
          </button>
        </div>
        <div className="bg-neutral-dark rounded-xl border border-border-dark overflow-hidden">
          <div className="divide-y divide-border-dark">
            {transactions.map((tx) => {
              const typeInfo = TX_TYPE_MAP[tx.type];
              const statusInfo = TX_STATUS_MAP[tx.status];
              return (
                <div
                  key={tx.id}
                  className="px-5 py-4 flex items-center gap-4 hover:bg-background-dark/30 transition-colors"
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", typeInfo.cls)}>
                    <span className="material-symbols-outlined">{typeInfo.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white truncate">{tx.description}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span>{new Date(tx.date).toLocaleDateString("fr-FR")}</span>
                      <span className="font-mono">{tx.txHash}</span>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full",
                        NETWORKS.find((n) => n.name === tx.network)?.bgColor,
                        NETWORKS.find((n) => n.name === tx.network)?.color
                      )}>
                        {tx.network}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={cn("text-sm font-bold", tx.type === "depot" ? "text-primary" : tx.type === "paiement" || tx.type === "retrait" ? "text-red-400" : "text-blue-400")}>
                      {tx.type === "depot" ? "+" : tx.type === "paiement" || tx.type === "retrait" ? "-" : ""}
                      {tx.amount.toLocaleString("fr-FR", { minimumFractionDigits: tx.asset === "ETH" ? 4 : 2, maximumFractionDigits: tx.asset === "ETH" ? 4 : 2 })} {tx.asset}
                    </p>
                    <div className="flex items-center gap-2 justify-end mt-0.5">
                      <span className="text-[11px] text-slate-500">{tx.eurValue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} EUR</span>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", statusInfo.cls)}>{statusInfo.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Security info box */}
      <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
          </div>
          <div>
            <h3 className="font-bold text-white mb-2">Securite des paiements blockchain</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                <p>Les paiements en stablecoins (USDC/USDT) sont proteges par le systeme escrow de FreelanceHigh. Les fonds sont bloques jusqu&apos;a la validation de la livraison.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                <p>Toutes les transactions sont enregistrees sur la blockchain et verifiables publiquement via l&apos;explorateur du reseau.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                <p>FreelanceHigh utilise Base L2 (Coinbase) pour les micro-transactions, reduisant les frais de gas de plus de 99% par rapport a Ethereum mainnet.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-400 text-sm mt-0.5">warning</span>
                <p>Ne partagez jamais votre cle privee ou votre phrase de recuperation. FreelanceHigh ne vous demandera jamais ces informations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Connect Wallet Modal */}
      {/* ============================================================ */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConnectModal(false)} />
          <div className="relative w-full max-w-md bg-neutral-dark rounded-2xl border border-border-dark shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-border-dark">
              <h2 className="text-xl font-bold text-white">Connecter un wallet</h2>
              <button
                onClick={() => setShowConnectModal(false)}
                className="w-8 h-8 rounded-lg bg-border-dark flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={() => handleConnect("MetaMask")}
                className="w-full flex items-center gap-4 p-4 bg-background-dark rounded-xl border border-border-dark hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-400 text-xl">pets</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-white">MetaMask</p>
                  <p className="text-xs text-slate-500">Extension navigateur la plus populaire</p>
                </div>
                <span className="material-symbols-outlined text-slate-500 ml-auto">arrow_forward</span>
              </button>
              <button
                onClick={() => handleConnect("WalletConnect")}
                className="w-full flex items-center gap-4 p-4 bg-background-dark rounded-xl border border-border-dark hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-400 text-xl">qr_code_2</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-white">WalletConnect</p>
                  <p className="text-xs text-slate-500">Scanner un QR code depuis votre mobile</p>
                </div>
                <span className="material-symbols-outlined text-slate-500 ml-auto">arrow_forward</span>
              </button>
              <button
                onClick={() => handleConnect("Coinbase Wallet")}
                className="w-full flex items-center gap-4 p-4 bg-background-dark rounded-xl border border-border-dark hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-300 text-xl">account_balance</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-white">Coinbase Wallet</p>
                  <p className="text-xs text-slate-500">Ideal pour le reseau Base L2</p>
                </div>
                <span className="material-symbols-outlined text-slate-500 ml-auto">arrow_forward</span>
              </button>

              <p className="text-xs text-slate-500 text-center pt-3">
                En connectant votre wallet, vous acceptez les conditions d&apos;utilisation Web3 de FreelanceHigh.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Deposit Modal */}
      {/* ============================================================ */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDepositModal(false)} />
          <div className="relative w-full max-w-md bg-neutral-dark rounded-2xl border border-border-dark shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-border-dark">
              <h2 className="text-xl font-bold text-white">Deposer des crypto</h2>
              <button
                onClick={() => setShowDepositModal(false)}
                className="w-8 h-8 rounded-lg bg-border-dark flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Asset selector */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Actif</label>
                <div className="flex gap-2">
                  {["USDC", "USDT", "ETH"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedAsset(s)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border",
                        selectedAsset === s
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-background-dark text-slate-400 border-border-dark hover:text-white"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Network */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Reseau</label>
                <div className="flex gap-2">
                  {NETWORKS.map((n) => (
                    <button
                      key={n.name}
                      onClick={() => setSelectedNetwork(n.name)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border",
                        selectedNetwork === n.name
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-background-dark text-slate-400 border-border-dark hover:text-white"
                      )}
                    >
                      {n.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Montant</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={actionAmount}
                    onChange={(e) => setActionAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">{selectedAsset}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleDeposit}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-lg">arrow_downward</span>
                  Deposer
                </button>
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="px-6 py-2.5 bg-border-dark text-slate-400 text-sm font-semibold rounded-xl hover:text-white transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Withdraw Modal */}
      {/* ============================================================ */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowWithdrawModal(false)} />
          <div className="relative w-full max-w-md bg-neutral-dark rounded-2xl border border-border-dark shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-border-dark">
              <h2 className="text-xl font-bold text-white">Retirer des crypto</h2>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-8 h-8 rounded-lg bg-border-dark flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Asset selector */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Actif</label>
                <div className="flex gap-2">
                  {["USDC", "USDT", "ETH"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedAsset(s)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border",
                        selectedAsset === s
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-background-dark text-slate-400 border-border-dark hover:text-white"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Solde disponible : {assets.find((a) => a.symbol === selectedAsset)?.balance.toLocaleString("fr-FR", { minimumFractionDigits: selectedAsset === "ETH" ? 4 : 2 })} {selectedAsset}
                </p>
              </div>

              {/* Network */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Reseau</label>
                <div className="flex gap-2">
                  {NETWORKS.map((n) => (
                    <button
                      key={n.name}
                      onClick={() => setSelectedNetwork(n.name)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border",
                        selectedNetwork === n.name
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-background-dark text-slate-400 border-border-dark hover:text-white"
                      )}
                    >
                      {n.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Montant</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={actionAmount}
                    onChange={(e) => setActionAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">{selectedAsset}</span>
                </div>
                <button
                  onClick={() => {
                    const bal = assets.find((a) => a.symbol === selectedAsset)?.balance;
                    if (bal) setActionAmount(String(bal));
                  }}
                  className="text-xs text-primary font-semibold mt-1 hover:underline"
                >
                  Utiliser le solde maximum
                </button>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Adresse de destination</label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10">
                <span className="material-symbols-outlined text-amber-400 text-lg">warning</span>
                <p className="text-xs text-slate-400">
                  Verifiez l&apos;adresse et le reseau avant d&apos;envoyer. Les transactions blockchain sont irreversibles.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleWithdraw}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-lg">arrow_upward</span>
                  Retirer
                </button>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-6 py-2.5 bg-border-dark text-slate-400 text-sm font-semibold rounded-xl hover:text-white transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Convert Modal */}
      {/* ============================================================ */}
      {showConvertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConvertModal(false)} />
          <div className="relative w-full max-w-md bg-neutral-dark rounded-2xl border border-border-dark shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-border-dark">
              <h2 className="text-xl font-bold text-white">Convertir</h2>
              <button
                onClick={() => setShowConvertModal(false)}
                className="w-8 h-8 rounded-lg bg-border-dark flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* From */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">De</label>
                <div className="flex gap-2">
                  {["USDC", "USDT", "ETH"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setConvertFrom(s)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border",
                        convertFrom === s
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-background-dark text-slate-400 border-border-dark hover:text-white"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Solde : {assets.find((a) => a.symbol === convertFrom)?.balance.toLocaleString("fr-FR", { minimumFractionDigits: convertFrom === "ETH" ? 4 : 2 })} {convertFrom}
                </p>
              </div>

              {/* Swap icon */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const tmp = convertFrom;
                    setConvertFrom(convertTo);
                    setConvertTo(tmp);
                  }}
                  className="w-10 h-10 rounded-full bg-border-dark flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors text-slate-400"
                >
                  <span className="material-symbols-outlined">swap_vert</span>
                </button>
              </div>

              {/* To */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Vers</label>
                <div className="flex gap-2">
                  {["USDC", "USDT", "ETH"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setConvertTo(s)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border",
                        convertTo === s
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-background-dark text-slate-400 border-border-dark hover:text-white"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Montant</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    value={actionAmount}
                    onChange={(e) => setActionAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">{convertFrom}</span>
                </div>
                {actionAmount && parseFloat(actionAmount) > 0 && (
                  <p className="text-xs text-primary mt-2">
                    Vous recevrez environ{" "}
                    {convertFrom === "ETH" && convertTo !== "ETH"
                      ? (parseFloat(actionAmount) * 3240).toFixed(2)
                      : convertTo === "ETH" && convertFrom !== "ETH"
                        ? (parseFloat(actionAmount) / 3240).toFixed(6)
                        : parseFloat(actionAmount).toFixed(2)}{" "}
                    {convertTo}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleConvert}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-background-dark text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-lg">swap_horiz</span>
                  Convertir
                </button>
                <button
                  onClick={() => setShowConvertModal(false)}
                  className="px-6 py-2.5 bg-border-dark text-slate-400 text-sm font-semibold rounded-xl hover:text-white transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
