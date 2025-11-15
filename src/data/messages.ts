export const motivationalMessages = [
  "Aujourd'hui est ton jour pour briller. Crois en toi et avance !",
  "Chaque petit pas te rapproche de ton rêve. N'abandonne jamais !",
  "Tu es capable de plus que tu ne le crois. Fonce !",
  "Le succès commence par une seule décision : celle d'essayer.",
  "Ta force intérieure est illimitée. Libère-la aujourd'hui !",
  "Les obstacles sont des opportunités déguisées. Relève le défi !",
  "Crois en tes rêves et ils deviendront réalité.",
  "Chaque jour est une nouvelle chance de grandir.",
  "Tu as tout ce qu'il faut pour réussir. Vas-y !",
  "L'échec n'existe pas, seuls les apprentissages comptent.",
  "Ta détermination est ton superpouvoir. Utilise-le !",
  "Le moment parfait, c'est maintenant. Agis !",
  "Tu mérites tout le succès que tu recherches.",
  "Transforme tes peurs en force et avance.",
  "Chaque effort compte. Continue d'avancer !",
  "Le chemin est long, mais tu es déjà en route.",
  "Tes rêves n'attendent que ton courage.",
  "Aujourd'hui, décide d'être exceptionnel !",
  "Ta persévérance est ta plus grande qualité.",
  "Le meilleur reste à venir. Continue !",
  "Fais-toi confiance, tu en es capable.",
  "Transforme ta vision en action dès maintenant.",
  "Chaque nouveau jour est une page blanche à écrire.",
  "Tu es plus fort que tes doutes.",
  "L'impossible devient possible quand tu y crois.",
  "Ton potentiel est infini. Explore-le !",
  "Les grandes choses commencent par de petits pas.",
  "Ta motivation d'aujourd'hui sera ton succès de demain.",
  "Ose rêver grand et agis encore plus grand !",
  "La réussite sourit aux audacieux. Sois audacieux !",
];

export const getRandomMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[randomIndex];
};
