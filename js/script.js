const algorithmSelect = document.getElementById('algorithmSelect');
const startSortButton = document.getElementById('startSort');
const generateArrayButton = document.getElementById('generateArray');
const arraySizeInput = document.getElementById('arraySize');
const arraySizeValue = document.getElementById('arraySizeValue');
const sortingSpeedInput = document.getElementById('sortingSpeed');
const speedValue = document.getElementById('speedValue');
const arrayContainer = document.getElementById('arrayContainer');
const comparisonsSpan = document.getElementById('comparisons');
const swapsSpan = document.getElementById('swaps');
const timeSpan = document.getElementById('time');
const manualInputField = document.getElementById('manualInput');

let array = [];
let isSorting = false;
let comparisons = 0;
let swaps = 0;
let startTime = 0;
let animationSpeed = 100 - sortingSpeedInput.value;

/*
function generateArray() {
    const size = parseInt(arraySizeInput.value);
    array = [];
    comparisons = 0;
    swaps = 0;
    timeSpan.textContent = '0.00';
    arrayContainer.innerHTML = '';

    for (let i = 0; i < size; i++) {
        const value = Math.floor(Math.random() * (300 - 10) + 10);
        array.push(value);
        
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${value}px`;
        bar.style.width = `${Math.max(2, Math.floor(700 / size))}px`;
        arrayContainer.appendChild(bar);
    }
    updateStats();
}
*/

function generateArray() {
    const input = manualInputField.value.trim();
    const inputValues = input ? 
        input.split(',').map(val => {
            const num = parseInt(val.trim(), 10);
            return isNaN(num) ? null : num;
        }).filter(val => val !== null) : 
        Array.from({length: 50}, () => Math.floor(Math.random() * (300 - 10) + 10));

    if (inputValues.length === 0) {
        alert('Please enter valid numbers');
        return;
    }
    const size = 50;
    array = inputValues;
    comparisons = 0;
    swaps = 0;
    timeSpan.textContent = '0.00';
    arrayContainer.innerHTML = '';

    array.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar-wrapper';
        
        const barHeight = document.createElement('div');
        barHeight.className = 'array-bar';
        barHeight.style.height = `${value}px`;
        barHeight.style.width = `${700 / array.length}px`;
        
        const barLabel = document.createElement('div');
        barLabel.className = 'bar-label';
        barLabel.textContent = value;
        
        bar.appendChild(barLabel);
        bar.appendChild(barHeight);
        
        arrayContainer.appendChild(bar);
    });
    
    updateStats();
}

function updateStats() {
    comparisonsSpan.textContent = comparisons;
    swapsSpan.textContent = swaps;
    if (startTime > 0) {
        const currentTime = (Date.now() - startTime) / 1000;
        timeSpan.textContent = currentTime.toFixed(2);
    }
}

async function markComparing(i, j) {
    const bars = arrayContainer.children;
    const barElements = Array.from(bars).map(bar => bar.querySelector('.array-bar'));
    
    barElements[i].classList.add('comparing');
    if (j !== undefined) barElements[j].classList.add('comparing');
    
    comparisons++;
    updateStats();
    await sleep(animationSpeed);
    
    barElements[i].classList.remove('comparing');
    if (j !== undefined) barElements[j].classList.remove('comparing');
}

async function swap(i, j) {
    const bars = arrayContainer.children;
    const barElements = Array.from(bars).map(bar => bar.querySelector('.array-bar'));
    const barLabels = Array.from(bars).map(bar => bar.querySelector('.bar-label'));
    
    barElements[i].classList.add('swapping');
    barElements[j].classList.add('swapping');
    
    const tempHeight = barElements[i].style.height;
    const tempLabel = barLabels[i].textContent;
    
    barElements[i].style.height = barElements[j].style.height;
    barLabels[i].textContent = barLabels[j].textContent;
    
    barElements[j].style.height = tempHeight;
    barLabels[j].textContent = tempLabel;
    
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    
    swaps++;
    updateStats();
    await sleep(animationSpeed);
    
    barElements[i].classList.remove('swapping');
    barElements[j].classList.remove('swapping');
}

async function markSorted(index) {
    const bars = arrayContainer.children;
    const barElements = Array.from(bars).map(bar => bar.querySelector('.array-bar'));
    barElements[index].classList.add('sorted');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            await markComparing(j, j + 1);
            if (array[j] > array[j + 1]) {
                await swap(j, j + 1);
            }
        }
        await markSorted(n - i - 1);
    }
    await markSorted(0);
}

async function selectionSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            await markComparing(minIdx, j);
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            await swap(i, minIdx);
        }
        await markSorted(i);
    }
    await markSorted(n - 1);
}

async function insertionSort() {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0) {
            await markComparing(j, j + 1);
            if (array[j] > key) {
                await swap(j, j + 1);
                j--;
            } else {
                break;
            }
        }
        for (let k = 0; k <= i; k++) {
            await markSorted(k);
        }
    }
}

async function mergeSort() {
    async function merge(l, m, r) {
        const n1 = m - l + 1;
        const n2 = r - m;
        const L = array.slice(l, m + 1);
        const R = array.slice(m + 1, r + 1);
        
        let i = 0, j = 0, k = l;
        
        while (i < n1 && j < n2) {
            await markComparing(l + i, m + 1 + j);
            if (L[i] <= R[j]) {
                array[k] = L[i];
                const bars = arrayContainer.children;
                bars[k].style.height = `${L[i]}px`;
                i++;
            } else {
                array[k] = R[j];
                const bars = arrayContainer.children;
                bars[k].style.height = `${R[j]}px`;
                j++;
            }
            swaps++;
            updateStats();
            await sleep(animationSpeed);
            k++;
        }
        
        while (i < n1) {
            array[k] = L[i];
            const bars = arrayContainer.children;
            bars[k].style.height = `${L[i]}px`;
            i++;
            k++;
            swaps++;
            updateStats();
            await sleep(animationSpeed);
        }
        
        while (j < n2) {
            array[k] = R[j];
            const bars = arrayContainer.children;
            bars[k].style.height = `${R[j]}px`;
            j++;
            k++;
            swaps++;
            updateStats();
            await sleep(animationSpeed);
        }
        
        for (let idx = l; idx <= r; idx++) {
            await markSorted(idx);
        }
    }
    
    async function mergeSortHelper(l, r) {
        if (l < r) {
            const m = Math.floor(l + (r - l) / 2);
            await mergeSortHelper(l, m);
            await mergeSortHelper(m + 1, r);
            await merge(l, m, r);
        }
    }
    
    await mergeSortHelper(0, array.length - 1);
}

async function quickSort() {
    async function partition(low, high) {
        const pivot = array[high];
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            await markComparing(j, high);
            if (array[j] < pivot) {
                i++;
                await swap(i, j);
            }
        }
        await swap(i + 1, high);
        await markSorted(i + 1);
        return i + 1;
    }
    
    async function quickSortHelper(low, high) {
        if (low < high) {
            const pi = await partition(low, high);
            await quickSortHelper(low, pi - 1);
            await quickSortHelper(pi + 1, high);
        } else if (low === high) {
            await markSorted(low);
        }
    }
    
    await quickSortHelper(0, array.length - 1);
}

async function heapSort() {
    async function heapify(n, i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        
        if (left < n) {
            await markComparing(largest, left);
            if (array[left] > array[largest]) {
                largest = left;
            }
        }
        
        if (right < n) {
            await markComparing(largest, right);
            if (array[right] > array[largest]) {
                largest = right;
            }
        }
        
        if (largest !== i) {
            await swap(i, largest);
            await heapify(n, largest);
        }
    }
    
    const n = array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }
    
    for (let i = n - 1; i > 0; i--) {
        await swap(0, i);
        await markSorted(i);
        await heapify(i, 0);
    }
    await markSorted(0);
}

manualInputField.addEventListener('input', generateArray);

sortingSpeedInput.addEventListener('input', () => {
    speedValue.textContent = sortingSpeedInput.value;
    animationSpeed = 100 - sortingSpeedInput.value;
});

startSortButton.addEventListener('click', async () => {
    if (isSorting || !algorithmSelect.value) return;
    
    isSorting = true;
    startSortButton.disabled = true;
    startTime = Date.now();
    
    try {
        switch (algorithmSelect.value) {
            case 'bubble': await bubbleSort(); break;
            case 'selection': await selectionSort(); break;
            case 'insertion': await insertionSort(); break;
            case 'merge': await mergeSort(); break;
            case 'quick': await quickSort(); break;
            case 'heap': await heapSort(); break;
        }
    } finally {
        isSorting = false;
        startSortButton.disabled = false;
    }
});

// Initial array generation
generateArray();
