import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, XAxis, YAxis, Tooltip, Line, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ALGORITHMS = {
  bubble: {
    name: 'Bubble Sort',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    bestCase: 'O(n)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)'
  },
  selection: {
    name: 'Selection Sort',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Divides the array into a sorted and unsorted region, repeatedly selects the smallest element from the unsorted region.',
    bestCase: 'O(n²)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)'
  },
  insertion: {
    name: 'Insertion Sort',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Builds the final sorted array one item at a time, by repeatedly inserting a new element into the sorted portion of the array.',
    bestCase: 'O(n)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)'
  },
  merge: {
    name: 'Merge Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'Divides the array into two halves, recursively sorts them, and then merges the sorted halves.',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n log n)'
  },
  quick: {
    name: 'Quick Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    description: 'Selects a pivot element and partitions the array around it, recursively sorting the sub-arrays.',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n²)'
  },
  heap: {
    name: 'Heap Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    description: 'Builds a heap from the array and repeatedly extracts the maximum element.',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n log n)'
  }
};

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(50);
  const [speed, setSpeed] = useState(50);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [isSorting, setIsSorting] = useState(false);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0, time: 0 });
  
  const generateArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * (300 - 10) + 10)
    );
    setArray(newArray);
    setStats({ comparisons: 0, swaps: 0, time: 0 });
  }, [arraySize]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const compare = async (i, j) => {
    setStats(prev => ({ ...prev, comparisons: prev.comparisons + 1 }));
    await sleep(100 - speed);
    return array[i] > array[j];
  };

  const swap = async (i, j) => {
    const newArray = [...array];
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    setArray(newArray);
    setStats(prev => ({ ...prev, swaps: prev.swaps + 1 }));
    await sleep(100 - speed);
  };

  const bubbleSort = async () => {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (await compare(j, j + 1)) {
          await swap(j, j + 1);
        }
      }
    }
  };

  // ... Other sorting algorithms implemented similarly

  const startSort = async () => {
    if (isSorting) return;
    
    setIsSorting(true);
    const startTime = Date.now();
    
    try {
      switch (selectedAlgorithm) {
        case 'bubble':
          await bubbleSort();
          break;
        // ... other cases
      }
    } finally {
      setIsSorting(false);
      setStats(prev => ({ ...prev, time: ((Date.now() - startTime) / 1000).toFixed(2) }));
    }
  };

  const complexityData = [
    { size: 10, n2: 100, nlogn: 33 },
    { size: 20, n2: 400, nlogn: 86 },
    { size: 50, n2: 2500, nlogn: 282 },
    { size: 100, n2: 10000, nlogn: 664 },
    { size: 200, n2: 40000, nlogn: 1660 },
    { size: 500, n2: 250000, nlogn: 4983 }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sorting Visualizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ALGORITHMS).map(([key, algo]) => (
                    <SelectItem key={key} value={key}>{algo.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={startSort} 
                disabled={isSorting}
                className="w-32"
              >
                {isSorting ? 'Sorting...' : 'Start Sorting'}
              </Button>
              
              <Button 
                onClick={generateArray}
                disabled={isSorting}
                variant="outline"
                className="w-32"
              >
                New Array
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="w-24">Array Size:</span>
                <Slider
                  value={[arraySize]}
                  onValueChange={([value]) => setArraySize(value)}
                  min={10}
                  max={100}
                  disabled={isSorting}
                  className="w-48"
                />
                <span>{arraySize}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="w-24">Speed:</span>
                <Slider
                  value={[speed]}
                  onValueChange={([value]) => setSpeed(value)}
                  min={1}
                  max={100}
                  disabled={isSorting}
                  className="w-48"
                />
                <span>{speed}</span>
              </div>
            </div>

            <div className="h-64 bg-slate-100 rounded-lg overflow-hidden">
              {array.map((value, idx) => (
                <div
                  key={idx}
                  className="inline-block bg-blue-500 w-2"
                  style={{
                    height: `${value}px`,
                    marginRight: '1px'
                  }}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>Comparisons: {stats.comparisons}</div>
              <div>Swaps: {stats.swaps}</div>
              <div>Time: {stats.time}s</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Name:</strong> {ALGORITHMS[selectedAlgorithm].name}</p>
              <p><strong>Time Complexity:</strong> {ALGORITHMS[selectedAlgorithm].timeComplexity}</p>
              <p><strong>Space Complexity:</strong> {ALGORITHMS[selectedAlgorithm].spaceComplexity}</p>
              <p><strong>Description:</strong> {ALGORITHMS[selectedAlgorithm].description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Complexity Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart width={500} height={300} data={complexityData}>
              <XAxis dataKey="size" label={{ value: 'Array Size', position: 'bottom' }} />
              <YAxis label={{ value: 'Operations', angle: -90, position: 'left' }} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Line type="monotone" dataKey="n2" name="O(n²)" stroke="#1a73e8" />
              <Line type="monotone" dataKey="nlogn" name="O(n log n)" stroke="#34a853" />
            </LineChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SortingVisualizer;