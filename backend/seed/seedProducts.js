import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

dotenv.config();
connectDB();

const products = [
  { name: "Wireless Noise-Cancelling Headphones", description: "Over-ear headphones with active noise cancellation and 30-hour battery life.", image: "https://picsum.photos/seed/headphones/500/500", category: "Electronics", brand: "SoundCore", price: 89.99, countInStock: 25 },
  { name: "Mechanical Keyboard", description: "RGB backlit mechanical keyboard with hot-swappable switches.", image: "https://picsum.photos/seed/keyboard/500/500", category: "Electronics", brand: "KeyTech", price: 59.99, countInStock: 40 },
  { name: "Stainless Steel Water Bottle", description: "Insulated 32oz water bottle, keeps drinks cold for 24 hours.", image: "https://picsum.photos/seed/bottle/500/500", category: "Home", brand: "HydroLife", price: 19.99, countInStock: 100 },
  { name: "Yoga Mat", description: "Extra-thick non-slip yoga mat with carrying strap.", image: "https://picsum.photos/seed/yoga/500/500", category: "Sports", brand: "FlexFit", price: 24.99, countInStock: 60 },
  { name: "Espresso Machine", description: "15-bar pump espresso machine with milk frother.", image: "https://picsum.photos/seed/espresso/500/500", category: "Home", brand: "BrewMaster", price: 149.99, countInStock: 15 },
  { name: "Running Shoes", description: "Lightweight breathable running shoes with cushioned sole.", image: "https://picsum.photos/seed/shoes/500/500", category: "Fashion", brand: "StrideOn", price: 74.99, countInStock: 50 },
  { name: "4K Action Camera", description: "Waterproof action camera with image stabilization.", image: "https://picsum.photos/seed/camera/500/500", category: "Electronics", brand: "ViewPro", price: 129.99, countInStock: 20 },
  { name: "Backpack", description: "Water-resistant laptop backpack with USB charging port.", image: "https://picsum.photos/seed/backpack/500/500", category: "Fashion", brand: "TrailPack", price: 44.99, countInStock: 70 },
  { name: "Smart Watch", description: "Fitness tracking smartwatch with heart-rate monitor.", image: "https://picsum.photos/seed/watch/500/500", category: "Electronics", brand: "PulseTech", price: 99.99, countInStock: 35 },
  { name: "Non-Stick Cookware Set", description: "10-piece non-stick cookware set, dishwasher safe.", image: "https://picsum.photos/seed/cookware/500/500", category: "Home", brand: "ChefLine", price: 89.99, countInStock: 18 },
  { name: "Desk Lamp", description: "LED desk lamp with adjustable brightness and USB port.", image: "https://picsum.photos/seed/lamp/500/500", category: "Home", brand: "BrightSpot", price: 27.99, countInStock: 45 },
  { name: "Bluetooth Speaker", description: "Portable waterproof speaker with 12-hour playtime.", image: "https://picsum.photos/seed/speaker/500/500", category: "Electronics", brand: "SoundCore", price: 39.99, countInStock: 55 },
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);

    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (!adminExists) {
      await User.create({
        name: "Admin",
        email: "admin@example.com",
        password: "admin123",
        isAdmin: true,
      });
      console.log("Admin user created: admin@example.com / admin123");
    }

    console.log("Data imported!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
