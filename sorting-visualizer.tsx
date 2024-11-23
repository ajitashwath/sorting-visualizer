import { useState, useEffect } from 'react';
import { Play, RefreshCw, Info, Settings2 } from 'lucide-react';
import { 
  BubbleSort, 
  InsertionSort, 
  SelectionSort, 
  MergeSort 
} from './sorting-algorithms';
import {
  generateRandomArray,
  calculateDelay,
  getBarColor,
  formatNumber,
  getTimeComplexity,
  algorithmMetadata
} from './sorting-visualizer-utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const SortingVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState(50);
  const [sortingSpeed, setSortingSpeed] = useState(50);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');
  const [isSorting, setIsSorting] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [animationState, setAnimationState] = useState({
    comparing: [] as number[],
    swapping: [] as number[],
    sorted: [] as number[]
  });

  const algorithms = {
    bubble: new BubbleSort(),
    insertion: new InsertionSort(),
    selection: new SelectionSort(),
    merge: new MergeSort()
  };
  
  const generateArray = () => {
    const newArray = generateRandomArray(arraySize, 5, 85);
    setArray(newArray);
    setAnimationState({
      comparing: [],
      swapping: [],
      sorted: []
    });
  };

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  const startSorting = async () => {
    setIsSorting(true);
    const delay = calculateDelay(sortingSpeed, arraySize);
    
    try {
      await algorithms[selectedAlgorithm].sort(
        array,
        (state) => {
          setArray([...state.array]);
          setAnimationState({
            comparing: state.comparing,
            swapping: state.swapping,
            sorted: state.sorted
          });
        },
        delay
      );
    } catch (error) {
      console.error('Sorting error:', error);
    }
    
    setIsSorting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="max-w-6xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Sorting Visualizer</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              disabled={isSorting}
            >
              Operations: {getTimeComplexity(selectedAlgorithm, arraySize)}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowInfo(!showInfo)}>
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6">
            {/* Controls */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Algorithm</label>
                <Select
                  value={selectedAlgorithm}
                  onValueChange={setSelectedAlgorithm}
                  disabled={isSorting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(algorithmMetadata).map(([key, data]) => (
                      <SelectItem key={key} value={key}>
                        {data.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Array Size: {arraySize}
                </label>
                <Slider
                  value={[arraySize]}
                  onValueChange={(value) => setArraySize(value[0])}
                  min={10}
                  max={100}
                  step={1}
                  disabled={isSorting}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Speed: {sortingSpeed}
                </label>
                <Slider
                  value={[sortingSpeed]}
                  onValueChange={(value) => setSortingSpeed(value[0])}
                  min={1}
                  max={99}
                  step={1}
                  disabled={isSorting}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={generateArray}
                disabled={isSorting}
                variant="outline"
                className="w-32"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                New Array
              </Button>
              <Button
                onClick={startSorting}
                disabled={isSorting}
                className="w-32"
              >
                <Play className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </div>

            {/* Visualization */}
            <div className="h-64 flex items-end gap-1">
              {array.map((value, idx) => (
                <div
                  key={idx}
                  className={`array-bar ${getBarColor(
                    idx,
                    animationState.comparing,
                    animationState.swapping,
                    animationState.sorted
                  )}`}
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Info Dialog */}
      <AlertDialog open={showInfo} onOpenChange={setShowInfo}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {algorithmMetadata[selectedAlgorithm].name}
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <p>{algorithmMetadata[selectedAlgorithm].description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Time Complexity</h4>
                    <p className="text-sm text-gray-500">
                      {algorithmMetadata[selectedAlgorithm].timeComplexity}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Space Complexity</h4>
                    <p className="text-sm text-gray-500">
                      {algorithmMetadata[selectedAlgorithm].spaceComplexity}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Stable</h4>
                    <p className="text-sm text-gray-500">
                      {algorithmMetadata[selectedAlgorithm].stable ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">In Place</h4>
                    <p className="text-sm text-gray-500">
                      {algorithmMetadata[selectedAlgorithm].inPlace ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Color Legend</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded" />
                      <span className="text-sm">Unsorted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-400 rounded" />
                      <span className="text-sm">Comparing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded" />
                      <span className="text-sm">Swapping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded" />
                      <span className="text-sm">Sorted</span>
                    </div>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SortingVisualizer;
