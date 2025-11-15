import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    const { name, motivationLevel, goal } = await req.json();

    // Validation
    if (name && typeof name !== 'string') {
      throw new Error('Invalid name parameter');
    }
    if (motivationLevel && !['faible', 'moyen', 'élevé'].includes(motivationLevel)) {
      throw new Error('Invalid motivation level');
    }
    if (goal && typeof goal !== 'string') {
      throw new Error('Invalid goal parameter');
    }

    // Validate lengths
    if (name && name.length > 50) {
      throw new Error('Name too long');
    }
    if (goal && goal.length > 100) {
      throw new Error('Goal too long');
    }

    let systemPrompt = 'Tu es un coach motivant, inspirant et dynamique. Crée un message motivant unique, court et percutant (moins de 50 mots). Ton amical et encourageant. Utilise des verbes d\'action. Retourne uniquement le message, sans guillemets ni formatage.';
    let userPrompt = 'Génère un nouveau message de motivation inspirant.';

    // If personalized parameters are provided, customize the prompt
    if (name && motivationLevel && goal) {
      systemPrompt = `Tu es un coach motivant et inspirant. Tu dois créer un message motivant personnalisé en fonction des informations suivantes :
- Nom : ${name}
- Niveau de motivation : ${motivationLevel}
- Objectif ou domaine : ${goal}

Règles :
1. Message court et percutant (moins de 50 mots).
2. Ton chaleureux, encourageant et amical.
3. Inclure des verbes d'action pour stimuler la motivation.
4. Le message doit être inspirant et positif.
5. Retourne uniquement le message, sans guillemets ni formatage.`;
      
      userPrompt = `Génère un message motivant unique et personnalisé pour ${name} qui a un niveau de motivation ${motivationLevel} et veut être motivé dans : ${goal}`;
    }

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
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const motivationText = data.choices[0].message.content.trim();

    console.log('Generated motivation:', motivationText);

    return new Response(
      JSON.stringify({ message: motivationText }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-motivation function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
