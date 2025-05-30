type UpdateFn = (array: number[], comparisons: number, swaps: number) => void;
type CompleteFn = () => void;
type IsPausedFn = () => boolean;

export const bubbleSort = (
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
    
    for (let i = 0; i < n; i++) {
      let swapped = false;
      
      for (let j = 0; j < n - i - 1; j++) {
        if (isCancelled) return;
        
        // Check if paused
        while (isPausedFn()) {
          if (isCancelled) return;
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        comparisons++;
        
        if (array[j] > array[j + 1]) {
          // Swap elements
          const temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
          swaps++;
          swapped = true;
          
          // Update visualization
          updateFn([...array], comparisons, swaps);
          await new Promise(resolve => setTimeout(resolve, animationSpeedMs));
        }
      }
      
      // If no swapping occurred in this pass, array is sorted
      if (!swapped) break;
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