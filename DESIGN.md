# KIVO — Complete App Design Document

## Brand
- **Primary Green**: #187906
- **Neon Green**: #2CDF0C
- **White**: #FFFFFF
- **Dark**: #111827
- **Gray**: #6B7280
- **Light Gray**: #F3F4F6
- **Border**: #E5E7EB
- **Font**: Inter (or system)

## Architecture
- Next.js 16 App Router
- Supabase (PostgreSQL + Auth + RLS)
- Stripe (subscriptions)
- NVIDIA NIM (AI chat)
- Tailwind CSS + shadcn/ui

---

## Pages & Mock Data

### 1. Landing Page (`/`)
Full marketing page with:
- Hero: "O teu agente AI para dominar o delivery" + CTA
- 3 plan cards: Start €39, Grow €99, Autopilot €199
- Features grid
- How it works (3 steps)
- Testimonials
- Footer

### 2. Login (`/login`)
- Email + password form
- Google OAuth button
- Link to register
- Kivo logo

### 3. Register (`/register`)
- Full name, email, password, confirm password
- Google OAuth button
- Link to login

### 4. Onboarding Wizard (`/dashboard/onboarding`)
6 steps, each with specific UI:

**Step 1 — Restaurant Info**
```
Nome do Restaurante: [input]
Tipo de Cozinha: [select: Portuguesa, Italiana, Chinesa, Indiana, Mexicana, Japonesa, Francesa, Árabe, Vegana, Fusion, Outra]
Cidade: [select: Lisboa, Porto, Faro, Coimbra, Braga, Leiria, Setúbal, Aveiro, Viseu, Guimarães, Outra]
```

**Step 2 — Platforms**
```
[ ] Uber Eats
[ ] Glovo
[ ] Bolt Food
[ ] App Própria
```

**Step 3 — Volume**
```
Pedidos diários: [1-10, 11-30, 31-50, 51-100, 100+]
Receita mensal: [input €]
Ticket médio: [input €]
```

**Step 4 — Team**
```
Tamanho da equipa: [1, 2-3, 4-6, 7-10, 10+]
Tem gestor de delivery: [Sim/Não]
```

**Step 5 — Challenges**
```
[x] Preços baixos nas plataformas
[ ] Poucas reviews negativas
[ ] Difícil gestão de menu
[ ] Promoções ineficazes
[ ] Falta de dados
[ ] Poucos pedidos
[ ] Margens baixas
[ ] Concorrência forte
[ ] Tempos de entrega longos
[ ] Qualidade inconsistente
```

**Step 6 — Results**
- Circular score gauge (animated)
- Score: 72/100
- Recommended plan: Grow
- Feature list
- "Começar" button

### 5. Dashboard — Assistant (`/dashboard/assistant`)
**Layout**: Full height, no scroll on page

**Top bar**: Chat | Insights tabs

**Chat view**:
```
┌─────────────────────────────────────────┐
│  Kivo: Olá! Sou o teu agente AI.       │
│  Pergunta-me sobre vendas, preços,      │
│  promoções ou avaliações.               │
│                                          │
│  User: Quais são os meus melhores       │
│  pratos esta semana?                    │
│                                          │
│  Kivo: 📊 Top 3 pratos esta semana:    │
│  1. Francesinha Clássica — €1.245       │
│     (87 pedidos, 23% da receita)        │
│  2. Burger Kivo — €892                  │
│     (65 pedidos, 18% da receita)        │
│  3. Salada Caesar — €456               │
│     (42 pedidos, 9% da receita)         │
│                                          │
│  Sugestão: Aumentar preço da Salada     │
│  em €0.50 (+8%) = +€180/mês.           │
│                                          │
│──────────────────────────────────────────│
│ [Pergunta ao Kivo...          ] [↑] [🗑] │
└─────────────────────────────────────────┘
```

**Insights view**:
```
┌─────────────────────────────────────────┐
│  Insights Automáticos                    │
│                                          │
│  ⚠️ Queda de 15% vs semana anterior     │
│  Receita: €3.450 → €2.932              │
│  [Criar promoção] [Ajustar preços]      │
│                                          │
│  📈 Top plataforma: Uber Eats (62%)     │
│  Uber Eats: €1.818 (57 pedidos)        │
│  Glovo: €892 (32 pedidos)              │
│  Bolt: €222 (11 pedidos)               │
│                                          │
│  ⭐ Reviews: 4.2★ médio (12 novos)     │
│  3 negativos precisam de resposta       │
│  [Ver reviews] [Responder todos]        │
│                                          │
│  📅 Previsão 7 dias:                    │
│  │█████████████░░░░░░░│ €3.800         │
│  Confiança: 78%                         │
│                                          │
│  💡 Sugestão: Criar promo "2x1 Pizzas" │
│  Impacto estimado: +€450/semana         │
│  [Aplicar via Kivo]                     │
└─────────────────────────────────────────┘
```

### 6. Dashboard — Performance (`/dashboard/performance`)
**Layout**: Scrollable, padded

```
┌─────────────────────────────────────────┐
│  Performance              [7d][30d][Tudo]│
│                                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │Receita│ │Pedidos│ │Ticket│ │Total │   │
│  │Hoje   │ │Hoje   │ │Médio │ │Receita│  │
│  │€342   │ │28     │ │€12.21│ │€3.450│   │
│  │↑12%   │ │↑8%    │ │      │ │      │   │
│  └──────┘ └──────┘ └──────┘ └──────┘   │
│                                          │
│  📈 Receita Diária (LineChart)          │
│  ┌─────────────────────────────────┐    │
│  │    ╱╲    ╱╲                     │    │
│  │   ╱  ╲╱╱  ╲╱╲                  │    │
│  │  ╱              ╲               │    │
│  │ ╱                ╲              │    │
│  │╱                  ╲╱            │    │
│  └─────────────────────────────────┘    │
│                                          │
│  ┌──────────────┐ ┌──────────────┐      │
│  │Por Plataforma │ │Pedidos/Hora  │      │
│  │  🟢 Uber 62% │ │  ▐▐▐▐▐▐▐▐   │      │
│  │  ⚫ Glovo 25%│ │  ▐▐▐▐▐▐▐▐▐  │      │
│  │  🟢 Bolt 13% │ │  ▐▐▐▐▐▐▐▐▐▐ │      │
│  └──────────────┘ └──────────────┘      │
└─────────────────────────────────────────┘
```

### 7. Dashboard — Menu (`/dashboard/menu`)
**Layout**: Scrollable table

```
┌─────────────────────────────────────────┐
│  Menu                          [Falar com Kivo]
│                                          │
│  ┌──────────┬────────┬───────┬────────┐ │
│  │Item      │Preço   │Custo  │Margem  │ │
│  ├──────────┼────────┼───────┼────────┤ │
│  │Francesin.│€14.50  │€5.20  │64%     │ │
│  │Burger    │€12.00  │€4.80  │60%     │ │
│  │Salada    │€9.50   │€3.10  │67%     │ │
│  │Pizza     │€11.00  │€3.50  │68%     │ │
│  │Sobremesa │€6.50   │€1.80  │72%     │ │
│  └──────────┴────────┴───────┴────────┘ │
│                                          │
│  🤖 "Queres que ajuste o preço da      │
│  Salada? Posso aumentar €0.50 para      │
│  melhorar a margem."                    │
│  [Sim, ajustar] [Não, obrigado]         │
└─────────────────────────────────────────┘
```

### 8. Dashboard — Pricing Engine (`/dashboard/pricing-engine`)
**Layout**: Cards with suggestions

```
┌─────────────────────────────────────────┐
│  Pricing Engine              [Falar com Kivo]
│                                          │
│  💡 Sugestões de Preço                   │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │ Salada Caesar                    │    │
│  │ Preço atual: €9.50              │    │
│  │ Preço sugerido: €10.00 (+5.3%)  │    │
│  │ Impacto estimado: +€180/mês     │    │
│  │ Confiança: 85%                  │    │
│  │ [Aplicar via Kivo]              │    │
│  └─────────────────────────────────┘    │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │ Burger Kivo                      │    │
│  │ Preço atual: €12.00             │    │
│  │ Preço sugerido: €11.50 (-4.2%)  │    │
│  │ Impacto estimado: +€320/mês     │    │
│  │ Confiança: 72%                  │    │
│  │ [Aplicar via Kivo]              │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### 9. Dashboard — Promotions (`/dashboard/promotions`)
**Layout**: Active/Inactive lists

```
┌─────────────────────────────────────────┐
│  Promoções                   [Falar com Kivo]
│                                          │
│  Ativas (2)                              │
│  ┌─────────────────────────────────┐    │
│  │ 🟢 2x1 Pizzas — Uber Eats       │    │
│  │ Desconto: 50% | Ativo desde 3d  │    │
│  │ Pedidos: 45 | Receita: €520     │    │
│  │ [Pausar] [Editar]               │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ 🟢 Frete Grátis — Todas         │    │
│  │ Desconto: €2.50 fixo | Ativo 7d │    │
│  │ Pedidos: 120 | Receita: €1.200  │    │
│  │ [Pausar] [Editar]               │    │
│  └─────────────────────────────────┘    │
│                                          │
│  Inativas (1)                            │
│  ┌─────────────────────────────────┐    │
│  │ ⚫ Happy Hour — Glovo           │    │
│  │ Desconto: 20% | Pausado há 2d   │    │
│  │ [Ativar] [Eliminar]             │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### 10. Dashboard — Reviews (`/dashboard/reviews`)
**Layout**: Star chart + list

```
┌─────────────────────────────────────────┐
│  Reviews                     [Importar] [Falar com Kivo]
│                                          │
│  Distribuição de Ratings                 │
│  5★ ████████████████████ 45 (56%)       │
│  4★ ████████ 20 (25%)                   │
│  3★ ████ 8 (10%)                        │
│  2★ ██ 4 (5%)                           │
│  1★ █ 3 (4%)                            │
│  Média: 4.2★ (80 reviews)              │
│                                          │
│  Reviews Recentes                        │
│  ┌─────────────────────────────────┐    │
│  │ ⭐⭐⭐⭐⭐ Uber Eats — João      │    │
│  │ "Comida excelente! Entrega      │    │
│  │ rápida. Recomendo!"            │    │
│  │ Há 2 horas | ✅ Respondido      │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ ⭐⭐ Glovo — Maria              │    │
│  │ "Demorou 1 hora. Pizza fria."   │    │
│  │ Há 1 dia | ❌ Por responder     │    │
│  │ [Responder via Kivo]            │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### 11. Dashboard — Billing (`/dashboard/billing`)
**Layout**: Current plan + upgrade

```
┌─────────────────────────────────────────┐
│  Subscrição                             │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │ Plano Atual                      │    │
│  │                                  │    │
│  │        GROW                      │    │
│  │        €99/mês                   │    │
│  │                                  │    │
│  │ [● Ativo]                        │    │
│  │ Próxima cobrança: 15/07/2026    │    │
│  │                                  │    │
│  │ [Gerir Subscrição]               │    │
│  └─────────────────────────────────┘    │
│                                          │
│  O teu plano inclui:                     │
│  ✓ Tudo do Start                        │
│  ✓ Menu Intelligence (via agente)       │
│  ✓ Pricing Engine (via agente)          │
│  ✓ Gestão de promoções (via agente)     │
│  ✓ Reviews + respostas (via agente)     │
│  ✓ Import de dados das plataformas      │
│  ✓ Sugestões com impacto em €           │
│                                          │
│  Upgrade de Plano                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │Start €39 │ │Grow €99  │ │Autopilot ││
│  │          │ │[Atual]   │ │€199      ││
│  │          │ │          │ │[Upgrade] ││
│  └──────────┘ └──────────┘ └──────────┘│
└─────────────────────────────────────────┘
```

### 12. Dashboard — Settings (`/dashboard/settings`)
**Layout**: Sections with nav

```
┌─────────────────────────────────────────┐
│  Definições                             │
│                                          │
│  [👤 Perfil] [🔗 Plataformas]           │
│  [📱 WhatsApp] [🤖 Autopilot]           │
│  [📊 Conta] [🚪 Sair]                  │
│                                          │
│  ── Perfil ──                            │
│  Nome: [João Silva          ]            │
│  Email: [joao@email.com     ] (disabled) │
│  Restaurante: [O Kivo Restaurante ]      │
│  [Guardar]                               │
│                                          │
│  ── Plataformas ──                       │
│  🟢 Uber Eats        [Conectado] [Desconectar]│
│  ⚫ Glovo            [Conectado] [Desconectar]│
│  🟢 Bolt Food        [Não conectado] [Conectar]│
│                                          │
│  ── WhatsApp ──                          │
│  Número: [+351 912 345 678 ]            │
│  [Guardar]                               │
│                                          │
│  ── Autopilot ──                         │
│  [+ Nova Regra]                          │
│  ┌─────────────────────────────────┐    │
│  │ "Queda de vendas"                │    │
│  │ SE sales_drop > 20%             │    │
│  │ ENTÃO notify                    │    │
│  │ [Ativo] [✕]                     │    │
│  └─────────────────────────────────┘    │
│                                          │
│  ── Conta ──                             │
│  Plano: Grow                             │
│  Estado: Ativo                           │
│  Membro desde: 01/06/2026               │
│  Alertas não lidos: 3                   │
│  [Gerir Subscrição] [Suporte]           │
│                                          │
│  ── Sair ──                              │
│  [Terminar sessão]                       │
└─────────────────────────────────────────┘
```

### 13. Dashboard — Support (`/dashboard/support`)
**Layout**: Contact form + FAQ

```
┌─────────────────────────────────────────┐
│  Suporte                                │
│                                          │
│  Contactar Suporte                       │
│  Assunto: [input]                        │
│  Mensagem: [textarea]                    │
│  [Enviar Mensagem]                       │
│                                          │
│  FAQ                                     │
│  Q: Como conecto as plataformas?         │
│  A: Vai a Definições → Plataformas...    │
│                                          │
│  Q: O Kivo pode alterar preços?          │
│  A: Sim, no plano Autopilot...           │
│                                          │
│  Q: Como funciona o WhatsApp?            │
│  A: O Kivo responde automaticamente...   │
└─────────────────────────────────────────┘
```

---

## Component Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (marketing)/
│   │   └── page.tsx
│   ├── auth/callback/route.ts
│   ├── dashboard/
│   │   ├── layout.tsx (sidebar + topbar)
│   │   ├── assistant/page.tsx
│   │   ├── performance/page.tsx
│   │   ├── menu/page.tsx
│   │   ├── pricing-engine/page.tsx
│   │   ├── promotions/page.tsx
│   │   ├── reviews/page.tsx
│   │   ├── billing/page.tsx
│   │   ├── billing/success/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── support/page.tsx
│   │   └── onboarding/page.tsx
│   ├── api/
│   │   ├── ai/chat/route.ts
│   │   ├── billing/checkout/route.ts
│   │   ├── billing/portal/route.ts
│   │   ├── cron/{sync,forecast,insights,digest,autopilot}/route.ts
│   │   ├── platforms/[platform]/route.ts
│   │   ├── platforms/[platform]/callback/route.ts
│   │   ├── support/route.ts
│   │   ├── webhooks/stripe/route.ts
│   │   └── whatsapp/route.ts
│   └── layout.tsx
├── components/
│   ├── icons/index.tsx
│   ├── sidebar-user.tsx
│   └── complete-account-widget.tsx
├── features/
│   ├── assistant/components/chat-interface.tsx
│   ├── billing/
│   │   ├── actions.ts
│   │   ├── subscription-provider.tsx
│   │   └── components/billing-page.tsx
│   ├── insights/components/insights-panel.tsx
│   └── onboarding/
│       ├── lib/types.ts
│       └── components/{wizard,step-*.tsx}
├── hooks/
│   ├── use-data.ts
│   └── use-plan-gating.ts
├── lib/
│   ├── ai/{client,tools}.ts
│   ├── constants.ts
│   ├── platforms/{types,uber-eats,glovo,bolt-food,index}.ts
│   ├── stripe.ts
│   └── supabase/{client,server,admin}.ts
└── proxy.ts
```

---

## Sidebar Design (Icon-only)
```
┌─────┐
│  K  │ ← Green K logo
├─────┤
│  💬 │ ← Assistant (active: green bg)
│  📊 │ ← Performance
│  📋 │ ← Menu
│  💰 │ ← Pricing
│  🏷️ │ ← Promotions
│  ⭐ │ ← Reviews
├─────┤ ← Green separator
│  ⚙️ │ ← Settings
│  💳 │ ← Billing
│  ❓ │ ← Support
└─────┘
```

Width: 72px
Active state: #2CDF0C background with white icon
Inactive state: #9CA3AF icon, hover gray bg

---

## Top Bar
```
┌─────────────────────────────────────────────────────┐
│  [☰ mobile]                    [🔍] [🔔 3] [👤]   │
└─────────────────────────────────────────────────────┘
```

---

## Complete Account Widget (bottom-right)
```
┌──────────────────────────┐
│ [72%] Complete a conta   │
│ ████████████░░░░ 5/7     │
│ ✓ Criar conta            │
│ ✓ Escolher plano         │
│ ✓ Onboarding             │
│ ○ Conectar plataformas → │
│ ○ Importar menu →        │
│ ○ Importar reviews →     │
└──────────────────────────┘
```

---

## Color Palette
- Primary: #2CDF0C (neon green)
- Primary Dark: #187906
- Background: #FFFFFF
- Card: #FFFFFF
- Border: #E5E7EB
- Text Primary: #111827
- Text Secondary: #6B7280
- Text Muted: #9CA3AF
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
- Uber Eats: #06C167
- Glovo: #000000
- Bolt Food: #2DB5A0

---

## API Endpoints Summary

| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/ai/chat | AI chat with tool calling |
| POST | /api/billing/checkout | Create Stripe checkout |
| POST | /api/billing/portal | Create Stripe portal |
| POST | /api/webhooks/stripe | Handle Stripe events |
| GET | /api/cron/sync | Sync platform data |
| GET | /api/cron/forecast | Generate forecast |
| GET | /api/cron/insights | Generate insights |
| GET | /api/cron/digest | Generate daily digest |
| GET | /api/cron/autopilot | Evaluate autopilot rules |
| POST | /api/platforms/[platform] | Sync platform data |
| GET | /api/platforms/[platform]/callback | OAuth callback |
| POST | /api/whatsapp | Send WhatsApp message |
| POST | /api/whatsapp/webhook | Receive WhatsApp messages |
| POST | /api/support | Send support request |

---

## Database Tables

1. **subscriptions** — Stripe billing (user_id, plan_id, status, stripe_*)
2. **restaurants** — Core profile (user_id, name, cuisine, platforms, score)
3. **menu_items** — Menu (restaurant_id, name, price, cost, margin)
4. **orders** — Orders (restaurant_id, platform, total, items, ordered_at)
5. **reviews** — Reviews (restaurant_id, platform, rating, text, sentiment)
6. **promotions** — Promotions (restaurant_id, name, discount, status)
7. **alerts** — Alerts (restaurant_id, type, title, message, severity)
8. **autopilot_rules** — Rules (restaurant_id, condition, action, status)
9. **chat_messages** — Chat history (user_id, role, content, channel)
10. **platform_tokens** — OAuth tokens (restaurant_id, platform, access_token)
11. **action_log** — Autopilot execution log
12. **daily_digests** — Daily summaries

---

## Mock Data for Demo Mode

```typescript
const MOCK_RESTAURANT = {
  name: "O Kivo Restaurante",
  cuisine_type: "Portuguesa",
  city: "Lisboa",
  platforms: ["uber_eats", "glovo", "bolt_food"],
  daily_orders: "31-50",
  monthly_revenue: 8500,
  avg_ticket: 12.50,
  team_size: "4-6",
  onboarding_score: 72,
  onboarding_plan: "grow",
};

const MOCK_MENU_ITEMS = [
  { name: "Francesinha Clássica", category: "Pratos", price: 14.50, cost: 5.20, orders_count: 87, revenue: 1261.50 },
  { name: "Burger Kivo", category: "Pratos", price: 12.00, cost: 4.80, orders_count: 65, revenue: 780.00 },
  { name: "Salada Caesar", category: "Pratos", price: 9.50, cost: 3.10, orders_count: 42, revenue: 399.00 },
  { name: "Pizza Margherita", category: "Pizzas", price: 11.00, cost: 3.50, orders_count: 38, revenue: 418.00 },
  { name: "Sobremesa do Dia", category: "Sobremesas", price: 6.50, cost: 1.80, orders_count: 28, revenue: 182.00 },
  { name: "Bacalhau à Brás", category: "Pratos", price: 13.50, cost: 5.80, orders_count: 35, revenue: 472.50 },
  { name: "Arroz de Pato", category: "Pratos", price: 12.50, cost: 4.50, orders_count: 22, revenue: 275.00 },
  { name: "Água Mineral", category: "Bebidas", price: 1.50, cost: 0.30, orders_count: 120, revenue: 180.00 },
];

const MOCK_ORDERS = Array.from({ length: 150 }, (_, i) => ({
  total: 8 + Math.random() * 15,
  platform: ["uber_eats", "glovo", "bolt_food"][Math.floor(Math.random() * 3)],
  ordered_at: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
}));

const MOCK_REVIEWS = [
  { platform: "uber_eats", rating: 5, text: "Comida excelente! Entrega rápida. Recomendo!", author_name: "João", sentiment: "positive" },
  { platform: "glovo", rating: 2, text: "Demorou 1 hora. Pizza fria. Mau serviço.", author_name: "Maria", sentiment: "negative" },
  { platform: "uber_eats", rating: 4, text: "Bom restoration, mas porção um pouco pequena.", author_name: "Pedro", sentiment: "neutral" },
  { platform: "bolt_food", rating: 5, text: "Melhor francesinha de Lisboa!", author_name: "Ana", sentiment: "positive" },
  { platform: "glovo", rating: 3, text: "Normal, nada de especial.", author_name: "Carlos", sentiment: "neutral" },
];

const MOCK_PROMOTIONS = [
  { name: "2x1 Pizzas", platform: "uber_eats", discount_type: "percentage", discount_value: 50, status: "active", orders_count: 45, revenue: 520 },
  { name: "Frete Grátis", platform: "all", discount_type: "fixed", discount_value: 2.50, status: "active", orders_count: 120, revenue: 1200 },
  { name: "Happy Hour", platform: "glovo", discount_type: "percentage", discount_value: 20, status: "inactive", orders_count: 30, revenue: 280 },
];

const MOCK_ALERTS = [
  { type: "low_ratings", title: "Reviews negativos", message: "2 reviews com rating ≤2 esta semana", severity: "high", read: false },
  { type: "revenue_drop", title: "Queda de receita", message: "Receita caiu 15% vs semana anterior", severity: "high", read: false },
  { type: "platform_insight", title: "Plataforma líder", message: "Uber Eats representa 62% da receita", severity: "info", read: true },
];
```
