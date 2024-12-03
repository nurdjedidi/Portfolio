document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('nav');
    const ham = document.getElementById('ham');
    const bars = document.querySelectorAll('.bar');

    function toggle () { 
        const isDisplayed = getComputedStyle(nav).display !== 'none';
        
        if (isDisplayed) { 
            nav.style.display = 'none';
            bars.forEach(bar => bar.style.backgroundColor = 'white');
        } else { 
            nav.style.display = 'block';
            bars.forEach(bar => bar.style.backgroundColor = 'black');
        }
    }

    ham.addEventListener('click', toggle);

    const ctx = document.getElementById('myChart').getContext('2d');

    new Chart(ctx, {
        type: 'doughnut', 
        data: {
            labels: ['HTML', 'CSS', 'JS', 'Vue.js', 'Node.js', 'MySQL'],
            datasets: [
                {
                    label: 'Maîtrise 1',
                    data: [100, 95, 85, 80, 70, 60],
                    backgroundColor: [
                        '#003366', 
                        '#00509e', 
                        '#007bff', 
                        '#66aaff', 
                        '#99c2ff', 
                        '#cce5ff'  
                    ], 
                    borderColor: '#fff', 
                    borderWidth: 0.5 
                },
            ]
        },
        options: {
            plugins: {
                tooltip: {
                    enabled: false // Désactiver les tooltips
                },
                legend: {
                    display: true, // Afficher la légende
                    position: 'top' // Position de la légende
                }
            },
            responsive: true, // Rendre le graphique responsive
            maintainAspectRatio: false // Ne pas maintenir le rapport d'aspect
        }
    });
});