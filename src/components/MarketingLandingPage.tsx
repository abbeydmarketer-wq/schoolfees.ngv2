import React, { useState } from 'react';
import { PlatformConfig } from '../types';

interface MarketingLandingPageProps {
  platformConfig: PlatformConfig;
  onSignInClick: () => void;
  onGetStartedClick: () => void;
}

const MarketingLandingPage: React.FC<MarketingLandingPageProps> = ({
  platformConfig,
  onSignInClick,
  onGetStartedClick,
}) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const { websiteContent, pricingPlans } = platformConfig;

  // Icon mapping for features
  const getFeatureIcon = (iconName: string) => {
    const icons = {
      Communication: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      Payments: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      Analytics: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      Reconciliation: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    };
    return icons[iconName as keyof typeof icons] || icons.Analytics;
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation */}
      <div className="navbar bg-base-100 shadow-sm fixed top-0 z-50 bg-opacity-95 backdrop-blur">
        <div className="container mx-auto">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><button onClick={() => scrollToSection('features')}>Features</button></li>
                <li><button onClick={() => scrollToSection('testimonials')}>Testimonials</button></li>
                <li><button onClick={() => scrollToSection('pricing')}>Pricing</button></li>
                <li><button onClick={() => scrollToSection('faq')}>FAQ</button></li>
                <li><button onClick={() => scrollToSection('contact')}>Contact</button></li>
              </ul>
            </div>
            <a className="btn btn-ghost text-xl font-bold">{websiteContent.title}</a>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li><button onClick={() => scrollToSection('features')} className="hover:text-primary">Features</button></li>
              <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-primary">Testimonials</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="hover:text-primary">Pricing</button></li>
              <li><button onClick={() => scrollToSection('faq')} className="hover:text-primary">FAQ</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="hover:text-primary">Contact</button></li>
            </ul>
          </div>
          <div className="navbar-end">
            <button onClick={onSignInClick} className="btn btn-ghost mr-2">Sign In</button>
            <button onClick={onGetStartedClick} className="btn btn-primary">Register Now</button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 pt-16">
        <div className="hero-content text-center max-w-4xl">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {websiteContent.title}
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-base-content/80">
              {websiteContent.description}
            </p>
            <p className="text-lg mb-8 text-base-content/70">
              {websiteContent.tagline}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button onClick={onGetStartedClick} className="btn btn-primary btn-lg">
                Register Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button onClick={() => scrollToSection('contact')} className="btn btn-outline btn-lg">
                View Demo
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-base-content/60">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Paystack Supported
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Flutterwave Ready
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Bank Transfer Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-base-content/70">Get started in minutes with our simple 3-step process</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Setup</h3>
              <p className="text-base-content/70">Create your school account and import student data in minutes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collect Payments</h3>
              <p className="text-base-content/70">Parents pay fees online via multiple payment methods</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track & Reconcile</h3>
              <p className="text-base-content/70">Get AI-powered insights and automated reconciliation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-base-content/70">Everything you need to manage school fees efficiently</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {websiteContent.features.map((feature) => (
              <div key={feature.id} className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
                <div className="card-body">
                  <div className="text-primary mb-4">
                    {getFeatureIcon(feature.icon)}
                  </div>
                  <h3 className="card-title text-xl mb-3">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{websiteContent.testimonials.title}</h2>
            <p className="text-lg text-base-content/70">Trusted by school administrators across Nigeria</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {websiteContent.testimonials.items.map((testimonial) => (
              <div key={testimonial.id} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-lg mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-base-content/70">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-base-content/70 mb-6">Choose the plan that fits your school's needs</p>
            
            <div className="flex justify-center mb-8">
              <div className="tabs tabs-boxed">
                <button 
                  className={`tab ${selectedPlan === 'monthly' ? 'tab-active' : ''}`}
                  onClick={() => setSelectedPlan('monthly')}
                >
                  Monthly
                </button>
                <button 
                  className={`tab ${selectedPlan === 'yearly' ? 'tab-active' : ''}`}
                  onClick={() => setSelectedPlan('yearly')}
                >
                  Yearly
                  <span className="badge badge-primary badge-sm ml-1">Save 20%</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={plan.id} className={`card bg-base-100 shadow-lg border-2 relative ${index === 1 ? 'border-primary scale-105' : 'border-base-300'}`}>
                {index === 1 && (
                  <div className="badge badge-primary absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </div>
                )}
                <div className="card-body text-center">
                  <h3 className="card-title justify-center text-2xl mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-primary mb-2">
                    ₦{(selectedPlan === 'yearly' ? plan.prices.yearly : plan.prices.monthly).toLocaleString('en-NG')}
                    <span className="text-lg text-base-content/60 font-normal">
                      /{selectedPlan === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                  <p className="text-base-content/70 mb-6">
                    {plan.limits.students > 0 ? `Up to ${plan.limits.students} students` : 'Unlimited students'} • {plan.limits.storage} storage
                  </p>
                  
                  <ul className="text-left space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={onGetStartedClick} 
                    className={`btn btn-block ${index === 1 ? 'btn-primary' : 'btn-outline btn-primary'}`}
                  >
                    {plan.name === 'Starter' ? 'Register Now' : 'Register Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-base-content/70">All plans include 24/7 support • No setup fees • 30-day money-back guarantee</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your School's Fee Collection?</h2>
          <p className="text-xl mb-8 opacity-90">Join hundreds of Nigerian schools already using SchoolFees.NG</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onGetStartedClick} className="btn btn-secondary btn-lg">
              Register Your School Now
            </button>
            <button onClick={() => scrollToSection('contact')} className="btn btn-outline btn-secondary btn-lg">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-base-content/70">Get answers to common questions about SchoolFees.NG</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="collapse collapse-plus bg-base-200">
                <input type="radio" name="faq-accordion-1" /> 
                <div className="collapse-title text-lg font-medium">
                  How quickly can I set up my school?
                </div>
                <div className="collapse-content"> 
                  <p>You can have your school fully set up and collecting payments within 24 hours. Our onboarding team will help you import your students and configure everything.</p>
                </div>
              </div>

              <div className="collapse collapse-plus bg-base-200">
                <input type="radio" name="faq-accordion-2" /> 
                <div className="collapse-title text-lg font-medium">
                  Which payment methods do you support?
                </div>
                <div className="collapse-content"> 
                  <p>We support Paystack, Flutterwave, bank transfers, USSD, and card payments. Parents can pay using any method that's convenient for them.</p>
                </div>
              </div>

              <div className="collapse collapse-plus bg-base-200">
                <input type="radio" name="faq-accordion-3" /> 
                <div className="collapse-title text-lg font-medium">
                  Do you charge transaction fees?
                </div>
                <div className="collapse-content"> 
                  <p>We don't charge additional transaction fees. You only pay the standard gateway fees from Paystack/Flutterwave, which are among the lowest in Nigeria.</p>
                </div>
              </div>

              <div className="collapse collapse-plus bg-base-200">
                <input type="radio" name="faq-accordion-4" /> 
                <div className="collapse-title text-lg font-medium">
                  Can parents track their payment history?
                </div>
                <div className="collapse-content"> 
                  <p>Yes! Parents have access to a dedicated portal where they can view all payment history, download receipts, and see outstanding balances for their children.</p>
                </div>
              </div>

              <div className="collapse collapse-plus bg-base-200">
                <input type="radio" name="faq-accordion-5" /> 
                <div className="collapse-title text-lg font-medium">
                  Is my school data secure?
                </div>
                <div className="collapse-content"> 
                  <p>Absolutely. We use bank-grade security with SSL encryption, regular backups, and comply with Nigerian data protection regulations to keep your information safe.</p>
                </div>
              </div>

              <div className="collapse collapse-plus bg-base-200">
                <input type="radio" name="faq-accordion-6" /> 
                <div className="collapse-title text-lg font-medium">
                  Can I export my financial reports?
                </div>
                <div className="collapse-content"> 
                  <p>Yes, you can export detailed financial reports in PDF and Excel formats. Generate reports by term, class, payment method, or any custom date range.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer footer-center bg-base-200 text-base-content p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <div className="space-y-2">
              <p className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {websiteContent.contactInfo.email}
              </p>
              <p className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {websiteContent.contactInfo.phone}
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <div className="space-y-2">
              <button onClick={() => scrollToSection('features')} className="link link-hover">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="link link-hover">Pricing</button>
              <button onClick={() => scrollToSection('faq')} className="link link-hover">FAQ</button>
              <button onClick={onSignInClick} className="link link-hover">Sign In</button>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <div className="space-y-2">
              <a className="link link-hover">Privacy Policy</a>
              <a className="link link-hover">Terms of Service</a>
              <a className="link link-hover">Help Center</a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-base-content/20 w-full text-center">
          <p>&copy; 2024 {websiteContent.title}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLandingPage;