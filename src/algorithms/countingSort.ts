type UpdateFn = (array: number[], comparisons: number, swaps: number) => void;
type CompleteFn = () => void;
type IsPausedFn = () => boolean;

export const countingSort = (
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
    if (array.length === 0) {
      completeFn();
      return;
    }
    
    // Find the maximum value in the array
    let max = array[0];
    for (let i = 1; i < array.length; i++) {
      if (array[i] > max) {
        max = array[i];
      }
      comparisons++;
    }
    
    // Create a counting array
    const count = new Array(max + 1).fill(0);
    
    // Count occurrences of each element
    for (let i = 0; i < array.length; i++) {
      if (isCancelled) return;
      
      // Check if paused
      while (isPausedFn()) {
        if (isCancelled) return;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      count[array[i]]++;
    }
    
    // Reconstruct the sorted array
    let index = 0;
    for (let i = 0; i <= max; i++) {
      while (count[i] > 0) {
        if (isCancelled) return;
        
        // Check if paused
        while (isPausedFn()) {
          if (isCancelled) return;
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        array[index] = i;
        index++;
        count[i]--;
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