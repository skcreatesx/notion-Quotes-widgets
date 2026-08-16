document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------
     1. Quote Data
  --------------------------------------- */
  const quotesData = {
    general: [
      { text: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
      { text: "What we think, we become.", author: "Buddha" },
      { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
      { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
      { text: "Well done is better than well said.", author: "Benjamin Franklin" }
    ],
    finance: [
      { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
      { text: "Do not save what is left after spending; spend what is left after saving.", author: "Warren Buffett" },
      { text: "The stock market is a device for transferring money from the impatient to the patient.", author: "Warren Buffett" },
      { text: "It's not how much money you make, but how much money you keep.", author: "Robert Kiyosaki" },
      { text: "Financial freedom is available to those who learn about it and work for it.", author: "Robert Kiyosaki" }
    ],
    students: [
      { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
      { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
      { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
      { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
      { text: "The expert in anything was once a beginner.", author: "Helen Hayes" }
    ]
  };

  const quoteTextEl = document.getElementById('quoteText');
  const quoteAuthorEl = document.getElementById('quoteAuthor');
  const refreshBtn = document.getElementById('refreshBtn');

  /* ---------------------------------------
     2. Parse URL Parameters -> get niche
  --------------------------------------- */
  function getActiveCategory() {
    const params = new URLSearchParams(window.location.search);
    const niche = (params.get('niche') || '').toLowerCase().trim();

    if (niche && quotesData.hasOwnProperty(niche)) {
      return niche;
    }
    return 'general'; // default fallback
  }

  const activeCategory = getActiveCategory();
  const activeQuotes = quotesData[activeCategory];

  /* ---------------------------------------
     3. Date-Seeded Daily Quote
  --------------------------------------- */
  function getLocalDateSeed() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateString = `${yyyy}-${mm}-${dd}`; // e.g. "2026-08-16"

    // Simple numeric hash from the date string
    let seed = 0;
    for (let i = 0; i < dateString.length; i++) {
      seed += dateString.charCodeAt(i) * (i + 1);
    }
    return seed;
  }

  function getDailyQuote(category) {
    const seed = getLocalDateSeed();
    const index = seed % category.length;
    return category[index];
  }

  /* ---------------------------------------
     Render helper
  --------------------------------------- */
  function renderQuote(quoteObj) {
    quoteTextEl.style.opacity = 0;
    quoteAuthorEl.style.opacity = 0;

    setTimeout(() => {
      quoteTextEl.textContent = quoteObj.text;
      quoteAuthorEl.textContent = quoteObj.author;
      quoteTextEl.style.transition = 'opacity 0.3s ease';
      quoteAuthorEl.style.transition = 'opacity 0.3s ease';
      quoteTextEl.style.opacity = 1;
      quoteAuthorEl.style.opacity = 1;
    }, 150);
  }

  // Initial load: date-seeded "Quote of the Day"
  renderQuote(getDailyQuote(activeQuotes));

  /* ---------------------------------------
     4. Refresh Override (random, bypasses seed)
  --------------------------------------- */
  function getRandomQuote(category, excludeQuote) {
    if (category.length === 1) return category[0];

    let newQuote;
    do {
      const randomIndex = Math.floor(Math.random() * category.length);
      newQuote = category[randomIndex];
    } while (excludeQuote && newQuote.text === excludeQuote.text);

    return newQuote;
  }

  let currentQuote = getDailyQuote(activeQuotes);

  refreshBtn.addEventListener('click', () => {
    refreshBtn.classList.remove('spinning');
    void refreshBtn.offsetWidth; // restart animation
    refreshBtn.classList.add('spinning');

    currentQuote = getRandomQuote(activeQuotes, currentQuote);
    renderQuote(currentQuote);
  });

});