// src/constants/sharedBooks.js

// Helper functions for consistent page creation
function createQuestionPage(pageNumber, content) {
  return {
    type: "question",
    content,
    pageNumber,
    createdAt: new Date().toISOString()
  };
}

function createAnswerPage(pageNumber, text, points = []) {
  return {
    type: "answer",
    content: { text, points },
    pageNumber,
    createdAt: new Date().toISOString()
  };
}

// Main books data export
export const SHARED_BOOKS = [
  {
    id: 1,
    name: "Letters to Sage",
    recipient: "Sage",
    recipientId: 1,
    description: "Life lessons and love letters for my daughter",
    count: 12,
    color: "bg-pink-500",
    lastUpdated: "2 days ago",
    type: "book",
    pages: [
      createQuestionPage(1, "How can I teach you about resilience when life gets difficult?"),
      createAnswerPage(2,
        "Resilience isn't about avoiding falls, but learning how to get up. When you face challenges:",
        [
          "Remember that struggles are temporary",
          "Ask for help when you need it",
          "Know that I'll always be here for you"
        ]
      ),
      createQuestionPage(3, "What do I want you to know about finding true happiness?"),
      createAnswerPage(4,
        "Happiness comes from within and grows when you:",
        [
          "Cultivate gratitude daily",
          "Build meaningful relationships",
          "Pursue purpose, not just pleasure"
        ]
      )
    ]
  },
  {
    id: 2,
    name: "First Year Lessons",
    recipient: "Cohen",
    recipientId: 2,
    description: "What I learned in your first year of life",
    count: 6,
    color: "bg-blue-500",
    lastUpdated: "1 week ago",
    type: "book",
    pages: [
      createQuestionPage(1, "What surprised me most about becoming your parent?"),
      createAnswerPage(2,
        "The depth of love and responsibility I felt immediately:",
        [
          "How your smile could brighten my worst day",
          "The instinct to protect you at all costs",
          "The joy in your smallest discoveries"
        ]
      ),
      createQuestionPage(3, "What advice would I give to new parents?"),
      createAnswerPage(4,
        "The things that matter most:",
        [
          "Trust your instincts - you know your child best",
          "Don't compare milestones - every child develops differently",
          "Take time to just be present together"
        ]
      )
    ]
  },
  {
    id: 3,
    name: "For When You're Older",
    recipient: "Ellie",
    recipientId: 3,
    description: "Wisdom for their teenage years and beyond",
    count: 4,
    color: "bg-purple-500",
    lastUpdated: "3 days ago",
    type: "book",
    pages: [
      createQuestionPage(1, "How should you handle heartbreak when it comes?"),
      createAnswerPage(2,
        "Though painful, heartbreak teaches valuable lessons:",
        [
          "It's okay to grieve - don't rush the healing",
          "Every ending makes space for new beginnings",
          "Your worth isn't defined by any relationship"
        ]
      ),
      createQuestionPage(3, "What financial principles will serve you best?"),
      createAnswerPage(4,
        "Money management fundamentals:",
        [
          "Live below your means and save consistently",
          "Invest early - time is your greatest asset",
          "True wealth is freedom, not possessions"
        ]
      ),
      createQuestionPage(5, "How do I want you to remember me?"),
      createAnswerPage(6,
        "I hope you remember:",
        [
          "I loved you unconditionally, always",
          "I did my best, even when I made mistakes",
          "My greatest legacy is the people you become"
        ]
      )
    ]
  },
  {
    id: 4,
    name: "Truett's Scofield Graduation",
    recipient: "Truett",
    recipientId: 4,
    description: "Advice for Truett as he graduates from Scofield",
    count: 5,
    color: "bg-purple-500",
    lastUpdated: "1 day ago",
    type: "book",
    pages: [
      createQuestionPage(1, "What are your hopes for Truett as he enters this next chapter of school?"),
      createAnswerPage(2,
        "My hopes for Truett as he graduates from Scofield are:",
        [
          "That he stays true to himself and is authentic",
          "That he continues to develop the relationships he's formed",
          "That he makes new lasting relationships at FBA"
        ]
      )
    ]
  },
  {
    id: 5,
    name: "Cohen's 16th Birthday",
    recipient: "Cohen",
    recipientId: 2,
    description: "Thoughts and advice for Cohen as he turns 16",
    count: 4,
    color: "bg-blue-500",
    lastUpdated: "5 days ago",
    type: "book",
    pages: [
      createQuestionPage(1, "What do you remember most about Cohen at age 15?"),
      createAnswerPage(2,
        "Memories that stand out from this past year:",
        [
          "His eagerness to learn how to drive",
          "The way he captivated audiences in Beauty and the Beast",
          "His maturity and commitment to press into relationships"
        ]
      )
    ]
  }
];

// Utility functions
export const getBookById = (id) => SHARED_BOOKS.find(book => book.id === id);

export const getBooksByRecipient = (recipientId) =>
  SHARED_BOOKS.filter(book => book.recipientId === recipientId);

export const getRecentBooks = (limit = 3) =>
  [...SHARED_BOOKS]
    .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
    .slice(0, limit);

/**
 * @typedef {Object} Book
 * @property {number} id
 * @property {string} name
 * @property {string} recipient
 * @property {number} recipientId
 * @property {string} description
 * @property {number} count
 * @property {string} color - Tailwind color class
 * @property {string} lastUpdated - Relative time string
 * @property {'book'} type
 * @property {Array<BookPage>} pages
 */

/**
 * @typedef {Object} BookPage
 * @property {'question'|'answer'} type
 * @property {string} [content] - For questions
 * @property {Object} [content] - For answers
 * @property {string} content.text
 * @property {string[]} content.points
 * @property {number} pageNumber
 * @property {string} [createdAt]
 */
