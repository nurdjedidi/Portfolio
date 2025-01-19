document.addEventListener('DOMContentLoaded', function() {  
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function displayCart() {
    const cartList = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    let total = 0;

    cartList.innerHTML = '';
    cart.forEach((item, index) => {
        if (item && typeof item.name === 'string' && typeof item.price === 'number') {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.price.toFixed(2)} € `;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Supprimer';
            removeButton.onclick = function() {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCart();
            };
            li.appendChild(removeButton);
            cartList.appendChild(li);
            total += item.price;
        } else {
            console.warn(`Invalid item at index ${index}:`, item);
        }
    });

    totalElement.textContent = total.toFixed(2);
}
displayCart();

        const stripe = Stripe('pk_live_51QCQQhEbOWaFK5rOLLDonpFQX96rNK7xuRMYrV2Yo6utvlKEh6LrG0CYc6RXhnqIrFMMPcpTqwYre9nQeiZxDdsZ00aoH1WkhE');
        const elements = stripe.elements();

        const style = {
            base: {
                color: "#32325d",
                fontFamily: 'Arial, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": { color: "#32325d" }
            },
            invalid: {
                fontFamily: 'Arial, sans-serif',
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        };

        const card = elements.create("card", { style: style });
        card.mount("#card-element");

        card.on('change', function(event) {
            var displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });

        const form = document.getElementById('payment-form');
        const submitButton = document.getElementById('submit');

        form.addEventListener('submit', function(ev) {
            ev.preventDefault();
            submitButton.disabled = true;
            submitButton.textContent = 'Traitement en cours...';

            getClientSecret().then(function(clientSecret) {
                stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: card,
                        billing_details: {
                            name: 'Nom du client'
                        }
                    }
                }).then(function(result) {
                    if (result.error) {
                        console.error('Erreur de paiement:', result.error);
                        var errorElement = document.getElementById('card-errors');
                        errorElement.textContent = result.error.message;
                        submitButton.disabled = false;
                        submitButton.textContent = 'Payer';
                    } else {
                        if (result.paymentIntent.status === 'succeeded') {
                            console.log('Paiement réussi !');
                            alert('Paiement réussi !');
                        }
                    }
                });
            }).catch(function(error) {
                console.error('Erreur lors de la récupération du clientSecret:', error);
                var errorElement = document.getElementById('card-errors');
                errorElement.textContent = "Erreur lors de la préparation du paiement. Veuillez réessayer.";
                submitButton.disabled = false;
                submitButton.textContent = 'Payer';
            });
        });
        function getClientSecret() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve('votre_client_secret_ici');
                }, 1000);
            });
        }
});
