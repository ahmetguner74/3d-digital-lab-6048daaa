
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ContactMessage } from "@/types/supabase-extensions";

interface RecentMessagesProps {
  messages: Partial<ContactMessage>[];
  isLoading?: boolean;
}

export default function RecentMessages({ messages, isLoading = false }: RecentMessagesProps) {
  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <div className="h-5 w-36 bg-muted rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mb-4 pb-4 border-b last:border-b-0 last:pb-0 last:mb-0">
              <div className="h-5 w-3/4 bg-muted rounded animate-pulse mb-2"></div>
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Son Mesajlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Henüz mesaj bulunmuyor.</p>
            <Button asChild className="mt-2" variant="outline">
              <Link to="/admin/messages">Mesajları Yönet</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Son Mesajlar</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin/messages">Tümünü Gör</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {messages.map((message) => (
          <div
            key={message.id}
            className="mb-4 pb-4 border-b last:border-b-0 last:pb-0 last:mb-0"
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium">{message.name}</h4>
              {!message.read && (
                <Badge variant="secondary">Yeni</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1 truncate">
              {message.message?.substring(0, 100)}{message.message && message.message.length > 100 ? "..." : ""}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                {message.created_at && new Date(message.created_at).toLocaleDateString("tr-TR")}
              </span>
              <Button asChild variant="link" size="sm" className="p-0 h-auto">
                <Link to={`/admin/messages`}>Detaylar</Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
