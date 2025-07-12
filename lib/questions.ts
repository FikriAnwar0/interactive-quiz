export const questions = [
  {
    id: "q1",
    question: "Apa ibu kota Indonesia?",
    options: ["Surabaya", "Bandung", "Jakarta", "Medan"],
    answer: "Jakarta",
  },
  {
    id: "q2",
    question: "Berapa jumlah provinsi di Indonesia (per 2024)?",
    options: ["34", "36", "38", "39"],
    answer: "38",
  },
  {
    id: "q3",
    question: "Sungai terpanjang di dunia adalah?",
    options: ["Sungai Nil", "Sungai Amazon", "Sungai Yangtze", "Sungai Mississippi"],
    answer: "Sungai Nil",
  },
  {
    id: "q4",
    question: "Siapa penemu bola lampu?",
    options: ["Nikola Tesla", "Alexander Graham Bell", "Thomas Edison", "Isaac Newton"],
    answer: "Thomas Edison",
  },
  {
    id: "q5",
    question: "Planet mana yang dikenal sebagai 'Planet Merah'?",
    options: ["Bumi", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
  },
]

export type Question = (typeof questions)[0]
