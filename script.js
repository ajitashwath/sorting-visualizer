const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const barContainer = document.getElementById('barContainer');
const arrayInput = document.getElementById('arrayInput');
const randomArrayBtn = document.getElementById('randomArray');
const speedInput = document.getElementById('speed');
const sortBtn = document.getElementById('sort');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const algorithmInfo = document.getElementById('algorithmInfo');
const complexityInfo = document.getElementById('complexityInfo');
const implementationInfo = document.getElementById('implementationInfo');
const languageSelect = document.getElementById('languageSelect');
const implementationCode = document.getElementById('implementationCode');
const comparisonsSpan = document.getElementById('comparisons');
const swapsSpan = document.getElementById('swaps');
const timeSpan = document.getElementById('time');
const practiceProblems = document.getElementById('practiceProblems');

let array = [];
let originalArray = [];
let sorting = false;
let paused = false;
let comparisons = 0;
let swaps = 0;
let startTime;
let complexityChart;
let currentAlgorithm;

const algorithms = {
    selection: {
        name: 'Selection Sort',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        description: 'Selection Sort is a comparison-based sorting algorithm. It sorts an array by repeatedly selecting the smallest  (or largest) element from the unsorted portion and wapping it with the first unsorted element.',
        pseudocode: 
        `procedure selectionSort(A: list of sortable items)
            n = length(A)
            for i from 0 to n - 2 inclusive do
                minIndex = i
                for j = i + 1 to n - 1 inclusive do
                    if A[j] < A[minIndex] then
                        minIndex = j
                    end if
                end for
                if minIndex != i then
                    swap(A[i], A[minIndex])
                end if
            end for
end procedure`,
        implementation: {
            python: `def selection_sort(arr):
                        n = len(arr)
                        for i in range(n - 1):
                            min_idx = i
                            for j in range(i + 1,n):
                                if arr[j] < arr[min_idx]:
                                    min_idx = j
                            arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
            javascript: `function selectionSort(arr) {
                            let n = arr.length;
                            for(let i = 0; i < n - 1; i++) {
                                let min_idx = i;
                                for(let j = i + 1; j < n; j++) {
                                    if(arr[j] < arr[min_idx]) {
                                        min_idx = j
                                    }
                                }
                            }
                        }`,
            java: `public static void selectionSort(int[] arr) {
                    int n = arr.length;
                    for(int i = 0; i < n - 1; i++) {
                        int min_idx = i;
                        for(int j = i + 1; j < n; j++) {
                            if(arr[j] < arr[min_idx]) {
                                min_idx = j;
                            }
                        }
                        int temp = arr[i];
                        arr[i] = arr[min_idx];
                        arr[min_idx] = temp;
                    }
                }`
        },
        sort: async function () {
            const n = array.length;
            for (let i = 0; i < n - 1; i++) {
                let minIndex = i;
                for (let j = i + 1; j < n; j++) {
                    comparisons++;
                    if (array[j] < array[minIndex]) {
                        minIndex = j;
                    }
                }
                if (minIndex !== i) {
                    swaps++;
                    [array[i], array[minIndex]] = [array[minIndex], array[i]];
                    updateBars();
                    updateStats();
                    await sleep(getDelay());
                    if (paused) await waitForResume();
                }
            }
        }                  
    },
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
        implementation: {
            python: `def bubble_sort(arr):
                        n = len(arr)
                        for i in range(n):
                            for j in range(0, n - i - 1):
                                if arr[j] > arr[j + 1]:
                                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
                        return arr`,
            javascript: `function bubbleSort(arr) {
                            const n = arr.length;
                            for (let i = 0; i < n - 1; i++) {
                                for (let j = 0; j < n - i - 1; j++) {
                                    if (arr[j] > arr[j + 1]) {
                                        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                                    }
                                }
                            }
                            return arr;
                        }`,
            java: `public static void bubbleSort(int[] arr) {
                        int n = arr.length;
                        for (int i = 0; i < n-1; i++)
                            for (int j = 0; j < n-i-1; j++)
                                if (arr[j] > arr[j+1]) {
                                    int temp = arr[j];
                                    arr[j] = arr[j+1];
                                    arr[j+1] = temp;
                                }
                    }`
        },
        sort: async function () {
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
                        if (paused) await waitForResume();
                    }
                }
            }
        }
    },
    quick: {
        name: 'Quick Sort',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(log n)',
        description: 'Quick Sort is a divide-and-conquer algorithm that picks an element as a pivot and partitions the array around the pivot, recursively sorting the sub-arrays.',
        pseudocode: `procedure quickSort(A, low, high)
    if low < high then
        pivotIndex = partition(A, low, high)
        quickSort(A, low, pivotIndex - 1)
        quickSort(A, pivotIndex + 1, high)
    end if
end procedure

procedure partition(A, low, high)
    pivot = A[high]
    i = low - 1
    for j = low to high - 1 do
        if A[j] <= pivot then
            i = i + 1
            swap A[i] with A[j]
        end if
    end for
    swap A[i + 1] with A[high]
    return i + 1
end procedure`,
        implementation: {
            python: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    else:
        pivot = arr[0]
        less = [x for x in arr[1:] if x <= pivot]
        greater = [x for x in arr[1:] if x > pivot]
        return quick_sort(less) + [pivot] + quick_sort(greater)`,
            javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        let pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`,
            java: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

private static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`
        },
        sort: async function () {
            async function quickSort(low = 0, high = array.length - 1) {
                if (low < high) {
                    let pi = await partition(low, high);
                    await quickSort(low, pi - 1);
                    await quickSort(pi + 1, high);
                }
            }

            async function partition(low, high) {
                let pivot = array[high];
                let i = low - 1;
                for (let j = low; j <= high - 1; j++) {
                    comparisons++;
                    if (array[j] < pivot) {
                        i++;
                        swaps++;
                        [array[i], array[j]] = [array[j], array[i]];
                        updateBars();
                        updateStats();
                        await sleep(getDelay());
                        if (paused) await waitForResume();
                    }
                }
                swaps++;
                [array[i + 1], array[high]] = [array[high], array[i + 1]];
                updateBars();
                updateStats();
                await sleep(getDelay());
                if (paused) await waitForResume();
                return i + 1;
            }

            await quickSort();
        }
    },
    merge: {
        name: 'Merge Sort',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        description: 'Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the two sorted halves.',
        pseudocode: `procedure mergeSort(A, left, right)
    if left < right then
        middle = (left + right) / 2
        mergeSort(A, left, middle)
        mergeSort(A, middle + 1, right)
        merge(A, left, middle, right)
    end if
end procedure

procedure merge(A, left, middle, right)
    n1 = middle - left + 1
    n2 = right - middle
    L = new array of size n1
    R = new array of size n2
    for i = 0 to n1 - 1 do
        L[i] = A[left + i]
    for j = 0 to n2 - 1 do
        R[j] = A[middle + 1 + j]
    i = 0, j = 0, k = left
    while i < n1 and j < n2 do
        if L[i] <= R[j] then
            A[k] = L[i]
            i = i + 1
        else
            A[k] = R[j]
            j = j + 1
        k = k + 1
    while i < n1 do
        A[k] = L[i]
        i = i + 1
        k = k + 1
    while j < n2 do
        A[k] = R[j]
        j = j + 1
        k = k + 1
end procedure`,
        implementation: {
            python: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        L = arr[:mid]
        R = arr[mid:]
        merge_sort(L)
        merge_sort(R)
        i = j = k = 0
        while i < len(L) and j < len(R):
            if L[i] < R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1
        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1
        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1
    return arr`,
            javascript: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}`,
            java: `public static void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = (l + r) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

private static void merge(int[] arr, int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int[] L = new int[n1];
    int[] R = new int[n2];
    for (int i = 0; i < n1; ++i)
        L[i] = arr[l + i];
    for (int j = 0; j < n2; ++j)
        R[j] = arr[m + 1 + j];
    int i = 0, j = 0;
    int k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}`
        },
        sort: async function () {
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
                    if (paused) await waitForResume();
                }

                while (i < leftArray.length) {
                    array[k] = leftArray[i];
                    i++;
                    k++;
                    swaps++;
                    updateBars();
                    updateStats();
                    await sleep(getDelay());
                    if (paused) await waitForResume();
                }

                while (j < rightArray.length) {
                    array[k] = rightArray[j];
                    j++;
                    k++;
                    swaps++;
                    updateBars();
                    updateStats();
                    await sleep(getDelay());
                    if (paused) await waitForResume();
                }
            }

            await mergeSort();
        }
    }
};

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) &&
        !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

function createBars() {
    barContainer.innerHTML = '';
    const containerWidth = barContainer.clientWidth;
    const containerHeight = barContainer.clientHeight - 20; 
    const maxValue = Math.max(...array);
    const barWidth = containerWidth / array.length;

    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        const height = (value / maxValue) * containerHeight;
        bar.style.height = `${height}px`;
        bar.style.width = `${barWidth}px`;
        bar.style.left = `${index * barWidth}px`;

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
    const containerHeight = barContainer.clientHeight - 20;
    const maxValue = Math.max(...array);
    array.forEach((value, index) => {
        const height = (value / maxValue) * containerHeight;
        bars[index].style.height = `${height}px`;
        labels[index].textContent = value;
    });
}

function generateRandomArray() {
    const size = Math.floor(Math.random() * 20) + 10;
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    originalArray = [...array];
    createBars();
    resetStats();
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
    timeSpan.textContent = elapsedTime.toFixed(2);
}

async function startSort() {
    if (sorting || !currentAlgorithm) return;
    sorting = true;
    sortBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = true;
    resetStats();
    await currentAlgorithm.sort();
    sorting = false;
    sortBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = false;
}

function togglePause() {
    paused = !paused;
    pauseBtn.textContent = paused ? 'Resume' : 'Pause';
}

function resetArray() {
    array = [...originalArray];
    createBars();
    resetStats();
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForResume() {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (!paused) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });
}

function getDelay() {
    return 1000 / speedInput.value;
}

function selectAlgorithm(key) {
    currentAlgorithm = algorithms[key];
    document.querySelectorAll('.algorithm-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-algorithm="${key}"]`).classList.add('active');
    updateAlgorithmInfo();

    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
}

function updateAlgorithmInfo() {
    algorithmInfo.innerHTML = `
        <h2>${currentAlgorithm.name}</h2>
        <p><strong>Description:</strong> ${currentAlgorithm.description}</p>
        <p><strong>Time Complexity:</strong> ${currentAlgorithm.timeComplexity}</p>
        <p><strong>Space Complexity:</strong> ${currentAlgorithm.spaceComplexity}</p>
        <h3>Pseudocode:</h3>
        <pre><code>${currentAlgorithm.pseudocode}</code></pre>
    `;
    updateComplexityGraph();
    updateImplementation();
    updatePracticeProblems();
}

function updateComplexityGraph() {
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
                if (currentAlgorithm.timeComplexity === 'O(n²)') {
                    return n * n;
                } else if (currentAlgorithm.timeComplexity.includes('O(n log n)')) {
                    return n * Math.log2(n);
                } else if (currentAlgorithm.timeComplexity.includes('O(n + k)')) {
                    return n + 10; // Assuming k is constant
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
}

function updateImplementation() {
    const language = languageSelect.value;
    implementationCode.textContent = currentAlgorithm.implementation[language];
}

function updatePracticeProblems() {
    const problems = [
        { name: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/', difficulty: 'Easy' },
        { name: 'Merge Intervals', url: 'https://leetcode.com/problems/merge-intervals/', difficulty: 'Medium' },
        { name: 'Sort Colors', url: 'https://leetcode.com/problems/sort-colors/', difficulty: 'Medium' },
        { name: 'Kth Largest Element', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', difficulty: 'Medium' },
        { name: 'Merge k Sorted Lists', url: 'https://leetcode.com/problems/merge-k-sorted-lists/', difficulty: 'Hard' }
    ];

    practiceProblems.innerHTML = '<h2>Practice Problems</h2><div class="problem-list"></div>';
    const problemList = practiceProblems.querySelector('.problem-list');

    problems.forEach(problem => {
        const problemItem = document.createElement('a');
        problemItem.href = problem.url;
        problemItem.target = '_blank';
        problemItem.className = 'problem-item';
        problemItem.innerHTML = `
            <strong>${problem.name}</strong>
            <span class="difficulty ${problem.difficulty.toLowerCase()}">${problem.difficulty}</span>
        `;
        problemList.appendChild(problemItem);
    });
}

randomArrayBtn.addEventListener('click', generateRandomArray);
arrayInput.addEventListener('change', (e) => {
    const input = e.target.value.split(',').map(Number);
    if (input.some(isNaN)) {
        alert('Please enter valid numbers separated by commas');
        return;
    }
    array = input;
    originalArray = [...array];
    createBars();
    resetStats();
});
sortBtn.addEventListener('click', startSort);
pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetArray);
languageSelect.addEventListener('change', updateImplementation);

function populateAlgorithmList() {
    const algorithmList = document.getElementById('algorithmList');
    for (const [key, value] of Object.entries(algorithms)) {
        const button = document.createElement('button');
        button.textContent = value.name;
        button.className = 'algorithm-button';
        button.setAttribute('data-algorithm', key);
        button.onclick = () => selectAlgorithm(key);
        algorithmList.appendChild(button);
    }
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (!sorting) {
            createBars();
        }
    }, 250);
});

populateAlgorithmList();
generateRandomArray();
selectAlgorithm('bubble');