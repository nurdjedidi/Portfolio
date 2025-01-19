let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(name, price) {
    cart.push({ name: name, price: price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${name} a été ajouté au panier !`);
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

document.addEventListener('DOMContentLoaded', updateCartCount);

document.addEventListener('DOMContentLoaded', function() { 
    const loupe = document.getElementById('loupe');
    const search = document.getElementById('search');
    const cards = document.querySelectorAll('.card-global'); 
    const articles = document.querySelectorAll('article.add');
    const tailleButtons = document.querySelectorAll('.taille');
    const retourButtons = document.querySelectorAll('[id="off"]');

    // Recherche 

    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        performSearch(searchTerm);
    });

    function performSearch(searchTerm) {
        const cards = document.querySelectorAll('.card-global');
        
        cards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            if (cardText.includes(searchTerm)) {
                card.style.display = 'block'; 
            } else {
                card.style.display = 'none'; 
            }
        });
    }

    function toggle() { 
        const isDisplayed = getComputedStyle(loupe).display !== 'none';

        if (isDisplayed) {
            loupe.style.display = 'none'; 
            search.style.display = 'flex';
        } else { 
            loupe.style.display = 'flex';
            search.style.display = 'none';
        }
    }

    loupe.addEventListener('click', toggle);

    function toggleCard(event) {
        const clickedCardId = event.currentTarget.id.replace('card-', 'article-');
        
        cards.forEach(card => card.style.display = 'none');
        
        const correspondingArticle = document.getElementById(clickedCardId);
        if (correspondingArticle) {
            correspondingArticle.classList.add('active');
        }
    }
    
    cards.forEach(card => {
        card.addEventListener('click', toggleCard);
    });

     function closeArticle() {
        articles.forEach(article => {
            article.classList.remove('active');
        });
        cards.forEach(card => {
            card.style.display = 'block'; 
        });
    }

    retourButtons.forEach(button => {
        button.addEventListener('click', closeArticle);
    });
    
    tailleButtons.forEach(button => {
        button.addEventListener('click', function() {
            tailleButtons.forEach(btn => {
                btn.classList.remove('locked');
            });
            
            if (!this.classList.contains('locked')) {
                this.classList.add('locked');
            }
        });
    });

});
