type UpdateFn = (array: number[], comparisons: number, swaps: number) => void;
type CompleteFn = () => void;
type IsPausedFn = () => boolean;

export const heapSort = (
  array: number[],
  animationSpeedMs: number,
  updateFn: UpdateFn,
  completeFn: CompleteFn,
  isPausedFn: IsPausedFn
) => {
  let comparisons = 0;
  let swaps = 0;
  let isCancelled = false;
  
  const heapify = async (arr: number[], n: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    // Check if paused
    while (isPausedFn()) {
      if (isCancelled) return;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Compare with left child
    if (left < n) {
      comparisons++;
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }
    
    // Compare with right child
    if (right < n) {
      comparisons++;
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }
    
    // If largest is not root
    if (largest !== i) {
      // Swap
      const temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;
      swaps++;
      
      // Update visualization
      updateFn([...arr], comparisons, swaps);
      await new Promise(resolve => setTimeout(resolve, animationSpeedMs));
      
      // Recursively heapify the affected sub-tree
      await heapify(arr, n, largest);
    }
  };
  
  const sort = async () => {
    const n = array.length;
    
    // Build heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      if (isCancelled) return;
      await heapify(array, n, i);
    }
    
    // One by one extract an element from heap
    for (let i = n - 1; i > 0; i--) {
      if (isCancelled) return;
      
      // Move current root to end
      const temp = array[0];
      array[0] = array[i];
      array[i] = temp;
      swaps++;
      
      // Update visualization
      updateFn([...array], comparisons, swaps);
      await new Promise(resolve => setTimeout(resolve, animationSpeedMs));
      
      // Call max heapify on the reduced heap
      await heapify(array, i, 0);
    }
    
    if (!isCancelled) {
      completeFn();
    }
  };
  
  // Start sorting
  sort();
  
  // Return cancel function
  return {
    cancel: () => {
      isCancelled = true;
    }
  };
};