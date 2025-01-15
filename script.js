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
        description: 'Selection Sort is a comparison-based sorting algorithm. It sorts an array by repeatedly selecting the smallest (or largest) element from the unsorted portion and swapping it with the first unsorted element.',
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
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
            c: `void selection_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        int temp = arr[i];
        arr[i] = arr[min_idx];
        arr[min_idx] = temp;
    }
}`,
            cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        swap(arr[i], arr[min_idx]);
    }
}`
        },
        sort: async function () {
            const n = array.length;
            let comparisons = 0;
            let swaps = 0;
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
                    updateStats(comparisons, swaps);
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
        pseudocode: 
        `procedure bubbleSort(A: list of sortable items)
            n = length(A)
            for i from 0 to n - 1 do
                for j from 0 to n - i - 1 do
                    if A[j] > A[j + 1] then
                        swap(A[j], A[j + 1])
                    end if
                end for
            end for
        end procedure`,
        implementation: {
            python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
            c: `void bubble_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
            cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`
        },
        sort: async function () {
            const n = array.length;
            let comparisons = 0;
            let swaps = 0;
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
    insertion: {
        name: 'Insertion Sort',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        description: 'Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
        pseudocode: 
        `procedure insertionSort(A: list of sortable items)
            n = length(A)
            for i from 1 to n - 1 do
                key = A[i]
                j = i - 1
                while j >= 0 and A[j] > key do
                    A[j + 1] = A[j]
                    j = j - 1
                end while
                A[j + 1] = key
            end for
        end procedure`,
        implementation: {
            python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
            c: `void insertion_sort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
            cpp: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`
        },
        sort: async function () {
            const n = array.length;
            let comparisons = 0;
            let swaps = 0;
            for (let i = 1; i < n; i++) {
                let key = array[i];
                let j = i - 1;
                while (j >= 0 && array[j] > key) {
                    comparisons++;
                    swaps++;
                    array[j + 1] = array[j];
                    j = j - 1;
                    updateBars();
                    updateStats();
                    await sleep(getDelay());
                    if (paused) await waitForResume();
                }
                array[j + 1] = key;
            }
        }
    },
    merge: {
        name: 'Merge Sort',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        description: 'Merge Sort is an efficient, stable, divide-and-conquer sorting algorithm. It divides the input array into two halves, recursively sorts them, and then merges the two sorted halves.',
        pseudocode: 
        `procedure mergeSort(A: list of sortable items)
            if length(A) > 1
                middle = length(A) / 2
                left = A[0..middle]
                right = A[middle..length(A)]
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
            k += 1`,
            c: `void merge(int arr[], int l, int m, int r) {
    int i, j, k;
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    for (i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (j = 0; j < n2; j++)
        R[j] = arr[m + 1 + j];
    i = 0;
    j = 0;
    k = l;
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
}

void merge_sort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        merge_sort(arr, l, m);
        merge_sort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
            cpp: `void merge(vector<int>& arr, int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    vector<int> L(n1), R(n2);
    for (int i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
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
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`
        },
        sort: async function (left, right, arr, ) {
            let comparisons = 0;
            let swaps = 0;

            async function merge(left, right) {
                let result = [];
                let leftIndex = 0;
                let rightIndex = 0;

                while (leftIndex < left.length && rightIndex < right.length) {
                    comparisons++;
                    if (left[leftIndex] < right[rightIndex]) {
                        result.push(left[leftIndex]);
                        leftIndex++;
                    } else {
                        result.push(right[rightIndex]);
                        rightIndex++;
                    }
                    swaps++;
                    updateBars();
                    updateStats();
                    await sleep(getDelay());
                    if (paused) await waitForResume();
                }

                return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
            }

            async function mergeSort(arr) {
                if (arr.length <= 1) return arr;
                const mid = Math.floor(arr.length / 2);
                const left = arr.slice(0, mid);
                const right = arr.slice(mid);
                return merge(await mergeSort(left), await mergeSort(right));
            }

            array = await mergeSort(array);
        }
    },
    quick: {
        name: 'Quick Sort',
        timeComplexity: 'O(n log n) average, O(n²) worst case',
        spaceComplexity: 'O(log n)',
        description: 'Quick Sort is an efficient, in-place sorting algorithm. It works by selecting a "pivot" element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.',
        pseudocode: 
        `procedure quickSort(A, low, high)
            if low < high then
                p = partition(A, low, high)
                quickSort(A, low, p - 1)
                quickSort(A, p + 1, high)
            end if
        end procedure

        procedure partition(A, low, high)
            pivot = A[high]
            i = low - 1
            for j from low to high - 1 do
                if A[j] <= pivot then
                    i = i + 1
                    swap A[i] with A[j]
                end if
            end for
            swap A[i + 1] with A[high]
            return i + 1
        end procedure`,
        implementation: {
            python: `def partition(arr, low, high):
    i = low - 1
    pivot = arr[high]
    for j in range(low, high):
        if arr[j] <= pivot:
            i = i + 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)`,
            c: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
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
    return (i + 1);
}

void quick_sort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quick_sort(arr, low, pi - 1);
        quick_sort(arr, pi + 1, high);
    }
}`,
            cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`
        },
        sort: async function (low, high) {
            let comparisons = 0;
            let swaps = 0;

            async function partition(low, high) {
                let pivot = array[high];
                let i = low - 1;

                for (let j = low; j < high; j++) {
                    comparisons++;
                    if (array[j] < pivot) {
                        i++;
                        swaps++;
                        [array[i], array[j]] = [array[j], array[i]];
                        updateBars();
                        updateStats(comparisons, swaps);
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

            async function quickSort(low, high) {
                if (low < high) {
                    let pi = await partition(low, high);
                    await quickSort(low, pi - 1);
                    await quickSort(pi + 1, high);
                }
            }

            await quickSort(0, array.length - 1);
        }
    },
    heap: {
        name: 'Heap Sort',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(1)',
        description: 'Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It divides its input into a sorted and an unsorted region, and iteratively shrinks the unsorted region by extracting the largest element and moving that to the sorted region.',
        pseudocode: 
        `procedure heapSort(A)
            buildMaxHeap(A)
            for i from length(A) - 1 to 1 do
                swap A[0] with A[i]
                heapSize = heapSize - 1
                maxHeapify(A, 0)
            end for
        end procedure

        procedure buildMaxHeap(A)
            heapSize = length(A)
            for i from floor(length(A)/2) - 1 to 0 do
                maxHeapify(A, i)
            end for
        end procedure

        procedure maxHeapify(A, i)
            left = 2i + 1
            right = 2i + 2
            largest = i
            if left < heapSize and A[left] > A[largest] then
                largest = left
            end if
            if right < heapSize and A[right] > A[largest] then
                largest = right
            end if
            if largest != i then
                swap A[i] with A[largest]
                maxHeapify(A, largest)
            end if
        end procedure`,
        implementation: {
            python: `def heapify(arr, n, i):
    largest = i
    l = 2 * i + 1
    r = 2 * i + 2
    if l < n and arr[i] < arr[l]:
        largest = l
    if r < n and arr[largest] < arr[r]:
        largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)`,
            c: `void heapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest])
        largest = l;
    if (r < n && arr[r] > arr[largest])
        largest = r;
    if (largest != i) {
        int swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;
        heapify(arr, n, largest);
    }
}

void heap_sort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}`,
            cpp: `void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest])
        largest = l;
    if (r < n && arr[r] > arr[largest])
        largest = r;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`
        },
        sort: async function () {
            let comparisons = 0;
            let swaps = 0;

            async function heapify(n, i) {
                let largest = i;
                let left = 2 * i + 1;
                let right = 2 * i + 2;

                comparisons += 2;
                if (left < n && array[left] > array[largest]) {
                    largest = left;
                }
                if (right < n && array[right] > array[largest]) {
                    largest = right;
                }

                if (largest !== i) {
                    swaps++;
                    [array[i], array[largest]] = [array[largest], array[i]];
                    updateBars();
                    updateStats(comparisons, swaps);
                    await sleep(getDelay());
                    if (paused) await waitForResume();
                    await heapify(n, largest);
                }
            }

            let n = array.length;

            for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
                await heapify(n, i);
            }

            for (let i = n - 1; i > 0; i--) {
                swaps++;
                [array[0], array[i]] = [array[i], array[0]];
                updateBars();
                updateStats();
                await sleep(getDelay());
                if (paused) await waitForResume();
                await heapify(i, 0);
            }
        }
    },
    cycle: {
        name: 'Cycle Sort',
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)',
        description: 'Cycle Sort is an in-place, unstable sorting algorithm that is theoretically optimal in terms of the total number of writes to the original array. It is based on the idea that the permutation to be sorted can be factored into cycles, which can be individually rotated to give a sorted result.',
        pseudocode: 
        `procedure cycleSort(A)
            for cycleStart from 0 to length(A) - 2 do
                item = A[cycleStart]
                pos = cycleStart
                for i from cycleStart + 1 to length(A) - 1 do
                    if A[i] < item then
                        pos = pos + 1
                    end if
                end for
                if pos == cycleStart then
                    continue
                end if
                while item == A[pos] do
                    pos = pos + 1
                end while
                A[pos], item = item, A[pos]
                while pos != cycleStart do
                    pos = cycleStart
                    for i from cycleStart + 1 to length(A) - 1 do
                        if A[i] < item then
                            pos = pos + 1
                        end if
                    end for
                    while item == A[pos] do
                        pos = pos + 1
                    end while
                    A[pos], item = item, A[pos]
                end while
            end for
        end procedure`,
        implementation: {
            python: `def cycle_sort(arr):
    for cycle_start in range(0, len(arr) - 1):
        item = arr[cycle_start]
        pos = cycle_start
        for i in range(cycle_start + 1, len(arr)):
            if arr[i] < item:
                pos += 1
        if pos == cycle_start:
            continue
        while item == arr[pos]:
            pos += 1
        arr[pos], item = item, arr[pos]
        while pos != cycle_start:
            pos = cycle_start
            for i in range(cycle_start + 1, len(arr)):
                if arr[i] < item:
                    pos += 1
            while item == arr[pos]:
                pos += 1
            arr[pos], item = item, arr[pos]`,
            c: `void cycle_sort(int arr[], int n) {
    for (int cycle_start = 0; cycle_start <= n - 2; cycle_start++) {
        int item = arr[cycle_start];
        int pos = cycle_start;
        for (int i = cycle_start + 1; i < n; i++)
            if (arr[i] < item)
                pos++;
        if (pos == cycle_start)
            continue;
        while (item == arr[pos])
            pos++;
        if (pos != cycle_start) {
            int temp = item;
            item = arr[pos];
            arr[pos] = temp;
        }
        while (pos != cycle_start) {
            pos = cycle_start;
            for (int i = cycle_start + 1; i < n; i++)
                if (arr[i] < item)
                    pos++;
            while (item == arr[pos])
                pos++;
            if (item != arr[pos]) {
                int temp = item;
                item = arr[pos];
                arr[pos] = temp;
            }
        }
    }
}`,
            cpp: `void cycleSort(vector<int>& arr) {
    int n = arr.size();
    for (int cycle_start = 0; cycle_start <= n - 2; cycle_start++) {
        int item = arr[cycle_start];
        int pos = cycle_start;
        for (int i = cycle_start + 1; i < n; i++)
            if (arr[i] < item)
                pos++;
        if (pos == cycle_start)
            continue;
        while (item == arr[pos])
            pos++;
        if (pos != cycle_start)
            swap(item, arr[pos]);
        while (pos != cycle_start) {
            pos = cycle_start;
            for (int i = cycle_start + 1; i < n; i++)
                if (arr[i] < item)
                    pos++;
            while (item == arr[pos])
                pos++;
            if (item != arr[pos])
                swap(item, arr[pos]);
        }
    }
}`
        },
        sort: async function () {
            let comparisons = 0;
            let swaps = 0;
            const n = array.length;

            for (let cycleStart = 0; cycleStart <= n - 2; cycleStart++) {
                let item = array[cycleStart];
                let pos = cycleStart;

                for (let i = cycleStart + 1; i < n; i++) {
                    comparisons++;
                    if (array[i] < item) {
                        pos++;
                    }
                }

                if (pos === cycleStart) {
                    continue;
                }

                while (item === array[pos]) {
                    pos++;
                }

                if (pos !== cycleStart) {
                    swaps++;
                    [item, array[pos]] = [array[pos], item];
                    updateBars();
                    updateStats();
                    await sleep(getDelay());
                    if (paused) await waitForResume();
                }

                while (pos !== cycleStart) {
                    pos = cycleStart;
                    for (let i = cycleStart + 1; i < n; i++) {
                        comparisons++;
                        if (array[i] < item) {
                            pos++;
                        }
                    }

                    while (item === array[pos]) {
                        pos++;
                    }

                    if (item !== array[pos]) {
                        swaps++;
                        [item, array[pos]] = [array[pos], item];
                        updateBars();
                        updateStats();
                        await sleep(getDelay());
                        if (paused) await waitForResume();
                    }
                }
            }
        }
    },
    threeWayMerge: {
        name: '3-Way Merge Sort',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        description: '3-Way Merge Sort is a variation of merge sort that divides the array into three parts instead of two. This can be more efficient than standard merge sort for certain types of data.',
        pseudocode: 
        `procedure threeWayMergeSort(A, low, high)
            if high - low < 2 then
                return
            end if
            mid1 = low + ((high - low) / 3)
            mid2 = low + 2 * ((high - low) / 3) + 1
            threeWayMergeSort(A, low, mid1)
            threeWayMergeSort(A, mid1, mid2)
            threeWayMergeSort(A, mid2, high)
            merge(A, low, mid1, mid2, high)
        end procedure

        procedure merge(A, low, mid1, mid2, high)
            // Implementation of merging three sorted subarrays
        end procedure`,
        implementation: {
            python: `def three_way_merge_sort(arr, low, high):
    if high - low < 2:
        return
    mid1 = low + ((high - low) // 3)
    mid2 = low + 2 * ((high - low) // 3) + 1
    three_way_merge_sort(arr, low, mid1)
    three_way_merge_sort(arr, mid1, mid2)
    three_way_merge_sort(arr, mid2, high)
    merge(arr, low, mid1, mid2, high)

def merge(arr, low, mid1, mid2, high):
    left = arr[low:mid1]
    middle = arr[mid1:mid2]
    right = arr[mid2:high]
    i = j = k = 0
    index = low
    while i < len(left) and j < len(middle) and k < len(right):
        if left[i] <= middle[j] and left[i] <= right[k]:
            arr[index] = left[i]
            i += 1
        elif middle[j] <= left[i] and middle[j] <= right[k]:
            arr[index] = middle[j]
            j += 1
        else:
            arr[index] = right[k]
            k += 1
        index += 1
    while i < len(left):
        arr[index] = left[i]
        i += 1
        index += 1
    while j < len(middle):
        arr[index] = middle[j]
        j += 1
        index += 1
    while k < len(right):
        arr[index] = right[k]
        k += 1
        index += 1`,
            c: `void merge(int arr[], int low, int mid1, int mid2, int high) {
    int left_size = mid1 - low;
    int middle_size = mid2 - mid1;
    int right_size = high - mid2;
    int left[left_size], middle[middle_size], right[right_size];
    
    for (int i = 0; i < left_size; i++)
        left[i] = arr[low + i];
    for (int i = 0; i < middle_size; i++)
        middle[i] = arr[mid1 + i];
    for (int i = 0; i < right_size; i++)
        right[i] = arr[mid2 + i];
    
    int i = 0, j = 0, k = 0, index = low;
    while (i < left_size && j < middle_size && k < right_size) {
        if (left[i] <= middle[j] && left[i] <= right[k])
            arr[index++] = left[i++];
        else if (middle[j] <= left[i] && middle[j] <= right[k])
            arr[index++] = middle[j++];
        else
            arr[index++] = right[k++];
    }
    while (i < left_size)
        arr[index++] = left[i++];
    while (j < middle_size)
        arr[index++] = middle[j++];
    while (k < right_size)
        arr[index++] = right[k++];
}

void three_way_merge_sort(int arr[], int low, int high) {
    if (high - low < 2)
        return;
    int mid1 = low + ((high - low) / 3);
    int mid2 = low + 2 * ((high - low) / 3) + 1;
    three_way_merge_sort(arr, low, mid1);
    three_way_merge_sort(arr, mid1, mid2);
    three_way_merge_sort(arr, mid2, high);
    merge(arr, low, mid1, mid2, high);
}`,
            cpp: `void merge(vector<int>& arr, int low, int mid1, int mid2, int high) {
    vector<int> left(arr.begin() + low, arr.begin() + mid1);
    vector<int> middle(arr.begin() + mid1, arr.begin() + mid2);
    vector<int> right(arr.begin() + mid2, arr.begin() + high);
    
    int i = 0, j = 0, k = 0, index = low;
    while (i < left.size() && j < middle.size() && k < right.size()) {
        if (left[i] <= middle[j] && left[i] <= right[k])
            arr[index++] = left[i++];
        else if (middle[j] <= left[i] && middle[j] <= right[k])
            arr[index++] = middle[j++];
        else
            arr[index++] = right[k++];
    }
    while (i < left.size())
        arr[index++] = left[i++];
    while (j < middle.size())
        arr[index++] = middle[j++];
    while (k < right.size())
        arr[index++] = right[k++];
}

void threeWayMergeSort(vector<int>& arr, int low, int high) {
    if (high - low < 2)
        return;
    int mid1 = low + ((high - low) / 3);
    int mid2 = low + 2 * ((high - low) / 3) + 1;
    threeWayMergeSort(arr, low, mid1);
    threeWayMergeSort(arr, mid1, mid2);
    threeWayMergeSort(arr, mid2, high);
    merge(arr, low, mid1, mid2, high);
}`
        },
        sort: async function (low, mid1, mid2, high) {
            let comparisons = 0;
            let swaps = 0;

            async function merge(low, mid1, mid2, high) {
                let left = array.slice(low, mid1);
                let middle = array.slice(mid1, mid2);
                let right = array.slice(mid2, high);
                let i = 0, j = 0, k = 0, index = low;

                while (i < left.length && j < middle.length && k < right.length) {
                    comparisons += 2;
                    if (left[i] <= middle[j] && left[i] <= right[k]) {
                        array[index] = left[i];
                        i++;
                    } else if (middle[j] <= left[i] && middle[j] <= right[k]) {
                        array[index] = middle[j];
                        j++;
                    } else {
                        array[index] = right[k];
                        k++;
                    }
                    swaps++;
                    index++;
                    updateBars();
                    updateStats();
                    await sleep(getDelay());
                    if (paused) await waitForResume();
                }

                while (i < left.length) {
                    array[index] = left[i];
                    i++;
                    index++;
                    swaps++;
                    updateBars();
                    updateStats(comparisons, swaps);
                    await sleep(getDelay());
                    if (paused) await waitForResume();
                }

                while (j < middle.length) {
                    array[index] = middle[j];
                    j++;
                    index++;
                    swaps++;
                    updateBars();
                    updateStats(comparisons, swaps);
                    await sleep(getDelay());
                    if (paused) await waitForResume();
                }

                while (k < right.length) {
                    array[index] = right[k];
                    k++;
                    index++;
                    swaps++;
                    updateBars();
                    updateStats(comparisons, swaps);
                    await sleep(getDelay());
                    if (paused) await waitForResume();
                }
            }

            async function threeWayMergeSort(low, high) {
                if (high - low < 2) {
                    return;
                }
                let mid1 = low + Math.floor((high - low) / 3);
                let mid2 = low + 2 * Math.floor((high - low) / 3) + 1;
                await threeWayMergeSort(low, mid1);
                await threeWayMergeSort(mid1, mid2);
                await threeWayMergeSort(mid2, high);
                await merge(low, mid1, mid2, high);
            }

            await threeWayMergeSort(0, array.length);
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