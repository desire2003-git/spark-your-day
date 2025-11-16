import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MotivationForm } from "@/components/MotivationForm";
import { MotivationResult } from "@/components/MotivationResult";
import { History } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);

  const handleMessageGenerated = (message: string) => {
    setGeneratedMessage(message);
  };

  const handleReset = () => {
    setGeneratedMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
            AI Motivation Maker
          </h1>
          <p className="text-xl text-muted-foreground animate-fade-in">
            Votre coach personnel alimenté par l'intelligence artificielle
          </p>
        </div>

        {generatedMessage ? (
          <MotivationResult message={generatedMessage} onReset={handleReset} />
        ) : (
          <MotivationForm onMessageGenerated={handleMessageGenerated} />
        )}

        <div className="flex justify-center pt-4">
          <Button
            onClick={() => navigate('/historique')}
            variant="outline"
            size="lg"
            className="border-2 hover:bg-accent/20"
          >
            <History className="mr-2 h-5 w-5" />
            Voir l'historique
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
