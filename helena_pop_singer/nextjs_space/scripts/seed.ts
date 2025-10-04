
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create admin users
  const hashedPassword1 = await bcrypt.hash('johndoe123', 10);
  const hashedPassword2 = await bcrypt.hash('admin123', 10);

  const adminUser1 = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: hashedPassword1,
      fullName: 'John Doe',
      isAdmin: true,
    },
  });

  const adminUser2 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword2,
      fullName: 'Admin User',
      isAdmin: true,
    },
  });

  console.log('Admin users created:', adminUser1.email, adminUser2.email);

  // Create products
  const products = [
    {
      name: 'Helena Tour T-Shirt',
      description: 'Official Helena World Tour 2025 t-shirt in premium cotton. Features bold tour branding with vibrant gradient colors and tour dates. Available in all sizes.',
      price: 29.99,
      imageUrl: 'https://cdn.abacus.ai/images/6f7cc80f-9689-4be3-bfb2-3bcee7f0df29.png',
      category: 'Apparel',
      inventory: 50,
    },
    {
      name: 'Signed Album CD',
      description: 'Helena\'s latest album on CD, personally signed by the artist. Includes exclusive bonus tracks and a collectible booklet with behind-the-scenes photos.',
      price: 24.99,
      imageUrl: 'https://cdn.abacus.ai/images/fa16ec2f-9898-4acf-b47d-266ebe81c319.png',
      category: 'Music',
      inventory: 30,
    },
    {
      name: 'Concert Poster',
      description: 'Limited edition concert poster featuring vibrant artwork and tour information. Perfect for framing and displaying your love for Helena\'s music.',
      price: 19.99,
      imageUrl: 'https://cdn.abacus.ai/images/456e2434-69b3-4886-add4-3ce2eac7e4dc.png',
      category: 'Collectibles',
      inventory: 100,
    },
    {
      name: 'Helena Logo Hoodie',
      description: 'Cozy pullover hoodie in premium fabric with embroidered Helena logo. Perfect for concerts or everyday wear. Ultra-soft and comfortable.',
      price: 49.99,
      imageUrl: 'https://cdn.abacus.ai/images/5f606f44-448d-4ff8-8d1a-8214482ffb58.png',
      category: 'Apparel',
      inventory: 40,
    },
    {
      name: 'Vinyl Record',
      description: 'Helena\'s album on premium 180g vinyl with stunning album artwork. Includes a digital download card. A must-have for collectors and audiophiles.',
      price: 34.99,
      imageUrl: 'https://cdn.abacus.ai/images/f16d0057-4892-4190-afbb-82e0513d7d0d.png',
      category: 'Music',
      inventory: 25,
    },
    {
      name: 'Phone Case',
      description: 'Protect your phone in style with this Helena-branded case featuring artistic watercolor design. Compatible with multiple phone models.',
      price: 14.99,
      imageUrl: 'https://cdn.abacus.ai/images/967bdaf6-7099-49af-8819-68ef377473f5.png',
      category: 'Accessories',
      inventory: 75,
    },
    {
      name: 'Tote Bag',
      description: 'Eco-friendly canvas tote bag with minimalist Helena logo. Perfect for shopping, beach trips, or carrying your daily essentials.',
      price: 16.99,
      imageUrl: 'https://cdn.abacus.ai/images/557e88f8-3ce4-4370-94d2-002ce3e9d2d8.png',
      category: 'Accessories',
      inventory: 60,
    },
    {
      name: 'Baseball Cap',
      description: 'Trendy baseball cap with embroidered Helena logo. Adjustable strap for perfect fit. Shield yourself from the sun in style.',
      price: 22.99,
      imageUrl: 'https://cdn.abacus.ai/images/5aea82d3-cf0a-4914-b4b1-9babbecf7f20.png',
      category: 'Accessories',
      inventory: 45,
    },
  ];

  // Delete existing products first (for clean seeding)
  await prisma.product.deleteMany({});
  
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Products created:', products.length);

  // Create gallery items
  const galleryItems = [
    {
      title: 'World Tour Announcement',
      description: 'Helena announces her highly anticipated world tour with stops in 50+ cities across the globe!',
      imageUrl: 'https://cdn.abacus.ai/images/1f460741-fd68-4639-a2ea-88c17835acc0.png',
      type: 'image',
      published: true,
    },
    {
      title: 'Behind The Scenes',
      description: 'Exclusive behind-the-scenes footage from the making of Helena\'s latest music video. See the creative process unfold!',
      imageUrl: 'https://cdn.abacus.ai/images/734a9b78-c5b2-4856-b9f7-fe86077987b7.png',
      type: 'image',
      published: true,
    },
    {
      title: 'Fan Meet & Greet',
      description: 'Helena loves connecting with her fans! Check out these amazing moments from recent meet and greet events.',
      imageUrl: 'https://cdn.abacus.ai/images/6f0ae4eb-a251-40e7-b32f-6c9bb2dac85a.png',
      type: 'image',
      published: true,
    },
    {
      title: 'Fashion Photoshoot',
      description: 'Helena stuns in this bold, colorful photoshoot for a major fashion magazine. Style meets music!',
      imageUrl: 'https://cdn.abacus.ai/images/37467984-0ade-4cd2-a4ec-017ff79476cb.png',
      type: 'image',
      published: true,
    },
    {
      title: 'A Message to My Fans',
      description: null,
      imageUrl: null,
      content: `Dear incredible fans,

I can't express how grateful I am for your endless support and love. Every show, every song, every moment on stage is magical because of YOU.

The journey we've been on together has been absolutely incredible. From my first single to selling out arenas around the world, you've been there every step of the way. Your energy, your passion, and your dedication inspire me every single day to create music that moves you.

As we embark on this new world tour, I promise to give you unforgettable performances filled with new songs, your favorite classics, and plenty of surprises. This tour is dedicated to you - the fans who made all my dreams come true.

Thank you for believing in me, for streaming my music, for singing along at concerts, and for being the most amazing community an artist could ask for.

Let's make this tour one for the history books!

With all my love,
Helena ❤️`,
      type: 'article',
      published: true,
    },
  ];

  // Delete existing gallery items first (for clean seeding)
  await prisma.galleryItem.deleteMany({});
  
  for (const item of galleryItems) {
    await prisma.galleryItem.create({
      data: item,
    });
  }

  console.log('Gallery items created:', galleryItems.length);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
