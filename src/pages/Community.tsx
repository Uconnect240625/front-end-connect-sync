import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Upload, Send, File, Image, Video } from 'lucide-react';
import { toast } from 'sonner';

interface CommunityMessage {
  id: string;
  user_id: string;
  university_id: string;
  message: string | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string;
  } | null;
}

export default function Community() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      console.log('Fetching community messages...');
      const { data, error } = await supabase
        .from('community_messages')
        .select(`
          *,
          profiles!inner (
            full_name
          )
        `)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
        return;
      }

      console.log('Raw messages data:', data);

      // Type assertion to handle the join result with proper null checking
      const messagesWithProfiles = (data || []).map(msg => {
        console.log('Processing message:', msg);
        return {
          ...msg,
          profiles: msg.profiles && 
                    typeof msg.profiles === 'object' && 
                    msg.profiles !== null &&
                    'full_name' in msg.profiles 
            ? msg.profiles as { full_name: string }
            : null
        };
      }) as CommunityMessage[];

      console.log('Processed messages:', messagesWithProfiles);
      setMessages(messagesWithProfiles);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('community-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_messages'
        },
        (payload) => {
          console.log('New message received:', payload);
          // Fetch the complete message with profile data
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('community-files')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('community-files')
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      name: file.name,
      type: file.type,
      size: file.size
    };
  };

  const sendMessage = async () => {
    if (!user || (!newMessage.trim() && !selectedFile)) return;

    setUploading(true);
    try {
      let fileData = null;
      
      if (selectedFile) {
        fileData = await uploadFile(selectedFile);
      }

      const { error } = await supabase
        .from('community_messages')
        .insert({
          user_id: user.id,
          university_id: user.user_metadata?.university_id,
          message: newMessage.trim() || null,
          file_url: fileData?.url || null,
          file_name: fileData?.name || null,
          file_type: fileData?.type || null,
          file_size: fileData?.size || null
        });

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        return;
      }

      setNewMessage('');
      setSelectedFile(null);
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setUploading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return <File className="w-4 h-4" />;
    
    if (fileType.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    } else if (fileType.startsWith('video/')) {
      return <Video className="w-4 h-4" />;
    } else {
      return <File className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading community chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="h-[80vh] flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">🏫 University Community</CardTitle>
          <p className="text-muted-foreground">
            Chat with your fellow students and share files
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/30 rounded-lg">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {message.profiles?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm">
                        {message.profiles?.full_name || 'Unknown User'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleString()}
                      </span>
                    </div>
                    
                    {message.message && (
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {message.message}
                      </p>
                    )}
                    
                    {message.file_url && (
                      <div className="mt-2">
                        {message.file_type?.startsWith('image/') ? (
                          <img 
                            src={message.file_url} 
                            alt={message.file_name || 'Image'} 
                            className="max-w-xs rounded-lg cursor-pointer"
                            onClick={() => window.open(message.file_url!, '_blank')}
                          />
                        ) : message.file_type?.startsWith('video/') ? (
                          <video 
                            src={message.file_url} 
                            controls 
                            className="max-w-xs rounded-lg"
                          />
                        ) : (
                          <a 
                            href={message.file_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                          >
                            {getFileIcon(message.file_type)}
                            <span className="text-sm">{message.file_name}</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="space-y-3">
            {selectedFile && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted p-2 rounded">
                {getFileIcon(selectedFile.type)}
                <span>{selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="ml-auto"
                >
                  ×
                </Button>
              </div>
            )}
            
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={uploading}
              />
              
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              />
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={sendMessage}
                disabled={(!newMessage.trim() && !selectedFile) || uploading}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
