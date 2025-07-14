
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const roommateRequestSchema = z.object({
  requesterName: z.string().min(1, 'Name is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  budget: z.string().min(1, 'Budget is required'),
  location: z.string().min(1, 'Location is required'),
  contactNumber: z.string().min(10, 'Valid contact number is required'),
  preferences: z.string().optional(),
});

type RoommateRequestFormData = z.infer<typeof roommateRequestSchema>;

const RoommateRequestForm = () => {
  const { profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RoommateRequestFormData>({
    resolver: zodResolver(roommateRequestSchema),
    defaultValues: {
      requesterName: '',
      gender: 'Male',
      budget: '',
      location: '',
      contactNumber: '',
      preferences: '',
    },
  });

  const onSubmit = async (data: RoommateRequestFormData) => {
    if (!profile) {
      toast.error('Please log in to submit a roommate request');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('roommate_requests')
        .insert({
          user_id: profile.id,
          university_id: profile.university_id,
          requester_name: data.requesterName,
          gender: data.gender,
          budget: parseFloat(data.budget),
          location: data.location,
          contact_number: data.contactNumber,
          preferences: data.preferences,
          approval_status: 'pending',
        });

      if (error) {
        console.error('Error submitting roommate request:', error);
        toast.error('Failed to submit roommate request');
        return;
      }

      toast.success('Roommate request submitted successfully! It will be reviewed by admin.');
      form.reset();
    } catch (error) {
      console.error('Error submitting roommate request:', error);
      toast.error('An error occurred while submitting your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Please Log In</CardTitle>
          <CardDescription>You need to be logged in to post a roommate request.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Roommate Request</CardTitle>
        <CardDescription>Find a roommate for your accommodation</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="requesterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget (₹/month)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 6000" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Near Gate 1, Sector 125" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferences (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Non-smoker, vegetarian, quiet person..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RoommateRequestForm;
