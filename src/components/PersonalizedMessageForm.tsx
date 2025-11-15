import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PersonalizedMessageFormProps {
  onMessageGenerated: (message: string) => void;
}

const PersonalizedMessageForm = ({ onMessageGenerated }: PersonalizedMessageFormProps) => {
  const [name, setName] = useState("");
  const [motivationLevel, setMotivationLevel] = useState<string>("");
  const [goal, setGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      toast.error("Veuillez entrer votre nom");
      return;
    }
    if (!motivationLevel) {
      toast.error("Veuillez sélectionner votre niveau de motivation");
      return;
    }
    if (!goal.trim()) {
      toast.error("Veuillez entrer votre objectif");
      return;
    }

    if (name.length > 50) {
      toast.error("Le nom doit faire moins de 50 caractères");
      return;
    }
    if (goal.length > 100) {
      toast.error("L'objectif doit faire moins de 100 caractères");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-motivation', {
        body: { 
          name: name.trim(), 
          motivationLevel, 
          goal: goal.trim() 
        }
      });

      if (error) throw error;

      if (data?.message) {
        onMessageGenerated(data.message);
        toast.success("Message personnalisé généré !");
      } else {
        throw new Error("Aucun message généré");
      }
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      toast.error("Erreur lors de la génération du message");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Votre nom</Label>
          <Input
            id="name"
            placeholder="Ex: Marie"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            disabled={isGenerating}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Niveau de motivation actuel</Label>
          <Select value={motivationLevel} onValueChange={setMotivationLevel} disabled={isGenerating}>
            <SelectTrigger id="level">
              <SelectValue placeholder="Sélectionnez votre niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="faible">Faible</SelectItem>
              <SelectItem value="moyen">Moyen</SelectItem>
              <SelectItem value="élevé">Élevé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">Votre objectif ou domaine</Label>
          <Input
            id="goal"
            placeholder="Ex: sport, travail, études"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            maxLength={100}
            disabled={isGenerating}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-primary hover:opacity-90"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Générer mon message personnalisé
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default PersonalizedMessageForm;
