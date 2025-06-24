
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';

const UploadNotes = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: '',
    semester: '',
    subject: '',
    description: ''
  });
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!formData.studentName || !formData.semester || !formData.subject || !file || !formData.description) {
      alert('Please fill out all fields and upload a PDF.');
      return;
    }
    alert('✅ Notes uploaded successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-2xl mx-auto pt-20 px-4">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-center text-2xl font-bold mb-6 text-gray-800">📤 Upload Notes</h1>

          <div className="space-y-4">
            <div>
              <label htmlFor="studentName" className="block font-semibold mb-2">👤 Student Name</label>
              <input 
                type="text" 
                id="studentName" 
                value={formData.studentName}
                onChange={handleInputChange}
                placeholder="Enter student name" 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="semester" className="block font-semibold mb-2">🎓 Semester</label>
              <input 
                type="text" 
                id="semester" 
                value={formData.semester}
                onChange={handleInputChange}
                placeholder="Semester (e.g., 4th)" 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block font-semibold mb-2">📘 Subject</label>
              <input 
                type="text" 
                id="subject" 
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Subject (e.g., DSA)" 
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="notesFile" className="block font-semibold mb-2">📎 Upload PDF</label>
              <input 
                type="file" 
                id="notesFile" 
                accept="application/pdf" 
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="description" className="block font-semibold mb-2">📝 Description</label>
              <textarea 
                id="description" 
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Write a brief description..." 
                className="w-full p-3 border border-gray-300 rounded-lg h-20"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleUpload}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                ✅ Upload Now
              </button>
              <button 
                onClick={() => navigate('/notes')}
                className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
              >
                ← Back to Notes Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadNotes;
