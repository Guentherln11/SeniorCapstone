const correctContainer = document.querySelectorAll('.correct');
const incorrectContainer = document.querySelectorAll('.incorrect');
const startContainer = document.querySelector('.blocker');
const outerContainer = document.querySelector('.quizOuter');


outerContainer.scrollLeft = 0;
var score = 0;
updateText();

startContainer.addEventListener('click', startHandle)

function startHandle() {
    outerContainer.scrollLeft += 800;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

correctContainer.forEach(b => {
    b.addEventListener("click", async function () {
        b.style.backgroundColor = 'green';
        score++;
        updateText();
        b.disabled = true;
        await sleep(1000);
        outerContainer.scrollLeft += 750;
    });
});
incorrectContainer.forEach(b => {
    b.addEventListener("click", function () {
        b.style.backgroundColor = 'red';
        score--;
        updateText();
        b.disabled = true;
    });
});

function updateText() {
    document.getElementById("updater").innerText = score;
}
