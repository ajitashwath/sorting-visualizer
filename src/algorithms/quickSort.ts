type UpdateFn = (array: number[], comparisons: number, swaps: number) => void;
type CompleteFn = () => void;
type IsPausedFn = () => boolean;

export const quickSort = (
  array: number[],
  animationSpeedMs: number,
  updateFn: UpdateFn,
  completeFn: CompleteFn,
  isPausedFn: IsPausedFn
) => {
  let comparisons = 0;
  let swaps = 0;
  let isCancelled = false;
  
  const partition = async (arr: number[], low: number, high: number): Promise<number> => {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      if (isCancelled) return -1;
      
      // Check if paused
      while (isPausedFn()) {
        if (isCancelled) return -1;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      comparisons++;
      
      if (arr[j] <= pivot) {
        i++;
        
        // Swap arr[i] and arr[j]
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        swaps++;
        
        // Update visualization
        updateFn([...arr], comparisons, swaps);
        await new Promise(resolve => setTimeout(resolve, animationSpeedMs));
      }
    }
    
    // Swap arr[i+1] and arr[high] (put pivot in its correct position)
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    swaps++;
    
    // Update visualization
    updateFn([...arr], comparisons, swaps);
    await new Promise(resolve => setTimeout(resolve, animationSpeedMs));
    
    return i + 1;
  };
  
  const quickSort = async (arr: number[], low: number, high: number) => {
    if (low < high) {
      const pi = await partition(arr, low, high);
      
      if (pi === -1) return; // Cancelled
      
      // Recursively sort elements before and after partition
      await quickSort(arr, low, pi - 1);
      await quickSort(arr, pi + 1, high);
    }
  };
  
  const sort = async () => {
    await quickSort(array, 0, array.length - 1);
    
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