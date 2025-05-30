import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { getAlgorithms } from '@algorithms/index';

const DEFAULT_ARRAY_SIZE = 50;
const MIN_ARRAY_SIZE = 5;
const MAX_ARRAY_SIZE = 100;
const DEFAULT_SPEED = 50;
const MIN_SPEED = 1;
const MAX_SPEED = 100;

interface Metrics {
  comparisons: number;
  swaps: number;
  startTime: number | null;
  elapsedTime: number;
}

const SortingVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState(DEFAULT_ARRAY_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  type AlgorithmKey = keyof typeof algorithms;
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmKey>('bubbleSort');
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({
    comparisons: 0,
    swaps: 0,
    startTime: null,
    elapsedTime: 0
  });
  
  const algorithms = getAlgorithms();
  const algorithmRef = useRef<{ cancel: () => void } | null>(null);

  // Initialize array
  useEffect(() => {
    resetArray();
  }, [arraySize]);

  // Reset array with random values
  const resetArray = () => {
    if (isSorting) {
      algorithmRef.current?.cancel();
      setIsSorting(false);
      setIsPaused(false);
    }
    
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push(randomIntFromInterval(5, 500));
    }
    setArray(newArray);
    resetMetrics();
  };

  // Reset metrics
  const resetMetrics = () => {
    setMetrics({
      comparisons: 0,
      swaps: 0,
      startTime: null,
      elapsedTime: 0
    });
  };

  // Generate random integer within range
  const randomIntFromInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Handle custom array input
  const handleArrayInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const inputArray = event.target.value
        .split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num));
      
      if (inputArray.length > 0) {
        setArray(inputArray);
        setArraySize(inputArray.length);
      }
    } catch (error) {
      console.error("Invalid input", error);
    }
  };

  // Start sorting
  const startSorting = async () => {
    if (isSorting && !isPaused) return;
    
    if (!isPaused) {
      resetMetrics();
      setMetrics(prev => ({
        ...prev,
        startTime: Date.now()
      }));
    }
    
    setIsSorting(true);
    setIsPaused(false);
    const sortFunction = algorithms[selectedAlgorithm as AlgorithmKey];
    const sortFunction = algorithms[selectedAlgorithm];
    
    if (!sortFunction) {
      console.error("Sort function not found");
      return;
    }
    
    // Calculate animation speed based on speed setting
    const animationSpeedMs = Math.max(1, 101 - speed);
    
    const updateMetrics = (comparisons: number, swaps: number) => {
      setMetrics(prev => ({
        ...prev,
        comparisons,
        swaps,
        elapsedTime: prev.startTime ? Date.now() - prev.startTime : 0
      }));
    };
    
    // Run sorting algorithm
    algorithmRef.current = sortFunction(
      [...array],
      animationSpeedMs,
      (newArray: number[], comparison: number, swap: number) => {
        setArray([...newArray]);
        updateMetrics(comparison, swap);
      },
      () => {
        setIsSorting(false);
        setMetrics(prev => ({
          ...prev,
          elapsedTime: prev.startTime ? Date.now() - prev.startTime : 0
        }));
        algorithmRef.current = null;
      },
      () => isPaused
    );
  };

  // Pause sorting
  const pauseSorting = () => {
    setIsPaused(true);
  };

  return (
    <section id="visualizer" className="mb-16">
      <div className="bg-dark-700 border border-dark-600 rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="algorithm" className="block text-sm font-medium text-white/70 mb-1">
                Algorithm
              </label>
              <select
                id="algorithm"
                className="bg-dark-600 text-white border border-dark-500 rounded-md px-3 py-2 w-full md:w-60"
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                disabled={isSorting && !isPaused}
              >
                <option value="bubbleSort">Bubble Sort</option>
                <option value="insertionSort">Insertion Sort</option>
                <option value="selectionSort">Selection Sort</option>
                <option value="mergeSort">Merge Sort</option>
                <option value="quickSort">Quick Sort</option>
                <option value="heapSort">Heap Sort</option>
                <option value="countingSort">Counting Sort</option>
                <option value="radixSort">Radix Sort</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="arrayInput" className="block text-sm font-medium text-white/70 mb-1">
                Custom Array (comma separated)
              </label>
              <input
                id="arrayInput"
                type="text"
                placeholder="e.g. 5, 3, 8, 1, 2"
                className="bg-dark-600 text-white border border-dark-500 rounded-md px-3 py-2 w-full md:w-60"
                onChange={handleArrayInput}
                disabled={isSorting && !isPaused}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="arraySize" className="block text-sm font-medium text-white/70 mb-1">
                Array Size: {arraySize}
              </label>
              <input
                id="arraySize"
                type="range"
                min={MIN_ARRAY_SIZE}
                max={MAX_ARRAY_SIZE}
                value={arraySize}
                onChange={(e) => setArraySize(parseInt(e.target.value))}
                className="slider"
                disabled={isSorting && !isPaused}
              />
            </div>
            
            <div>
              <label htmlFor="speed" className="block text-sm font-medium text-white/70 mb-1">
                Speed: {speed}%
              </label>
              <input
                id="speed"
                type="range"
                min={MIN_SPEED}
                max={MAX_SPEED}
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="slider"
              />
            </div>
          </div>
          
          <div className="flex flex-row md:flex-col justify-between gap-2">
            <div className="flex gap-2">
              {!isSorting || isPaused ? (
                <button
                  onClick={startSorting}
                  className="btn btn-primary flex-1"
                  title="Start Sorting"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isPaused ? 'Resume' : 'Sort'}
                </button>
              ) : (
                <button
                  onClick={pauseSorting}
                  className="btn btn-outline flex-1"
                  title="Pause Sorting"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </button>
              )}
              
              <button
                onClick={resetArray}
                className="btn btn-ghost"
                title="Reset Array"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
            
            <div className="hidden md:block space-y-2">
              <div className="text-sm text-white/70">
                <span className="font-mono text-primary-300">{metrics.comparisons}</span> comparisons
              </div>
              <div className="text-sm text-white/70">
                <span className="font-mono text-primary-300">{metrics.swaps}</span> swaps
              </div>
              <div className="text-sm text-white/70">
                <span className="font-mono text-primary-300">{metrics.elapsedTime}</span> ms
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:hidden flex justify-between mb-4 px-2">
          <div className="text-xs text-white/70">
            <span className="font-mono text-primary-300">{metrics.comparisons}</span> comparisons
          </div>
          <div className="text-xs text-white/70">
            <span className="font-mono text-primary-300">{metrics.swaps}</span> swaps
          </div>
          <div className="text-xs text-white/70">
            <span className="font-mono text-primary-300">{metrics.elapsedTime}</span> ms
          </div>
        </div>
        
        <div className="relative h-64 bg-dark-800 rounded-md border border-dark-600 overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-center p-1">
            {array.map((value, idx) => (
                {/* <span className="absolute -top-6 text-xs text-white/70 font-mono">
                  {value}
                </span> */}
                </span>
                <div
                  className="array-bar mx-[1px]"
                  style={{
                    height: `${Math.max(5, (value / 500) * 100)}%`,
                    width: `${100 / arraySize}%`,
                    maxWidth: '20px',
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SortingVisualizer;