
"use client";

import Link from "next/link";
import Image from "next/image";
import { Music, ShoppingBag, Image as ImageIcon, ArrowRight, Star, Users, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AnimatedCounter } from "@/components/animated-counter";

export default function HomePage() {
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const features = [
    {
      icon: ImageIcon,
      title: "Exclusive Gallery",
      description: "Behind-the-scenes photos, music videos, and personal moments from Helena's journey",
      href: "/gallery",
    },
    {
      icon: ShoppingBag,
      title: "Official Merch",
      description: "Shop exclusive merchandise including apparel, music, and collectibles",
      href: "/merch",
    },
    {
      icon: Music,
      title: "Latest Music",
      description: "Stream and purchase Helena's latest albums, singles, and limited editions",
      href: "/merch",
    },
  ];

  const stats = [
    { label: "Albums Released", value: 5, suffix: "+" },
    { label: "Concert Shows", value: 250, suffix: "+" },
    { label: "Fans Worldwide", value: 2, suffix: "M+" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
        <Image
          src="https://image.pbs.org/video-assets/uoyPljE-asset-mezzanine-16x9-TebWDq7.jpg?format=webp&resize=1440x810"
          alt="Helena performing live"
          fill
          priority
          className="object-cover"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 flex h-full items-center justify-center px-4"
        >
          <div className="text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-4 text-5xl md:text-7xl font-bold"
            >
              HELENA
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-8 text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto"
            >
              Chart-topping pop sensation bringing energy and emotion to stages worldwide
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/merch"
                className="group inline-flex items-center space-x-2 rounded-full bg-pink-500 px-8 py-4 text-lg font-medium text-white transition-all hover:bg-pink-600 hover:shadow-xl"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Shop Now</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center space-x-2 rounded-full bg-white/20 backdrop-blur-md px-8 py-4 text-lg font-medium text-white transition-all hover:bg-white/30"
              >
                <ImageIcon className="h-5 w-5" />
                <span>View Gallery</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="bg-gradient-to-br from-pink-50 to-purple-50 py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Helena's World
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dive into exclusive content, shop official merchandise, and stay connected with the latest updates
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <Link href={feature.href}>
                    <div className="group h-full rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 p-8 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="mb-4 inline-flex rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-3">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="mb-3 text-xl font-bold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                      <div className="flex items-center text-pink-500 font-medium group-hover:text-pink-600">
                        <span>Explore</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-16">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Star className="h-12 w-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join the Helena Community
            </h2>
            <p className="text-lg text-pink-100 mb-8 max-w-2xl mx-auto">
              Be the first to know about new music releases, tour dates, and exclusive merchandise drops
            </p>
            <Link
              href="/merch"
              className="inline-flex items-center space-x-2 rounded-full bg-white px-8 py-4 text-lg font-medium text-pink-500 transition-all hover:shadow-xl hover:scale-105"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Shop Exclusive Merch</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
