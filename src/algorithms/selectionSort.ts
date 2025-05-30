type UpdateFn = (array: number[], comparisons: number, swaps: number) => void;
type CompleteFn = () => void;
type IsPausedFn = () => boolean;

export const selectionSort = (
  array: number[],
  animationSpeedMs: number,
  updateFn: UpdateFn,
  completeFn: CompleteFn,
  isPausedFn: IsPausedFn
) => {
  let comparisons = 0;
  let swaps = 0;
  let isCancelled = false;
  
  const sort = async () => {
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      
      for (let j = i + 1; j < n; j++) {
        if (isCancelled) return;
        
        // Check if paused
        while (isPausedFn()) {
          if (isCancelled) return;
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        comparisons++;
        
        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
      }
      
      // Swap the found minimum element with the first element
      if (minIndex !== i) {
        const temp = array[i];
        array[i] = array[minIndex];
        array[minIndex] = temp;
        swaps++;
        
        // Update visualization
        updateFn([...array], comparisons, swaps);
        await new Promise(resolve => setTimeout(resolve, animationSpeedMs));
      }
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