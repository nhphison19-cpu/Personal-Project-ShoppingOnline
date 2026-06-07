import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { User, Category, Brand, Product, Cart, Order, Review, Address, Wishlist, OrderStatus, PaymentMethod } from "./src/types";

const app = express();
const PORT = 3000;

// Enable JSON body parking with limit for base64 uploads
app.use(express.json({ limit: "10mb" }));

// In-Memory Database State
const db = {
  users: [
    {
      id: "admin-1",
      name: "E-Commerce Admin",
      email: "admin@store.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "ADMIN" as const,
      password: "admin", // Simple password auth
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-1",
      name: "John Doe",
      email: "user@store.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      role: "USER" as const,
      password: "password",
      createdAt: new Date().toISOString(),
    }
  ] as (User & { password: string })[],
  categories: [
    { id: "cat-1", name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400" },
    { id: "cat-2", name: "Audio Sound", slug: "audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400" },
    { id: "cat-3", name: "Desk Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400" },
    { id: "cat-4", name: "Wearables", slug: "wearables", image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=400" }
  ] as Category[],
  brands: [
    { id: "brand-1", name: "Apple", logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=150" },
    { id: "brand-2", name: "Sony", logo: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=150" },
    { id: "brand-3", name: "Logitech", logo: "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&q=80&w=150" },
    { id: "brand-4", name: "Keychron", logo: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=150" }
  ] as Brand[],
  products: [] as Product[],
  carts: {} as { [userId: string]: Cart },
  orders: [] as Order[],
  wishlists: {} as { [userId: string]: Wishlist[] },
  addresses: {} as { [userId: string]: Address[] },
  reviews: [] as Review[]
};

// Seed initial products
db.products = [
  {
    id: "prod-1",
    name: "MacBook Pro M3 Max",
    slug: "macbook-pro-m3-max",
    description: "The ultimate laptop for developers and creatives. Powered by the M3 Max chip, featuring up to 128GB of unified memory and an ultra-deep Liquid Retina XDR screen.",
    price: 68000000,
    discountPrice: 64990000,
    stock: 12,
    sold: 4,
    categoryId: "cat-1",
    brandId: "brand-1",
    category: db.categories[0],
    brand: db.brands[0],
    images: [{ id: "img-1a", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800" }],
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Sony WH-1000XM5 Wireless Headphones",
    slug: "sony-wh-1000xm5",
    description: "Industry-leading active noise canceling headphones with 30 hours of battery life, exceptional call quality, and custom high-fidelity audio engineering.",
    price: 8490000,
    discountPrice: 7890000,
    stock: 22,
    sold: 15,
    categoryId: "cat-2",
    brandId: "brand-2",
    category: db.categories[1],
    brand: db.brands[1],
    images: [{ id: "img-2a", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800" }],
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Logitech MX Master 3S Ergonomic Mouse",
    slug: "logitech-mx-master-3s",
    description: "Precision scrolling, 8k DPI sensor, silent clicks, and exceptional multi-device flows. Perfectly paired for executive desk spaces.",
    price: 2590000,
    stock: 35,
    sold: 28,
    categoryId: "cat-3",
    brandId: "brand-3",
    category: db.categories[2],
    brand: db.brands[2],
    images: [{ id: "img-3a", url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800" }],
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "Keychron Q1 Max Mechanical Keyboard",
    slug: "keychron-q1-max",
    description: "Full-aluminum custom keycap mechanical keyboard with hot-swappable switches, double-gasket dampening, and advanced wireless capability.",
    price: 4800000,
    discountPrice: 4200000,
    stock: 10,
    sold: 8,
    categoryId: "cat-3",
    brandId: "brand-4",
    category: db.categories[2],
    brand: db.brands[3],
    images: [{ id: "img-4a", url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800" }],
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-5",
    name: "Apple Watch Ultra 2 Titanium",
    slug: "apple-watch-ultra-2",
    description: "Rugged exterior, multi-day battery, specialized dual-frequency GPS, and the brightest display in Apple Watch history. Built for extreme athletic journeys.",
    price: 22000000,
    stock: 8,
    sold: 3,
    categoryId: "cat-4",
    brandId: "brand-1",
    category: db.categories[3],
    brand: db.brands[0],
    images: [{ id: "img-5a", url: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=800" }],
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Seed initial system reviews
db.reviews = [
  {
    id: "rev-1",
    rating: 5,
    comment: "This headphone is pure sound bliss. Noise-canceling is lightyears ahead of competition!",
    userId: "user-1",
    productId: "prod-2",
    user: db.users[1],
    createdAt: new Date().toISOString()
  },
  {
    id: "rev-2",
    rating: 4,
    comment: "Excellent keyboard, very solid build and super clean typing sound. Best purchase of the year.",
    userId: "user-1",
    productId: "prod-4",
    user: db.users[1],
    createdAt: new Date().toISOString()
  }
];

// Synchronize reviews inside products
db.products.forEach(p => {
  p.reviews = db.reviews.filter(r => r.productId === p.id);
});

// Seed default addresses
db.addresses["user-1"] = [
  {
    id: "addr-1",
    fullName: "John Doe",
    phone: "0901234567",
    city: "Ho Chi Minh City",
    district: "District 1",
    ward: "Ben Nghe Ward",
    detail: "123 Le Loi Street, Room 502"
  }
];

// Context helper to get logged-in user through Custom 'token' header
function getAuthUser(req: express.Request): (typeof db.users[0]) | null {
  const tokenHeader = req.headers.token as string;
  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = tokenHeader.split("Bearer ")[1];
  if (!token || !token.startsWith("mock-jwt-token-for-")) {
    return null;
  }
  const userId = token.replace("mock-jwt-token-for-", "");
  return db.users.find(u => u.id === userId) || null;
}

// Authentication Middlewares
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ status: "ERR", message: "Unauthorized. Please sign in again." });
  }
  (req as any).user = user;
  next();
};

const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const user = getAuthUser(req);
  if (!user || user.role !== "ADMIN") {
    return res.status(401).json({ status: "ERR", message: "Forbidden. Admin access required." });
  }
  (req as any).user = user;
  next();
};


// -------------------------------------------------------------
// USER API ENDPOINTS (/api/user)
// -------------------------------------------------------------

// Sign Up
app.post("/api/user/sign-up", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ status: "ERR", message: "Please provide name, email, and password." });
  }
  if (db.users.some(u => u.email === email)) {
    return res.status(400).json({ status: "ERR", message: "Email has already been registered." });
  }
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    role: "USER" as const,
    password,
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);
  res.json({
    status: "OK",
    message: "Registration successful!",
    data: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, createdAt: newUser.createdAt }
  });
});

// Sign In
app.post("/api/user/sign-in", (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(400).json({ status: "ERR", message: "Incorrect email or password." });
  }
  res.json({
    status: "OK",
    message: "Sign in successful",
    access_token: `mock-jwt-token-for-${user.id}`,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// Update Profile
app.put("/api/user/update-user/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const { name, avatar } = req.body;
  const loggedUser = (req as any).user;
  if (loggedUser.id !== id && loggedUser.role !== "ADMIN") {
    return res.status(401).json({ status: "ERR", message: "You cannot update another user's profile." });
  }

  const userIndex = db.users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ status: "ERR", message: "User not found." });
  }

  // Update logic
  db.users[userIndex].name = name || db.users[userIndex].name;
  db.users[userIndex].avatar = avatar || db.users[userIndex].avatar;

  res.json({
    status: "OK",
    message: "Profile updated successfully.",
    data: {
      id: db.users[userIndex].id,
      name: db.users[userIndex].name,
      email: db.users[userIndex].email,
      avatar: db.users[userIndex].avatar,
      role: db.users[userIndex].role,
      createdAt: db.users[userIndex].createdAt
    }
  });
});

// Get User Detail
app.get("/api/user/get-detail-user/:id", requireAuth, (req, res) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ status: "ERR", message: "User not found." });
  }
  res.json({
    status: "OK",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// Get All Users (Admin)
app.get("/api/user/getall", requireAdmin, (req, res) => {
  const list = db.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    role: u.role,
    createdAt: u.createdAt
  }));
  res.json({ status: "OK", data: list });
});

// Delete User (Admin)
app.delete("/api/user/delete/:id", requireAdmin, (req, res) => {
  const index = db.users.findIndex(u => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ status: "ERR", message: "User not found." });
  }
  db.users.splice(index, 1);
  res.json({ status: "OK", message: "User deleted successfully." });
});


// -------------------------------------------------------------
// PRODUCTS API ENDPOINTS (/api/product)
// -------------------------------------------------------------

// List all products
app.get("/api/product/getall", (req, res) => {
  res.json({ status: "OK", data: db.products });
});

// Product Detail
app.get("/api/product/getdetail/:id", (req, res) => {
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ status: "ERR", message: "Product not found." });
  }
  res.json({ status: "OK", data: product });
});

// Create Product (Admin Only)
app.post("/api/product/create", requireAdmin, (req, res) => {
  const { name, description, price, stock, categoryId, brandId, discountPrice, images } = req.body;
  if (!name || !description || price === undefined || stock === undefined || !categoryId || !brandId) {
    return res.status(400).json({ status: "ERR", message: "Missing required product fields." });
  }

  const category = db.categories.find(c => c.id === categoryId);
  const brand = db.brands.find(b => b.id === brandId);
  if (!category || !brand) {
    return res.status(400).json({ status: "ERR", message: "Invalid Category or Brand ID specified." });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const imageList = Array.isArray(images)
    ? images.map((url, i) => ({ id: `img-${Date.now()}-${i}`, url }))
    : [{ id: `img-${Date.now()}`, url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400" }];

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name,
    slug,
    description,
    price: Number(price),
    discountPrice: discountPrice ? Number(discountPrice) : undefined,
    stock: Number(stock),
    sold: 0,
    categoryId,
    brandId,
    category,
    brand,
    images: imageList,
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.products.push(newProduct);
  res.json({ status: "OK", message: "Product created successfully", data: newProduct });
});

// Update Product (Admin Only)
app.put("/api/product/update/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, categoryId, brandId, discountPrice, images } = req.body;

  const productIndex = db.products.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ status: "ERR", message: "Product not found." });
  }

  const currentProduct = db.products[productIndex];
  const finalCategoryId = categoryId || currentProduct.categoryId;
  const finalBrandId = brandId || currentProduct.brandId;

  const category = db.categories.find(c => c.id === finalCategoryId);
  const brand = db.brands.find(b => b.id === finalBrandId);

  if (!category || !brand) {
    return res.status(400).json({ status: "ERR", message: "Invalid Category or Brand specified." });
  }

  const imageList = Array.isArray(images)
    ? images.map((url, i) => ({ id: `img-${Date.now()}-${i}`, url }))
    : currentProduct.images;

  const updatedProduct: Product = {
    ...currentProduct,
    name: name || currentProduct.name,
    slug: name ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : currentProduct.slug,
    description: description || currentProduct.description,
    price: price !== undefined ? Number(price) : currentProduct.price,
    discountPrice: discountPrice !== undefined ? (discountPrice ? Number(discountPrice) : undefined) : currentProduct.discountPrice,
    stock: stock !== undefined ? Number(stock) : currentProduct.stock,
    categoryId: finalCategoryId,
    brandId: finalBrandId,
    category,
    brand,
    images: imageList,
    updatedAt: new Date().toISOString()
  };

  db.products[productIndex] = updatedProduct;
  res.json({ status: "OK", message: "Product updated successfully", data: updatedProduct });
});

// Delete Product (Admin Only)
app.delete("/api/product/delete/:id", requireAdmin, (req, res) => {
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ status: "ERR", message: "Product not found." });
  }
  db.products.splice(index, 1);
  res.json({ status: "OK", message: "Product deleted successfully" });
});


// -------------------------------------------------------------
// CATEGORIES API ENDPOINTS (/api/category)
// -------------------------------------------------------------

app.get("/api/category/getall", (req, res) => {
  res.json({ status: "OK", data: db.categories });
});

app.get("/api/category/getCategory/:id", (req, res) => {
  const cat = db.categories.find(c => c.id === req.params.id);
  if (!cat) return res.status(404).json({ status: "ERR", message: "Category not found." });
  res.json({ status: "OK", data: cat });
});

app.post("/api/category/create", requireAdmin, (req, res) => {
  const { name, slug, image } = req.body;
  if (!name) return res.status(400).json({ status: "ERR", message: "Name is required." });
  const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name,
    slug: finalSlug,
    image: image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400"
  };
  db.categories.push(newCat);
  res.json({ status: "OK", message: "Category created successfully", data: newCat });
});

app.put("/api/category/update/:id", requireAdmin, (req, res) => {
  const cat = db.categories.find(c => c.id === req.params.id);
  if (!cat) return res.status(404).json({ status: "ERR", message: "Category not found." });
  cat.name = req.body.name || cat.name;
  cat.slug = req.body.slug || cat.slug;
  cat.image = req.body.image || cat.image;
  res.json({ status: "OK", message: "Category updated successfully", data: cat });
});

app.delete("/api/category/delete/:id", requireAdmin, (req, res) => {
  const idx = db.categories.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ status: "ERR", message: "Category not found." });
  db.categories.splice(idx, 1);
  res.json({ status: "OK", message: "Category deleted successfully" });
});


// -------------------------------------------------------------
// BRANDS API ENDPOINTS (/api/brand)
// -------------------------------------------------------------

app.get("/api/brand/getall", (req, res) => {
  res.json({ status: "OK", data: db.brands });
});

app.get("/api/brand/getdetail/:id", (req, res) => {
  const brand = db.brands.find(b => b.id === req.params.id);
  if (!brand) return res.status(404).json({ status: "ERR", message: "Brand not found." });
  res.json({ status: "OK", data: brand });
});

app.post("/api/brand/create", requireAdmin, (req, res) => {
  const { name, logo } = req.body;
  if (!name) return res.status(400).json({ status: "ERR", message: "Brand name is required." });
  const newBrand: Brand = {
    id: `brand-${Date.now()}`,
    name,
    logo: logo || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=150"
  };
  db.brands.push(newBrand);
  res.json({ status: "OK", message: "Brand created successfully", data: newBrand });
});

app.put("/api/brand/update/:id", requireAdmin, (req, res) => {
  const brand = db.brands.find(b => b.id === req.params.id);
  if (!brand) return res.status(404).json({ status: "ERR", message: "Brand not found." });
  brand.name = req.body.name || brand.name;
  brand.logo = req.body.logo || brand.logo;
  res.json({ status: "OK", message: "Brand updated successfully", data: brand });
});

app.delete("/api/brand/delete/:id", requireAdmin, (req, res) => {
  const idx = db.brands.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ status: "ERR", message: "Brand not found." });
  db.brands.splice(idx, 1);
  res.json({ status: "OK", message: "Brand deleted successfully." });
});


// -------------------------------------------------------------
// CART API ENDPOINTS (/api/cart)
// -------------------------------------------------------------

// Helper to initialize empty cart
const getOrCreateCart = (userId: string): Cart => {
  if (!db.carts[userId]) {
    db.carts[userId] = {
      id: `cart-${Date.now()}`,
      userId,
      items: []
    };
  }
  return db.carts[userId];
};

// Get Cart
app.get("/api/cart/get", requireAuth, (req, res) => {
  const user = (req as any).user;
  const cart = getOrCreateCart(user.id);
  res.json({ status: "OK", data: cart });
});

// Add to Cart
app.post("/api/cart/add", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res.status(400).json({ status: "ERR", message: "ProductId and quantity are required." });
  }

  const product = db.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ status: "ERR", message: "Product not found." });
  }

  const cart = getOrCreateCart(user.id);
  const existingItem = cart.items.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({
      id: `cartitem-${Date.now()}`,
      cartId: cart.id,
      productId,
      quantity: Number(quantity),
      product
    });
  }

  res.json({ status: "OK", message: "Added to cart successfully.", data: cart });
});

// Remove Cart Item by Item ID
app.delete("/api/cart/delete/:id", requireAuth, (req, res) => {
  const user = (req as any).user;
  const itemId = req.params.id;
  const cart = getOrCreateCart(user.id);

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(item => item.id !== itemId);

  if (cart.items.length === initialLength) {
    return res.status(404).json({ status: "ERR", message: "Cart item not found." });
  }

  res.json({ status: "OK", message: "Removed item from cart.", data: cart });
});

// Clear entire cart
app.delete("/api/cart/clear", requireAuth, (req, res) => {
  const user = (req as any).user;
  const cart = getOrCreateCart(user.id);
  cart.items = [];
  res.json({ status: "OK", message: "Cart cleared.", data: cart });
});


// -------------------------------------------------------------
// ORDERS API ENDPOINTS (/api/order)
// -------------------------------------------------------------

// Create Direct Order
app.post("/api/order/create", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { paymentMethod, shippingAddress, items } = req.body; // items: [{ productId, quantity }]

  if (!paymentMethod || !shippingAddress || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ status: "ERR", message: "Missing payment method, address, or order items." });
  }

  let totalPrice = 0;
  const orderItems: any[] = [];

  for (const item of items) {
    const product = db.products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(404).json({ status: "ERR", message: `Product ${item.productId} not found.` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ status: "ERR", message: `Product ${product.name} has only ${product.stock} items left in stock.` });
    }

    const price = product.discountPrice !== undefined ? product.discountPrice : product.price;
    const subtotal = price * item.quantity;
    totalPrice += subtotal;

    // Deduct stock and increment sold counter
    product.stock -= item.quantity;
    product.sold += item.quantity;

    orderItems.push({
      id: `orditem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId: product.id,
      quantity: item.quantity,
      price,
      product
    });
  }

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    userId: user.id,
    totalPrice,
    status: "PENDING",
    paymentMethod,
    shippingAddress,
    orderItems,
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder); // Add to head of orders list
  res.json({ status: "OK", message: "Order placed successfully!", data: newOrder });
});

// Create Order from Cart items
app.post("/api/order/createOrderFromCart", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { paymentMethod, shippingAddress } = req.body;

  if (!paymentMethod || !shippingAddress) {
    return res.status(400).json({ status: "ERR", message: "Payment method and shipping address are required." });
  }

  const cart = getOrCreateCart(user.id);
  if (cart.items.length === 0) {
    return res.status(400).json({ status: "ERR", message: "Your shopping cart is empty!" });
  }

  let totalPrice = 0;
  const orderItems: any[] = [];

  for (const cartItem of cart.items) {
    const product = db.products.find(p => p.id === cartItem.productId);
    if (!product) {
      return res.status(404).json({ status: "ERR", message: `Product ${cartItem.productId} not found.` });
    }
    if (product.stock < cartItem.quantity) {
      return res.status(400).json({ status: "ERR", message: `Sorry, ${product.name} only has ${product.stock} units remaining.` });
    }

    const price = product.discountPrice !== undefined ? product.discountPrice : product.price;
    totalPrice += price * cartItem.quantity;

    // Deduct stock and increment sold count
    product.stock -= cartItem.quantity;
    product.sold += cartItem.quantity;

    orderItems.push({
      id: `orditem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId: product.id,
      quantity: cartItem.quantity,
      price,
      product
    });
  }

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    userId: user.id,
    totalPrice,
    status: "PENDING",
    paymentMethod,
    shippingAddress,
    orderItems,
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  // Clear cart
  cart.items = [];

  res.json({ status: "OK", message: "Checkout order processed successfully!", data: newOrder });
});

// Get My Order
app.get("/api/order/getMyOrder", requireAuth, (req, res) => {
  const user = (req as any).user;
  const myOrders = db.orders.filter(ord => ord.userId === user.id);
  res.json({ status: "OK", data: myOrders });
});

// Get Order Detail
app.get("/api/order/getOrderById/:orderid", requireAuth, (req, res) => {
  const order = db.orders.find(ord => ord.id === req.params.orderid);
  if (!order) {
    return res.status(404).json({ status: "ERR", message: "Order not found." });
  }
  // Check auth boundaries: either owners or admins can see
  const user = (req as any).user;
  if (order.userId !== user.id && user.role !== "ADMIN") {
    return res.status(401).json({ status: "ERR", message: "Access denied to see this order." });
  }
  res.json({ status: "OK", data: order });
});

// Cancel Order
app.post("/api/order/cancleOrder/:orderid", requireAuth, (req, res) => {
  const order = db.orders.find(ord => ord.id === req.params.orderid);
  if (!order) {
    return res.status(404).json({ status: "ERR", message: "Order not found." });
  }

  const user = (req as any).user;
  if (order.userId !== user.id && user.role !== "ADMIN") {
    return res.status(401).json({ status: "ERR", message: "You can only cancel your own orders." });
  }

  if (order.status !== "PENDING" && order.status !== "PROCESSING") {
    return res.status(400).json({ status: "ERR", message: `Cannot cancel an order in ${order.status} state.` });
  }

  // Restore inventory stock
  for (const item of order.orderItems) {
    const product = db.products.find(p => p.id === item.productId);
    if (product) {
      product.stock += item.quantity;
      product.sold = Math.max(0, product.sold - item.quantity);
    }
  }

  order.status = "CANCELLED";
  res.json({ status: "OK", message: "Order successfully cancelled.", data: order });
});

// Get All Orders (Admin Only)
app.get("/api/order/getAll", requireAdmin, (req, res) => {
  res.json({ status: "OK", data: db.orders });
});

// Update Order Status (Admin Only)
app.put("/api/order/update/:orderid", requireAdmin, (req, res) => {
  const order = db.orders.find(ord => ord.id === req.params.orderid);
  if (!order) {
    return res.status(404).json({ status: "ERR", message: "Order not found." });
  }
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ status: "ERR", message: "Please specify active status string." });
  }

  order.status = status as OrderStatus;
  res.json({ status: "OK", message: `Order status upgraded to ${status}`, data: order });
});


// -------------------------------------------------------------
// WISHLIST API ENDPOINTS (/api/wishlist)
// -------------------------------------------------------------

// Initialise Wishlist
const getOrCreateWishlist = (userId: string): Wishlist[] => {
  if (!db.wishlists[userId]) {
    db.wishlists[userId] = [];
  }
  return db.wishlists[userId];
};

// Get wishlist
app.get("/api/wishlist/getWishList", requireAuth, (req, res) => {
  const user = (req as any).user;
  const list = getOrCreateWishlist(user.id);
  res.json({ status: "OK", data: list });
});

// Add to Wishlist
app.post("/api/wishlist/create/:id", requireAuth, (req, res) => {
  const user = (req as any).user;
  const productId = req.params.id;

  const product = db.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ status: "ERR", message: "Product not found." });
  }

  const list = getOrCreateWishlist(user.id);
  if (list.some(wl => wl.productId === productId)) {
    return res.status(400).json({ status: "ERR", message: "Product is already in wishlist." });
  }

  const newWL: Wishlist = {
    id: `wl-${Date.now()}`,
    userId: user.id,
    productId,
    product
  };
  list.push(newWL);

  res.json({ status: "OK", message: "Added to wishlist.", data: list });
});

// Delete from Wishlist
app.delete("/api/wishlist/delete/:id", requireAuth, (req, res) => {
  const user = (req as any).user;
  const wlId = req.params.id; // Usually represents wishlist entry ID or product ID
  const list = getOrCreateWishlist(user.id);

  // Filter out matching entry
  const initialLength = list.length;
  db.wishlists[user.id] = list.filter(wl => wl.id !== wlId && wl.productId !== wlId);

  if (db.wishlists[user.id].length === initialLength) {
    return res.status(404).json({ status: "ERR", message: "Item not found in wishlist." });
  }

  res.json({ status: "OK", message: "Removed from wishlist.", data: db.wishlists[user.id] });
});


// -------------------------------------------------------------
// ADDRESSES API ENDPOINTS (/api/information)
// -------------------------------------------------------------

const getOrCreateAddresses = (userId: string): Address[] => {
  if (!db.addresses[userId]) {
    db.addresses[userId] = [];
  }
  return db.addresses[userId];
};

app.post("/api/information/create", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { fullName, phone, city, district, ward, detail } = req.body;
  if (!fullName || !phone || !city || !district || !ward || !detail) {
    return res.status(400).json({ status: "ERR", message: "Missing address fields." });
  }

  const list = getOrCreateAddresses(user.id);
  const newAddr: Address = {
    id: `addr-${Date.now()}`,
    fullName,
    phone,
    city,
    district,
    ward,
    detail
  };
  list.push(newAddr);
  res.json({ status: "OK", message: "Address saved successfully.", data: newAddr });
});

app.get("/api/information/getall", requireAuth, (req, res) => {
  const user = (req as any).user;
  const list = getOrCreateAddresses(user.id);
  res.json({ status: "OK", data: list });
});

app.get("/api/information/getById/:id", requireAuth, (req, res) => {
  const user = (req as any).user;
  const list = getOrCreateAddresses(user.id);
  const addr = list.find(a => a.id === req.params.id);
  if (!addr) {
    return res.status(404).json({ status: "ERR", message: "Address record not found." });
  }
  res.json({ status: "OK", data: addr });
});

app.put("/api/information/update/:id", requireAuth, (req, res) => {
  const user = (req as any).user;
  const list = getOrCreateAddresses(user.id);
  const index = list.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ status: "ERR", message: "Address not found." });
  }

  const { fullName, phone, city, district, ward, detail } = req.body;
  list[index] = {
    ...list[index],
    fullName: fullName || list[index].fullName,
    phone: phone || list[index].phone,
    city: city || list[index].city,
    district: district || list[index].district,
    ward: ward || list[index].ward,
    detail: detail || list[index].detail
  };

  res.json({ status: "OK", message: "Address upgraded.", data: list[index] });
});

app.delete("/api/information/delete/:id", requireAuth, (req, res) => {
  const user = (req as any).user;
  const list = getOrCreateAddresses(user.id);
  const index = list.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ status: "ERR", message: "Address not found." });
  }
  list.splice(index, 1);
  res.json({ status: "OK", message: "Address deleted successfully." });
});


// -------------------------------------------------------------
// REVIEWS API ENDPOINTS (/api/review)
// -------------------------------------------------------------

// Get Product Reviews
app.get("/api/review/getReview/:productId", (req, res) => {
  const reviews = db.reviews.filter(r => r.productId === req.params.productId);
  res.json({ status: "OK", data: reviews });
});

// Create Review (User Auth required)
app.post("/api/review/create/:productId", requireAuth, (req, res) => {
  const { productId } = req.params;
  const user = (req as any).user;
  const { rating, comment } = req.body;

  if (rating === undefined || !comment) {
    return res.status(400).json({ status: "ERR", message: "Comment message and rating out of 5 stars required." });
  }

  const product = db.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ status: "ERR", message: "Product not found." });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    rating: Number(rating),
    comment,
    userId: user.id,
    productId,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt
    },
    createdAt: new Date().toISOString()
  };

  db.reviews.push(newReview);

  // Synchronise reviews in product list
  product.reviews = db.reviews.filter(r => r.productId === product.id);

  res.json({ status: "OK", message: "Review posted successfully!", data: newReview });
});

// Update Review
app.put("/api/review/update/:id", requireAuth, (req, res) => {
  const review = db.reviews.find(r => r.id === req.params.id);
  if (!review) {
    return res.status(404).json({ status: "ERR", message: "Review not found." });
  }

  const user = (req as any).user;
  if (review.userId !== user.id && user.role !== "ADMIN") {
    return res.status(401).json({ status: "ERR", message: "Unauthorized update of review." });
  }

  review.rating = req.body.rating !== undefined ? Number(req.body.rating) : review.rating;
  review.comment = req.body.comment || review.comment;

  // Sync to back product reviews
  const prod = db.products.find(p => p.id === review.productId);
  if (prod) {
    prod.reviews = db.reviews.filter(r => r.productId === prod.id);
  }

  res.json({ status: "OK", message: "Review edited.", data: review });
});

// Delete Review
app.delete("/api/review/delete/:id", requireAuth, (req, res) => {
  const idx = db.reviews.findIndex(r => r.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ status: "ERR", message: "Review not found." });
  }

  const user = (req as any).user;
  const review = db.reviews[idx];
  if (review.userId !== user.id && user.role !== "ADMIN") {
    return res.status(401).json({ status: "ERR", message: "Access forbidden." });
  }

  db.reviews.splice(idx, 1);

  // Sync to back product reviews
  const prod = db.products.find(p => p.id === review.productId);
  if (prod) {
    prod.reviews = db.reviews.filter(r => r.productId === prod.id);
  }

  res.json({ status: "OK", message: "Review deleted successfully." });
});


// -------------------------------------------------------------
// VITE AND SERVING PIPELINES
// -------------------------------------------------------------

async function initializeApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started running on http://localhost:${PORT}`);
  });
}

initializeApp().catch(err => {
  console.error("Failed to start app server:", err);
});
