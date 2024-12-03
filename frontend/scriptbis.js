document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('card-container');
    const buttonon = document.getElementById('buttonon');
    const buttonoff = document.getElementById('buttonoff');
    const nav = document.getElementById('nav');
    const ham = document.getElementById('ham');
    const bars = document.querySelectorAll('.bar');
    container.style.display = 'none';
    buttonoff.style.display = 'none'; 

    function toggleContainer() {
        if (container.style.display === 'none') {
            container.style.display = 'block';
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
});
