// ============================================
// data.js — Structured data for Acumen Watches
// - Collections
// - Products
// - Blog posts
// - Contact and social information
// ============================================

(function () {
  'use strict';

  const collections = [
    {
      id: "heritage",
      name: "Heritage Collection",
      description: "Timeless craftsmanship inspired by classic watchmaking traditions.",
      heroImage: "assets/images/collections/heritage-hero.jpg"
    },
    {
      id: "avantgarde",
      name: "Avant-Garde Collection",
      description: "Bold, modern aesthetics meet cutting-edge engineering.",
      heroImage: "assets/images/collections/avant-hero.jpg"
    },
    {
      id: "limited",
      name: "Limited Edition",
      description: "Exclusive timepieces crafted for collectors who value rarity.",
      heroImage: "assets/images/collections/limited-hero.jpg"
    },
    {
      id: "titanium",
      name: "Titanium Series",
      description: "Feather-light strength and durability for the modern adventurer.",
      heroImage: "assets/images/collections/titanium-hero.jpg"
    }
  ];

  const products = [
    {
      id: "axion01",
      name: "Axion Heritage Chronometer",
      collection: "heritage",
      price: 8999,
      currency: "USD",
      shortDesc: "Classic mechanical chronometer encased in rose gold.",
      longDesc: "The Axion Heritage Chronometer is an homage to traditional Swiss artistry. With its 41mm rose gold case, sapphire crystal back, and hand-wound movement, it blends timeless design with modern precision.",
      specs: {
        movement: "Hand-wound mechanical",
        waterResistance: "50m / 165ft",
        materials: "18k Rose Gold, Sapphire Crystal",
        strap: "Genuine alligator leather",
        warranty: "5 years international"
      },
      images: [
        "assets/images/products/axion01-front.jpg",
        "assets/images/products/axion01-side.jpg",
        "assets/images/products/axion01-back.jpg"
      ],
      sku: "ACM-HR-AX01"
    },
    {
      id: "nova02",
      name: "Nova Titanium Sport",
      collection: "titanium",
      price: 7499,
      currency: "USD",
      shortDesc: "Lightweight, rugged, and relentlessly precise.",
      longDesc: "The Nova Titanium Sport redefines resilience with a brushed titanium case, ceramic bezel, and automatic movement. Designed for performance and precision, this watch embodies understated strength.",
      specs: {
        movement: "Automatic self-winding",
        waterResistance: "200m / 660ft",
        materials: "Titanium, Ceramic, Sapphire Crystal",
        strap: "High-density rubber",
        warranty: "5 years international"
      },
      images: [
        "assets/images/products/nova02-front.jpg",
        "assets/images/products/nova02-lume.jpg",
        "assets/images/products/nova02-back.jpg"
      ],
      sku: "ACM-TI-NV02"
    },
    {
      id: "zenith03",
      name: "Zenith Avant-Garde Automatic",
      collection: "avantgarde",
      price: 10999,
      currency: "USD",
      shortDesc: "A fusion of architecture and horology in motion.",
      longDesc: "With an open skeleton dial revealing the heartbeat of its automatic movement, the Zenith Avant-Garde captures futuristic beauty. Carbon fiber bezel, luminous markers, and anti-reflective crystal complete the bold aesthetic.",
      specs: {
        movement: "Automatic skeleton",
        waterResistance: "100m / 330ft",
        materials: "Carbon Fiber, Sapphire Crystal",
        strap: "Stainless steel integrated bracelet",
        warranty: "7 years international"
      },
      images: [
        "assets/images/products/zenith03-front.jpg",
        "assets/images/products/zenith03-detail.jpg",
        "assets/images/products/zenith03-macro.jpg"
      ],
      sku: "ACM-AV-ZN03"
    },
    {
      id: "imperial04",
      name: "Imperial Midnight Tourbillon",
      collection: "limited",
      price: 24999,
      currency: "USD",
      shortDesc: "An exclusive masterpiece for true connoisseurs.",
      longDesc: "The Imperial Midnight Tourbillon embodies prestige. Crafted from platinum, it features a tourbillon complication visible through an anti-reflective crystal dome. Only 50 pieces worldwide.",
      specs: {
        movement: "Tourbillon hand-wound",
        waterResistance: "30m / 100ft",
        materials: "Platinum, Sapphire Crystal",
        strap: "Midnight blue alligator leather",
        warranty: "Lifetime limited"
      },
      images: [
        "assets/images/products/imperial04-front.jpg",
        "assets/images/products/imperial04-back.jpg",
        "assets/images/products/imperial04-detail.jpg"
      ],
      sku: "ACM-LD-IM04"
    }
  ];

  const blogPosts = [
    {
      id: "craftsmanship-evolution",
      title: "The Evolution of Modern Craftsmanship",
      excerpt: "Discover how traditional artistry meets technology in today’s watchmaking industry.",
      date: "2025-07-22",
      image: "assets/images/blog/craftsmanship.jpg",
      author: "Liam Archer",
      readTime: "6 min",
      tags: ["craftsmanship", "design", "innovation"]
    },
    {
      id: "material-science",
      title: "Material Science Behind Titanium Watches",
      excerpt: "A deep dive into the advanced alloys that redefine durability and luxury.",
      date: "2025-08-15",
      image: "assets/images/blog/materials.jpg",
      author: "Sophia Laurent",
      readTime: "5 min",
      tags: ["titanium", "engineering", "performance"]
    },
    {
      id: "collectors-guide",
      title: "Collector’s Guide to Limited Editions",
      excerpt: "How to identify value, rarity, and timeless appeal in collectible watches.",
      date: "2025-09-09",
      image: "assets/images/blog/collectors.jpg",
      author: "Ethan Cole",
      readTime: "8 min",
      tags: ["collecting", "luxury", "limited-edition"]
    }
  ];

  const socialLinks = {
    instagram: "https://www.instagram.com/acumenwatches",
    facebook: "https://www.facebook.com/acumenwatches",
    twitter: "https://x.com/acumenwatches",
    linkedin: "https://linkedin.com/company/acumenwatches",
    youtube: "https://www.youtube.com/@acumenwatches"
  };

  const contactInfo = {
    email: "support@acumenwatches.com",
    phone: "+1 (800) 888-2025",
    address: "Rue du Rhône 52, 1204 Genève, Switzerland"
  };

  // Global export for site-wide use
  window.Acumen = window.Acumen || {};
  window.Acumen.data = {
    collections,
    products,
    blogPosts,
    socialLinks,
    contactInfo
  };

})();
