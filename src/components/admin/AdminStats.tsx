
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminStatsProps {
  stats: {
    pendingApprovals: number;
    totalRevenue: number;
    activeUsers: number;
    pendingComplaints: number;
  };
}

const AdminStats = ({ stats }: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          <span className="text-2xl">⏳</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.pendingApprovals}</div>
          <p className="text-xs text-muted-foreground">Awaiting review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <span className="text-2xl">💰</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">₹{stats.totalRevenue}</div>
          <p className="text-xs text-muted-foreground">From paid features</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <span className="text-2xl">👥</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.activeUsers}</div>
          <p className="text-xs text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Complaints</CardTitle>
          <span className="text-2xl">🚨</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.pendingComplaints}</div>
          <p className="text-xs text-muted-foreground">Need attention</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
