import { useState } from "react";
import { getRandomMessage } from "@/data/messages";
import MessageCard from "@/components/MessageCard";
import PersonalizedMessageForm from "@/components/PersonalizedMessageForm";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [message, setMessage] = useState(getRandomMessage());
  const [showPersonalizedForm, setShowPersonalizedForm] = useState(false);

  const handleNewMessage = () => {
    setMessage(getRandomMessage());
  };

  const handlePersonalizedMessage = (generatedMessage: string) => {
    setMessage(generatedMessage);
    setShowPersonalizedForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <header className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-4 shadow-[var(--shadow-glow)]">
            <Zap className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dose de Motivation
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Chaque jour, une nouvelle inspiration pour booster ton énergie et ta confiance.
          </p>
        </header>

        <div className="flex justify-center mb-4">
          <Button
            variant={showPersonalizedForm ? "default" : "outline"}
            onClick={() => setShowPersonalizedForm(!showPersonalizedForm)}
            className="transition-all"
          >
            {showPersonalizedForm ? "Mode aléatoire" : "Message personnalisé ✨"}
          </Button>
        </div>

        {showPersonalizedForm ? (
          <PersonalizedMessageForm onMessageGenerated={handlePersonalizedMessage} />
        ) : (
          <MessageCard message={message} onNewMessage={handleNewMessage} />
        )}

        <footer className="text-center text-sm text-muted-foreground animate-fade-in">
          Partage ta motivation avec tes proches ✨
        </footer>
      </div>
    </div>
  );
};

export default Index;
