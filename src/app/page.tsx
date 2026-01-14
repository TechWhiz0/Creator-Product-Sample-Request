"use client";

import { useState } from "react";
import { ProductCard, Product } from "@/components/ProductCard";
import { RequestForm } from "@/components/RequestForm";
import {
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const PRODUCTS: Product[] = [
  {
    id: "PROD-001",
    name: "Eco-Friendly Yoga Mat",
    description: "Premium biodegradable yoga mat with superior grip and cushioning for your daily practice.",
    image: "https://images.unsplash.com/photo-1592432676556-224451baac49?auto=format&fit=crop&q=80&w=800",
    category: "Wellness",
  },
  {
    id: "PROD-002",
    name: "Pro Noise-Cancelling Headphones",
    description: "Immersive sound quality with advanced active noise cancellation for creators on the go.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    category: "Electronics",
  },
  {
    id: "PROD-003",
    name: "Minimalist Leather Backpack",
    description: "Handcrafted from full-grain leather, designed for both style and functionality in the city.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
    category: "Fashion",
  },
  {
    id: "PROD-004",
    name: "Smart Hydration Bottle",
    description: "Tracks your water intake and syncs with your phone to keep you hydrated all day.",
    image: "https://images.unsplash.com/photo-1602143352538-2a155030807b?auto=format&fit=crop&q=80&w=800",
    category: "Lifestyle",
  },
  {
    id: "PROD-005",
    name: "Organic Coffee Blend",
    description: "Ethically sourced beans from high-altitude farms, roasted to perfection for a rich flavor.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800",
    category: "Food & Drink",
  },
  {
    id: "PROD-006",
    name: "Portable LED Ring Light",
    description: "Perfect lighting for content creators, featuring adjustable brightness and color temperature.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800",
    category: "Content Creation",
  },
];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const scrollToSamples = () => {
    const el = document.getElementById("samples");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col gap-16 py-12 pb-0">
      {/* Hero Section */}
      <section className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl grid gap-10 lg:grid-cols-[1.2fr,1fr] items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-accent">
              <Star className="h-4 w-4" />
              <span>Built for modern creators & brands</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary">
              Get samples.
              <br className="hidden sm:block" />
              <span className="text-accent"> Launch content. </span>
              Grow together.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              SampleFlow connects creators with brands in one simple workflow—request products,
              get approved, and start creating content in days, not weeks.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <button
                onClick={scrollToSamples}
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground shadow-md hover:bg-accent/90 transition-colors"
              >
                Browse available samples
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span>No fees. No long forms.</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                <span>Trusted by creators</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span>Designed for quick brand approvals</span>
            </div>
          </div>

          {/* Right hero card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 via-transparent to-primary/10 blur-3xl" />
            <div className="relative rounded-3xl border bg-background/80 backdrop-blur-sm shadow-xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Live Activity
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
                  Sample requests today
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
                  <div className="flex flex-col">
                    <span className="font-semibold">Eco-Friendly Yoga Mat</span>
                    <span className="text-[11px] text-muted-foreground">Creator • Wellness</span>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-[11px] font-medium">
                    Pending
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
                  <div className="flex flex-col">
                    <span className="font-semibold">LED Ring Light</span>
                    <span className="text-[11px] text-muted-foreground">Creator • Content</span>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-[11px] font-medium">
                    Approved
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
                  <div className="flex flex-col">
                    <span className="font-semibold">Noise-Cancelling Headphones</span>
                    <span className="text-[11px] text-muted-foreground">Creator • Tech</span>
                  </div>
                  <span className="rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-[11px] font-medium">
                    In Review
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Approvals sync automatically with the brand dashboard and tracking pages.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: ShoppingBag, title: "Premium Products", desc: "Access high-quality products from top-tier brands." },
              { icon: TrendingUp, title: "Boost Engagement", desc: "Authentic reviews and content lead to higher engagement." },
              { icon: Star, title: "Verified Creators", desc: "Join an exclusive community of professional content creators." },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Section 1: Trusted by brands & creators */}
      <section className="container mx-auto px-4">
        <div className="rounded-3xl border bg-background/80 px-6 py-8 sm:px-10 sm:py-10 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
                Trusted by
              </p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Creators and brands across categories
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                From wellness to electronics, SampleFlow powers fast, transparent collaboration
                between brands and the creators who love them.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-muted-foreground">
              {["GlowCo", "UrbanBrew", "NovaTech", "PureForm", "StudioLight", "PeakFit"].map(
                (name) => (
                  <div
                    key={name}
                    className="rounded-full border bg-muted px-3 py-2 text-center font-medium"
                  >
                    {name}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* New Section 2: How it works */}
      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">How SampleFlow works</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            A streamlined path from discovering products to publishing content—built for both sides
            of the partnership.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Browse samples",
              desc: "Creators discover products they genuinely want to feature in their content.",
            },
            {
              step: "2",
              title: "Request & approve",
              desc: "Submit a short request; brands review and approve from a single dashboard.",
            },
            {
              step: "3",
              title: "Ship & track",
              desc: "Samples are shipped with built-in status pages so everyone stays aligned.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative overflow-hidden rounded-2xl border bg-background/80 p-5 shadow-sm"
            >
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-accent/10" />
              <div className="relative space-y-3">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Section 3: For creators & brands */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border bg-background/80 p-6 sm:p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
              For creators
            </p>
            <h3 className="text-xl font-bold mb-4">Turn product collaborations into content quickly</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" />
                <span>Request products with a few clicks—no spreadsheets or email threads.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" />
                <span>Track every request with a dedicated status page and timeline.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" />
                <span>Build long-term relationships with brands you actually love.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border bg-background/80 p-6 sm:p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2">
              For brands
            </p>
            <h3 className="text-xl font-bold mb-4">Operational clarity for every sample you send</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" />
                <span>Review, approve, or reject creator requests from a single dashboard.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" />
                <span>Track shipping progress and keep creators updated automatically.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-accent" />
                <span>See which products and creators drive the best results over time.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="samples" className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Available Samples</h2>
          <div className="flex gap-2">
            {["All", "Wellness", "Fashion", "Tech"].map((tag) => (
              <button key={tag} className="px-4 py-2 text-sm font-medium rounded-full border hover:bg-muted transition-colors">
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onSelect={handleSelectProduct} 
            />
          ))}
        </div>
      </section>

      {/* Request Form Dialog */}
      <RequestForm 
        product={selectedProduct} 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
      
      {/* Footer */}
      <footer className="border-t pt-8 pb-6 mt-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2024 SampleFlow. All rights reserved. Built for creators and brands.
          </p>
        </div>
      </footer>
    </div>
  );
}
