// Utility functions for the sorting visualizer
export const generateRandomArray = (size: number, min: number, max: number): number[] => {
  return Array.from({ length: size }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

export const calculateDelay = (speed: number, size: number): number => {
  // Adjust delay based on array size and speed
  // Speed is 1-99, where 99 is fastest
  const baseDelay = 1000; // 1 second base delay
  const sizeAdjustment = Math.max(0.1, 1 - (size / 200)); // Reduce delay for larger arrays
  const speedFactor = (100 - speed) / 100; // Convert speed to delay factor
  return baseDelay * speedFactor * sizeAdjustment;
};

export const getBarColor = (
  index: number,
  comparing: number[],
  swapping: number[],
  sorted: number[]
): string => {
  if (sorted.includes(index)) return "array-bar sorted";
  if (comparing.includes(index)) return "array-bar comparing";
  if (swapping.includes(index)) return "array-bar swapping";
  return "array-bar bg-blue-500";
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export const getTimeComplexity = (algorithm: string, size: number): string => {
  const complexities = {
    bubble: size * size,
    insertion: size * size,
    selection: size * size,
    merge: size * Math.log2(size)
  };
  
  return formatNumber(Math.floor(complexities[algorithm] || 0));
};

interface AlgorithmInfo {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  stable: boolean;
  inPlace: boolean;
}

export const algorithmMetadata: Record<string, AlgorithmInfo> = {
  bubble: {
    name: "Bubble Sort",
    description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until no swaps are needed.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    stable: true,
    inPlace: true
  },
  insertion: {
    name: "Insertion Sort",
    description: "Builds the final sorted array one item at a time by repeatedly inserting a new element into the sorted portion of the array. Uses binary search to find the correct position.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    stable: true,
    inPlace: true
  },
  selection: {
    name: "Selection Sort",
    description: "Divides the input list into a sorted and an unsorted region. It repeatedly selects the smallest element from the unsorted region and adds it to the sorted region.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    stable: false,
    inPlace: true
  },
  merge: {
    name: "Merge Sort",
    description: "A divide-and-conquer algorithm that recursively breaks down a list into smaller sublists until each sublist consists of a single element, then merges those sublists to produce a sorted list.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    stable: true,
    inPlace: false
  }
};
