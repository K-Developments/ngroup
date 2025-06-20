
import type { Product, Customer, Sale, StatsData, SalesChartData, FullReportEntry } from "./types";
import { format } from "date-fns";

export const placeholderProducts: Product[] = [
  { id: "prod001", name: "Yoghurt", category: "Yogurt", price: 1.50, wholesalePrice: 1.30, stock: 100, imageUrl: "https://placehold.co/300x200.png", description: "Classic creamy yoghurt.", sku: "YOG001", reorderLevel: 20 },
  { id: "prod002", name: "Jelly Yoghurt", category: "Yogurt", price: 1.80, wholesalePrice: 1.60, stock: 80, imageUrl: "https://placehold.co/300x200.png", description: "Yoghurt with fruit jelly.", sku: "YOG002", reorderLevel: 15 },
  { id: "prod003", name: "Drinking Yoghurt", category: "Yogurt", price: 2.00, wholesalePrice: 1.80, stock: 90, imageUrl: "https://placehold.co/300x200.png", description: "Refreshing drinkable yoghurt.", sku: "YOG003", reorderLevel: 20 },
  { id: "prod004", name: "Chocolate Drink", category: "Drink", price: 2.50, wholesalePrice: 2.20, stock: 70, imageUrl: "https://placehold.co/300x200.png", description: "Rich chocolate flavored milk drink.", sku: "DRK001", reorderLevel: 15 },
  { id: "prod005", name: "Glue Cola", category: "Drink", price: 1.20, wholesalePrice: 1.00, stock: 120, imageUrl: "https://placehold.co/300x200.png", description: "A popular cola beverage.", sku: "DRK002", reorderLevel: 25 },
  { id: "prod006", name: "Milk Ice Packet", category: "Ice Cream", price: 1.00, wholesalePrice: 0.80, stock: 150, imageUrl: "https://placehold.co/300x200.png", description: "Frozen milk ice treat.", sku: "ICE001", reorderLevel: 30 },
  { id: "prod007", name: "Chocolate Ice Packet", category: "Ice Cream", price: 1.20, wholesalePrice: 1.00, stock: 140, imageUrl: "https://placehold.co/300x200.png", description: "Frozen chocolate ice treat.", sku: "ICE002", reorderLevel: 30 },
  { id: "prod008", name: "Watalappan", category: "Dessert", price: 3.50, wholesalePrice: 3.20, stock: 50, imageUrl: "https://placehold.co/300x200.png", description: "Traditional coconut custard pudding.", sku: "DES001", reorderLevel: 10 },
  { id: "prod009", name: "Jelly Pudding", category: "Dessert", price: 2.80, wholesalePrice: 2.50, stock: 60, imageUrl: "https://placehold.co/300x200.png", description: "Colorful fruit jelly pudding.", sku: "DES002", reorderLevel: 10 },
  { id: "prod010", name: "Faluda", category: "Drink", price: 3.00, wholesalePrice: 2.70, stock: 40, imageUrl: "https://placehold.co/300x200.png", description: "Sweet rose-flavored milk drink with vermicelli and basil seeds.", sku: "DRK003", reorderLevel: 10 },
  { id: "prod011", name: "Iced Coffee", category: "Drink", price: 2.20, wholesalePrice: 2.00, stock: 60, imageUrl: "https://placehold.co/300x200.png", description: "Chilled coffee beverage.", sku: "DRK004", reorderLevel: 15 },
  { id: "prod012", name: "Curd", category: "Curd", price: 4.00, wholesalePrice: 3.70, stock: 70, imageUrl: "https://placehold.co/300x200.png", description: "Thick and creamy curd.", sku: "CRD001", reorderLevel: 15 },
];

export const placeholderCustomers: Customer[] = [
  { id: "1", name: "Retail LK", phone: "077-1234567", address: "12 Galle Rd, Colombo", shopName: "Colombo Super" },
  { id: "2", name: "Kandy Foods", phone: "071-7654321", address: "34 Temple St, Kandy", shopName: "Kandy Central Mart" },
  { id: "3", name: "Nuwara Eliya Grocers", phone: "070-5558888", shopName: "Highland Grocers" },
  { id: "4", name: "Jaffna Traders", phone: "076-9990000", address: "7 Market Sq, Jaffna" },
];

export const placeholderSales: Sale[] = [
  { 
    id: "SALE-001", 
    customerId: "1", 
    customerName: "Retail LK",
    items: [
      { ...placeholderProducts[0], quantity: 2, appliedPrice: placeholderProducts[0].price, saleType: 'retail' },
      { ...placeholderProducts[1], quantity: 1, appliedPrice: placeholderProducts[1].price, saleType: 'retail' },
      { ...placeholderProducts[4], quantity: 5, appliedPrice: placeholderProducts[4].wholesalePrice || placeholderProducts[4].price, saleType: 'wholesale' },
    ], 
    totalAmount: (placeholderProducts[0].price * 2) + placeholderProducts[1].price + ((placeholderProducts[4].wholesalePrice || placeholderProducts[4].price) * 5), 
    paymentMethod: "Card", 
    saleDate: new Date(Date.now() - 86400000 * 2.5), // 2.5 days ago
    staffId: "staff001" 
  },
  { 
    id: "SALE-002", 
    customerId: "2", 
    customerName: "Kandy Foods",
    items: [
      { ...placeholderProducts[7], quantity: 1, appliedPrice: placeholderProducts[7].price, saleType: 'retail' },
      { ...placeholderProducts[11], quantity: 1, appliedPrice: placeholderProducts[11].price, saleType: 'retail' },
    ], 
    totalAmount: placeholderProducts[7].price + placeholderProducts[11].price, 
    paymentMethod: "Cash", 
    saleDate: new Date(Date.now() - 86400000 * 1.2), // 1.2 days ago
    staffId: "staff002"
  },
  { 
    id: "SALE-003", 
    customerName: "Walk-in Customer", // No customerId for walk-in
    items: [
      { ...placeholderProducts[5], quantity: 3, appliedPrice: placeholderProducts[5].price, saleType: 'retail' },
    ], 
    totalAmount: placeholderProducts[5].price * 3, 
    paymentMethod: "Cash", 
    saleDate: new Date(Date.now() - 3600000 * 5), // 5 hours ago
    staffId: "staff001" 
  },
];

export const placeholderStats: StatsData = {
  totalSales: placeholderSales.reduce((sum, sale) => sum + sale.totalAmount, 0), 
  totalCustomers: placeholderCustomers.length,
  lowStockItems: placeholderProducts.filter(p => p.stock <= (p.reorderLevel || 10)).length,
  revenueToday: placeholderSales.filter(s => s.saleDate >= new Date(new Date().setHours(0,0,0,0))).reduce((sum, sale) => sum + sale.totalAmount, 0), 
};

export const placeholderSalesChartData: SalesChartData[] = [
  { name: "Mon", sales: 400 },
  { name: "Tue", sales: 300 },
  { name: "Wed", sales: 200 },
  { name: "Thu", sales: 278 },
  { name: "Fri", sales: 189 },
  { name: "Sat", sales: 239 },
  { name: "Sun", sales: 349 },
];

export const placeholderMonthlySalesData: SalesChartData[] = [
  { name: "Jan", sales: 2400 },
  { name: "Feb", sales: 1398 },
  { name: "Mar", sales: 9800 },
  { name: "Apr", sales: 3908 },
  { name: "May", sales: 4800 },
  { name: "Jun", sales: 3800 },
  { name: "Jul", sales: 4300 },
];


export function generatePlaceholderFullReportData(): FullReportEntry[] {
  const reportData: FullReportEntry[] = [];
  placeholderSales.forEach(sale => {
    sale.items.forEach(item => {
      reportData.push({
        saleId: sale.id,
        saleDate: format(sale.saleDate, "yyyy-MM-dd"),
        saleTime: format(sale.saleDate, "HH:mm:ss"),
        customerName: sale.customerName || "N/A",
        productSku: item.sku || "N/A",
        productName: item.name,
        productCategory: item.category,
        quantity: item.quantity,
        appliedPrice: item.appliedPrice,
        lineTotal: item.quantity * item.appliedPrice,
        saleType: item.saleType,
        paymentMethod: sale.paymentMethod,
        staffId: sale.staffId,
      });
    });
  });
  return reportData.sort((a,b) => new Date(b.saleDate + 'T' + b.saleTime).getTime() - new Date(a.saleDate + 'T' + a.saleTime).getTime());
}

export const placeholderFullReportData: FullReportEntry[] = generatePlaceholderFullReportData();
