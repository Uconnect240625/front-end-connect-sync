
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

const pgListingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['pg', 'flat', 'room']),
  location: z.string().min(1, 'Location is required'),
  price: z.string().min(1, 'Price is required'),
  description: z.string().optional(),
  contactPhone: z.string().min(10, 'Valid contact number is required'),
});

type PGListingFormData = z.infer<typeof pgListingSchema>;

const PGListingForm = () => {
  const { profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PGListingFormData>({
    resolver: zodResolver(pgListingSchema),
    defaultValues: {
      title: '',
      type: 'pg',
      location: '',
      price: '',
      description: '',
      contactPhone: '',
    },
  });

  const onSubmit = async (data: PGListingFormData) => {
    if (!profile) {
      toast.error('Please log in to submit a PG listing');
      return;
    }

    if (profile.role !== 'admin') {
      toast.error('Only admins can create PG listings');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('pg_listings')
        .insert({
          user_id: profile.id,
          university_id: profile.university_id,
          title: data.title,
          type: data.type as any,
          location: data.location,
          price: parseFloat(data.price),
          description: data.description,
          contact_phone: data.contactPhone,
          approval_status: 'approved', // Admins can directly approve their listings
          is_paid: true, // Assume admin listings are paid
        });

      if (error) {
        console.error('Error submitting PG listing:', error);
        toast.error('Failed to submit PG listing');
        return;
      }

      toast.success('PG listing submitted successfully!');
      form.reset();
    } catch (error) {
      console.error('Error submitting PG listing:', error);
      toast.error('An error occurred while submitting your listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile || profile.role !== 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Restricted</CardTitle>
          <CardDescription>Only admins can create PG listings.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>List a PG</CardTitle>
        <CardDescription>Add a new PG listing for your university</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PG Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Star Boys PG" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pg">PG</SelectItem>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="room">Room</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sector 125, Near Gate 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₹/month)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 6500" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPhone"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional details about the PG..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Submit PG Listing'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PGListingForm;
