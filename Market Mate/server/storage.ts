import { type Product, type InsertProduct, type Sale, type InsertSale, type SaleWithProduct, products, sales } from "@shared/schema";
import { db } from "./db";
import { eq, desc, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Sale operations
  getSales(): Promise<SaleWithProduct[]>;
  getSale(id: string): Promise<Sale | undefined>;
  createSale(sale: InsertSale): Promise<Sale>;
  
  // Analytics
  getDashboardStats(): Promise<{
    totalProducts: number;
    lowStockItems: number;
    todaySales: number;
    monthlySales: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with sample data if needed
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    try {
      // Check if we already have products
      const existingProducts = await db.select().from(products).limit(1);
      if (existingProducts.length > 0) {
        return; // Already initialized
      }

      // Add sample products to database
      const sampleProducts: InsertProduct[] = [
        {
          name: "Wireless Headphones",
          description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
          category: "Electronics",
          price: "45999.99",
          stock: 25,
          lowStockThreshold: 10,
        },
        {
          name: "Gaming Mouse",
          description: "Precision gaming mouse with RGB lighting and customizable buttons for competitive gaming.",
          category: "Electronics",
          price: "18250.00",
          stock: 3,
          lowStockThreshold: 5,
        },
        {
          name: "Bluetooth Speaker",
          description: "Portable wireless speaker with 360-degree sound and waterproof design.",
          category: "Electronics",
          price: "52000.00",
          stock: 15,
          lowStockThreshold: 10,
        },
        {
          name: "USB Cable Type-C",
          description: "High-speed USB-C cable for fast charging and data transfer.",
          category: "Accessories",
          price: "5200.00",
          stock: 2,
          lowStockThreshold: 5,
        },
      ];

      await db.insert(products).values(sampleProducts);
    } catch (error) {
      console.log("Sample data initialization skipped or failed:", error);
    }
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.count > 0;
  }

  async getSales(): Promise<SaleWithProduct[]> {
    const salesWithProducts = await db
      .select({
        id: sales.id,
        productId: sales.productId,
        quantity: sales.quantity,
        unitPrice: sales.unitPrice,
        totalAmount: sales.totalAmount,
        paymentMethod: sales.paymentMethod,
        notes: sales.notes,
        createdAt: sales.createdAt,
        product: {
          id: products.id,
          name: products.name,
          description: products.description,
          category: products.category,
          price: products.price,
          stock: products.stock,
          lowStockThreshold: products.lowStockThreshold,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
        },
      })
      .from(sales)
      .innerJoin(products, eq(sales.productId, products.id))
      .orderBy(desc(sales.createdAt));

    return salesWithProducts;
  }

  async getSale(id: string): Promise<Sale | undefined> {
    const [sale] = await db.select().from(sales).where(eq(sales.id, id));
    return sale || undefined;
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    // Start a transaction to create sale and update product stock
    const [sale] = await db
      .insert(sales)
      .values(insertSale)
      .returning();

    // Update product stock
    await db
      .update(products)
      .set({
        stock: sql`${products.stock} - ${insertSale.quantity}`,
        updatedAt: new Date(),
      })
      .where(eq(products.id, insertSale.productId));

    return sale;
  }

  async getDashboardStats(): Promise<{
    totalProducts: number;
    lowStockItems: number;
    todaySales: number;
    monthlySales: number;
  }> {
    // Get total products count
    const [{ count: totalProducts }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products);

    // Get low stock items count
    const [{ count: lowStockItems }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(lte(products.stock, products.lowStockThreshold));

    // Get today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySalesResult = await db
      .select({ sum: sql<string>`COALESCE(SUM(${sales.totalAmount}), '0')` })
      .from(sales)
      .where(gte(sales.createdAt, today));

    // Get monthly sales
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlySalesResult = await db
      .select({ sum: sql<string>`COALESCE(SUM(${sales.totalAmount}), '0')` })
      .from(sales)
      .where(gte(sales.createdAt, thisMonth));

    return {
      totalProducts: totalProducts || 0,
      lowStockItems: lowStockItems || 0,
      todaySales: parseFloat(todaySalesResult[0]?.sum || '0'),
      monthlySales: parseFloat(monthlySalesResult[0]?.sum || '0'),
    };
  }
}

export const storage = new DatabaseStorage();