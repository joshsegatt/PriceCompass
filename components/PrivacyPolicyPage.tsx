
import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <section className="hero-cinematic w-full relative min-h-screen">
      <div className="relative z-10 max-w-screen-lg mx-auto px-6 sm:px-8 lg:px-12 py-24 md:py-32">
        <div className="bg-slate-800/50 backdrop-blur-lg border border-white/20 shadow-soft p-8 md:p-12 rounded-2xl">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tighter mb-6">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400 mb-8">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-invert prose-slate max-w-none text-slate-300">
            <p>
              Price Compass Ltd ("us", "we", or "our") operates the Price Compass website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>

            <h2 className="text-white">Information Collection and Use</h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            <h3>Types of Data Collected</h3>
            <ul>
              <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to: Email address, First name and last name, Cookies and Usage Data.</li>
              <li><strong>Financial Data:</strong> When you use our dashboard feature, you may provide details about your monthly bills, such as provider names and costs. If you connect your accounts, we will receive transaction data from third-party partners to automatically identify these bills. This data is handled with bank-level security.</li>
            </ul>

            <h2 className="text-white">Use of Data</h2>
            <p>
              Price Compass Ltd uses the collected data for various purposes:
            </p>
            <ul>
              <li>To provide and maintain the Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer care and support</li>
              <li>To provide analysis or valuable information so that we can improve the Service</li>
              <li>To monitor the usage of the Service</li>
            </ul>

            <h2 className="text-white">Data Security</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
            
            <h2 className="text-white">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-white">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us by email: privacy@pricecompass.example.com.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;