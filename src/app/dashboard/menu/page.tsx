"use client";

const menuItems = [
  { name: "Classic Burger", orders: 156, revenue: "€1,872", margin: 62, trend: 8, category: "Burgers" },
  { name: "Chicken Burger", orders: 134, revenue: "€1,474", margin: 58, trend: -25, category: "Burgers" },
  { name: "BBQ Bacon Burger", orders: 98, revenue: "€1,372", margin: 55, trend: 12, category: "Burgers" },
  { name: "Margherita Pizza", orders: 87, revenue: "€1,044", margin: 65, trend: 5, category: "Pizzas" },
  { name: "Pepperoni Pizza", orders: 76, revenue: "€1,064", margin: 60, trend: -3, category: "Pizzas" },
  { name: "Caesar Salad", orders: 65, revenue: "€715", margin: 72, trend: 15, category: "Saladas" },
  { name: "Onion Rings", orders: 120, revenue: "€360", margin: 78, trend: 10, category: "Extras" },
  { name: "Coca-Cola 33cl", orders: 180, revenue: "€360", margin: 80, trend: 2, category: "Bebidas" },
  { name: "Batatas Fritas", orders: 145, revenue: "€435", margin: 75, trend: 6, category: "Extras" },
  { name: "Milkshake", orders: 42, revenue: "€336", margin: 70, trend: -8, category: "Bebidas" },
];

const categories = ["Todos", "Burgers", "Pizzas", "Saladas", "Extras", "Bebidas"];

export default function MenuPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Menu Intelligence</h1>
        <p className="text-sm text-muted-foreground">
          Análise de performance e margem de cada item do teu menu.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Itens no Menu</div>
          <div className="text-2xl font-bold">10</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Margem Média</div>
          <div className="text-2xl font-bold">67.5%</div>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Top Seller</div>
          <div className="text-2xl font-bold">Classic Burger</div>
          <div className="text-xs text-muted-foreground">156 pedidos</div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="rounded-lg border-2 border-yellow-500/20 bg-yellow-500/5 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-sm text-white">
            ⚠️
          </div>
          <div>
            <div className="text-sm font-semibold text-yellow-600">Atenção Necessária</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Chicken Burger perdeu 25% de vendas esta semana. Considera uma promoção
              ou ajuste no preço.
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-sm font-semibold">Todos os Itens</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Item</th>
                <th className="px-4 py-3 text-left font-medium">Categoria</th>
                <th className="px-4 py-3 text-right font-medium">Pedidos</th>
                <th className="px-4 py-3 text-right font-medium">Receita</th>
                <th className="px-4 py-3 text-right font-medium">Margem</th>
                <th className="px-4 py-3 text-right font-medium">Tendência</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.name} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                  <td className="px-4 py-3 text-right">{item.orders}</td>
                  <td className="px-4 py-3 text-right font-medium">{item.revenue}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      item.margin >= 70 ? "bg-green-100 text-green-800" :
                      item.margin >= 60 ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {item.margin}%
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${
                    item.trend >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {item.trend >= 0 ? "+" : ""}{item.trend}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
