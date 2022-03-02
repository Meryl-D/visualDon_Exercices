const rect = document.querySelector('.rect');
const donut = document.querySelector('.donut');

// On click
rect.addEventListener('click', evt => {
    rect.classList.toggle("color");
})

// On hover
donut.addEventListener('mouseover', evt => {
    donut.setAttribute('r', '80');
})
donut.addEventListener('mouseout', evt => {
    donut.setAttribute('r', '60');
})