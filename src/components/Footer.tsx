import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

export const Footer = () => {
  const { language } = useLanguage();
  
  const content = {
    en: {
      about: 'Nepal\'s most trusted online shopping platform. Quality products, secure payment, and fast delivery.',
      quickLinks: 'Quick Links',
      aboutUs: 'About Us',
      contact: 'Contact',
      terms: 'Terms & Conditions',
      privacy: 'Privacy Policy',
      customerService: 'Customer Service',
      myAccount: 'My Account',
      trackOrder: 'Track Order',
      returnPolicy: 'Return Policy',
      helpCenter: 'Help Center',
      contactInfo: 'Contact Information',
      address: 'Kathmandu, Nepal',
      phone: '+977-XXXXXXXXXX',
      email: 'info@nepalecom.com',
      rights: 'All rights reserved.',
      paymentOptions: 'Payment Options:',
      bankTransfer: 'Bank Transfer'
    },
    ne: {
      about: 'नेपालको सबैभन्दा भरपर्दो अनलाइन शपिङ प्लेटफर्म। गुणस्तरीय उत्पादनहरू, सुरक्षित भुक्तानी र छिटो डेलिभरी।',
      quickLinks: 'द्रुत लिंकहरू',
      aboutUs: 'हाम्रो बारेमा',
      contact: 'सम्पर्क',
      terms: 'नियम र सर्तहरू',
      privacy: 'गोपनीयता नीति',
      customerService: 'ग्राहक सेवा',
      myAccount: 'मेरो खाता',
      trackOrder: 'अर्डर ट्र्याक गर्नुहोस्',
      returnPolicy: 'फिर्ता नीति',
      helpCenter: 'सहायता केन्द्र',
      contactInfo: 'सम्पर्क जानकारी',
      address: 'काठमाडौं, नेपाल',
      phone: '+977-XXXXXXXXXX',
      email: 'info@nepalecom.com',
      rights: 'सर्वाधिकार सुरक्षित।',
      paymentOptions: 'भुक्तानी विकल्पहरू:',
      bankTransfer: 'बैंक स्थानान्तरण'
    }
  };
  
  const t = content[language];
  
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NepalEcom
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t.about}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t.quickLinks}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.aboutUs}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.contact}
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.terms}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.privacy}
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">{t.customerService}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.myAccount}
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.trackOrder}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.returnPolicy}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.helpCenter}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{t.contactInfo}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{t.address}</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>{t.phone}</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>{t.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 NepalEcom. {t.rights}</p>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <span className="font-semibold">{t.paymentOptions}</span>
            <span>eSewa</span>
            <span>Khalti</span>
            <span>IMEPay</span>
            <span>{t.bankTransfer}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
