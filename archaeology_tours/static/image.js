const container = document.querySelector('.scrollable-container');
let image = container.querySelector('img');
const zoomDiv = document.createElement('div');
zoomDiv.className = "zoom-div";
zoomDiv.style.position = 'relative';
zoomDiv.style.display = 'inline-block';
zoomDiv.style.transformOrigin = '0 0';

container.replaceChild(zoomDiv, image);
zoomDiv.appendChild(image);
image = zoomDiv.querySelector('img');
let startX, startY, scrollLeft, scrollTop, isDown;
let currentZoom = 1;

const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');

let imageNum = 0;

nextButton.addEventListener('click', () => {
    imageNum = (imageNum + 1) % images.length;
    clearAnnotations();
    loadAnnotations(imageNum);
    image.src = images[imageNum];
    image = zoomDiv.querySelector('img');
})

prevButton.addEventListener('click', () => {
    imageNum = (imageNum - 1 + images.length) % images.length;
    clearAnnotations();
    loadAnnotations(imageNum);
    image.src = images[imageNum];
    image = zoomDiv.querySelector('img');
})

container.addEventListener('mousedown', e => mouseIsDown(e));
container.addEventListener('mouseup', mouseIsUp);
container.addEventListener('mousemove', e => mouseMove(e));
container.addEventListener('mouseleave', mouseLeave);
container.addEventListener('wheel', e => handleScroll(e), { passive: false })
container.addEventListener('dblclick', e => doubleClick(e))

function doubleClick(e) {
    let scale = 1;
    const scaleStep = 1;
    const minScale = 1;
    const maxScale = 10;
    const rect = image.getBoundingClientRect();
    if (e.deltaY < 0) {
        scale = Math.min(maxScale, scale + scaleStep);
    } else {
        scale = Math.max(minScale, scale - scaleStep);
    }

    const x = (e.clientX - rect.left) / currentZoom;
    const y = (e.clientY - rect.top) / currentZoom;

    const txt = prompt("Enter Annotation: ")

    const circle = document.createElement('div');
    circle.className = 'circle-marker';
    circle.style.position = 'absolute';
    circle.style.left = `${(x - 5)}px`; // Center the circle (assuming 10px width)
    circle.style.top = `${y - 5}px`;  // Center the circle (assuming 10px height)
    circle.style.width = '10px';
    circle.style.height = '10px';
    circle.style.backgroundColor = 'red';
    circle.style.borderRadius = '50%';
    circle.style.class = "visible";

    circle.setAttribute('data-x', x);
    circle.setAttribute('data-y', y);

    const tooltip = document.createElement('div');
    tooltip.textContent = txt;
    tooltip.style.position = 'absolute';
    tooltip.style.width = '50px'
    tooltip.style.left = `${x - 5}px`;
    tooltip.style.top = `${y + 10}px`;
    tooltip.style.fontSize = '12px';
    tooltip.style.color = 'white';
    tooltip.style.visibility = 'hidden'


    zoomDiv.appendChild(circle);
    zoomDiv.appendChild(tooltip);

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

    saveAnnotation(x, y, txt, imageNum);
}

function handleScroll(e) {
    if (e.target == image) { 
        e.preventDefault(); 
        
        const scaleStep = 1;
        const minScale = 1;
        const maxScale = 10;

        //size of image relative to box
        // with coordinates for mouse cursor
        // offsets calc mouse position relative to img
        const rect = image.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        // where zoom will occur
        // ratio of x/y position of mouse to image width/height
        const originX = (offsetX / rect.width) * 100;
        const originY = (offsetY / rect.height) * 100;

        // scrolling up
        if (e.deltaY < 0) {
            currentZoom = Math.min(maxScale, currentZoom + scaleStep);
        } else {
            currentZoom = Math.max(minScale, currentZoom - scaleStep);
        }

        zoomDiv.style.transform = `scale(${currentZoom})`;

        zoomDiv.style.transformOrigin = `${originX}% ${originY}%`;

    }
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

function saveAnnotation(x, y, txt, imageNum) {
    fetch('/berry/save_annotation/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ x, y, txt, imageNo: imageNum, siteName: siteName })
    }).then(response => response.json())
        .then(data => console.log(data));
}

function getCookie(name) {
    let cookieV = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieV = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieV
}

function loadAnnotations(imageNumber) {
    console.log("ENTERING LOAD ANNO");

    fetch('/berry/annotations/')
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", data)
            data.forEach(annotation => {
                console.log("ANNOTATION.IMAGENO: " + annotation.imageNo);
                console.log("IMAGENUMBER: " + imageNumber);

                if (annotation.imageNo === imageNumber && annotation.siteName === siteName) {
                    const circle = document.createElement('div');
                    circle.className = 'circle-marker';
                    circle.style.position = 'absolute';
                    circle.style.left = `${annotation.x - 5}px`; // Center the circle (assuming 10px width)
                    circle.style.top = `${annotation.y - 5}px`;  // Center the circle (assuming 10px height)
                    circle.style.width = '10px';
                    circle.style.height = '10px';
                    circle.style.backgroundColor = 'red';
                    circle.style.borderRadius = '50%';
                    circle.style.class = "visible";


                    const tooltip = document.createElement('div');
                    tooltip.textContent = annotation.text;
                    tooltip.style.position = 'absolute';
                    tooltip.style.width = '50px'
                    tooltip.style.left = `${annotation.x - 5}px`;
                    tooltip.style.top = `${annotation.y + 10}px`;
                    tooltip.style.fontSize = '12px';
                    tooltip.style.color = 'white';
                    tooltip.style.visibility = 'hidden'

                    zoomDiv.appendChild(circle);
                    zoomDiv.appendChild(tooltip);

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
            }
            )
        })
}

function clearAnnotations() {
    const circles = container.querySelectorAll('.circle-marker');
    const tooltips = container.querySelectorAll('div[style*="color: white"]');
    circles.forEach(circle => {
        zoomDiv.removeChild(circle);
    })
    tooltips.forEach(tooltip => {
        zoomDiv.removeChild(tooltip);
    })
}

document.addEventListener('DOMContentLoaded', loadAnnotations(imageNum));