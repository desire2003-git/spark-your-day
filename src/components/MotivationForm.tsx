import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MotivationFormProps {
  onMessageGenerated: (message: string) => void;
}

export const MotivationForm = ({ onMessageGenerated }: MotivationFormProps) => {
  const [nom, setNom] = useState("");
  const [niveau, setNiveau] = useState("");
  const [objectif, setObjectif] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nom.trim() || !niveau || !objectif.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (nom.length > 50) {
      toast.error("Le nom doit faire moins de 50 caractères");
      return;
    }

    if (objectif.length > 100) {
      toast.error("L'objectif doit faire moins de 100 caractères");
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-motivation', {
        body: { nom, niveau, objectif }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.message) {
        onMessageGenerated(data.message);
        toast.success("Message généré avec succès !");
        // Réinitialiser le formulaire
        setNom("");
        setNiveau("");
        setObjectif("");
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la génération du message");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-card/80 backdrop-blur-sm">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Motivation Maker
          </CardTitle>
        </div>
        <CardDescription className="text-base">
          Obtenez un message motivant personnalisé généré par l'IA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nom" className="text-base font-semibold">
              Votre nom
            </Label>
            <Input
              id="nom"
              placeholder="Ex: Marie"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              maxLength={50}
              disabled={isGenerating}
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="niveau" className="text-base font-semibold">
              Niveau de motivation actuel
            </Label>
            <Select value={niveau} onValueChange={setNiveau} disabled={isGenerating}>
              <SelectTrigger id="niveau" className="h-12 text-base">
                <SelectValue placeholder="Sélectionnez votre niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Faible">Faible</SelectItem>
                <SelectItem value="Moyen">Moyen</SelectItem>
                <SelectItem value="Élevé">Élevé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectif" className="text-base font-semibold">
              Votre objectif
            </Label>
            <Input
              id="objectif"
              placeholder="Ex: apprendre le piano, me mettre au sport..."
              value={objectif}
              onChange={(e) => setObjectif(e.target.value)}
              maxLength={100}
              disabled={isGenerating}
              className="h-12 text-base"
            />
          </div>

          <Button
            type="submit"
            disabled={isGenerating}
            size="lg"
            className="w-full h-12 text-base font-semibold bg-gradient-primary hover:opacity-90 transition-opacity shadow-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Obtenir ma motivation
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
