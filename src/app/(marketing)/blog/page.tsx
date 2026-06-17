"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

const BLOG_POSTS = [
  {
    id: 1,
    title: "Mastering the Canton Fair: A Complete Guide for First-Time Importers",
    category: "Trade Fairs",
    date: "May 12, 2026",
    readTime: "6 min read",
    excerpt: "Everything you need to know about navigating China's largest trade exhibition, negotiating direct with manufacturers on the spot, and managing logistics.",
    accent: "bg-red-500/10 text-red-600 border-red-500/20"
  },
  {
    id: 2,
    title: "Avoiding Supplier Scams: How We Conduct On-Ground Factory Audits",
    category: "Sourcing Intelligence",
    date: "April 28, 2026",
    readTime: "8 min read",
    excerpt: "Learn the exact 5-step physical verification check we run on manufacturing units in Chongqing and Zhejiang to guarantee compliance and quality output.",
    accent: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
  },
  {
    id: 3,
    title: "Navigating the Chongqing Automotive & High-Tech Export Sector",
    category: "Market Insights",
    date: "March 15, 2026",
    readTime: "5 min read",
    excerpt: "Chongqing has emerged as the world's largest automotive and electronics manufacturing hub. Discover how to connect with top-tier verified Liangjiang suppliers.",
    accent: "bg-amber-500/10 text-amber-600 border-amber-500/20"
  }
];

export default function BlogPage() {
  return (
    <div className="pt-24 md:pt-28 pb-12 md:pb-16 min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="px-3 py-1 border-primary/20 text-primary bg-primary/5">
            Resource Center
          </Badge>
          <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight mt-4 mb-3">
            Sourcing & Trade <span className="text-primary">Blog</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Latest trends, physical market field guides, and manufacturing insights curated by the SAILX global sourcing team.
          </p>
        </div>

        {/* Featured Post Card */}
        <div className="mb-12 rounded-3xl border border-primary/10 overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="grid lg:grid-cols-2">
            <div className="p-6 md:p-10 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary text-primary-foreground">FEATURED ARTICLE</Badge>
                <span className="text-xs text-muted-foreground">May 2026 Edition</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                How to Successfully Import Industrial Machinery from China to India
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                From validating international machinery standards (CE, ISO) and navigating custom duties, to supervised container loading and door-to-door logistics management. This playbook covers it all.
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>May 25, 2026</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>10 min read</span>
                </div>
              </div>
              <div className="pt-2">
                <Button asChild className="rounded-xl bg-primary hover:bg-primary/90">
                  <Link href="#featured" className="flex items-center gap-2">
                    Read Featured Article <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="bg-primary/5 min-h-[250px] lg:min-h-full flex items-center justify-center p-8 border-t lg:border-t-0 lg:border-l border-primary/10">
              <div className="text-center space-y-3 max-w-sm">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-sm">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg">Downloadable PDF Version</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Want to read this offline? Log in to your buyer dashboard to download our step-by-step industrial import booklets completely free.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <Card key={post.id} className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-300 border-primary/10 bg-card rounded-2xl">
              <div className="space-y-4">
                <Badge variant="outline" className={`px-2.5 py-0.5 font-semibold text-xs border ${post.accent}`}>
                  {post.category}
                </Badge>
                
                <h3 className="font-bold text-lg leading-snug text-foreground hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-border/50 mt-6">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <Button variant="ghost" className="w-full text-primary hover:text-primary/90 hover:bg-primary/5 p-0 justify-between group rounded-lg text-sm font-semibold">
                  Read Full Article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
