"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarDays, TrendingUp, Users, Package, FileText, BarChart3 } from 'lucide-react';

const Dashboard = ({ 
  salesData, 
  newCustomers, 
  topProducts, 
  latestInvoices, 
  recentCustomers 
}) => {
  // Sample data structure (you would replace this with your actual data)
  const data = {
    salesData: {
      daily: 2350,
      weekly: 14250,
      monthly: 58700,
      dailyChange: 12.5,
      weeklyChange: 8.3,
      monthlyChange: 15.2
    },
    newCustomers: {
      count: 24,
      percentageChange: 8.5
    },
    topProducts: [
      { id: 1, name: "Premium Laptop", sales: 42, revenue: 89000 },
      { id: 2, name: "Wireless Earbuds", sales: 128, revenue: 12800 },
      { id: 3, name: "Smart Watch", sales: 78, revenue: 15600 },
      { id: 4, name: "Gaming Console", sales: 35, revenue: 17500 },
      { id: 5, name: "Wireless Keyboard", sales: 64, revenue: 6400 }
    ],
    latestInvoices: [
      { id: "INV-1234", customer: "Acme Corp", amount: 1250, date: "2025-03-19", status: "Paid" },
      { id: "INV-1233", customer: "TechGiant Inc", amount: 3450, date: "2025-03-18", status: "Pending" },
      { id: "INV-1232", customer: "Summit Solutions", amount: 876, date: "2025-03-18", status: "Paid" },
      { id: "INV-1231", customer: "Horizon Enterprises", amount: 2154, date: "2025-03-17", status: "Pending" }
    ],
    recentCustomers: [
      { id: 1, name: "Jane Cooper", company: "Acme Inc", email: "jane@acme.com", date: "2025-03-19" },
      { id: 2, name: "Robert Fox", company: "Fox Industries", email: "robert@foxind.com", date: "2025-03-18" },
      { id: 3, name: "Sarah Williams", company: "Quantum Tech", email: "sarah@quantum.tech", date: "2025-03-18" }
    ]
  };

  // Use provided data or fall back to sample data
  const displayData = {
    salesData: salesData || data.salesData,
    newCustomers: newCustomers || data.newCustomers,
    topProducts: topProducts || data.topProducts,
    latestInvoices: latestInvoices || data.latestInvoices,
    recentCustomers: recentCustomers || data.recentCustomers
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sales Dashboard</h1>
        <p className="text-muted-foreground">{new Date().toLocaleDateString()}</p>
      </div>

      {/* Sales Metrics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
              <TabsContent value="daily" className="pt-4">
                <div className="text-2xl font-bold">{formatCurrency(displayData.salesData.daily)}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className={`h-3 w-3 mr-1 ${displayData.salesData.dailyChange > 0 ? 'text-green-500' : 'text-red-500'}`} />
                  {displayData.salesData.dailyChange > 0 ? '+' : ''}{displayData.salesData.dailyChange}% from yesterday
                </p>
              </TabsContent>
              <TabsContent value="weekly" className="pt-4">
                <div className="text-2xl font-bold">{formatCurrency(displayData.salesData.weekly)}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className={`h-3 w-3 mr-1 ${displayData.salesData.weeklyChange > 0 ? 'text-green-500' : 'text-red-500'}`} />
                  {displayData.salesData.weeklyChange > 0 ? '+' : ''}{displayData.salesData.weeklyChange}% from last week
                </p>
              </TabsContent>
              <TabsContent value="monthly" className="pt-4">
                <div className="text-2xl font-bold">{formatCurrency(displayData.salesData.monthly)}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className={`h-3 w-3 mr-1 ${displayData.salesData.monthlyChange > 0 ? 'text-green-500' : 'text-red-500'}`} />
                  {displayData.salesData.monthlyChange > 0 ? '+' : ''}{displayData.salesData.monthlyChange}% from last month
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayData.newCustomers.count}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className={`h-3 w-3 mr-1 ${displayData.newCustomers.percentageChange > 0 ? 'text-green-500' : 'text-red-500'}`} />
              {displayData.newCustomers.percentageChange > 0 ? '+' : ''}{displayData.newCustomers.percentageChange}% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue Breakdown</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="h-32 flex items-center justify-center bg-slate-50 text-slate-500 rounded-md">
              Sales Chart Visualization
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Top Selling Products Section */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Products with the highest sales volume this month</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Units Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.topProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">{product.sales}</TableCell>
                    <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Latest Invoices Section */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Latest Invoices</CardTitle>
            <CardDescription>Most recent invoices created in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.latestInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Recently Added Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Newly Added Customers</CardTitle>
          <CardDescription>Most recently added customers to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayData.recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{customer.name.charAt(0)}{customer.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                  <p className="text-xs text-muted-foreground">{new Date(customer.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;