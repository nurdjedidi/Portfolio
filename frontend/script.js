document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('card-container');
    const buttonon = document.getElementById('buttonon');
    const buttonoff = document.getElementById('buttonoff');
    const nav = document.getElementById('nav');
    const ham = document.getElementById('ham');
    container.style.display = 'none';
    buttonoff.style.display = 'none'; 

    function toggleContainer() {
        if (container.style.display === 'none') {
            container.style.display = 'flex';
            buttonon.style.display = 'none'; 
            buttonoff.style.display = 'flex'; 
        } else {
            container.style.display = 'none';
            buttonon.style.display = 'block'; 
            buttonoff.style.display = 'none'; 
        }
    }

    buttonon.addEventListener('click', toggleContainer);
    buttonoff.addEventListener('click', toggleContainer);
});

const ctx = document.getElementById('myChart').getContext('2d');

        new Chart(ctx, {
            type: 'bar', 
            data: {
                labels: ['HTML', 'CSS', 'JS', 'Vue.js', 'Node.js', 'MySQL'],
                datasets: [
                    {
                        label: 'Developpement web',
                        data: [100, 95, 85, 80, 70, 60],
                        backgroundColor: '#007bff', 
                        borderColor: 'rgba(75, 192, 192, 1)', 
                        borderWidth: 1
                    },
                ]
            },
            
            
            options: {
                plugins: {
                    tooltip: {
                        enabled: false 
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true 
                    }
                }
            }
        });

    

    