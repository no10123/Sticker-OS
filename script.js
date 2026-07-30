const viewport = document.getElementById("viewport");

let W = '<div id="windows">\n';

const systemApps = [
    { n: "calculator", i: "fa-calculator", t: "Calculator", w: 300, h: 450 }
];

function CreateApp(n, i, t, w = 600, h = 450) {
    W += `
        <div id="${n}" class="dragable hidden" style="width:${w}px;height:${h}px;">
            <div class="drag" id="${n}-header">
                <div>
                    <i class="fa-solid ${i}"></i>
                    <span class="wTitle">${t}</span>
                </div>
                <div class="window-controls">
                    <!-- Just the close button, no text inside -->
                    <button type="button" onclick="AMI.closeApp('${n}')"></button>
                </div>
            </div>
            <div class="text frosted-glass-large flex-col-window" id="${n}-Window"></div>
        </div>`;
}

systemApps.forEach(({ n, i, t, w, h }) => {
    CreateApp(n, i, t, w, h);
});

viewport.innerHTML = `${W}</div>`;

let topZIndex = 10;

const AMI = {
    openApp: (id) => {
        const win = document.getElementById(id);
        if (win) {
            win.classList.remove('hidden');
            AMI.bringToFront(win);
        }
    },
    closeApp: (id) => {
        const win = document.getElementById(id);
        if (win) win.classList.add('hidden');
    },
    bringToFront: (element) => {
        topZIndex++;
        element.style.zIndex = topZIndex;
    }
};

function makeDraggable(element, dragHandle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    dragHandle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        AMI.bringToFront(element); 
        
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        document.onmousemove = elementDrag;
        document.onmouseup = closeDragElement;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

systemApps.forEach(({ n }) => {
    const template = document.getElementById(`t-${n}`);
    const destination = document.getElementById(`${n}-Window`);

    if (template && destination) {
        destination.appendChild(template.content.cloneNode(true));
    }

    const windowElement = document.getElementById(n);
    const windowHeader = document.getElementById(`${n}-header`);
    
    if (windowElement && windowHeader) {
        makeDraggable(windowElement, windowHeader);
        
        windowElement.addEventListener("mousedown", () => {
            AMI.bringToFront(windowElement);
        });
    }
});