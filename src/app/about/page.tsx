'use client';
import { motion } from 'framer-motion';
import { Shield, Clock, Heart, Leaf, Star, Sparkles, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  const whyChoose = [
    {
      title: 'Natural & Safe',
      desc: 'Formulated with carefully selected 100% organic herbs. Zero chemical additives or synthetic colorings.',
      icon: Leaf,
    },
    {
      title: 'Time-Tested',
      desc: 'Formulations inspired by centuries-old Ayurvedic scriptures combined with clinical precision.',
      icon: Clock,
    },
    {
      title: 'Holistic Approach',
      desc: 'Balances internal doshas, cleanses toxins, and addresses physical and mental recovery aspects.',
      icon: Heart,
    }
  ];

  const ingredientCategories = [
    {
      category: 'Stress & Anxiety Relief',
      items: ['Ashwagandha', 'Brahmi', 'Lemon Balm'],
      desc: 'Calms the nervous system and lowers cortisol to manage withdrawal stressors.'
    },
    {
      category: 'Craving Reduction',
      items: ['Vidarikand (Kudzu)', 'Sarpgandha'],
      desc: 'Modifies metabolic craving pathways and decreases substance dependency impulses.'
    },
    {
      category: 'Detoxification Support',
      items: ['Haldi (Turmeric)', 'Daru Haldi', 'Nagarmotha', 'Milk Thistle', 'Dandelion'],
      desc: 'Restores healthy liver function and purifies the bloodstream from toxic accumulation.'
    },
    {
      category: 'Mood Support',
      items: ['St John’s Wort', 'Avena Sativa', 'Gotu Kola', 'Shankhpushpi', 'Vach'],
      desc: 'Stabilizes serotonin and dopamine levels to reduce irritability and mood swings.'
    },
    {
      category: 'Antioxidant & Immune Support',
      items: ['Amla', 'Grapes', 'Astragalus', 'Vana Tulsi'],
      desc: 'Boosts natural body defenses, fights oxidative stress, and rebuilds vital Ojas.'
    },
    {
      category: 'Relaxation & Calmness',
      items: ['Indian Sandalwood (Chandan)', 'Jatamansi'],
      desc: 'Induces calm sleep patterns and relieves cerebral tension.'
    }
  ];

  return (
    <div className="pt-28 pb-24 bg-[#F9FFF9] min-h-screen text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-1 rounded-full">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#1B5E20] mt-3 mb-6">
            About Dr. Nidan
          </h1>
          <p className="text-base text-[#555555] max-w-xl mx-auto leading-relaxed">
            Authentic, result-oriented Ayurvedic remedies designed to bring your mind, body, and spirit back into perfect doshic equilibrium.
          </p>
        </div>

        {/* 4.1 Brand Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-md border border-[#2E7D32]/10 p-6 flex items-center justify-center"
          >
            <img 
              src="/product image/nasha mukti.jpeg" 
              alt="Dr. Nidan drops packaging" 
              className="max-h-full object-contain" 
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-6"
          >
            <h2 className="text-3xl font-display font-bold text-[#1B5E20]">
              About Dr Nidan Nasha Mukti Drops 50 ML
            </h2>
            <div className="space-y-4 text-sm text-[#555555] leading-relaxed">
              <p>
                Our <strong>DR NIDAN NASHA MUKTI DROPS 50 ML</strong> is a comprehensive herbal supplement designed to support individuals in their journey towards recovery from addiction. This blend of 30+ herbs and nutrients combines the wisdom of Ayurveda and traditional herbalism to address the physical and mental aspects of addiction.
              </p>
              <p>
                All causative factors of disease—internal or external—directly or indirectly create an imbalance in the doshas first, and only then do the symptoms of the disease manifest. Ayurvedic treatment does not mean suppressing symptoms; it is about removing the root cause and giving permanent relief.
              </p>
              <p>
                Because our medicines are prepared from natural herbs, plants, and minerals, they are assimilated in the body without creating side effects. They are often more effective than synthetic drugs with fewer side effects and can treat a wide range of conditions.
              </p>
            </div>
          </motion.div>
        </div>

        {/* 4.2 Why Choose Natural Medicine */}
        <div className="mb-24">
          <h2 className="text-2xl font-display font-bold text-center text-[#1B5E20] mb-12">
            Why Choose Natural Ayurvedic Medicine?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChoose.map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-[#2E7D32]/10 shadow-2xs text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#2E7D32] flex items-center justify-center mx-auto">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#1A1A1A]">{item.title}</h3>
                <p className="text-xs text-[#555555] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4.4 Stats Counter Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#1B5E20] text-white p-8 sm:p-12 rounded-3xl mb-24 text-center border border-[#2E7D32]/20 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-display font-bold text-[#FFF8E1]">40+</h3>
            <p className="text-xs text-emerald-100 font-medium">Herbs Used</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-display font-bold text-[#FFF8E1]">100%</h3>
            <p className="text-xs text-emerald-100 font-medium">Organic & Pure</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-display font-bold text-[#FFF8E1]">Thousands</h3>
            <p className="text-xs text-emerald-100 font-medium">Satisfied Customers</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl font-display font-bold text-[#FFF8E1]">0</h3>
            <p className="text-xs text-emerald-100 font-medium">Chemical Additives</p>
          </div>
        </div>

        {/* 4.5 Product Ingredients Breakdown */}
        <div>
          <h2 className="text-2xl font-display font-bold text-center text-[#1B5E20] mb-12">
            Formulation Ingredients Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ingredientCategories.map((cat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
                <h3 className="font-display font-bold text-base text-[#2E7D32] border-b border-gray-50 pb-2">{cat.category}</h3>
                <p className="text-xs text-[#555555] leading-relaxed">{cat.desc}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {cat.items.map((item) => (
                    <span key={item} className="bg-[#FFF8E1] text-[#F9A825] px-2.5 py-1 rounded-full text-xs font-bold border border-[#FFF8E1] shadow-2xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
