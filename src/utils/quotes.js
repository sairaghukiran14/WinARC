// Curated Discipline & Harsh Reality Quotes for Winter ARC

export const DISCIPLINE_QUOTES = [
  { text: "Nobody is coming to save you. Your transformation is 100% your responsibility.", author: "Harsh Reality" },
  { text: "Comfort is the stealth killer of human potential.", author: "David Goggins" },
  { text: "Discipline is choosing between what you want NOW and what you want MOST.", author: "Winter ARC Standard" },
  { text: "While you sleep, someone else is putting in the work to replace you.", author: "Harsh Reality" },
  { text: "You don't rise to the level of your goals; you fall to the level of your systems.", author: "James Clear" },
  { text: "Excuses sound best to the person making them.", author: "Winter ARC Rule" },
  { text: "If you quit today, you will end up back where you started—where you desperately wanted to escape.", author: "Harsh Reality" },
  { text: "Work in silence. Let your results make the noise.", author: "Winter ARC Manifesto" },
  { text: "The pain of discipline weighs ounces. The pain of regret weighs tons.", author: "Jim Rohn" },
  { text: "Self-discipline is the highest form of self-love.", author: "Winter ARC Standard" },
  { text: "Suffer the pain of discipline today, or suffer the pain of regret tomorrow.", author: "Harsh Reality" },
  { text: "Small daily non-negotiables compounded over 90 days equal unstoppable transformation.", author: "Winter ARC Protocol" }
];

export function getRandomQuote() {
  const index = Math.floor(Math.random() * DISCIPLINE_QUOTES.length);
  return DISCIPLINE_QUOTES[index];
}
