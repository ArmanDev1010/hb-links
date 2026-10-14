# Garage Conversion (ADU page): 10 frames

An old detached garage at the end of an LA driveway becomes a rental unit.
The ADU page plays it in place of the homepage's ADU build. Until these
frames are done, the page keeps showing the homepage timelapse.

Unlike the other services there's no photo yet, so **start with step 1**:
the finished conversion. Every other frame is edited from it.

| Frame | Day | Crew action (for the crew prompt) |
|---|---|---|
| 01 | Before: the old garage | none |
| 02 | Clean-out | Add 2 workers carrying old boxes and a broken chair out of the garage toward the driveway. |
| 03 | Door out, gutted | Add 2 workers carrying the old garage door's metal track down the driveway. |
| 04 | Sewer line | Add 2 workers: one digging in the trench with a shovel, one kneeling to fit a section of pipe. |
| 05 | New front wall framed | Add 2 workers: one nailing a stud into the new wall, one cutting a board on a saw stand. |
| 06 | Dried in, new roof | Add 2 workers: one on a ladder fitting the window, one on the roof laying the last row of shingles. |
| 07 | Stucco | Add 2 plasterers on the scaffold, troweling stucco onto the front wall. |
| 08 | Paint and lights | Add 2 workers: one painting the window trim with a brush, one on a short ladder installing the wall light by the door. |
| 09 | Patio and planting | Add 2 workers: one kneeling to lay pavers, one setting a plant into the bed. |
| 10 | Finished | none: the photo from step 1 |

## Step 1: the finished conversion

A new Gemini chat, no attachments. Make a few and pick the most natural one.
Save it as **`keys/10.png` and `frames/10.png`**.

```
An ordinary iPhone photo taken by the homeowner, standing at chest height in the middle of a long concrete driveway in a Los Angeles neighborhood, looking toward a small detached building at the back of the lot that used to be a two-car garage and has just been converted into a one-bedroom rental unit. It keeps the garage's simple shape and low gable roof, now in new charcoal asphalt shingles with black fascia and gutters. The old garage door is gone: the front wall is now smooth white stucco with a large black-framed window and a black front door with a narrow glass panel, a black wall light beside it, a small cedar-board accent panel, and a short concrete step. In front of it, the end of the driveway has become a small patio of light-gray pavers with two simple chairs, a few drought-tolerant plants in a narrow bed of dark mulch, and a potted olive tree.

Around it: the side wall of the main house on the left edge of the frame (beige stucco with a window and an AC unit), a horizontal cedar-slat fence on the right, a palm tree and the neighbor's two-story house beyond, a power line crossing the sky. Well kept but lived in: a coffee mug on a chair arm, a garden hose coiled by the house, a few dry leaves on the pavers.

Plain afternoon sunlight with crisp natural shadows, slightly muted true-to-life colors. Casual phone framing, not perfectly level, 26mm phone lens, mild sensor noise. Not a real-estate listing photo, no HDR, no golden-hour glow, nothing perfectly symmetrical, not a 3D render. No people, no text, no logos, no house numbers. Keep the converted garage in the center third of the frame, with calm, simple areas on the left and bottom — the image is used full-screen behind text, and on phones it's cropped to a narrow vertical slice from the middle. Aspect ratio 16:9.
```

## Keys: make them in this order

### 09: from `keys/10.png`
```
Edit the attached photo. It is one frame from a fixed time-lapse camera, so the camera must not move: keep the exact framing, angle, lens and 16:9 size, and keep the main house on the left, the fence, the palm tree, the neighbor's house, the power line and the sky exactly as they are. Change only this:

Go back a few days. Remove the chairs, the mug, the potted olive tree and the hose. Only half the patio is laid: the half nearest the building has light-gray pavers, the rest is flat compacted gravel, with a pallet of pavers beside it. The planting bed is bare dark mulch, with a few drought-tolerant plants waiting in black nursery pots. Keep the converted building exactly as it is.

No people. It must still look like an ordinary, unedited photo — natural light, not a 3D render.
```

### 08: from `keys/09.png`
```
Edit the attached photo. It is one frame from a fixed time-lapse camera, so the camera must not move: keep the exact framing, angle, lens and 16:9 size, and keep the main house on the left, the fence, the palm tree, the neighbor's house, the power line and the sky exactly as they are. Change only this:

Go back a week. Replace the pavers, gravel, planting bed and nursery pots with the old driveway: plain gray concrete, cracked and oil-stained, running right up to the building. Remove the cedar accent panel and the wall light from the building. Blue painter's tape around the window and the door. Keep the white stucco, the window, the door and the roof exactly as they are.

No people. It must still look like an ordinary, unedited photo — natural light, not a 3D render.
```

### 07: from `keys/08.png`
```
Edit the attached photo. It is one frame from a fixed time-lapse camera, so the camera must not move: keep the exact framing, angle, lens and 16:9 size, and keep the main house on the left, the fence, the palm tree, the neighbor's house, the power line, the sky and the old driveway exactly as they are. Change only this:

Go back a week. Replace the smooth white paint on the building with rough, darker gray stucco scratch coat, not painted. Add metal scaffolding along the front wall. The window and door glass are covered in plastic film. Keep the roof exactly as it is.

No people. It must still look like an ordinary, unedited photo — natural light, not a 3D render.
```

### 06: from `keys/07.png`
```
Edit the attached photo. It is one frame from a fixed time-lapse camera, so the camera must not move: keep the exact framing, angle, lens and 16:9 size, and keep the main house on the left, the fence, the palm tree, the neighbor's house, the power line, the sky and the old driveway exactly as they are. Change only this:

Go back a week. Remove the scaffolding. Replace the gray scratch coat on the new front wall with plain white house wrap with no printing, with black flashing tape around the new window and door. The building's side walls are the old garage's faded beige stucco, with a few hairline cracks. Keep the new charcoal roof exactly as it is.

No people. It must still look like an ordinary, unedited photo — natural light, not a 3D render.
```

## Redo of frames 01–05 (2026-10-14)

The first round of 01–05 looked AI-made: an orange, torn and curled roof, a
garage door that didn't look real, and a bike. They're redone as one chain
from `frames/06.png`, so all five share one believable old roof. In each
step, attach the frame named, make a few versions, and save the most natural
one **over** `frames/NN.png`. Then the next step uses that new file. If a
step changes the roof, try that step again. When all five are in, say so: I
line them up and rebuild the page.

What happened next: Gemini drifted on 01–04. Frames 01–02 came back zoomed in
with a different house on the left, and 04 shifted up 40 px. So 01–04 in
`frames/` are now built on frame 05: the house, sky, palm, neighbor, fence,
garage walls, roof and driveway all come from 05, with its lumber swapped for
frame 06's clean driveway. Only each frame's own garage opening, the ground
just in front of it, and its driveway items (bins, dumpster and boxes, door
panels and bag, trench, weeds) are pasted in, mapped onto 05's opening. If you
regenerate any of 01–04, tell me, and I'll put it on the same background.

### 05: from `frames/06.png`
```
Edit the attached photo. It is one frame from a fixed time-lapse camera, so the camera must not move: keep the exact framing, angle, lens and 16:9 size, and keep the main house on the left, the fence, the palm tree, the neighbor's house, the power line, the sky and the old driveway exactly as they are. Change only this — go back a week, to before the new roof and the new front wall:

1. The roof: replace the new charcoal shingles, the black fascia and the black gutter with the garage's original roof, keeping the roof's shape, size and edges exactly as they are now. It is an ordinary 20-year-old asphalt shingle roof in a weathered gray-brown, evenly faded by the sun, with a few faint darker streaks. It is complete and lies flat: no holes, no torn, missing, lifted or curled shingles, no patches, no moss. Along its edge, a plain wood fascia board painted the same beige as the garage walls, its paint dull. No gutter.
2. The front: replace the house wrap, the window and the door with a newly framed wall of bare, light-yellow wood studs filling the old garage-door opening, with empty openings where the window and the door will go. Through them you can see the gutted inside of the garage. Above and beside the opening, the front wall is the garage's old beige stucco, like its side walls.
3. A neat stack of new lumber on the driveway, near the bottom left.

No people. It must still look like an ordinary, unedited phone photo of a real garage: natural light, not a 3D render.
```

### 04: from the new `frames/05.png`
```
Edit the attached photo. It is one frame from a fixed time-lapse camera, so the camera must not move: keep the exact framing, angle, lens and 16:9 size, and keep the main house on the left, the fence, the palm tree, the neighbor's house, the power line, the sky, and the old garage's walls and roof exactly as they are — do not change the roof at all. Change only this:

Go back a week. Remove the stack of lumber. Replace the new stud wall with the old, wide, empty garage-door opening, showing the bare inside of the garage: old wood studs and an old concrete floor. Cut a narrow trench through the driveway concrete, running from the main house toward the garage, with a new white sewer pipe lying in it and piles of dirt and broken concrete along its sides.

No people. It must still look like an ordinary, unedited phone photo: natural light, not a 3D render.
```

### 03: from the new `frames/04.png`
```
Edit the attached photo. It is one frame from a fixed time-lapse camera, so the camera must not move: keep the exact framing, angle, lens and 16:9 size, and keep the main house on the left, the fence, the palm tree, the neighbor's house, the power line, the sky, and the old garage exactly as it is — do not change the roof at all. Change only this:

Go back a few days. Replace the trench, the pipe and the dirt piles with the old cracked, oil-stained driveway concrete, intact. The old garage door has just been taken off: three of its long off-white steel sections and its bent metal tracks lie stacked on the driveway, and a black contractor bag sits by the opening.

No people. It must still look like an ordinary, unedited phone photo: natural light, not a 3D render.
```

### 01: from the new `frames/03.png`
```
Edit the attached photo. It is one frame from a fixed time-lapse camera, so the camera must not move: keep the exact framing, angle, lens and 16:9 size, and keep the main house on the left, the fence, the palm tree, the neighbor's house, the power line, the sky, the driveway, and the old garage's walls and roof exactly as they are — do not change the roof at all. Change only this:

Show this same garage before the project. Remove the door sections, the tracks and the bag from the driveway. In the empty garage-door opening, put back the old garage door, closed: an ordinary off-white steel sectional garage door, the kind on most older Los Angeles garages. It has four horizontal sections, each with a row of shallow raised rectangular panels; it is a little dingy with dust, with a couple of small dents, a black rubber seal along the ground and a plain metal handle on the bottom section. It fills the opening exactly, straight and level, set just inside the opening's frame like a real installed door. A green trash bin and a blue recycling bin stand beside the garage on the right, and a few small weeds grow in the cracks of the driveway. Nothing else on the driveway: no bicycle, nothing leaning on the garage.

No people. It must still look like an ordinary, unedited phone photo: natural light, not a 3D render.
```

### 02: from the new `frames/01.png`
```
Edit the attached photo. It is one frame from a fixed time-lapse camera, so the camera must not move: keep the exact framing, angle, lens and 16:9 size, and keep the main house on the left, the fence, the palm tree, the neighbor's house, the power line, the sky, the driveway, the bins, and the garage's walls and roof exactly as they are — do not change the roof at all. Change only this:

Clean-out day. The garage door is rolled up open, its bottom edge just showing at the top of the opening, and the garage is packed with old boxes, furniture, paint cans and tools. Some of it is already piled on the driveway next to a small roll-off dumpster bin. No bicycle.

No people. It must still look like an ordinary, unedited phone photo: natural light, not a 3D render.
```
