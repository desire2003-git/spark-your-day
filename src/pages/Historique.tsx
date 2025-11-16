import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Calendar, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  nom: string;
  niveau: string;
  objectif: string;
  message: string;
  created_at: string;
}

const Historique = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-messages');

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error("Erreur lors du chargement de l'historique");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getNiveauColor = (niveau: string) => {
    switch (niveau) {
      case 'Faible':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Moyen':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Élevé':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="lg"
            className="border-2"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Historique des messages
          </h1>
        </div>

        {isLoading ? (
          <Card className="p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Chargement de l'historique...</p>
          </Card>
        ) : messages.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-xl text-muted-foreground">Aucun message pour le moment</p>
            <Button
              onClick={() => navigate('/')}
              className="mt-6 bg-gradient-primary"
              size="lg"
            >
              Créer votre premier message
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <Card key={msg.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow bg-card/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-primary/5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-bold">{msg.nom}</CardTitle>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(msg.created_at)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={getNiveauColor(msg.niveau)}>
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {msg.niveau}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-2">
                    <Target className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Objectif</p>
                      <p className="text-base font-medium">{msg.objectif}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-lg md:text-xl font-bold leading-relaxed text-foreground">
                      {msg.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Historique;
