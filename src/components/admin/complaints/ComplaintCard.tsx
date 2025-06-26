
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2, FileText } from 'lucide-react';
import { ComplaintCardProps } from './types';
import { formatDate, getStatusColor, getStatusLabel } from './utils';

const ComplaintCard = ({
  complaint,
  onStatusUpdate,
  onDeleteComplaint,
  onDownloadFile
}: ComplaintCardProps) => {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={getStatusColor(complaint.status)}>
              {getStatusLabel(complaint.status)}
            </Badge>
            <Badge variant="outline">{complaint.category}</Badge>
          </div>
          <h4 className="font-semibold text-lg">{complaint.title}</h4>
          <p className="text-gray-700 mt-2">{complaint.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            Submitted: {formatDate(complaint.created_at)}
          </p>
          
          {complaint.file_url && (
            <div className="mt-3 p-3 bg-gray-50 rounded border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Attachment</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDownloadFile(complaint.file_url!, `complaint-${complaint.id}-attachment`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {complaint.status === 'open' && (
          <Button
            size="sm"
            onClick={() => onStatusUpdate(complaint.id, 'in_progress')}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            🔄 Start Working
          </Button>
        )}
        
        {complaint.status !== 'resolved' && (
          <Button
            size="sm"
            onClick={() => onStatusUpdate(complaint.id, 'resolved')}
            className="bg-green-600 hover:bg-green-700"
          >
            ✅ Mark as Resolved
          </Button>
        )}

        {complaint.status === 'resolved' && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDeleteComplaint(complaint.id, complaint.file_url)}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Complaint
          </Button>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
