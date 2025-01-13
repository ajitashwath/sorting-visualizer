let startTime;
const barContainer = document.getElementById('barContainer');
const arrayInput = document.getElementById('arrayInput');
const randomArrayBtn = document.getElementById('randomArray');
const algorithmSelect = document.getElementById('algorithm');
const speedInput = document.getElementById('speed');
const sortBtn = document.getElementById('sort');
const resetBtn = document.getElementById('reset');
const algorithmInfo = document.getElementById('algorithmInfo');
const complexityInfo = document.getElementById('complexityInfo');
const comparisonsSpan = document.getElementById('comparisons');
const swapsSpan = document.getElementById('swaps');

let array = [];
let sorting = false;
let comparisons = 0;
let swaps = 0;
let complexityChart;

const algorithms = {
    bubble: {
        name: 'Bubble Sort',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        description: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        pseudocode: `procedure bubbleSort(A : list of sortable items)
    n = length(A)
    repeat
        swapped = false
        for i = 1 to n-1 inclusive do
            if A[i-1] > A[i] then
                swap(A[i-1], A[i])
                swapped = true
            end if
        end for
        n = n - 1
    until not swapped
end procedure`,
        applications: 'Bubble sort is mainly used as an educational tool to introduce the concept of sorting algorithms. It\'s not efficient for large data sets but can be useful for small lists or nearly sorted data.',
        sort: bubbleSort
    },
    selection: {
        name: 'Selection Sort',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        description: 'Selection Sort divides the input list into two parts: a sorted portion at the left end and an unsorted portion at the right end. It repeatedly selects the smallest element from the unsorted portion and adds it to the sorted portion.',
        pseudocode: `procedure selectionSort(A : list of sortable items)
    n = length(A)
    for i = 1 to n - 1
        min = i
        for j = i + 1 to n
            if A[j] < A[min] then
                min = j
            end if
        end for
        if min ≠ i then
            swap A[i] and A[min]
        end if
    end for
end procedure`,
        applications: 'Selection sort is used when memory writes are expensive, as it makes the minimum possible number of swaps during the sorting process.',
        sort: selectionSort
    },
    insertion: {
        name: 'Insertion Sort',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        description: 'Insertion Sort builds the final sorted array one item at a time. It iterates through the input elements, growing the sorted array with each iteration.',
        pseudocode: `procedure insertionSort(A : list of sortable items)
    n = length(A)
    for i = 1 to n - 1
        key = A[i]
        j = i - 1
        while j >= 0 and A[j] > key
            A[j+1] = A[j]
            j = j - 1
        end while
        A[j+1] = key
    end for
end procedure`,
        applications: 'Insertion sort is efficient for small data sets and is often used as part of more sophisticated algorithms. It\'s also useful when the input array is nearly sorted.',
        sort: insertionSort
    },
    merge: {
        name: 'Merge Sort',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        description: 'Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the two sorted halves.',
        pseudocode: `procedure mergeSort(A : list of sortable items)
    if length(A) > 1
        middle = length(A) / 2
        left = A[0...middle]
        right = A[middle...length(A)]
        mergeSort(left)
        mergeSort(right)
        merge(A, left, right)
    end if
end procedure

procedure merge(A, left, right)
    i = 0, j = 0, k = 0
    while i < length(left) and j < length(right)
        if left[i] <= right[j]
            A[k] = left[i]
            i = i + 1
        else
            A[k] = right[j]
            j = j + 1
        end if
        k = k + 1
    end while
    while i < length(left)
        A[k] = left[i]
        i = i + 1
        k = k + 1
    end while
    while j < length(right)
        A[k] = right[j]
        j = j + 1
        k = k + 1
    end while
end procedure`,
        applications: 'Merge sort is widely used for external sorting, where the data to be sorted is too large to fit into memory.',
        sort: mergeSort
    },
    quick: {
        name: 'Quick Sort',
        timeComplexity: 'O(n log n) average, O(n²) worst case',
        spaceComplexity: 'O(log n)',
        description: 'Quick Sort is a divide-and-conquer algorithm that picks an element as a pivot and partitions the array around the pivot, recursively sorting the sub-arrays.',
        pseudocode: `procedure quickSort(A, low, high)
    if low < high
        pivotIndex = partition(A, low, high)
        quickSort(A, low, pivotIndex - 1)
        quickSort(A, pivotIndex + 1, high)
    end if
end procedure

procedure partition(A, low, high)
    pivot = A[high]
    i = low - 1
    for j = low to high - 1
        if A[j] <= pivot
            i = i + 1
            swap A[i] with A[j]
        end if
    end for
    swap A[i + 1] with A[high]
    return i + 1
end procedure`,
        applications: 'Quick sort is one of the most efficient sorting algorithms and is widely used in practice. It\'s the default sorting algorithm in many programming languages\' standard libraries.',
        sort: quickSort
    },
    heap: {
        name: 'Heap Sort',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
        description: 'Heap Sort creates a max-heap from the array and repeatedly extracts the maximum element, placing it at the end of the array.',
        pseudocode: `procedure heapSort(A)
    buildMaxHeap(A)
    for i = length(A) - 1 to 1
        swap A[0] with A[i]
        heapify(A, 0, i)
    end for
end procedure

procedure buildMaxHeap(A)
    for i = length(A) / 2 - 1 to 0
        heapify(A, i, length(A))
    end for
end procedure

procedure heapify(A, i, heapSize)
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    if left < heapSize and A[left] > A[largest]
        largest = left
    end if
    if right < heapSize and A[right] > A[largest]
        largest = right
    end if
    if largest ≠ i
        swap A[i] with A[largest]
        heapify(A, largest, heapSize)
    end if
end procedure`,
        applications: 'Heap sort is widely used in sorting algorithms that require guaranteed O(n log n) performance. It\'s also used in priority queues.',
        sort: heapSort
    }
};

function populateAlgorithmSelect() {
    for (const [key, value] of Object.entries(algorithms)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value.name;
        algorithmSelect.appendChild(option);
    }
}

function createBars() {
    barContainer.innerHTML = '';
    const maxValue = Math.max(...array);
    array.forEach((value) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${(value / maxValue) * 100}%`;
        const label = document.createElement('span');
        label.className = 'bar-label';
        label.textContent = value;
        bar.appendChild(label);
        barContainer.appendChild(bar);
    });
}

function updateBars() {
    const bars = document.querySelectorAll('.bar');
    const labels = document.querySelectorAll('.bar-label');
    const maxValue = Math.max(...array);
    array.forEach((value, index) => {
        bars[index].style.height = `${(value / maxValue) * 100}%`;
        labels[index].textContent = value;
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            comparisons++;
            if (array[j] > array[j + 1]) {
                swaps++;
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                updateBars();
                updateStats();
                await sleep(getDelay());
            }
        }
    }
}

async function selectionSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            comparisons++;
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            swaps++;
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            updateBars();
            updateStats();
            await sleep(getDelay());
        }
    }
}

async function insertionSort() {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            comparisons++;
            swaps++;
            array[j + 1] = array[j];
            j--;
            updateBars();
            updateStats();
            await sleep(getDelay());
        }
        array[j + 1] = key;
    }
}

async function mergeSort(start = 0, end = array.length - 1) {
    if (start < end) {
        const mid = Math.floor((start + end) / 2);
        await mergeSort(start, mid);
        await mergeSort(mid + 1, end);
        await merge(start, mid, end);
    }
}

async function merge(start, mid, end) {
    const leftArray = array.slice(start, mid + 1);
    const rightArray = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < leftArray.length && j < rightArray.length) {
        comparisons++;
        if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            i++;
        } else {
            array[k] = rightArray[j];
            j++;
        }
        swaps++;
        k++;
        updateBars();
        updateStats();
        await sleep(getDelay());
    }

    while (i < leftArray.length) {
        array[k] = leftArray[i];
        i++;
        k++;
        swaps++;
        updateBars();
        updateStats();
        await sleep(getDelay());
    }

    while (j < rightArray.length) {
        array[k] = rightArray[j];
        j++;
        k++;
        swaps++;
        updateBars();
        updateStats();
        await sleep(getDelay());
    }
}

async function quickSort(low = 0, high = array.length - 1) {
    if (low < high) {
        const pivotIndex = await partition(low, high);
        await quickSort(low, pivotIndex - 1);
        await quickSort(pivotIndex + 1, high);
    }
}

async function partition(low, high) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        comparisons++;
        if (array[j] < pivot) {
            i++;
            swaps++;
            [array[i], array[j]] = [array[j], array[i]];
            updateBars();
            updateStats();
            await sleep(getDelay());
        }
    }

    swaps++;
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    updateBars();
    updateStats();
    await sleep(getDelay());

    return i + 1;
}

async function heapSort() {
    const n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        swaps++;
        [array[0], array[i]] = [array[i], array[0]];
        updateBars();
        updateStats();
        await sleep(getDelay());
        await heapify(i, 0);
    }
}

async function heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    comparisons++;
    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    comparisons++;
    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        swaps++;
        [array[i], array[largest]] = [array[largest], array[i]];
        updateBars();
        updateStats();
        await sleep(getDelay());
        await heapify(n, largest);
    }
}

function generateRandomArray() {
    const size = Math.floor(Math.random() * 20) + 10;
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    createBars();
}

function resetStats() {
    comparisons = 0;
    swaps = 0;
    startTime = Date.now();
    updateStats();
}

function updateStats() {
    comparisonsSpan.textContent = comparisons;
    swapsSpan.textContent = swaps;
    const elapsedTime = (Date.now() - startTime) / 1000;
    document.getElementById('time').textContent = elapsedTime.toFixed(2);
}

function updateAlgorithmInfo() {
    const algorithm = algorithms[algorithmSelect.value];
    algorithmInfo.innerHTML = `
        <h2>${algorithm.name}</h2>
        <p><strong>Description:</strong> ${algorithm.description}</p>
        <p><strong>Time Complexity:</strong> ${algorithm.timeComplexity}</p>
        <p><strong>Space Complexity:</strong> ${algorithm.spaceComplexity}</p>
        <h3>Pseudocode:</h3>
        <pre><code>${algorithm.pseudocode}</code></pre>
        <h3>Applications:</h3>
        <p>${algorithm.applications}</p>
    `;
    updateComplexityGraph(algorithm);
    populatePracticeProblems(algorithm);
}

function updateComplexityGraph(algorithm) {
    if (complexityChart) {
        complexityChart.destroy();
    }

    const ctx = document.createElement('canvas');
    ctx.id = 'complexityGraph';
    complexityInfo.innerHTML = '<h2>Time Complexity</h2>';
    complexityInfo.appendChild(ctx);

    const labels = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);
    const data = {
        labels: labels,
        datasets: [{
            label: 'Time Complexity',
            data: labels.map(n => {
                if (algorithm.timeComplexity === 'O(n²)') {
                    return n * n;
                } else if (algorithm.timeComplexity.includes('O(n log n)')) {
                    return n * Math.log2(n);
                } else {
                    return n;
                }
            }),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    complexityChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const spaceComplexity = document.createElement('p');
    spaceComplexity.innerHTML = `<strong>Space Complexity:</strong> ${algorithm.spaceComplexity}`;
    complexityInfo.appendChild(spaceComplexity);
}

function getDelay() {
    return Math.max(1, 1000 - speedInput.value * 10);
}

function populatePracticeProblems(algorithm) {
    const problemsContainer = document.getElementById('practiceProblems');
    problemsContainer.innerHTML = '<h2>Practice Problems</h2>';
    const problemList = document.createElement('div');
    problemList.className = 'problem-list';

    const problems = [
        { name: 'Easy: Sort an Array', url: 'https://leetcode.com/problems/sort-an-array/', difficulty: 'Easy' },
        { name: 'Medium: Kth Largest Element', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', difficulty: 'Medium' },
        { name: 'Hard: Count of Smaller Numbers', url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/', difficulty: 'Hard' },
    ];

    problems.forEach(problem => {
        const problemItem = document.createElement('a');
        problemItem.href = problem.url;
        problemItem.target = '_blank';
        problemItem.className = 'problem-item';
        problemItem.innerHTML = `<strong>${problem.name}</strong><br>Difficulty: ${problem.difficulty}`;
        problemList.appendChild(problemItem);
    });

    problemsContainer.appendChild(problemList);
}

randomArrayBtn.addEventListener('click', generateRandomArray);
sortBtn.addEventListener('click', async () => {
    if (sorting) return;
    sorting = true;
    resetStats();

    const algorithm = algorithms[algorithmSelect.value];
    await algorithm.sort();

    sorting = false;
});

resetBtn.addEventListener('click', () => {
    if (sorting) return;
    array = arrayInput.value.split(',').map(Number);
    createBars();
    resetStats();
});

algorithmSelect.addEventListener('change', updateAlgorithmInfo);

arrayInput.addEventListener('change', () => {
    if (sorting) return;
    array = arrayInput.value.split(',').map(Number);
    createBars();
    resetStats();
});

populateAlgorithmSelect();
generateRandomArray();
updateAlgorithmInfo();
