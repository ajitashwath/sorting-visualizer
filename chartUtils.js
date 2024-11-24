import Chart from 'chart.js/auto';

export function createTimeComplexityChart() {
  const ctx = document.getElementById('timeComplexityChart');
  
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['10', '20', '50', '100', '200', '500'],
      datasets: [
        {
          label: 'Bubble Sort (O(n²))',
          data: [100, 400, 2500, 10000, 40000, 250000],
          borderColor: '#1a73e8'
        },
        {
          label: 'Merge Sort (O(n log n))',
          data: [33, 86, 282, 664, 1660, 4983],
          borderColor: '#34a853'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Operations'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Array Size'
          }
        }
      }
    }
  });
}

export const algorithmInfo = {
  bubble: {
    name: 'Bubble Sort',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
  },
  merge: {
    name: 'Merge Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'Divides the array into two halves, recursively sorts them, and then merges the sorted halves.'
  },
  // ... will fucking add
};
