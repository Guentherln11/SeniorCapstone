const container = document.querySelector('.scrollable-container');
let startX, startY, scrollLeft, scrollTop, isDown, currentZoom;

container.addEventListener('mousedown', e => mouseIsDown(e));
container.addEventListener('mouseup', mouseIsUp);
container.addEventListener('mousemove', e => mouseMove(e));
container.addEventListener('mouseleave', mouseLeave);
container.addEventListener('wheel', e => handleScroll(e), { passive: false })
container.addEventListener('dblclick', e => doubleClick(e))

function doubleClick(e) {
    const image = container.querySelector('img');
    const rect = image.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const txt = prompt("Enter Annotation: ")

    const circle = document.createElement('div');
    circle.className = 'circle-marker';
    circle.style.position = 'absolute';
    circle.style.left = `${x - 5}px`; // Center the circle (assuming 10px width)
    circle.style.top = `${y - 5}px`;  // Center the circle (assuming 10px height)
    circle.style.width = '10px';
    circle.style.height = '10px';
    circle.style.backgroundColor = 'red';
    circle.style.borderRadius = '50%';
    circle.style.class = "visible";


    const tooltip = document.createElement('div');
    tooltip.textContent = txt;
    tooltip.style.position = 'absolute';
    tooltip.style.width = '50px'
    tooltip.style.left = `${x - 5}px`;
    tooltip.style.top = `${y + 10}px`;
    tooltip.style.fontSize = '12px';
    tooltip.style.color = 'white';
    tooltip.style.visiblity = 'hidden'

    container.appendChild(circle);
    container.appendChild(tooltip);

    circle.addEventListener('mouseover', function () {
        tooltip.style.visibility = 'visible';
    })

    circle.addEventListener('mouseout', function () {
        tooltip.style.visibility = 'hidden';
    })

    circle.addEventListener('contextmenu', e => removeAnno(e));

    function removeAnno(e) {
        e.preventDefault();
        container.removeChild(circle);
        container.removeChild(tooltip);
    }
}

function handleScroll(e) {
    //disables scrolling up/down with mouse wheel, only click/drag will work
    e.preventDefault();
    // TODO: IMPLEMENT ZOOM-IN/ZOOM-OUT WITH MOUSE SCROLL
}

function mouseIsDown(e) {
    e.preventDefault()
    isDown = true;
    startY = e.pageY - container.offsetTop;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    scrollTop = container.scrollTop;
}

function mouseIsUp() {
    isDown = false;
}

function mouseMove(e) {
    if (isDown) {
        e.preventDefault();
        const y = e.pageY - container.offsetTop;
        const walkY = y - startY;
        container.scrollTop = scrollTop - walkY;

        const x = e.pageX - container.offsetLeft;
        const walkX = x - startX;
        container.scrollLeft = scrollLeft - walkX;
    }
}

function mouseLeave() {
    isDown = false;
}
