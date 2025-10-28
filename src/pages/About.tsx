import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Truck, Clock, Award } from 'lucide-react';

const About = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: 'About NepalEcom',
      subtitle: "Nepal's Most Trusted Online Shopping Platform",
      description: `NepalEcom is Nepal's leading e-commerce platform, dedicated to providing quality products at competitive prices with exceptional customer service. We believe in making online shopping accessible, secure, and convenient for everyone across Nepal.`,
      mission: 'Our Mission',
      missionText: 'To revolutionize online shopping in Nepal by connecting buyers with quality products and reliable sellers, while ensuring the best shopping experience.',
      whyChoose: 'Why Choose Us?',
      features: [
        { icon: Shield, title: 'Secure Shopping', desc: '100% secure payment methods and buyer protection' },
        { icon: Truck, title: 'Fast Delivery', desc: 'Quick and reliable delivery across Nepal' },
        { icon: Clock, title: '24/7 Support', desc: 'Always here to help with any questions' },
        { icon: Award, title: 'Quality Products', desc: 'Only verified sellers and quality products' }
      ]
    },
    ne: {
      title: 'NepalEcom को बारेमा',
      subtitle: 'नेपालको सबैभन्दा भरपर्दो अनलाइन शपिङ प्लेटफर्म',
      description: 'NepalEcom नेपालको अग्रणी ई-कमर्स प्लेटफर्म हो, जो प्रतिस्पर्धात्मक मूल्यमा गुणस्तरीय उत्पादनहरू र असाधारण ग्राहक सेवा प्रदान गर्न समर्पित छ। हामी नेपालभरि सबैका लागि अनलाइन किनमेललाई पहुँचयोग्य, सुरक्षित र सुविधाजनक बनाउनमा विश्वास गर्छौं।',
      mission: 'हाम्रो मिशन',
      missionText: 'गुणस्तरीय उत्पादनहरू र भरपर्दो विक्रेताहरूसँग खरिदकर्ताहरूलाई जोड्दै, उत्कृष्ट किनमेल अनुभव सुनिश्चित गर्दै नेपालमा अनलाइन किनमेलमा क्रान्तिकारी परिवर्तन ल्याउने।',
      whyChoose: 'हामीलाई किन रोज्ने?',
      features: [
        { icon: Shield, title: 'सुरक्षित किनमेल', desc: '100% सुरक्षित भुक्तानी विधिहरू र क्रेता सुरक्षा' },
        { icon: Truck, title: 'छिटो डेलिभरी', desc: 'नेपालभरि छिटो र भरपर्दो डेलिभरी' },
        { icon: Clock, title: '24/7 सहयोग', desc: 'कुनै पनि प्रश्नमा मद्दत गर्न सधैं उपलब्ध' },
        { icon: Award, title: 'गुणस्तरीय उत्पादनहरू', desc: 'प्रमाणित विक्रेताहरू र गुणस्तरीय उत्पादनहरू मात्र' }
      ]
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-primary mb-8">{t.subtitle}</p>
          
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            {t.description}
          </p>

          <div className="bg-card border border-border rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">{t.mission}</h2>
            <p className="text-muted-foreground leading-relaxed">{t.missionText}</p>
          </div>

          <h2 className="text-2xl font-bold mb-8">{t.whyChoose}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.features.map((feature, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
