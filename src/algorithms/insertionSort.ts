type UpdateFn = (array: number[], comparisons: number, swaps: number) => void;
type CompleteFn = () => void;
type IsPausedFn = () => boolean;

export const insertionSort = (
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
    
    for (let i = 1; i < n; i++) {
      const key = array[i];
      let j = i - 1;
      
      while (j >= 0) {
        if (isCancelled) return;
        
        // Check if paused
        while (isPausedFn()) {
          if (isCancelled) return;
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        comparisons++;
        
        if (array[j] > key) {
          array[j + 1] = array[j];
          swaps++;
          j--;
          
          // Update visualization
          updateFn([...array], comparisons, swaps);
          await new Promise(resolve => setTimeout(resolve, animationSpeedMs));
        } else {
          break;
        }
      }
      
      array[j + 1] = key;
      
      // Update visualization
      updateFn([...array], comparisons, swaps);
      await new Promise(resolve => setTimeout(resolve, animationSpeedMs));
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