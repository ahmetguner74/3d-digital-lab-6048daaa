
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Inbox, 
  Loader2, 
  MailOpen, 
  RefreshCcw, 
  Search, 
  Trash2 
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { ContactMessage } from "@/types/supabase-extensions";

interface Message extends Partial<ContactMessage> {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const { toast } = useToast();
  
  const messagesPerPage = 10;
  
  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      try {
        const { count, error: countError } = await supabase
          .from('contact_messages' as any)
          .select('*', { count: 'exact', head: true });
        
        if (!countError) {
          setTotalMessages(count || 0);
        } else {
          console.error("Mesaj sayısı alınırken hata:", countError);
          setTotalMessages(0);
        }
        
        const from = (currentPage - 1) * messagesPerPage;
        const to = from + messagesPerPage - 1;
        
        const { data, error } = await supabase
          .from('contact_messages' as any)
          .select('*')
          .order('created_at', { ascending: false })
          .range(from, to);
        
        if (!error) {
          // Daha güvenli tip dönüşümü - önce unknown olarak değerlendirip sonra Message[] olarak dönüştürelim
          const safeData = (data as unknown) as Message[];
          setMessages(safeData || []);
        } else {
          throw error;
        }
      } catch (error) {
        console.error("Mesajlar yüklenirken hata:", error);
        toast({
          title: "Hata",
          description: "Mesajlar yüklenirken bir hata oluştu.",
          variant: "destructive"
        });
        setMessages([]);
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMessages();
    
    try {
      const channel = supabase
        .channel('messages-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, fetchMessages)
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error("Realtime mesaj değişiklikleri dinlenirken hata:", error);
    }
  }, [currentPage]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleMessageClick = async (message: Message) => {
    setSelectedMessage(message);
    
    if (!message.read) {
      try {
        await supabase
          .from('contact_messages' as any)
          .update({ read: true })
          .eq('id', message.id);
        
        setMessages(messages.map(m => 
          m.id === message.id ? { ...m, read: true } : m
        ));
      } catch (error) {
        console.error("Mesaj okundu olarak işaretlenirken hata:", error);
      }
    }
  };
  
  const handleBackToList = () => {
    setSelectedMessage(null);
  };
  
  const handleToggleRead = async (messageId: string, currentReadStatus: boolean) => {
    try {
      setProcessingAction(`read-${messageId}`);
      
      const { error } = await supabase
        .from('contact_messages' as any)
        .update({ read: !currentReadStatus })
        .eq('id', messageId);
      
      if (error) throw error;
      
      setMessages(messages.map(m => 
        m.id === messageId ? { ...m, read: !currentReadStatus } : m
      ));
      
      toast({
        title: currentReadStatus ? "Okunmadı olarak işaretlendi" : "Okundu olarak işaretlendi",
        description: currentReadStatus 
          ? "Mesaj okunmadı olarak işaretlendi." 
          : "Mesaj okundu olarak işaretlendi."
      });
    } catch (error) {
      console.error("Mesaj durumu değiştirilirken hata:", error);
      toast({
        title: "Hata",
        description: "Mesaj durumu değiştirilirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };
  
  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    
    try {
      setProcessingAction(`delete-${messageId}`);
      
      const { error } = await supabase
        .from('contact_messages' as any)
        .delete()
        .eq('id', messageId);
      
      if (error) throw error;
      
      setMessages(messages.filter(m => m.id !== messageId));
      
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage(null);
      }
      
      toast({
        title: "Mesaj silindi",
        description: "Mesaj başarıyla silindi."
      });
    } catch (error) {
      console.error("Mesaj silinirken hata:", error);
      toast({
        title: "Hata",
        description: "Mesaj silinirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };
  
  const filteredMessages = searchTerm
    ? messages.filter(message => 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : messages;
  
  const totalPages = Math.ceil(totalMessages / messagesPerPage);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <AdminLayout title="Mesajlar">
      <div className="flex items-center space-x-2 mb-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/dashboard" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Dashboard'a Dön</span>
          </Link>
        </Button>
      </div>
      
      {selectedMessage ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleBackToList}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Listeye Dön</span>
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.read)}
                  disabled={!!processingAction}
                >
                  {processingAction === `read-${selectedMessage.id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : selectedMessage.read ? (
                    <EyeOff className="h-4 w-4 mr-1" />
                  ) : (
                    <Eye className="h-4 w-4 mr-1" />
                  )}
                  {selectedMessage.read ? "Okunmadı olarak işaretle" : "Okundu olarak işaretle"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  disabled={!!processingAction}
                  className="text-destructive hover:bg-destructive/10"
                >
                  {processingAction === `delete-${selectedMessage.id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-1" />
                  )}
                  Sil
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
              <div className="text-sm text-muted-foreground">
                <p><span className="font-medium">Gönderen:</span> {selectedMessage.name} ({selectedMessage.email})</p>
                <p><span className="font-medium">Tarih:</span> {formatDate(selectedMessage.created_at)}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
            <div className="border-t pt-4">
              <Button asChild>
                <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}>
                  Yanıtla
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Mesaj ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={fetchMessages}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                  Yenile
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tüm Mesajlar</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-12">
                  <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Mesajınız Yok</h3>
                  <p className="text-muted-foreground">
                    Henüz hiç mesaj gönderilmemiş.
                  </p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Durum</TableHead>
                        <TableHead>Gönderen</TableHead>
                        <TableHead>Konu</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden md:table-cell">Tarih</TableHead>
                        <TableHead className="w-[100px]">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMessages.map((message) => (
                        <TableRow key={message.id} className={message.read ? "" : "font-medium bg-muted/20"}>
                          <TableCell>
                            {message.read ? (
                              <MailOpen className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <div className="relative">
                                <Mail className="h-4 w-4 text-primary" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell onClick={() => handleMessageClick(message)} className="cursor-pointer">
                            {message.name}
                          </TableCell>
                          <TableCell onClick={() => handleMessageClick(message)} className="cursor-pointer">
                            {message.subject}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {message.email}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {formatDate(message.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleRead(message.id, message.read)}
                                disabled={!!processingAction}
                              >
                                {processingAction === `read-${message.id}` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : message.read ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteMessage(message.id)}
                                disabled={!!processingAction}
                                className="text-destructive hover:bg-destructive/10"
                              >
                                {processingAction === `delete-${message.id}` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1 || loading}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        <span className="text-sm">
                          Sayfa {currentPage} / {totalPages}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages || loading}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </AdminLayout>
  );
}

function Mail(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
