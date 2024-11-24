/*
import { createTimeComplexityChart, updateAlgorithmInfo, algorithmInfo } from 'chartUtils.js';

const ctx = document.getElementById('timeComplexityChart');
let complexityChart = createTimeComplexityChart(ctx);

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
const algorithmInfoDiv = document.getElementById('algorithmInfo');
const metricsDiv = document.getElementById('metrics');

let array = [];
let isSorting = false;
let comparisons = 0;
let swaps = 0;
let startTime = 0;
let animationSpeed = 100 - sortingSpeedInput.value;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateStats() {
  comparisonsSpan.textContent = comparisons;
  swapsSpan.textContent = swaps;
  if (startTime > 0) {
    const currentTime = (Date.now() - startTime) / 1000;
    timeSpan.textContent = currentTime.toFixed(2);
  }
}

function generateArray() {
  if (isSorting) return;
  
  const size = parseInt(arraySizeInput.value);
  array = [];
  comparisons = 0;
  swaps = 0;
  startTime = 0;
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

// Sorting Algorithms
async function bubbleSort() {
  const n = array.length;
  const bars = arrayContainer.children;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (isSorting === false) return;

      bars[j].classList.add('comparing');
      bars[j + 1].classList.add('comparing');
      comparisons++;

      if (array[j] > array[j + 1]) {
        bars[j].classList.add('swapping');
        bars[j + 1].classList.add('swapping');
        
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        
        const tempHeight = bars[j].style.height;
        bars[j].style.height = bars[j + 1].style.height;
        bars[j + 1].style.height = tempHeight;
        
        swaps++;
        await sleep(animationSpeed);
        
        bars[j].classList.remove('swapping');
        bars[j + 1].classList.remove('swapping');
      }

      updateStats();
      await sleep(animationSpeed / 2);
      
      bars[j].classList.remove('comparing');
      bars[j + 1].classList.remove('comparing');
    }
    bars[n - i - 1].classList.add('sorted');
  }
  bars[0].classList.add('sorted');
}

async function selectionSort() {
  const n = array.length;
  const bars = arrayContainer.children;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    bars[i].classList.add('comparing');
    
    for (let j = i + 1; j < n; j++) {
      if (isSorting === false) return;
      
      bars[j].classList.add('comparing');
      comparisons++;
      
      if (array[j] < array[minIdx]) {
        bars[minIdx].classList.remove('comparing');
        minIdx = j;
        bars[minIdx].classList.add('comparing');
      }
      
      await sleep(animationSpeed / 2);
      if (j !== minIdx) bars[j].classList.remove('comparing');
      updateStats();
    }

    if (minIdx !== i) {
      bars[i].classList.add('swapping');
      bars[minIdx].classList.add('swapping');
      
      const temp = array[i];
      array[i] = array[minIdx];
      array[minIdx] = temp;
      
      const tempHeight = bars[i].style.height;
      bars[i].style.height = bars[minIdx].style.height;
      bars[minIdx].style.height = tempHeight;
      
      swaps++;
      await sleep(animationSpeed);
      
      bars[i].classList.remove('swapping');
      bars[minIdx].classList.remove('swapping');
    }
    
    bars[i].classList.remove('comparing');
    bars[minIdx].classList.remove('comparing');
    bars[i].classList.add('sorted');
  }
  bars[n - 1].classList.add('sorted');
}

async function insertionSort() {
  const n = array.length;
  const bars = arrayContainer.children;

  bars[0].classList.add('sorted');
  
  for (let i = 1; i < n; i++) {
    if (isSorting === false) return;
    
    const key = array[i];
    const keyHeight = bars[i].style.height;
    let j = i - 1;
    
    bars[i].classList.add('comparing');
    await sleep(animationSpeed);
    
    while (j >= 0 && array[j] > key) {
      if (isSorting === false) return;
      
      bars[j].classList.add('comparing');
      comparisons++;
      
      array[j + 1] = array[j];
      bars[j + 1].style.height = bars[j].style.height;
      bars[j + 1].classList.add('swapping');
      
      await sleep(animationSpeed);
      
      bars[j].classList.remove('comparing');
      bars[j + 1].classList.remove('swapping');
      swaps++;
      j--;
      updateStats();
    }
    
    array[j + 1] = key;
    bars[j + 1].style.height = keyHeight;
    bars[i].classList.remove('comparing');
    bars[j + 1].classList.add('sorted');
  }
}

arraySizeInput.addEventListener('input', (e) => {
  arraySizeValue.textContent = e.target.value;
  generateArray();
});

sortingSpeedInput.addEventListener('input', (e) => {
  speedValue.textContent = e.target.value;
  animationSpeed = 100 - e.target.value;
});

algorithmSelect.addEventListener('change', () => {
  updateAlgorithmInfo(algorithmSelect.value, algorithmInfoDiv, metricsDiv);
});

generateArrayButton.addEventListener('click', generateArray);

startSortButton.addEventListener('click', async () => {
  if (isSorting) {
    isSorting = false;
    startSortButton.textContent = 'Start Sorting';
    return;
  }

  isSorting = true;
  startTime = Date.now();
  startSortButton.textContent = 'Stop Sorting';
  generateArrayButton.disabled = true;
  algorithmSelect.disabled = true;

  try {
    switch (algorithmSelect.value) {
      case 'bubble':
        await bubbleSort();
        break;
      case 'selection':
        await selectionSort();
        break;
      case 'insertion':
        await insertionSort();
        break;
    }
  } finally {
    isSorting = false;
    startSortButton.textContent = 'Start Sorting';
    generateArrayButton.disabled = false;
    algorithmSelect.disabled = false;
  }
});

// Initial setup
generateArray();
updateAlgorithmInfo('bubble', algorithmInfoDiv, metricsDiv);
*/

document.addEventListener('DOMContentLoaded', () => {
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
  const algorithmInfoDiv = document.getElementById('algorithmInfo');
  const metricsDiv = document.getElementById('metrics');
  const ctx = document.getElementById('timeComplexityChart');

  let array = [];
  let isSorting = false;
  let comparisons = 0;
  let swaps = 0;
  let startTime = 0;
  let animationSpeed = 100 - parseInt(sortingSpeedInput.value);
  let complexityChart = null;

  if (ctx) {
      complexityChart = createTimeComplexityChart(ctx);
  }

  function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  function updateStats() {
      comparisonsSpan.textContent = comparisons;
      swapsSpan.textContent = swaps;
      if (startTime > 0) {
          const currentTime = (Date.now() - startTime) / 1000;
          timeSpan.textContent = currentTime.toFixed(2);
      }
  }

  function generateArray() {
      if (isSorting) return;
      
      const size = parseInt(arraySizeInput.value);
      array = [];
      comparisons = 0;
      swaps = 0;
      startTime = 0;
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

  // Add event listeners
  arraySizeInput.addEventListener('input', (e) => {
      arraySizeValue.textContent = e.target.value;
      generateArray();
  });

  sortingSpeedInput.addEventListener('input', (e) => {
      speedValue.textContent = e.target.value;
      animationSpeed = 100 - parseInt(e.target.value);
  });

  algorithmSelect.addEventListener('change', () => {
      updateAlgorithmInfo(algorithmSelect.value, algorithmInfoDiv, metricsDiv);
  });

  generateArrayButton.addEventListener('click', generateArray);

  startSortButton.addEventListener('click', async () => {
      if (isSorting) {
          isSorting = false;
          startSortButton.textContent = 'Start Sorting';
          return;
      }

      isSorting = true;
      startTime = Date.now();
      startSortButton.textContent = 'Stop Sorting';
      generateArrayButton.disabled = true;
      algorithmSelect.disabled = true;

      try {
          switch (algorithmSelect.value) {
              case 'bubble':
                  await bubbleSort();
                  break;
              case 'selection':
                  await selectionSort();
                  break;
              case 'insertion':
                  await insertionSort();
                  break;
          }
      } finally {
          isSorting = false;
          startSortButton.textContent = 'Start Sorting';
          generateArrayButton.disabled = false;
          algorithmSelect.disabled = false;
      }
  });

  // Initialize
  generateArray();
  updateAlgorithmInfo('bubble', algorithmInfoDiv, metricsDiv);
});