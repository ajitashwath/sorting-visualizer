type UpdateFn = (array: number[], comparisons: number, swaps: number) => void;
type CompleteFn = () => void;
type IsPausedFn = () => boolean;

export const radixSort = (
  array: number[],
  animationSpeedMs: number,
  updateFn: UpdateFn,
  completeFn: CompleteFn,
  isPausedFn: IsPausedFn
) => {
  let comparisons = 0;
  let swaps = 0;
  let isCancelled = false;
  
  // A function to do counting sort based on digit represented at exp
  const countSort = async (arr: number[], exp: number) => {
    const n = arr.length;
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);
    
    // Store count of occurrences in count[]
    for (let i = 0; i < n; i++) {
      if (isCancelled) return;
      
      // Check if paused
      while (isPausedFn()) {
        if (isCancelled) return;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      count[Math.floor(arr[i] / exp) % 10]++;
    }
    
    // Change count[i] so that count[i] now contains
    // actual position of this digit in output[]
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }
    
    // Build the output array
    for (let i = n - 1; i >= 0; i--) {
      if (isCancelled) return;
      
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
      swaps++;
    }
    
    // Copy the output array to arr[]
    for (let i = 0; i < n; i++) {
      if (isCancelled) return;
      
      // Check if paused
      while (isPausedFn()) {
        if (isCancelled) return;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      arr[i] = output[i];
      
      // Update visualization
      updateFn([...arr], comparisons, swaps);
      await new Promise(resolve => setTimeout(resolve, animationSpeedMs));
    }
  };
  
  const sort = async () => {
    if (array.length === 0) {
      completeFn();
      return;
    }
    
    // Find the maximum number to know number of digits
    let max = array[0];
    for (let i = 1; i < array.length; i++) {
      if (array[i] > max) {
        max = array[i];
      }
      comparisons++;
    }
    
    // Do counting sort for every digit
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      if (isCancelled) return;
      
      await countSort(array, exp);
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