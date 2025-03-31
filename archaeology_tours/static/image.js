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
    // this is adding scaling for the annotations' positions
    const scaleX = image.naturalWidth / rect.width;
    const scaleY = image.naturalHeight / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

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

    saveAnnotation(x, y, txt);
}

function handleScroll(e) {
    let image = document.getElementById("scrollImg");
    let scale = 1;
    const scaleStep = 1;
    const minScale = 1;
    const maxScale = 10;
    
    if (e.target == image) { // disables scrolling rest of page while cursor on image
        e.preventDefault(); //disables scrolling up/down with mouse wheel, only click/drag will work

        const rect = image.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const originX = (offsetX / rect.width) * 100;
        const originY = (offsetY / rect.height) * 100;

        if (e.deltaY < 0) {
            scale = Math.min(maxScale, scale + scaleStep);
        } else {
            scale = Math.max(minScale, scale - scaleStep);
        }
    
        image.style.transformOrigin = `${originX}% ${originY}%`;
        image.style.transform = `scale(${scale})`;
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

function saveAnnotation(x, y, txt){
    fetch('/berry/save_annotation/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ x, y, txt })
    }).then(response => response.json())
      .then(data => console.log(data));
}

function getCookie(name) {
    let cookieV = null;
    if(document.cookie && document.cookie !== ''){
        const cookies = document.cookie.split(';');
        for(let i = 0; i < cookies.length; i++){
            const cookie = cookies[i].trim();
            if(cookie.substring(0, name.length + 1) === (name + '=')){
                cookieV = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieV
}

function loadAnnotations(){
    fetch('/berry/annotations/')
    .then(response =>response.json())
    .then(data=>{
    data.forEach(annotation => {
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
        console.log(annotation.x);
    }

    )
})
}

document.addEventListener('DOMContentLoaded', loadAnnotations);