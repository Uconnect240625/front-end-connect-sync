
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HelpCenter = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: '',
    issueCategory: '',
    issueTitle: '',
    description: '',
    screenshot: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.issueCategory || !formData.issueTitle || !formData.description) {
      alert('Please fill in all required fields.');
      return;
    }
    alert('✅ Issue submitted successfully!');
    setFormData({
      studentName: '',
      issueCategory: '',
      issueTitle: '',
      description: '',
      screenshot: null
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <button 
            onClick={() => navigate('/uconnect')}
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to U Connect
          </button>
          <h1 className="text-3xl font-bold text-center mb-6 text-red-600">🚨 Help Centre</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">👤 Student Name</label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                placeholder="Enter your name"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">📂 Issue Category</label>
              <input
                type="text"
                value={formData.issueCategory}
                onChange={(e) => setFormData({...formData, issueCategory: e.target.value})}
                placeholder="e.g., Bug, UI, Suggestion"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">📌 Issue Title</label>
              <input
                type="text"
                value={formData.issueTitle}
                onChange={(e) => setFormData({...formData, issueTitle: e.target.value})}
                placeholder="Short descriptive title"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">📝 Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Explain the issue in detail..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg resize-vertical"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">📎 Upload Screenshot</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, screenshot: e.target.files?.[0] || null})}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              ✅ Submit Issue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
