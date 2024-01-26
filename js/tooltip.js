
function applyCustomTooltip(target) {
    let tooltipElement = null;
    target.addEventListener('mouseenter', () => {
        const rects = target.getBoundingClientRect();
        tooltipElement = document.createElement("div");
        
        tooltipElement.textContent = target.getAttribute('data-title');
        tooltipElement.classList.add('custom-tooltip');
        tooltipElement.style.left = `${rects.left}px`;
        tooltipElement.style.top = `${rects.top - 40}px`;

        document.querySelector('main').appendChild(tooltipElement)

        let tooltipRects = tooltipElement.getBoundingClientRect();
        tooltipElement.style.left = `${rects.left - (tooltipRects.width / 2) + (rects.width/2)}px`;
        tooltipElement.style.top = `${rects.top - 40}px`;
       
    })
    target.addEventListener('mouseleave', () => {
        if (tooltipElement) {
            tooltipElement.remove();
            tooltipElement = null;
        }
    })
}

window.addEventListener('load', () => {
    const targets = document.querySelectorAll('*[custom-tooltip]');
    targets.forEach(target => {
        applyCustomTooltip(target);
    })
})