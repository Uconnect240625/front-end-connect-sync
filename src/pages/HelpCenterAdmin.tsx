
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { HelpCircle, CheckCircle } from 'lucide-react';

const HelpCenterAdmin = () => {
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: 'Wi-Fi not working in Hostel B',
      category: 'Hostel',
      submittedBy: 'sahil123@cumail.in',
      description: 'Internet has been down for the last 2 days on 2nd floor. Please fix it asap.',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Classroom Projector not working',
      category: 'Academics',
      submittedBy: 'tanya_k@cumail.in',
      description: 'Projector in NB-4 Room 201 is broken. No lectures can be projected.',
      status: 'resolved'
    },
    {
      id: 3,
      title: 'Mess Food Quality Issue',
      category: 'Mess',
      submittedBy: 'student@cumail.in',
      description: 'Food quality has been poor for the past week. Multiple students have complained.',
      status: 'pending'
    }
  ]);

  const markAsResolved = (complaintId: number) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === complaintId 
        ? { ...complaint, status: 'resolved' }
        : complaint
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Hostel':
        return 'bg-blue-100 text-blue-800';
      case 'Academics':
        return 'bg-green-100 text-green-800';
      case 'Mess':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <HelpCircle size={32} className="text-red-600" />
            <h1 className="text-3xl font-bold text-red-600">Help & Complaints Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage and resolve student complaints and issues</p>
        </div>

        <div className="grid gap-6">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {complaint.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(complaint.category)}`}>
                  {complaint.category}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm">
                  <strong>Submitted by:</strong> {complaint.submittedBy}
                </p>
                <p className="text-sm">
                  <strong>Description:</strong> {complaint.description}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className={`flex items-center space-x-2 ${
                  complaint.status === 'resolved' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {complaint.status === 'resolved' && <CheckCircle size={16} />}
                  <span className="font-medium capitalize">
                    Status: {complaint.status}
                  </span>
                </div>
                
                {complaint.status === 'pending' && (
                  <Button
                    onClick={() => markAsResolved(complaint.id)}
                    className="bg-blue-600 hover:bg-red-600 text-white transition-colors"
                  >
                    Mark as Resolved
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {complaints.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No complaints to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpCenterAdmin;
