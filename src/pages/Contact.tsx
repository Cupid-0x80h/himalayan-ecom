import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);

  const content = {
    en: {
      title: 'Contact Us',
      subtitle: 'Get in touch with our team',
      name: 'Full Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      contactInfo: 'Contact Information',
      address: 'Kathmandu, Nepal',
      phone: '+977-XXXXXXXXXX',
      emailAddress: 'info@nepalecom.com',
      success: 'Message sent successfully!',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'your@email.com',
      messagePlaceholder: 'Your message...'
    },
    ne: {
      title: 'हामीलाई सम्पर्क गर्नुहोस्',
      subtitle: 'हाम्रो टोलीसँग सम्पर्कमा रहनुहोस्',
      name: 'पूरा नाम',
      email: 'इमेल',
      message: 'सन्देश',
      send: 'सन्देश पठाउनुहोस्',
      contactInfo: 'सम्पर्क जानकारी',
      address: 'काठमाडौं, नेपाल',
      phone: '+977-XXXXXXXXXX',
      emailAddress: 'info@nepalecom.com',
      success: 'सन्देश सफलतापूर्वक पठाइयो!',
      namePlaceholder: 'तपाईंको नाम',
      emailPlaceholder: 'तपाईंको@इमेल.com',
      messagePlaceholder: 'तपाईंको सन्देश...'
    }
  };

  const t = content[language];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate sending message
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(t.success);
    setLoading(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
            <p className="text-xl text-muted-foreground">{t.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card border border-border rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.name}</Label>
                  <Input 
                    id="name" 
                    placeholder={t.namePlaceholder}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder={t.emailPlaceholder}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t.message}</Label>
                  <Textarea 
                    id="message" 
                    placeholder={t.messagePlaceholder}
                    rows={6}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? '...' : t.send}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">{t.contactInfo}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{language === 'en' ? 'Address' : 'ठेगाना'}</h3>
                    <p className="text-muted-foreground">{t.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{language === 'en' ? 'Phone' : 'फोन'}</h3>
                    <p className="text-muted-foreground">{t.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{language === 'en' ? 'Email' : 'इमेल'}</h3>
                    <p className="text-muted-foreground">{t.emailAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
