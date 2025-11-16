import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Copy, Check, Database } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MessageCardProps {
  message: string;
  onNewMessage: () => void;
}

const MessageCard = ({ message, onNewMessage }: MessageCardProps) => {
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success("Message copié !", {
        description: "Le message est prêt à être partagé.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erreur lors de la copie");
    }
  };

  const handleSaveToSupabase = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('motivation_messages')
        .insert({ message: message });

      if (error) throw error;

      toast.success("Message enregistré !", {
        description: "Le message a été sauvegardé dans Supabase.",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="relative overflow-hidden border-0 bg-card/80 backdrop-blur-sm shadow-[var(--shadow-glow)] animate-scale-in">
      <div className="absolute inset-0 bg-gradient-primary opacity-5" />
      <div className="relative p-8 md:p-12">
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-6">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed text-foreground">
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onNewMessage}
            size="lg"
            className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity shadow-lg text-lg font-semibold"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Nouveau message
          </Button>

          <Button
            onClick={handleCopy}
            variant="outline"
            size="lg"
            className="sm:w-auto border-2 hover:bg-accent/20 text-lg font-semibold"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Copié !
              </>
            ) : (
              <>
                <Copy className="mr-2 h-5 w-5" />
                Copier
              </>
            )}
          </Button>

          <Button
            onClick={handleSaveToSupabase}
            variant="outline"
            size="lg"
            disabled={isSaving}
            className="sm:w-auto border-2 hover:bg-accent/20 text-lg font-semibold"
          >
            <Database className="mr-2 h-5 w-5" />
            {isSaving ? "Enregistrement..." : "Enregistrer dans Supabase"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MessageCard;
