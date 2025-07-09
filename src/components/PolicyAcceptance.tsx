
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const PolicyAcceptance = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAcceptPolicies = async () => {
    if (!isChecked) {
      toast({
        title: "Please acknowledge the policies",
        description: "You must check the box to acknowledge that you have read and understood the policies.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Record policy acceptance
      const { error: acceptanceError } = await supabase
        .from('policy_acceptances')
        .insert({
          user_id: user.id,
          policy_version: 'v1.0',
          ip_address: 'client_ip' // You can implement IP detection if needed
        });

      if (acceptanceError) {
        throw acceptanceError;
      }

      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          policies_accepted: true,
          policies_accepted_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        throw profileError;
      }

      toast({
        title: "Policies Accepted",
        description: "Thank you for accepting our policies. Welcome to U Connect!",
      });

      // Navigate to main application
      navigate('/uconnect');
    } catch (error) {
      console.error('Error accepting policies:', error);
      toast({
        title: "Error",
        description: "Failed to save policy acceptance. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white border-gray-200 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-900">
            <span className="px-2 mx-1 rounded">U</span>Connect Policies
          </CardTitle>
          <p className="text-gray-600">Please read and accept our policies to continue</p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full rounded-md border p-4 mb-6">
            <div className="space-y-6 text-sm text-gray-700">
              {/* Privacy Policy */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">PRIVACY POLICY</h3>
                <div className="space-y-3">
                  <p>
                    This Privacy Policy describes how U Connect ("we," "our," or "us") collects, uses, and protects your personal information when you use our platform.
                  </p>
                  
                  <h4 className="font-semibold">Information We Collect</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Personal identification information (name, email address, university details)</li>
                    <li>Academic information (semester, subjects, courses)</li>
                    <li>Communication data (messages, posts, notes shared on the platform)</li>
                    <li>Usage data (how you interact with our services)</li>
                    <li>Device information (IP address, browser type, operating system)</li>
                  </ul>

                  <h4 className="font-semibold">How We Use Your Information</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>To provide and maintain our services</li>
                    <li>To facilitate connections between students (roommate finder, marketplace, study groups)</li>
                    <li>To send notifications about events, announcements, and platform updates</li>
                    <li>To improve our services and develop new features</li>
                    <li>To ensure platform security and prevent fraud</li>
                  </ul>

                  <h4 className="font-semibold">Information Sharing</h4>
                  <p>
                    We do not sell your personal information. We may share your information only in the following circumstances:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>With other students on the platform for legitimate educational and social purposes</li>
                    <li>With university administrators when required for academic or safety purposes</li>
                    <li>With service providers who help us operate the platform</li>
                    <li>When required by law or to protect our rights and safety</li>
                  </ul>

                  <h4 className="font-semibold">Data Security</h4>
                  <p>
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>

                  <h4 className="font-semibold">Your Rights</h4>
                  <p>
                    You have the right to access, update, or delete your personal information. You can also opt out of certain communications and control your privacy settings within the platform.
                  </p>
                </div>
              </div>

              {/* Terms of Service */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">TERMS OF SERVICE</h3>
                <div className="space-y-3">
                  <h4 className="font-semibold">Acceptance of Terms</h4>
                  <p>
                    By using U Connect, you agree to these Terms of Service. If you disagree with any part of these terms, you may not access or use our services.
                  </p>

                  <h4 className="font-semibold">User Accounts</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>You must provide accurate and complete information when creating your account</li>
                    <li>You are responsible for maintaining the security of your account credentials</li>
                    <li>You must be a current student or authorized member of a participating university</li>
                    <li>One account per person is allowed</li>
                  </ul>

                  <h4 className="font-semibold">Acceptable Use</h4>
                  <p>You agree not to:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use the platform for any illegal or unauthorized purpose</li>
                    <li>Share inappropriate, offensive, or harmful content</li>
                    <li>Harass, bully, or discriminate against other users</li>
                    <li>Share false or misleading information</li>
                    <li>Attempt to gain unauthorized access to the platform or other users' accounts</li>
                    <li>Use the platform for commercial purposes without permission</li>
                  </ul>

                  <h4 className="font-semibold">Content and Intellectual Property</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>You retain ownership of content you create and share on the platform</li>
                    <li>By sharing content, you grant U Connect a license to display and distribute it within the platform</li>
                    <li>You must respect the intellectual property rights of others</li>
                    <li>U Connect reserves the right to remove content that violates these terms</li>
                  </ul>

                  <h4 className="font-semibold">Platform Features</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Notes sharing: Share study materials responsibly and respect copyright</li>
                    <li>Marketplace: Ensure accurate descriptions and fair pricing</li>
                    <li>Roommate finder: Provide honest information and communicate respectfully</li>
                    <li>Events: Organize legitimate educational and social events</li>
                  </ul>

                  <h4 className="font-semibold">Payments and Fees</h4>
                  <p>
                    Some features may require payment. All fees are non-refundable unless specified otherwise. You are responsible for providing accurate payment information.
                  </p>

                  <h4 className="font-semibold">Termination</h4>
                  <p>
                    We reserve the right to suspend or terminate your account for violations of these terms or for any other reason at our discretion.
                  </p>

                  <h4 className="font-semibold">Limitation of Liability</h4>
                  <p>
                    U Connect is provided "as is" without warranties. We are not liable for any damages arising from your use of the platform.
                  </p>

                  <h4 className="font-semibold">Changes to Terms</h4>
                  <p>
                    We may update these terms from time to time. Continued use of the platform constitutes acceptance of updated terms.
                  </p>
                </div>
              </div>

              {/* Community Guidelines */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">COMMUNITY GUIDELINES</h3>
                <div className="space-y-3">
                  <p>
                    U Connect is designed to foster a positive, inclusive, and supportive community for students. These guidelines help ensure everyone has a great experience.
                  </p>

                  <h4 className="font-semibold">Be Respectful</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Treat all community members with kindness and respect</li>
                    <li>Use inclusive language and be mindful of diverse backgrounds</li>
                    <li>Respect different opinions and perspectives</li>
                    <li>Avoid discriminatory language or behavior</li>
                  </ul>

                  <h4 className="font-semibold">Academic Integrity</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Share notes and study materials ethically</li>
                    <li>Do not share copyrighted content without permission</li>
                    <li>Respect your university's academic integrity policies</li>
                    <li>Give credit where credit is due</li>
                  </ul>

                  <h4 className="font-semibold">Safety First</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Protect your personal information and privacy</li>
                    <li>Meet new connections in public places</li>
                    <li>Report suspicious or inappropriate behavior</li>
                    <li>Follow university safety guidelines for events and meetups</li>
                  </ul>

                  <h4 className="font-semibold">Quality Content</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Share accurate and helpful information</li>
                    <li>Use clear and descriptive titles for posts and listings</li>
                    <li>Keep content relevant to the platform's purpose</li>
                    <li>Avoid spam or repetitive posts</li>
                  </ul>

                  <h4 className="font-semibold">Marketplace Ethics</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Provide honest descriptions of items for sale</li>
                    <li>Honor your commitments to buyers and sellers</li>
                    <li>Report fraudulent or suspicious listings</li>
                    <li>Follow fair pricing practices</li>
                  </ul>

                  <h4 className="font-semibold">Reporting and Enforcement</h4>
                  <p>
                    If you encounter behavior that violates these guidelines, please report it through our help center. We take all reports seriously and will take appropriate action, which may include warnings, content removal, or account suspension.
                  </p>

                  <h4 className="font-semibold">Building Community</h4>
                  <p>
                    We encourage you to actively participate in building a positive community by:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Helping fellow students with questions and challenges</li>
                    <li>Sharing valuable resources and opportunities</li>
                    <li>Organizing or participating in educational and social events</li>
                    <li>Providing constructive feedback to improve the platform</li>
                  </ul>
                </div>
              </div>

              {/* Copyright Notice */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">COPYRIGHT NOTICE</h3>
                <p className="text-sm text-gray-600">
                  © 2025 U Connect. All Rights Reserved. The content, layout, design, and policies of U Connect are the intellectual property of U Connect. No part of this document may be reproduced, stored, or transmitted in any form without prior written permission from the Founder.
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="policy-acceptance"
                checked={isChecked}
                onCheckedChange={(checked) => setIsChecked(checked === true)}
                className="border-gray-300"
              />
              <label 
                htmlFor="policy-acceptance" 
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                I hereby acknowledge that I have read and understood the above policy
              </label>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleAcceptPolicies}
                disabled={!isChecked || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 text-lg"
              >
                {isSubmitting ? 'Accepting...' : 'Continue to U Connect'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyAcceptance;
