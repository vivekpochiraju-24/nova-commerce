import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Store, Mail, Phone, MapPin, Twitter, Instagram, Facebook } from 'lucide-react';
import NeonButton from './ui/NeonButton';

const Footer: React.FC = () => {
  const footerLinks = {
    Shop: [
      { name: 'All Products', href: '/products' },
      { name: 'New Arrivals', href: '/products' },
      { name: 'Best Sellers', href: '/products' },
      { name: 'Deals', href: '/products' },
    ],
    Support: [
      { name: 'Help Center', href: '#' },
      { name: 'Track Order', href: '#' },
      { name: 'Returns', href: '#' },
      { name: 'Shipping Info', href: '#' },
    ],
    Company: [
      { name: 'About Us', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Facebook, href: '#' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-primary-foreground/70">
                Get updates on new products and exclusive deals.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-neon-cyan outline-none transition-all placeholder:text-primary-foreground/50 text-primary-foreground min-w-[280px]"
              />
              <NeonButton variant="secondary" size="md">
                Subscribe
              </NeonButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/">
              <motion.div className="flex items-center gap-2 mb-4" whileHover={{ scale: 1.05 }}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">
                  VEB<span className="text-neon-cyan"> Store</span>
                </span>
              </motion.div>
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-xs">
              Your trusted destination for premium electronics and accessories in India.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="w-4 h-4 text-neon-cyan" />
                support@vebstore.in
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="w-4 h-4 text-neon-cyan" />
                +91 98765 43210
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4 text-neon-cyan" />
                Hyderabad, India
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href}>
                      <motion.span
                        className="text-sm text-primary-foreground/70 hover:text-neon-cyan transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        {link.name}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/70">
              © 2024 VEB Store. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
