import mongoose from 'mongoose';
import User from './src/models/User';
import Product from './src/models/Product';
import CarouselSlide from './src/models/CarouselSlide';
import Testimonial from './src/models/Testimonial';
import BlogPost from './src/models/BlogPost';
import SalesNetwork from './src/models/SalesNetwork';
import fs from 'fs';
import path from 'path';

// Manually parse .env.local if it exists
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
  }
} catch (err) {
  console.warn('Warning: Could not read .env.local file', err);
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/drnidan';

async function seed() {
  try {
    console.log('Connecting to database:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // 1. Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await CarouselSlide.deleteMany({});
    await Testimonial.deleteMany({});
    await BlogPost.deleteMany({});
    await SalesNetwork.deleteMany({});
    console.log('Cleared existing collections.');

    // 2. Create Admin Users
    const adminAccounts = [
      { email: 'admin@drnidan.com', name: 'Dr. Nidan Admin', pass: 'Admin@123' },
      { email: 'MD@drnidan.in', name: 'Dr. Nidan MD', pass: 'NidanMD@2026' },
      { email: 'HR@drnidan.in', name: 'Dr. Nidan HR', pass: 'NidanHR@2026' },
      { email: 'Logistics@drnidan.in', name: 'Dr. Nidan Logistics', pass: 'NidanLogistics@2026' },
      { email: 'Sales@drnidan.in', name: 'Dr. Nidan Sales', pass: 'NidanSales@2026' }
    ];

    for (const acc of adminAccounts) {
      await User.create({
        name: acc.name,
        email: acc.email,
        password: acc.pass,
        role: 'admin',
        isVerified: true
      });
      console.log('Admin user seeded:', acc.email);
    }

    // Create a regular test user as well
    const testUser = await User.create({
      name: 'Test Customer',
      email: 'customer@gmail.com',
      password: 'Customer@123',
      role: 'user',
      isVerified: true,
      phone: '+91 98765 43210',
      address: {
        street: '123 Herbal Lane',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        country: 'India'
      }
    });
    console.log('Test customer seeded:', testUser.email);

    // 3. Create Products using actual photos from public/product image
    const flagshipProduct = await Product.create({
      name: 'Dr. Nidan Nasha Mukti Drops 50 ML',
      slug: 'dr-nidan-nasha-mukti-drops-50ml',
      description: 'Our DR NIDAN NASHA MUKTI DROPS is a comprehensive dietary supplement designed to support individuals in their journey towards recovery from addiction. This blend of herbs and nutrients combines the wisdom of Ayurveda and traditional herbalism to address the physical and mental aspects of addiction. It helps calm the mind, detoxify the body, and boost overall health naturally without side effects.',
      shortDescription: 'Calm, Detoxify, Boost Health. Enriched with Ayurvedic herbs to support recovery from alcohol and tobacco addiction. No Color, No Flavor, No Taste.',
      price: 799,
      mrp: 999,
      stock: 150,
      category: 'Herbal Drops',
      isActive: true,
      images: [
        { url: '/product image/nasha mukti.jpeg', publicId: 'nasha_mukti_drops' }
      ],
      keyStrengths: [
        'Comprehensive Approach: Addresses stress, anxiety, craving, detox, and mood support.',
        'Natural & Safe: Carefully selected herbal ingredients ensure safety and efficacy.',
        'Calm & Detoxify: Aids in flushing out harmful toxins and balancing the nervous system.'
      ],
      ingredients: [
        {
          category: 'Active Herbs',
          items: ['Kudzu (Vidarikand)', 'Sarpgandha', 'Ashwagandha', 'Brahmi', 'Milk Thistle']
        }
      ],
      benefits: [
        'Reduces alcohol and tobacco cravings significantly',
        'Supports natural liver detoxification and blood purification',
        'Reduces anxiety and mood swings associated with withdrawal',
        '100% natural, no added color, flavor, or taste (can be mixed secretly in food/water)'
      ],
      howToUse: [
        'Shake the bottle well before use.',
        'Take 20-25 drops in a cup of water, tea, juice, or mix it secretly in food.',
        'Administer twice daily, preferably after lunch and dinner.'
      ],
      tags: ['nasha mukti', 'addiction recovery', 'herbal drops', 'ayurvedic detox'],
      ratings: { average: 4.8, count: 124 },
      metaTitle: 'Dr. Nidan Nasha Mukti Drops - Quit Alcohol & Smoking Naturally',
      metaDescription: 'Buy Dr. Nidan Nasha Mukti Drops 50ml, designed to help recover from alcohol and tobacco addiction naturally. Calm, detoxify, and boost health.'
    });
    console.log('Flagship product seeded:', flagshipProduct.name);

    const ecoCleanse = await Product.create({
      name: 'Dr. Nidan Eco Cleanse Drops',
      slug: 'dr-nidan-eco-cleanse-drops',
      description: 'Dr. Nidan Eco Cleanse Drops is an internal balance herbal formula designed to support liver wellness and promote natural detoxification. Enriched with Vitamin C and Zinc, it helps boost immunity, detoxify the bloodstream, and maintain overall digestive vitality.',
      shortDescription: 'Internal Balance Herbal Drops. Supports liver wellness, enriched with Vitamin C & Zinc.',
      price: 599,
      mrp: 749,
      stock: 120,
      category: 'Herbal Drops',
      isActive: true,
      images: [
        { url: '/product image/eco cleanser.jpeg', publicId: 'eco_cleanse_drops' }
      ],
      keyStrengths: [
        'Liver Wellness: Promotes liver detoxification and overall digestive balance.',
        'Enriched with Zinc & Vitamin C: Promotes immune system recovery and cellular health.',
        'Natural Cleanser: Filters out metabolic waste products efficiently.'
      ],
      ingredients: [
        {
          category: 'Detox Herbs',
          items: ['Bhumi Amla', 'Kalmegh', 'Punarnava', 'Vitamin C', 'Zinc']
        }
      ],
      benefits: [
        'Supports optimal liver function and detoxification',
        'Improves digestion and metabolizes nutrients effectively',
        'Enriched with essential micro-nutrients for high immunity',
        'Cleanses internal organs naturally'
      ],
      howToUse: [
        'Take 15-20 drops in warm water twice daily.',
        'Consume 30 minutes before meals.'
      ],
      tags: ['eco cleanse', 'liver support', 'herbal drops', 'detoxify'],
      ratings: { average: 4.7, count: 48 },
      metaTitle: 'Dr. Nidan Eco Cleanse Drops - Liver Wellness Supplement',
      metaDescription: 'Support your liver and flush out internal toxins with Dr. Nidan Eco Cleanse Drops. Herbal formula with Vitamin C and Zinc.'
    });
    console.log('Eco Cleanse drops seeded:', ecoCleanse.name);

    const horseRider = await Product.create({
      name: 'Dr. Nidan Horse Rider Gold Capsules',
      slug: 'dr-nidan-horse-rider-gold-capsules',
      description: 'Dr. Nidan Horse Rider Gold is a premium Ayurvedic revitalizer designed to enhance vitality, boost stamina, and support peak performance. Made from selected herbal ingredients, these capsules restore vigor, combat fatigue, and promote overall physical strength.',
      shortDescription: 'Premium Revitalizer. Enhance Vitality, Boost Stamina, and Support Performance.',
      price: 699,
      mrp: 899,
      stock: 100,
      category: 'Health Capsules',
      isActive: true,
      images: [
        { url: '/product image/horse rider gold.jpeg', publicId: 'horse_rider_gold' }
      ],
      keyStrengths: [
        'Premium Revitalizer: Restores bodily vigor and combats overall tiredness.',
        'Boosts Stamina: Helps improve endurance and strength naturally.',
        'Safe & Pure: Formulated with standard Ayurvedic herbs.'
      ],
      ingredients: [
        {
          category: 'Vigor Herbs',
          items: ['Safed Musli', 'Shilajit', 'Ashwagandha', 'Kaunch Beej']
        }
      ],
      benefits: [
        'Significantly increases energy levels and stamina',
        'Enhances physical performance and muscle strength',
        'Helps reduce chronic fatigue and daily stress',
        'Supports vitality and general wellness'
      ],
      howToUse: [
        'Take 1 capsule twice daily, preferably with milk or water.',
        'For best results, continue regular course for 30 to 45 days.'
      ],
      tags: ['horse rider gold', 'vitality capsules', 'stamina booster', 'revitalizer'],
      ratings: { average: 4.9, count: 72 },
      metaTitle: 'Dr. Nidan Horse Rider Gold Capsules - Vigor & Stamina Booster',
      metaDescription: 'Boost your stamina and energy with Dr. Nidan Horse Rider Gold Capsules. Natural revitalizer with Shilajit and Safed Musli.'
    });
    console.log('Horse Rider Gold seeded:', horseRider.name);

    const aanidra = await Product.create({
      name: 'Dr. Nidan Aanidra Capsules',
      slug: 'dr-nidan-aanidra-capsules',
      description: 'Dr. Nidan Aanidra Capsules is a special pH Neuro Relax formulation designed to help reduce stress, support deep relaxation, promote healthy sleep, and maintain emotional balance. It addresses restlessness and brings calm sleep patterns naturally.',
      shortDescription: 'pH Neuro Relax. Helps Reduce Stress, Supports Relaxation, Healthy Sleep & Emotional Balance.',
      price: 499,
      mrp: 649,
      stock: 140,
      category: 'Health Capsules',
      isActive: true,
      images: [
        { url: '/product image/andhera.jpeg', publicId: 'aanidra_capsules' }
      ],
      keyStrengths: [
        'Stress Relief: Calms the nervous system and relaxes brain cells.',
        'Healthy Sleep: Induces restful and deep sleep cycles.',
        'Emotional Balance: Supports mood stability and mental calmness.'
      ],
      ingredients: [
        {
          category: 'Calming Herbs',
          items: ['Jatamansi', 'Sarpagandha', 'Tagar', 'Brahmi', 'Shankhpushpi']
        }
      ],
      benefits: [
        'Helps relieve stress, mental fatigue, and anxiety',
        'Improves sleep quality and helps manage sleeplessness/insomnia',
        'Enhances relaxation and mental peace',
        'Supports emotional wellness and neural health'
      ],
      howToUse: [
        'Take 1-2 capsules at bedtime with warm water or milk.',
        'Consult physician if experiencing chronic sleep issues.'
      ],
      tags: ['aanidra capsules', 'sleep support', 'stress relief', 'relaxation'],
      ratings: { average: 4.6, count: 35 },
      metaTitle: 'Dr. Nidan Aanidra Capsules - Natural Sleep & Stress Relief',
      metaDescription: 'Manage stress and sleep patterns with Dr. Nidan Aanidra Capsules. Natural neuro relax formulation with Jatamansi.'
    });
    console.log('Aanidra Capsules seeded:', aanidra.name);

    const slimkaya = await Product.create({
      name: 'Dr. Nidan Slimkaya Capsules',
      slug: 'dr-nidan-slimkaya-capsules',
      description: 'Dr. Nidan Slimkaya is a premium health supplement carefully formulated for appetite suppression, thermogenesis, healthy fat metabolism, and sugar control. It helps individuals maintain their perfect figure naturally without adverse side effects.',
      shortDescription: 'Appetite Suppression, Thermogenesis, Fat Metabolism, and Sugar Control. For Perfect Figure.',
      price: 599,
      mrp: 799,
      stock: 110,
      category: 'Health Capsules',
      isActive: true,
      images: [
        { url: '/product image/slimkaya.jpeg', publicId: 'slimkaya_capsules' }
      ],
      keyStrengths: [
        'Appetite Suppression: Helps control food cravings and overeating.',
        'Thermogenesis: Boosts body heat and metabolism to burn fat.',
        'Sugar Control: Regulates blood sugar levels and insulin spikes.'
      ],
      ingredients: [
        {
          category: 'Weight Management',
          items: ['Vrikshamla (Garcinia)', 'Guggulu', 'Green Tea Extract', 'Methi']
        }
      ],
      benefits: [
        'Promotes healthy fat metabolism and weight management',
        'Naturally suppresses frequent cravings and appetite',
        'Enhances thermogenesis for burning active calories',
        'Helps in blood sugar control and improves digestion'
      ],
      howToUse: [
        'Take 1 capsule twice daily, 30 minutes before lunch and dinner with warm water.',
        'Combine with a balanced diet and moderate exercise.'
      ],
      tags: ['slimkaya', 'weight loss', 'appetite suppressor', 'fat burner', 'sugar control'],
      ratings: { average: 4.5, count: 65 },
      metaTitle: 'Dr. Nidan Slimkaya Capsules - Natural Weight Management',
      metaDescription: 'Achieve your perfect figure with Dr. Nidan Slimkaya Capsules. Natural supplement for appetite control and fat metabolism.'
    });
    console.log('Slimkaya Capsules seeded:', slimkaya.name);

    // 4. Seed Carousel Slides using local photos
    await CarouselSlide.create([
      {
        imageUrl: '/crousel/andhera.jpeg',
        caption: 'Ayurvedic Nasha Mukti Drops - Overcome Addiction Naturally',
        ctaText: 'Shop Now',
        ctaLink: '/products/dr-nidan-nasha-mukti-drops-50ml',
        orderIndex: 0,
        isActive: true
      },
      {
        imageUrl: '/crousel/horse.jpeg',
        caption: '100% Organic, Result-Oriented Wellness Products',
        ctaText: 'About Our Mission',
        ctaLink: '/about',
        orderIndex: 1,
        isActive: true
      },
      {
        imageUrl: '/crousel/slim.jpeg',
        caption: 'Empower Your Family: Colorless, Tasteless Recovery Drops',
        ctaText: 'WhatsApp Inquiry',
        ctaLink: 'https://wa.me/919307904425',
        orderIndex: 2,
        isActive: true
      }
    ]);
    console.log('Carousel slides seeded.');

    // 5. Seed Testimonials
    await Testimonial.create([
      {
        name: 'Sumit Singh',
        city: 'Delhi',
        review: 'Dr. Nidan Nasha Mukti Drops have been a miracle. My alcohol cravings reduced significantly within just a few weeks of taking them secretly with dinner. No side effects at all!',
        rating: 5,
        photo: '',
        isApproved: true,
        isFeatured: true,
        productId: flagshipProduct._id
      },
      {
        name: 'Rajesh Kumar',
        city: 'Lucknow',
        review: '100% natural and highly effective. We mixed these colorless drops in my brother’s tea without him knowing. His alcohol intake has gone down to zero in 2 months. Truly grateful.',
        rating: 5,
        photo: '',
        isApproved: true,
        isFeatured: true,
        productId: flagshipProduct._id
      },
      {
        name: 'Megha',
        city: 'Jaipur',
        review: 'My husband had been smoking for over 15 years. These drops helped him manage withdrawal anxiety and stop smoking completely. Highly recommended for tobacco addiction!',
        rating: 5,
        photo: '',
        isApproved: true,
        isFeatured: true,
        productId: flagshipProduct._id
      }
    ]);
    console.log('Testimonials seeded.');

    // 6. Seed Blogs using local photos
    await BlogPost.create([
      {
        title: 'Understanding Addiction Recovery through Ayurveda',
        slug: 'understanding-addiction-recovery-through-ayurveda',
        content: '<h2>The Ayurvedic Approach to Sobriety</h2><p>Ayurveda, the ancient science of life, views addiction as an imbalance of the doshas, particularly Pitta and Vata, accompanied by accumulation of toxins (Ama) and depletion of Ojas (vital energy). Rather than treating addiction purely as a mental habit, Ayurveda addresses the physical cravings, emotional triggers, and organ health concurrently.</p><p>Herbs like Kudzu (Vidarikand) bind to cravings pathways, while Ashwagandha reduces stress hormones, and Haldi restores liver function. By using natural recovery drops, individuals can regain control over their lives gently and organically.</p>',
        excerpt: 'Learn how ancient Ayurvedic wisdom helps in managing cravings, purifying toxins, and rebuilding vital energy during addiction recovery.',
        featuredImage: '/product image/nasha mukti.jpeg',
        author: 'Dr. Nidan Ayurvedic Expert',
        category: 'Health & Recovery',
        tags: ['nasha mukti', 'ayurvedic healing', 'detoxification'],
        isPublished: true,
        publishedAt: new Date(),
        metaTitle: 'How Ayurveda Aids Addiction Recovery - Dr. Nidan',
        metaDescription: 'Explore the holistic Ayurvedic science behind overcoming alcohol and tobacco cravings using natural herbs and body purification methods.'
      },
      {
        title: '5 Herbs That Stop Alcohol Cravings Naturally',
        slug: '5-herbs-that-stop-alcohol-cravings-naturally',
        content: '<h2>Powerful Ayurvedic Herbs for Addiction</h2><p>Ayurvedic scriptures describe several powerful herbs that reduce substance cravings:</p><ul><li><strong>Kudzu (Vidarikand):</strong> Extensively studied for reducing alcohol consumption by modifying metabolic pathways.</li><li><strong>Sarpgandha:</strong> Calms the central nervous system, reducing the irritability and anxiety of withdrawal.</li><li><strong>Ashwagandha:</strong> An adaptogen that lowers cortisol and mitigates stress-induced triggers.</li><li><strong>Brahmi:</strong> Enhances brain focus and memory, supporting mental strength during recovery.</li><li><strong>Milk Thistle:</strong> Protects and regenerates liver tissues damaged by long-term alcohol consumption.</li></ul>',
        excerpt: 'Discover the top 5 natural herbs used in Dr. Nidan Nasha Mukti Drops to suppress alcohol cravings and protect the liver.',
        featuredImage: '/product image/eco cleanser.jpeg',
        author: 'Dr. Nidan Ayurvedic Expert',
        category: 'Ayurvedic Herbs',
        tags: ['herbs', 'alcohol detox', 'ashwagandha', 'kudzu'],
        isPublished: true,
        publishedAt: new Date(),
        metaTitle: 'Top 5 Herbs to Stop Cravings Naturally - Dr. Nidan',
        metaDescription: 'Learn about Vidarikand, Ashwagandha, Brahmi, and other herbs that calm the mind and stop alcohol and smoking withdrawal cravings.'
      }
    ]);
    console.log('Blogs seeded.');

    // 7. Seed Sales Network
    await SalesNetwork.create([
      {
        state: 'Maharashtra',
        city: 'Pune',
        dealerName: 'Dr. Nidan Main Office / Distributor',
        phone: '+91 93079 04425',
        address: 'Office #1222, Twin Building, Plegona, Dhabade, Pune (M.S.) – 410506',
        isActive: true
      },
      {
        state: 'Maharashtra',
        city: 'Mumbai',
        dealerName: 'Sahyadri Organic Distributors',
        phone: '+91 7058105880',
        address: 'Gala No. 4, Ground Floor, Laxmi Nivas, Andheri East, Mumbai – 400069',
        isActive: true
      },
      {
        state: 'Delhi',
        city: 'New Delhi',
        dealerName: 'Capital Ayurvedic Agency',
        phone: '+91 93079 04425',
        address: 'Shop No. 12, Block C, Lajpat Nagar-II, New Delhi – 110024',
        isActive: true
      },
      {
        state: 'Uttar Pradesh',
        city: 'Lucknow',
        dealerName: 'Awadh Herbal Store',
        phone: '+91 93079 04425',
        address: 'B-34, Aliganj Main Road, Near Hanuman Temple, Lucknow – 226024',
        isActive: true
      }
    ]);
    console.log('Sales Network seeded.');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seed();
