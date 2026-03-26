## 1. Fix critique — Sync forcee + invalidation cache localStorage

- [ ] 1.1 `store/dashboard.ts` — Bump persist key de `freelancehigh-dashboard-v2` a `freelancehigh-dashboard-v3` pour invalider le cache localStorage existant sur tous les navigateurs.
- [ ] 1.2 `dashboard/commandes/[id]/page.tsx` — Ajouter `syncFromApi()` dans un `useEffect` au mount. Ajouter un fallback direct `ordersApi.get(orderId)` si la commande n'est pas trouvee dans le store. Ajouter un skeleton de chargement.
- [ ] 1.3 `client/commandes/[id]/page.tsx` — Verifier que `syncOrders()` est bien appele au mount (deja fait). S'assurer que le fallback `ordersApi.get(id)` fonctionne.
- [ ] 1.4 `agence/commandes/[id]/page.tsx` — Verifier que `syncAll()` est bien appele au mount (deja fait).

## 2. API — Envoi automatique de message "offer" lors de la creation d'offre

- [ ] 2.1 `lib/dev/data-store.ts` — Etendre `conversationStore.sendMessage()` pour accepter un parametre optionnel `offerData?: { offerId: string; title: string; amount: number; delay: string; revisions: number; description: string; status: string; validityDays: number; expiresAt: string }`. Si fourni, stocker dans le message.
- [ ] 2.2 `app/api/offres/route.ts` (POST) — Apres la creation de l'offre, trouver ou creer une conversation directe entre le freelance et le client. Envoyer un message de type `"offer"` avec `offerData` complet.

## 3. Composant — OfferMessageCard

- [ ] 3.1 Creer `components/messaging/OfferMessageCard.tsx` — Carte riche avec : titre (bold), montant EUR (gros, emerald), delai, revisions, description (tronquee), countdown expiration. Boutons Accepter (emerald) / Refuser (outline rouge) visibles uniquement pour le client si status === "en_attente" et non expiree. Badges de statut : "Acceptee" (vert), "Refusee" (rouge), "Expiree" (gris muted).
- [ ] 3.2 Le bouton Refuser ouvre un `ConfirmModal` avant l'appel API. Les deux boutons sont `disabled` quand `loading === true`.

## 4. Integration — Rendu carte dans ChatPanel

- [ ] 4.1 Dans le composant de rendu des messages (`components/messaging/`), ajouter une condition : si `message.type === "offer" && message.offerData`, rendre `<OfferMessageCard>` au lieu du rendu texte.
- [ ] 4.2 Passer `onAccept` (appelle `POST /api/offres/[offerId]/accept`) et `onRefuse` (appelle `POST /api/offres/[offerId]/refuse`). Detecter `isClient` via `userRole`. Detecter `isExpired` via `expiresAt`.

## 5. API — Message systeme apres acceptation d'offre

- [ ] 5.1 `app/api/offres/[id]/accept/route.ts` — Apres creation de la commande, envoyer un message systeme dans la conversation : "Offre acceptee ! Commande #[orderId] creee. Le freelance dispose de 3 jours pour commencer le travail."
- [ ] 5.2 Mettre a jour le message d'offre existant dans la conversation pour que `offerData.status` passe a `"acceptee"`.

## 6. Store messaging — Actions accept/refuse depuis le chat

- [ ] 6.1 `store/messaging.ts` — Ajouter `acceptOffer(convId, messageId, offerId): Promise<{ success: boolean; error?: string; orderId?: string }>`. Appelle l'API, met a jour localement `offerData.status`, ajoute message systeme.
- [ ] 6.2 `store/messaging.ts` — Ajouter `refuseOffer(convId, messageId, offerId): Promise<{ success: boolean; error?: string }>`. Appelle l'API, met a jour localement `offerData.status = "refusee"`.

## 7. API — Auto-annulation commandes en_attente > 3 jours

- [ ] 7.1 Creer `app/api/orders/auto-cancel/route.ts` (POST) — Scanner les commandes `en_attente` dont `createdAt` < (now - 72h). Pour chaque : mettre `status = "annule"`, ajouter timeline event "Commande annulee automatiquement — le freelance n'a pas accepte dans le delai de 3 jours." Retourner `{ cancelled: string[], count: number }`.
- [ ] 7.2 `lib/dev/data-store.ts` — Ajouter `orderStore.autoCancelStale(): string[]` qui scanne et annule les commandes > 72h.

## 8. API — Auto-validation commandes livre > 7 jours

- [ ] 8.1 Creer `app/api/orders/auto-validate/route.ts` (POST) — Scanner les commandes `livre` dont `deliveredAt` < (now - 7 jours). Pour chaque : mettre `status = "termine"`, `completedAt = now`, `progress = 100`, ajouter timeline event "Commande validee automatiquement — le client n'a pas repondu dans le delai de 7 jours.", liberer les fonds escrow (`escrow_status = "released"`). Retourner `{ validated: string[], count: number }`.
- [ ] 8.2 `lib/dev/data-store.ts` — Ajouter `orderStore.autoValidateStale(): string[]` qui scanne et valide les commandes livre > 7 jours.

## 9. Liberation escrow automatique a la validation

- [ ] 9.1 `app/api/orders/[id]/route.ts` (PATCH) — Quand le status passe a `termine` (validation manuelle par le client), declencher automatiquement la liberation escrow. En dev mode : trouver la transaction escrow de la commande et passer `escrow_status` a `"released"`. En Prisma mode : `UPDATE payments SET status = 'COMPLETED' WHERE orderId = id AND type = 'ESCROW'`.
- [ ] 9.2 Verifier que l'auto-validation (task 8.1) libere aussi l'escrow.

## 10. Integration — Auto-cancel/auto-validate au chargement

- [ ] 10.1 `store/dashboard.ts` — Dans `syncFromApi()`, apres le chargement des commandes, appeler `POST /api/orders/auto-cancel` et `POST /api/orders/auto-validate` en background (fire-and-forget). Si des commandes changent, re-fetcher.
- [ ] 10.2 `store/client.ts` — Dans `syncOrders()`, meme logique.
- [ ] 10.3 `store/agency.ts` — Dans `syncAll()`, meme logique.

## 11. Verification end-to-end

- [ ] 11.1 Verifier : freelance cree une offre → message offer dans le chat → client voit la carte avec boutons → client accepte → commande creee → message systeme
- [ ] 11.2 Verifier : commande en_attente → freelance clique Accepter (banner visible) → confirmation modale → status en_cours → Livrer → livre
- [ ] 11.3 Verifier : client voit la commande livree → Valider → termine → formulaire avis → fonds liberes
- [ ] 11.4 Verifier : commande en_attente > 3 jours → auto-annulee au prochain chargement
- [ ] 11.5 Verifier : commande livre > 7 jours → auto-validee au prochain chargement → fonds liberes
- [ ] 11.6 Build reussi sans erreur TypeScript
