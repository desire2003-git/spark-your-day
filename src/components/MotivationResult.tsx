import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface MotivationResultProps {
  message: string;
  onReset: () => void;
}

export const MotivationResult = ({ message, onReset }: MotivationResultProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success("Message copié !");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erreur lors de la copie");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-card/80 backdrop-blur-sm animate-scale-in">
      <CardContent className="p-8 space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">Votre message motivant :</h3>
          <p className="text-2xl md:text-3xl font-bold leading-relaxed text-foreground">
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={onReset}
            size="lg"
            className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity shadow-lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Générer un nouveau message
          </Button>

          <Button
            onClick={handleCopy}
            variant="outline"
            size="lg"
            className="sm:w-auto border-2 hover:bg-accent/20"
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
        </div>
      </CardContent>
    </Card>
  );
};
