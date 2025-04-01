const container = document.querySelector('.scrollable-container');
let startX, startY, scrollLeft, scrollTop, isDown, currentZoom;

const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');
const image = container.querySelector('img');

let imageNum = 0;

const images = [
    '/media/images/ScrollTest.jpg',
    '/media/images/20250325_101839.jpg',
]

nextButton.addEventListener('click', () => {
    imageNum = (imageNum + 1) % images.length;
    clearAnnotations();
    loadAnnotations(imageNum);
    image.src= images[imageNum];
})

prevButton.addEventListener('click', () => {
    imageNum = (imageNum - 1 + images.length) % images.length;
    clearAnnotations();
    loadAnnotations(imageNum);
    image.src = images[imageNum];
})

container.addEventListener('mousedown', e => mouseIsDown(e));
container.addEventListener('mouseup', mouseIsUp);
container.addEventListener('mousemove', e => mouseMove(e));
container.addEventListener('mouseleave', mouseLeave);
container.addEventListener('wheel', e => handleScroll(e), { passive: false })
container.addEventListener('dblclick', e => doubleClick(e))

function doubleClick(e) {
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

    saveAnnotation(x, y, txt, imageNum);
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

function saveAnnotation(x, y, txt, imageNum) {
    fetch('/berry/save_annotation/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ x, y, txt, imageNo: imageNum })
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
                
                if (annotation.imageNo === imageNumber) {
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
            }
            )
        })
}

function clearAnnotations(){
    const circles = container.querySelectorAll('.circle-marker');
    const tooltips = container.querySelectorAll('div[style*="color: white"]');
    circles.forEach(circle => {
        container.removeChild(circle);
    })
    tooltips.forEach(tooltip => {
        container.removeChild(tooltip);
    })
}

document.addEventListener('DOMContentLoaded', loadAnnotations(imageNum));