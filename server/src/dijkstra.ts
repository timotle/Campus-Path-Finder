import { Location, Edge } from './campus';
import { Heap, newHeap } from './heap';


/**
 * A path from one location on the map to another by following along the given
 * steps in the order they appear in the array. Each edge must start at the
 * place where the previous edge ended. We also cache the total distance of the
 * edges in the path for faster access.
 */
export type Path =
    {start: Location, end: Location, steps: Array<Edge>, dist: number};

/**
 * Returns the shortest path from the given start to the given ending location
 * that can be made by following along the given edges. If no path exists, then
 * this will return undefined. (Note that all distances must be positive or else
 * shortestPath may not work!)
 */

const comparePaths = (a: Path, b: Path): number => {
  return a.dist - b.dist;
};

const locationToString = (location: Location): string => {
  return `${location.x},${location.y}`;
};
/**
 * Returns the shortest path between two locations.
 * If no path exists, it will then return undefined.
 *
 * @param start is the starting location
 * @param end is the location we want to end on
 * @param edges is the list of all edges
 * @returns A Path object if a path exists, if it cant, otherwise undefined
 */
export const shortestPath = (
    _start: Location, _end: Location, _edges: Array<Edge>): Path | undefined => {

  // TODO (Task 1 - The Full-Short Press): implement this
      const adjacent: Map<string, Edge[]> = new Map();
      const finished: Set<string> = new Set();
      const active: Heap<Path> = newHeap(comparePaths);

      //adjacent
      for (const edge of _edges) {
        const theKey = locationToString(edge.start);
        let theList = adjacent.get(theKey);
        if (theList === undefined) {
          theList = [];
          adjacent.set(theKey, theList);
        }
        theList.push(edge);
      }

    //initializing active
    const startingPath: Path = {
      start: _start,
      end: _start,
      steps: [], 
      dist: 0     
    };
  
    active.add(startingPath);
    // Inv: The shortest path to each location is in bestPaths.
    // If not, it still being searched for.
    while (!active.isEmpty()){
      const minPath = active.removeMin();
      
      //shortest path from start to end
      if (locationToString(minPath.end) === locationToString(_end)){
        return minPath;
      }
      //longer path found
      const location = locationToString(minPath.end)
      if (finished.has(location)) {
        continue;
      }
      //shortest path found
      finished.add(location);

      //adding all paths that have one step
      const edges = adjacent.get(location);

      //case where we get undefined 
      if(edges === undefined){
        continue;
      }

      
      for(const edge of edges){
        const theDist = minPath.dist + edge.dist;
        const key = locationToString(edge.end);
        if(!finished.has(key)){
          const newSteps = minPath.steps.slice();
          newSteps.push(edge);
          const newPath: Path = {
          start: _start,
          end: edge.end,
          steps: newSteps,
          dist: theDist
        };
        active.add(newPath);
      }
    }
  }
  //no path from start to end
  return undefined;
};