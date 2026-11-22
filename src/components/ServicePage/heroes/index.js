// The service pages' own hero scenes (11-21, the user: each service its own
// project — not the ADU's building, not one house seen from different
// sides — and the kitchen and the bathroom each a room on its own), by
// their service page's slug, in the shape intro/vignettes.js gives its
// stages: what the camera frames (`focus`), how it's drawn and outlined,
// where its build stops (`end`). ServiceHero plays these; a page without
// one plays its vignette (the ADU's, Home/intro/adu.js).

import { ghostDesignBuild } from "@/components/Home/intro/designbuild";
import { ADDITION_BOUNDS, drawAddition, ghostAddition } from "./addition";
import { BATHROOM_BOUNDS, drawBathroom, ghostBathroom } from "./bathroom";
import { DECK_BOUNDS, drawDeck, ghostDeck } from "./deck";
import { drawDesignBuildBlueprint } from "./designbuild";
import { GARAGE_BOUNDS, drawGarage, ghostGarage } from "./garage";
import { KITCHEN_BOUNDS, drawKitchen, ghostKitchen } from "./kitchen";
import { REMODEL_BOUNDS, drawRemodel, ghostRemodel } from "./remodel";

const view = (focus, draw, ghost) => ({ focus, draw, ghost, end: 1, seconds: 3.4, replay: 0.15 });

export const HERO_VIEWS = {
  "garage-conversion": view(GARAGE_BOUNDS, (G, k) => drawGarage(G, k), ghostGarage),
  "home-remodel": view(REMODEL_BOUNDS, (G, k) => drawRemodel(G, k), ghostRemodel),
  "kitchen-remodel": view(KITCHEN_BOUNDS, (G, k) => drawKitchen(G, k), ghostKitchen),
  "bathroom-remodel": view(BATHROOM_BOUNDS, (G, k) => drawBathroom(G, k), ghostBathroom),
  "home-additions": view(ADDITION_BOUNDS, (G, k) => drawAddition(G, k), ghostAddition),
  "deck-and-patio": view(DECK_BOUNDS, (G, k) => drawDeck(G, k), ghostDeck),
  "design-build": view({ x: [-6, 48], y: [0, 20], z: [-15, 28] }, (G, k, assets) => drawDesignBuildBlueprint(G, k, assets), ghostDesignBuild),
};

