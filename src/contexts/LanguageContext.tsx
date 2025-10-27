import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'search.placeholder': 'Search products...',
    'nav.login': 'Login',
    'nav.account': 'Account',
    'nav.cart': 'Cart',
    'nav.admin': 'Admin',
    'nav.logout': 'Logout',
    
    // Categories
    'category.electronics': 'Electronics',
    'category.clothing': 'Clothing',
    'category.home-kitchen': 'Home & Kitchen',
    'category.books': 'Books',
    
    // Home
    'home.hero.title': 'Welcome to Nepal E-Commerce',
    'home.hero.subtitle': 'Discover amazing products at great prices',
    'home.hero.cta': 'Shop Now',
    'home.features.title': 'Why Choose Us',
    'home.feature.shipping': 'Free Shipping',
    'home.feature.shipping.desc': 'On orders over NPR 5000',
    'home.feature.support': '24/7 Support',
    'home.feature.support.desc': 'Always here to help',
    'home.feature.returns': 'Easy Returns',
    'home.feature.returns.desc': '30-day return policy',
    'home.feature.payment': 'Secure Payment',
    'home.feature.payment.desc': 'Multiple payment options',
    'home.categories.title': 'Shop by Category',
    'home.featured.title': 'Featured Products',
    
    // Product
    'product.addToCart': 'Add to Cart',
    'product.outOfStock': 'Out of Stock',
    'product.inStock': 'In Stock',
    'product.discount': 'OFF',
    'product.reviews': 'Reviews',
    'product.description': 'Description',
    'product.ratings': 'Customer Ratings',
    'product.writeReview': 'Write a Review',
    'product.yourRating': 'Your Rating',
    'product.yourReview': 'Your Review',
    'product.submit': 'Submit Review',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continueShopping': 'Continue Shopping',
    'cart.item': 'Item',
    'cart.price': 'Price',
    'cart.quantity': 'Quantity',
    'cart.total': 'Total',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.grandTotal': 'Grand Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.remove': 'Remove',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.shipping': 'Shipping Address',
    'checkout.name': 'Full Name',
    'checkout.address': 'Address',
    'checkout.city': 'City',
    'checkout.phone': 'Phone Number',
    'checkout.payment': 'Payment Method',
    'checkout.esewa': 'eSewa',
    'checkout.khalti': 'Khalti',
    'checkout.imepay': 'IME Pay',
    'checkout.bank': 'Bank Transfer',
    'checkout.placeOrder': 'Place Order',
    'checkout.orderSummary': 'Order Summary',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.haveAccount': 'Already have an account?',
    'auth.noAccount': "Don't have an account?",
    'auth.loginButton': 'Login',
    'auth.signupButton': 'Sign Up',
    
    // Admin
    'admin.dashboard': 'Admin Dashboard',
    'admin.products': 'Products',
    'admin.orders': 'Orders',
    'admin.users': 'Users',
    'admin.addProduct': 'Add Product',
    'admin.editProduct': 'Edit Product',
    'admin.title': 'Title',
    'admin.price': 'Price',
    'admin.stock': 'Stock',
    'admin.category': 'Category',
    'admin.actions': 'Actions',
    'admin.edit': 'Edit',
    'admin.delete': 'Delete',
    'admin.save': 'Save',
    'admin.cancel': 'Cancel',
    
    // Footer
    'footer.about': 'About Us',
    'footer.about.text': 'Your trusted online shopping destination in Nepal.',
    'footer.quickLinks': 'Quick Links',
    'footer.home': 'Home',
    'footer.products': 'Products',
    'footer.about.page': 'About',
    'footer.contact': 'Contact',
    'footer.customer': 'Customer Service',
    'footer.shipping': 'Shipping Info',
    'footer.returns': 'Returns',
    'footer.faq': 'FAQ',
    'footer.terms': 'Terms & Conditions',
    'footer.contact.title': 'Contact Info',
    'footer.email': 'Email',
    'footer.phone': 'Phone',
    'footer.address': 'Address',
    'footer.payment': 'We Accept',
    'footer.rights': 'All rights reserved.',
  },
  ne: {
    // Header
    'search.placeholder': 'उत्पादनहरू खोज्नुहोस्...',
    'nav.login': 'लगइन',
    'nav.account': 'खाता',
    'nav.cart': 'कार्ट',
    'nav.admin': 'एडमिन',
    'nav.logout': 'लगआउट',
    
    // Categories
    'category.electronics': 'इलेक्ट्रोनिक्स',
    'category.clothing': 'कपडा',
    'category.home-kitchen': 'घर र भान्सा',
    'category.books': 'पुस्तकहरू',
    
    // Home
    'home.hero.title': 'नेपाल ई-कमर्समा स्वागत छ',
    'home.hero.subtitle': 'उत्कृष्ट मूल्यमा अद्भुत उत्पादनहरू पत्ता लगाउनुहोस्',
    'home.hero.cta': 'अहिले किनमेल गर्नुहोस्',
    'home.features.title': 'किन हामीलाई रोज्ने',
    'home.feature.shipping': 'नि:शुल्क डेलिभरी',
    'home.feature.shipping.desc': 'NPR 5000 भन्दा बढीको अर्डरमा',
    'home.feature.support': '24/7 सहयोग',
    'home.feature.support.desc': 'सधैं मद्दत गर्न तयार',
    'home.feature.returns': 'सजिलो फिर्ता',
    'home.feature.returns.desc': '30-दिन फिर्ता नीति',
    'home.feature.payment': 'सुरक्षित भुक्तानी',
    'home.feature.payment.desc': 'धेरै भुक्तानी विकल्पहरू',
    'home.categories.title': 'श्रेणी अनुसार किनमेल गर्नुहोस्',
    'home.featured.title': 'विशेष उत्पादनहरू',
    
    // Product
    'product.addToCart': 'कार्टमा थप्नुहोस्',
    'product.outOfStock': 'स्टकमा छैन',
    'product.inStock': 'स्टकमा छ',
    'product.discount': 'छुट',
    'product.reviews': 'समीक्षाहरू',
    'product.description': 'विवरण',
    'product.ratings': 'ग्राहक रेटिङ',
    'product.writeReview': 'समीक्षा लेख्नुहोस्',
    'product.yourRating': 'तपाईंको रेटिङ',
    'product.yourReview': 'तपाईंको समीक्षा',
    'product.submit': 'समीक्षा पेश गर्नुहोस्',
    
    // Cart
    'cart.title': 'किनमेल कार्ट',
    'cart.empty': 'तपाईंको कार्ट खाली छ',
    'cart.continueShopping': 'किनमेल जारी राख्नुहोस्',
    'cart.item': 'वस्तु',
    'cart.price': 'मूल्य',
    'cart.quantity': 'परिमाण',
    'cart.total': 'जम्मा',
    'cart.subtotal': 'उपजम्मा',
    'cart.shipping': 'डेलिभरी शुल्क',
    'cart.grandTotal': 'कुल जम्मा',
    'cart.checkout': 'चेकआउट गर्नुहोस्',
    'cart.remove': 'हटाउनुहोस्',
    
    // Checkout
    'checkout.title': 'चेकआउट',
    'checkout.shipping': 'डेलिभरी ठेगाना',
    'checkout.name': 'पूरा नाम',
    'checkout.address': 'ठेगाना',
    'checkout.city': 'शहर',
    'checkout.phone': 'फोन नम्बर',
    'checkout.payment': 'भुक्तानी विधि',
    'checkout.esewa': 'ईसेवा',
    'checkout.khalti': 'खल्ती',
    'checkout.imepay': 'आईएमई पे',
    'checkout.bank': 'बैंक ट्रान्सफर',
    'checkout.placeOrder': 'अर्डर गर्नुहोस्',
    'checkout.orderSummary': 'अर्डर सारांश',
    
    // Auth
    'auth.login': 'लगइन',
    'auth.signup': 'साइन अप',
    'auth.email': 'इमेल',
    'auth.password': 'पासवर्ड',
    'auth.name': 'पूरा नाम',
    'auth.haveAccount': 'पहिले नै खाता छ?',
    'auth.noAccount': 'खाता छैन?',
    'auth.loginButton': 'लगइन गर्नुहोस्',
    'auth.signupButton': 'साइन अप गर्नुहोस्',
    
    // Admin
    'admin.dashboard': 'एडमिन ड्यासबोर्ड',
    'admin.products': 'उत्पादनहरू',
    'admin.orders': 'अर्डरहरू',
    'admin.users': 'प्रयोगकर्ताहरू',
    'admin.addProduct': 'उत्पादन थप्नुहोस्',
    'admin.editProduct': 'उत्पादन सम्पादन गर्नुहोस्',
    'admin.title': 'शीर्षक',
    'admin.price': 'मूल्य',
    'admin.stock': 'स्टक',
    'admin.category': 'श्रेणी',
    'admin.actions': 'कार्यहरू',
    'admin.edit': 'सम्पादन गर्नुहोस्',
    'admin.delete': 'मेटाउनुहोस्',
    'admin.save': 'सेभ गर्नुहोस्',
    'admin.cancel': 'रद्द गर्नुहोस्',
    
    // Footer
    'footer.about': 'हाम्रो बारेमा',
    'footer.about.text': 'नेपालमा तपाईंको भरपर्दो अनलाइन किनमेल गर्ने ठाउँ।',
    'footer.quickLinks': 'द्रुत लिङ्कहरू',
    'footer.home': 'गृहपृष्ठ',
    'footer.products': 'उत्पादनहरू',
    'footer.about.page': 'बारेमा',
    'footer.contact': 'सम्पर्क',
    'footer.customer': 'ग्राहक सेवा',
    'footer.shipping': 'ढुवानी जानकारी',
    'footer.returns': 'फिर्ता',
    'footer.faq': 'बारम्बार सोधिने प्रश्नहरू',
    'footer.terms': 'नियम र शर्तहरू',
    'footer.contact.title': 'सम्पर्क जानकारी',
    'footer.email': 'इमेल',
    'footer.phone': 'फोन',
    'footer.address': 'ठेगाना',
    'footer.payment': 'हामी स्वीकार गर्छौं',
    'footer.rights': 'सबै अधिकार सुरक्षित।',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'ne') ? saved : 'ne';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
