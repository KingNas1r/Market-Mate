import { useQuery } from "@tanstack/react-query";
import { Package2, AlertTriangle, TrendingUp, DollarSign, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: sales, isLoading: salesLoading } = useQuery({
    queryKey: ["/api/sales"],
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  if (statsLoading || salesLoading || productsLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Overview of your business metrics</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const recentSales = Array.isArray(sales) ? sales.slice(0, 3) : [];
  const lowStockItems = Array.isArray(products) ? products.filter((p: any) => p.stock <= p.lowStockThreshold).slice(0, 3) : [];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Overview of your business metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalProducts ?? 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                <Package2 className="text-primary-blue" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
                <p className="text-2xl font-semibold text-warning-orange">{stats?.lowStockItems ?? 0}</p>
              </div>
              <div className="w-12 h-12 bg-warning-orange bg-opacity-10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-warning-orange" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Sales</p>
                <p className="text-2xl font-semibold text-success-green">₦{stats?.todaySales?.toFixed(2) ?? '0.00'}</p>
              </div>
              <div className="w-12 h-12 bg-success-green bg-opacity-10 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-success-green" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">₦{stats?.monthlySales?.toFixed(2) ?? '0.00'}</p>
              </div>
              <div className="w-12 h-12 bg-primary-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                <DollarSign className="text-primary-blue" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Sales</h3>
            <div className="space-y-4">
              {recentSales.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent sales</p>
              ) : (
                recentSales.map((sale: any) => (
                  <div key={sale.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="text-gray-600" size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{sale.product.name}</p>
                        <p className="text-sm text-gray-500">
                          {sale.createdAt ? new Date(sale.createdAt).toLocaleString() : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-success-green">₦{parseFloat(sale.totalAmount).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Low Stock Alerts</h3>
            <div className="space-y-4">
              {lowStockItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No low stock items</p>
              ) : (
                lowStockItems.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-warning-orange bg-opacity-10 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="text-warning-orange" size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-warning-orange bg-opacity-10 text-warning-orange text-sm font-medium rounded-full">
                      {item.stock} left
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
