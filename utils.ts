export interface AnimationState {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const swap = (array: number[], i: number, j: number): void => {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
};

export const createAnimationState = (
  array: number[],
  comparing: number[],
  swapping: number[],
  sorted: number[]
): AnimationState => {
  return {
    array: [...array],
    comparing,
    swapping,
    sorted
  };
};
