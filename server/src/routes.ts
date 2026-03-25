import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { BUILDINGS, EDGES } from './campus';
import { shortestPath } from "./dijkstra";

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

/** Returns a list of all known buildings. */
export const getBuildings = (_req: SafeRequest, res: SafeResponse): void => {
  res.json({buildings: BUILDINGS});
};

/**
 * Returns the shortest path between two buildings based on parameters.
 */
// TODO (Task 1 - Retrieve You Me): add a route to get the shortest path
export const getShortestPath = (req: SafeRequest, res: SafeResponse): void => {
  const start = first(req.query.from);
  const end = first(req.query.to);

  let fromBuilding;
  let toBuilding;

  if (!start || !end) {
    res.status(404).send({error: "invalid or missing input"});
    return;
  }

  for (const building of BUILDINGS) {
    if (building.shortName === start) {
      fromBuilding = building;
    }
    if (building.shortName === end) {
      toBuilding = building;
    }
    if (fromBuilding && toBuilding) {
      break; 
    }
  }

  if (!fromBuilding || !toBuilding) {
    res.status(404).send({error: "invalid or missing input"});
    return;
  }

  const thePath = shortestPath(fromBuilding.location, toBuilding.location, EDGES);
  if (!thePath) {
    res.status(404).send({error: "No path found"});
  } else {
    res.send({path: thePath.steps});
  }
};

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give multiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
