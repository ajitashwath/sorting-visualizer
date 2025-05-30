import { bubbleSort } from './bubbleSort';
import { insertionSort } from './insertionSort';
import { selectionSort } from './selectionSort';
import { mergeSort } from './mergeSort';
import { quickSort } from './quickSort';
import { heapSort } from './heapSort';
import { countingSort } from './countingSort';
import { radixSort } from './radixSort';

export const getAlgorithms = () => {
  return {
    bubbleSort,
    insertionSort,
    selectionSort,
    mergeSort,
    quickSort,
    heapSort,
    countingSort,
    radixSort
  };
};