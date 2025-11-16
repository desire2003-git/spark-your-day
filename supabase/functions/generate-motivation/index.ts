import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const { nom, niveau, objectif } = await req.json();

    // Validation stricte des inputs
    if (!nom || typeof nom !== 'string' || nom.trim().length === 0) {
      throw new Error('Le nom est requis');
    }
    if (nom.length > 50) {
      throw new Error('Le nom doit faire moins de 50 caractères');
    }
    if (!niveau || !['Faible', 'Moyen', 'Élevé'].includes(niveau)) {
      throw new Error('Le niveau doit être Faible, Moyen ou Élevé');
    }
    if (!objectif || typeof objectif !== 'string' || objectif.trim().length === 0) {
      throw new Error('L\'objectif est requis');
    }
    if (objectif.length > 100) {
      throw new Error('L\'objectif doit faire moins de 100 caractères');
    }

    // Nettoyer les inputs pour éviter les injections de prompt
    const cleanNom = nom.trim().replace(/[\n\r"'`]/g, '');
    const cleanObjectif = objectif.trim().replace(/[\n\r"'`]/g, '');

    const systemPrompt = `Tu es un coach motivant et inspirant. Tu dois créer un message motivant personnalisé en fonction des informations suivantes :
- Nom : ${cleanNom}
- Niveau de motivation : ${niveau}
- Objectif ou domaine : ${cleanObjectif}

Règles :
1. Message court et percutant (moins de 50 mots).
2. Ton chaleureux, encourageant et amical.
3. Inclure des verbes d'action pour stimuler la motivation.
4. Le message doit être inspirant et positif.
5. Retourne uniquement le message, sans guillemets ni formatage.`;
      
    const userPrompt = `Génère un message motivant unique et personnalisé pour ${cleanNom} qui a un niveau de motivation ${niveau} et veut être motivé dans : ${cleanObjectif}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 100,
        temperature: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`Erreur lors de la génération du message`);
    }

    const data = await response.json();
    const motivationText = data.choices[0].message.content.trim();

    // Sauvegarder dans Supabase
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const { error: dbError } = await supabase
      .from('motivation_messages')
      .insert({
        nom: cleanNom,
        niveau: niveau,
        objectif: cleanObjectif,
        message: motivationText
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Erreur lors de la sauvegarde du message');
    }

    console.log('Message generated and saved for:', cleanNom);

    return new Response(
      JSON.stringify({ message: motivationText }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-motivation function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue' 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
