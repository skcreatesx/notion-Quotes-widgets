const quoteData = {
    mindset: [
        { quote: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
        { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
        { quote: "Fall seven times, stand up eight.", author: "Japanese Proverb" }
    ],
    finance: [
        { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
        { quote: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
        { quote: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" }
    ],
    study: [
        { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
        { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
        { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" }
    ],
    wellness: [
        { quote: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
        { quote: "Taking care of yourself is part of taking care of others.", author: "Lissa Rankin" },
        { quote: "Rest and be thankful.", author: "William Wordsworth" }
    ]
};

const categories = Object.keys(quoteData);
let currentCategoryIndex = 0;
let isFirstLoad = true;

// Generate a mathematical seed based on local YYYY-MM-DD
function getDateSeed() {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// Render quote with a smooth opacity fade transition
function displayQuote(quoteObj, animate = true) {
    const quoteEl = document.getElementById('quote-text');
    const authorEl = document.getElementById('author-text');

    if (animate) {
        quoteEl.style.opacity = 0;
        authorEl.style.opacity = 0;
        setTimeout(() => {
            quoteEl.textContent = quoteObj.quote;
            authorEl.textContent = quoteObj.author;
            quoteEl.style.opacity = 1;
            authorEl.style.opacity = 1;
        }, 150);
    } else {
        quoteEl.textContent = quoteObj.quote;
        authorEl.textContent = quoteObj.author;
        quoteEl.style.opacity = 1;
        authorEl.style.opacity = 1;
    }
}

// Load quote logic handling daily seeding vs taps
function loadQuote() {
    const category = categories[currentCategoryIndex];
    const quotes = quoteData[category];

    if (isFirstLoad) {
        const seed = getDateSeed();
        const index = seed % quotes.length;
        displayQuote(quotes[index], false);
        isFirstLoad = false;
    } else {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        displayQuote(quotes[randomIndex], true);
    }
}

// Toast notification handler
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 1000);
}

// Cycle category via the hidden bottom-right corner click
function cycleCategory() {
    currentCategoryIndex = (currentCategoryIndex + 1) % categories.length;
    const newCategory = categories[currentCategoryIndex];
    const formattedName = newCategory.charAt(0).toUpperCase() + newCategory.slice(1);
    
    showToast(`Topic: ${formattedName}`);
    
    // Immediately pull a random quote from the newly selected category
    const quotes = quoteData[newCategory];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    displayQuote(quotes[randomIndex], true);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    loadQuote();

    // Clicking anywhere on the quote card generates a new quote from the current category
    const quoteCard = document.getElementById('quote-card');
    quoteCard.addEventListener('click', () => {
        loadQuote();
    });

    // Clicking the hidden absolute bottom-right corner cycles topics
    const hiddenBtn = document.getElementById('hidden-topic-btn');
    hiddenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cycleCategory();
    });
});
