import React from 'react';

const AIDisclosure = () => (
  <div className="ai-disclosure px-4 py-6">
    <h3 className="text-lg font-semibold mb-2">1. AI-Powered Content</h3>
    <p className="mb-4">
      WellSaid uses artificial intelligence to assist with journaling, prompts, and summaries. These outputs are automatically generated and may not always be accurate or complete. They are intended to support personal reflection, not replace professional advice or factual verification.
    </p>

    <h3 className="text-lg font-semibold mb-2">2. Control of Inputs</h3>
    <p className="mb-4">
      Only the data you provide is used. The app does not access your device's microphone or contacts without explicit permission. The AI system does not make independent decisions or predictions — it only responds to your inputs.
    </p>

    <h3 className="text-lg font-semibold mb-2">3. Accountability</h3>
    <p className="mb-4">
      You are responsible for the content you provide to the AI assistant, including any personally identifiable information about others. You are encouraged to use caution and good judgment when sharing sensitive or emotional content.
    </p>

    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <p className="text-sm">
        <strong>NOTICE:</strong><br />
        This app uses artificial intelligence (AI) to support journaling and memory collection. AI-generated responses are private and based only on the content you choose to share. All data is encrypted. You control what is captured and may request deletion at any time.
      </p>
    </div>
  </div>
);

export default AIDisclosure;
