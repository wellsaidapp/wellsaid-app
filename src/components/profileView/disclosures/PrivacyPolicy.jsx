import React from 'react';

const PrivacyPolicy = () => (
  <div className="privacy-policy px-4 py-6">
    <p className="mb-4">
      <strong>Effective Date:</strong> 1/1/2025
    </p>

    <h3 className="font-semibold mt-4 mb-2">1. What We Collect</h3>
    <p className="mb-4">We collect:</p>
    <ul className="list-disc pl-5 mb-4">
      <li>Information you provide (e.g. name, email, relationships)</li>
      <li>AI-assisted entries and transcripts</li>
      <li>Metadata (e.g. usage history)</li>
    </ul>
    <p className="mb-4">
      We do not collect biometric data, financial information, or device-level identifiers beyond what is required for functionality.
    </p>

    <h3 className="font-semibold mt-4 mb-2">2. Children's Data</h3>
    <p className="mb-4">
      This app is not directed at children under 13. However, adult users may reference children in their journal entries. These entries are stored securely and are not visible to others unless explicitly shared by the user. Users are responsible for using discretion when inputting identifying details about minors.
    </p>
    <p className="mb-4">
      We do not knowingly collect data directly from children. If we become aware that such data has been submitted in violation of our policies, we will delete it upon request.
    </p>

    <h3 className="font-semibold mt-4 mb-2">3. How We Use Your Data</h3>
    <ul className="list-disc pl-5 mb-4">
      <li>To provide personalized AI-assisted reflections</li>
      <li>To improve the user experience</li>
      <li>For security and support</li>
    </ul>
    <p className="mb-4">
      We do not sell or share your personal data with third parties. All data is encrypted in transit and at rest.
    </p>

    <h3 className="font-semibold mt-4 mb-2">4. User Rights</h3>
    <p className="mb-4">
      You may request to delete your data or account by contacting us at{' '}
      <a href="mailto:hello@wellsaid.com" className="text-blue-600 underline">
        hello@wellsaid.com
      </a>. We will respond within 30 days.
    </p>
  </div>
);

export default PrivacyPolicy;
