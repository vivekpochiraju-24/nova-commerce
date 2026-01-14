import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AIRecommendations from '@/components/AIRecommendations';
import TrendingProducts from '@/components/TrendingProducts';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import AIChatbot from '@/components/AIChatbot';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <AIRecommendations />
        <TrendingProducts />
        <Features />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Index;
