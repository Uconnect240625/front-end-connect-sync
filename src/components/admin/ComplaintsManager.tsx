
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ComplaintCard from './complaints/ComplaintCard';
import { useComplaintOperations } from './complaints/useComplaintOperations';
import { Complaint } from './complaints/types';

interface ComplaintsManagerProps {
  complaints: Complaint[];
  onComplaintUpdate: () => void;
}

const ComplaintsManager = ({
  complaints,
  onComplaintUpdate
}: ComplaintsManagerProps) => {
  const {
    handleStatusUpdate,
    handleDeleteComplaint,
    handleDownloadFile
  } = useComplaintOperations(onComplaintUpdate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🚨</span>
          Complaints Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {complaints.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No complaints to review</p>
          ) : (
            complaints.map(complaint => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onStatusUpdate={handleStatusUpdate}
                onDeleteComplaint={handleDeleteComplaint}
                onDownloadFile={handleDownloadFile}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplaintsManager;
