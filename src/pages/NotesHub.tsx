
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotesHub = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const defaultSubjects = ['DSA', 'Mathematics', 'Physics', 'DBMS', 'Operating Systems', 'English'];

  useEffect(() => {
    const stored = localStorage.getItem('subjects');
    const savedSubjects = stored ? JSON.parse(stored) : defaultSubjects;
    setSubjects(savedSubjects);
  }, []);

  const saveSubjects = (newSubjects: string[]) => {
    setSubjects(newSubjects);
    localStorage.setItem('subjects', JSON.stringify(newSubjects));
  };

  const addSubject = () => {
    if (newSubject.trim()) {
      const updated = [...subjects, newSubject.trim()];
      saveSubjects(updated);
      setNewSubject('');
    }
  };

  const deleteSubject = (subjectToDelete: string) => {
    if (confirm(`Delete "${subjectToDelete}"?`)) {
      const updated = subjects.filter(s => s !== subjectToDelete);
      saveSubjects(updated);
    }
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-center mb-6">📚 U Connect Notes Hub</h1>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search subjects..."
            className="w-full p-3 border border-gray-300 rounded-lg mb-6"
          />

          <div className="space-y-3 mb-6">
            {filteredSubjects.map((subject, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg transition-all hover:bg-blue-50 hover:scale-105 cursor-pointer"
                onDoubleClick={() => deleteSubject(subject)}
              >
                {subject}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSubject()}
              placeholder="✏️ Add a new subject..."
              className="flex-1 p-3 border border-gray-300 rounded-lg"
            />
            <button
              onClick={addSubject}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              📤 Upload Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesHub;
