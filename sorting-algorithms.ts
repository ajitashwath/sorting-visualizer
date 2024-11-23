import { sleep, swap, createAnimationState, AnimationState } from './utils';

const MINIMUM_ARRAY_LENGTH = 2;
const MINIMUM_DELAY = 0;

class SortingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SortingError';
  }
}

export type ComparisonFunction<T> = (a: T, b: T) => number;
export type AnimationCallback = (state: AnimationState) => void;

export interface SortingAlgorithm<T = number> {
  sort(
    array: T[],
    setAnimationState: AnimationCallback,
    delay: number,
    compareFunc?: ComparisonFunction<T>
  ): Promise<void>;
}

const validateInputs = (array: unknown[], delay: number): void => {
  if (!Array.isArray(array)) {
    throw new SortingError('Input must be an array');
  }
  if (array.length < MINIMUM_ARRAY_LENGTH) {
    throw new SortingError('Array must contain at least two elements');
  }
  if (delay < MINIMUM_DELAY) {
    throw new SortingError('Delay must be non-negative');
  }
  if (!array.every(item => typeof item === 'number')) {
    throw new SortingError('All array elements must be numbers');
  }
};

export class BubbleSort implements SortingAlgorithm {
  async sort(
    array: number[],
    setAnimationState: AnimationCallback,
    delay: number
  ): Promise<void> {
    validateInputs(array, delay);
    const n = array.length;
    const sorted: number[] = [];
    let hasSwapped: boolean;

    for (let i = 0; i < n - 1; i++) {
      hasSwapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        try {
          setAnimationState(createAnimationState(array, [j, j + 1], [], sorted));
          await sleep(delay);

          if (array[j] > array[j + 1]) {
            setAnimationState(createAnimationState(array, [], [j, j + 1], sorted));
            await sleep(delay);

            swap(array, j, j + 1);
            hasSwapped = true;
            setAnimationState(createAnimationState(array, [], [], sorted));
          }
        } catch (error) {
          throw new SortingError(`Error during bubble sort: ${error.message}`);
        }
      }

      sorted.unshift(n - i - 1);
      if (!hasSwapped) {
        sorted.unshift(...Array.from({ length: n - i - 1 }, (_, idx) => idx));
        setAnimationState(createAnimationState(array, [], [], sorted));
        break;
      }
    }
    
    if (sorted.length < n) {
      sorted.unshift(0);
    }
    setAnimationState(createAnimationState(array, [], [], sorted));
  }
}

export class InsertionSort implements SortingAlgorithm {
  private binarySearch(array: number[], item: number, start: number, end: number): number {
    if (start >= end) {
      return array[start] > item ? start : start + 1;
    }

    const mid = Math.floor((start + end) / 2);
    if (array[mid] === item) {
      return mid + 1;
    }

    if (array[mid] > item) {
      return this.binarySearch(array, item, start, mid - 1);
    }
    return this.binarySearch(array, item, mid + 1, end);
  }

  async sort(
    array: number[],
    setAnimationState: AnimationCallback,
    delay: number
  ): Promise<void> {
    validateInputs(array, delay);
    const n = array.length;
    const sorted: number[] = [0];

    try {
      for (let i = 1; i < n; i++) {
        const key = array[i];
        setAnimationState(createAnimationState(array, [i], [], sorted));
        await sleep(delay);
        const pos = this.binarySearch(array, key, 0, i - 1);
        
        for (let j = i - 1; j >= pos; j--) {
          setAnimationState(createAnimationState(array, [j], [j, j + 1], sorted));
          await sleep(delay);
          array[j + 1] = array[j];
        }

        array[pos] = key;
        sorted.push(i);
        setAnimationState(createAnimationState(array, [], [], sorted));
        await sleep(delay);
      }
    } catch (error) {
      throw new SortingError(`Error during insertion sort: ${error.message}`);
    }
  }
}

export class SelectionSort implements SortingAlgorithm {
  async sort(
    array: number[],
    setAnimationState: AnimationCallback,
    delay: number
  ): Promise<void> {
    validateInputs(array, delay);
    const n = array.length;
    const sorted: number[] = [];

    try {
      for (let i = 0; i < n / 2; i++) {
        let minIdx = i;
        let maxIdx = i;
        for (let j = i + 1; j < n - i; j++) {
          setAnimationState(createAnimationState(array, [minIdx, maxIdx, j], [], sorted));
          await sleep(delay);

          if (array[j] < array[minIdx]) {
            minIdx = j;
          }
          if (array[j] > array[maxIdx]) {
            maxIdx = j;
          }
        }

        if (minIdx !== i) {
          setAnimationState(createAnimationState(array, [], [i, minIdx], sorted));
          await sleep(delay);
          swap(array, i, minIdx);
        }

        const endIdx = n - 1 - i;
        if (maxIdx !== endIdx && maxIdx !== i) {
          setAnimationState(createAnimationState(array, [], [endIdx, maxIdx], sorted));
          await sleep(delay);
          swap(array, endIdx, maxIdx);
        }

        sorted.push(i);
        sorted.push(endIdx);
        setAnimationState(createAnimationState(array, [], [], sorted));
        await sleep(delay);
      }
    } catch (error) {
      throw new SortingError(`Error during selection sort: ${error.message}`);
    }
  }
}

export class MergeSort implements SortingAlgorithm {
  private async merge(
    array: number[],
    left: number,
    mid: number,
    right: number,
    setAnimationState: AnimationCallback,
    delay: number,
    sorted: number[]
  ): Promise<void> {
    const n1 = mid - left + 1;
    const n2 = right - mid;

    const L = new Array(n1);
    const R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = array[left + i];
    for (let i = 0; i < n2; i++) R[i] = array[mid + 1 + i];

    let i = 0, j = 0, k = left;

    try {
      while (i < n1 && j < n2) {
        setAnimationState(createAnimationState(array, [left + i, mid + 1 + j], [], sorted));
        await sleep(delay);

        array[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
        setAnimationState(createAnimationState(array, [], [], sorted));
        await sleep(delay);
      }
      while (i < n1) array[k++] = L[i++];
      while (j < n2) array[k++] = R[j++];

      setAnimationState(createAnimationState(array, [], [], sorted));
      await sleep(delay);
    } catch (error) {
      throw new SortingError(`Error during merge: ${error.message}`);
    }
  }

  private async mergeSortRecursive(
    array: number[],
    left: number,
    right: number,
    setAnimationState: AnimationCallback,
    delay: number,
    sorted: number[]
  ): Promise<void> {
    if (left >= right) return;

    const mid = Math.floor(left + (right - left) / 2);
    await this.mergeSortRecursive(array, left, mid, setAnimationState, delay, sorted);
    await this.mergeSortRecursive(array, mid + 1, right, setAnimationState, delay, sorted);
    await this.merge(array, left, mid, right, setAnimationState, delay, sorted);
  }

  async sort(
    array: number[],
    setAnimationState: AnimationCallback,
    delay: number
  ): Promise<void> {
    validateInputs(array, delay);
    const sorted: number[] = [];
    
    try {
      await this.mergeSortRecursive(array, 0, array.length - 1, setAnimationState, delay, sorted);
      sorted.push(...Array.from({ length: array.length }, (_, i) => i));
      setAnimationState(createAnimationState(array, [], [], sorted));
    } catch (error) {
      throw new SortingError(`Error during merge sort: ${error.message}`);
    }
  }
}
