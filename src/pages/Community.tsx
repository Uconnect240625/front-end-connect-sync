
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Message {
  id: string;
  message: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
  } | null;
}

export default function Community() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    console.log('Fetching community messages...');
    try {
      const { data, error } = await supabase
        .from('community_messages')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      console.log('Raw data from database:', data);
      
      if (data) {
        const processedMessages = data.map((msg: any) => {
          console.log('Processing message:', msg);
          return {
            ...msg,
            profiles: msg.profiles && 
                      typeof msg.profiles === 'object' && 
                      msg.profiles !== null &&
                      'full_name' in msg.profiles 
              ? { full_name: (msg.profiles as any).full_name }
              : null
          };
        });
        
        console.log('Processed messages:', processedMessages);
        setMessages(processedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('community_messages')
        .insert({
          message: newMessage.trim(),
          user_id: user.id
        });

      if (error) throw error;

      setNewMessage('');
      fetchMessages();
      toast.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
          <p className="mt-4 text-gray-600">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🏛️ Community Chat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share something with the community..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className="p-3 bg-white rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">
                      {message.profiles?.full_name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{message.message}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
