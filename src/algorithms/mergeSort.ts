type UpdateFn = (array: number[], comparisons: number, swaps: number) => void;
type CompleteFn = () => void;
type IsPausedFn = () => boolean;

export const mergeSort = (
  array: number[],
  animationSpeedMs: number,
  updateFn: UpdateFn,
  completeFn: CompleteFn,
  isPausedFn: IsPausedFn
) => {
  let comparisons = 0;
  let swaps = 0;
  let isCancelled = false;
  
  const merge = async (arr: number[], left: number, mid: number, right: number) => {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    
    // Create temporary arrays
    const L = new Array(n1);
    const R = new Array(n2);
    
    // Copy data to temp arrays
    for (let i = 0; i < n1; i++) {
      L[i] = arr[left + i];
    }
    for (let j = 0; j < n2; j++) {
      R[j] = arr[mid + 1 + j];
    }
    
    // Merge the temp arrays back into arr[left..right]
    let i = 0;
    let j = 0;
    let k = left;
    
    while (i < n1 && j < n2) {
      if (isCancelled) return;
      
      // Check if paused
      while (isPausedFn()) {
        if (isCancelled) return;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      comparisons++;
      
      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
        swaps++;
      }
      
      k++;
      
      // Update visualization
      updateFn([...arr], comparisons, swaps);
      await new Promise(resolve => setTimeout(resolve, animationSpeedMs));
    }
    
    // Copy the remaining elements of L[]
    while (i < n1) {
      if (isCancelled) return;
      
      arr[k] = L[i];
      i++;
      k++;
      
      // Update visualization
      updateFn([...arr], comparisons, swaps);
      await new Promise(resolve => setTimeout(resolve, animationSpeedMs));
    }
    
    // Copy the remaining elements of R[]
    while (j < n2) {
      if (isCancelled) return;
      
      arr[k] = R[j];
      j++;
      k++;
      
      // Update visualization
      updateFn([...arr], comparisons, swaps);
      await new Promise(resolve => setTimeout(resolve, animationSpeedMs));
    }
  };
  
  const mergeSort = async (arr: number[], left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor(left + (right - left) / 2);
      
      // Sort first and second halves
      await mergeSort(arr, left, mid);
      await mergeSort(arr, mid + 1, right);
      
      // Merge the sorted halves
      await merge(arr, left, mid, right);
    }
  };
  
  const sort = async () => {
    await mergeSort(array, 0, array.length - 1);
    
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