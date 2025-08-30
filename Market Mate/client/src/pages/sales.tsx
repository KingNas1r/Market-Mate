import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import NewSaleModal from "@/components/modals/new-sale-modal";

export default function Sales() {
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: sales, isLoading: salesLoading } = useQuery({
    queryKey: ["/api/sales"],
  });

  if (statsLoading || salesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Sales Management</h2>
            <p className="text-gray-600">Process sales and view transaction history</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const thisWeekSales = Array.isArray(sales) ? sales.filter((sale: any) => 
    new Date(sale.createdAt) >= startOfWeek
  ).reduce((sum: number, sale: any) => sum + parseFloat(sale.totalAmount), 0) : 0;

  const todaysSalesCount = Array.isArray(sales) ? sales.filter((sale: any) => {
    const saleDate = new Date(sale.createdAt);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  }).length : 0;

  const thisWeekSalesCount = Array.isArray(sales) ? sales.filter((sale: any) => 
    new Date(sale.createdAt) >= startOfWeek
  ).length : 0;

  const thisMonthSalesCount = Array.isArray(sales) ? sales.filter((sale: any) => {
    const saleDate = new Date(sale.createdAt);
    const thisMonth = new Date();
    return saleDate.getMonth() === thisMonth.getMonth() && 
           saleDate.getFullYear() === thisMonth.getFullYear();
  }).length : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Sales Management</h2>
          <p className="text-gray-600">Process sales and view transaction history</p>
        </div>
        <Button 
          onClick={() => setIsNewSaleModalOpen(true)}
          className="bg-success-green hover:bg-success-green-dark"
        >
          <Plus size={16} className="mr-2" />
          New Sale
        </Button>
      </div>

      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Sales</p>
                <p className="text-2xl font-semibold text-gray-900">₦{stats?.todaySales?.toFixed(2) ?? '0.00'}</p>
                <p className="text-sm text-gray-500">{todaysSalesCount} transactions</p>
              </div>
              <div className="w-12 h-12 bg-success-green bg-opacity-10 rounded-lg flex items-center justify-center">
                <span className="text-success-green">📅</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Week</p>
                <p className="text-2xl font-semibold text-gray-900">₦{thisWeekSales.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{thisWeekSalesCount} transactions</p>
              </div>
              <div className="w-12 h-12 bg-primary-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                <span className="text-primary-blue">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">₦{stats?.monthlySales?.toFixed(2) ?? '0.00'}</p>
                <p className="text-sm text-gray-500">{thisMonthSalesCount} transactions</p>
              </div>
              <div className="w-12 h-12 bg-warning-orange bg-opacity-10 rounded-lg flex items-center justify-center">
                <span className="text-warning-orange">📈</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales History Table */}
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!Array.isArray(sales) || sales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  sales.map((transaction: any) => (
                    <TableRow key={transaction.id} className="hover:bg-gray-50">
                      <TableCell>
                        <span className="text-sm font-medium text-gray-900">
                          #{transaction.id.slice(-8)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{transaction.product.name}</div>
                          <div className="text-sm text-gray-500">{transaction.product.category}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-900">{transaction.quantity}</TableCell>
                      <TableCell className="text-sm font-medium text-gray-900">
                        ₦{parseFloat(transaction.totalAmount).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 capitalize">
                        {transaction.paymentMethod}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <NewSaleModal
        isOpen={isNewSaleModalOpen}
        onClose={() => setIsNewSaleModalOpen(false)}
      />
    </div>
  );
}
