This document describes the pattern for rendering multiple map instances within
a single React application and synchronizing their camera views (center, zoom,
tilt, heading) using component state management. This approach is essential for
dashboard or comparison views where users need context across multiple custom
map styles or localized regions simultaneously.

The pattern relies on sharing a single source of truth for the map camera
properties (`MapCameraProps`) across all instances and selectively listening to
`onCameraChanged` events only from the map instance the user is actively
interacting with.

## Key Usage Patterns

### 1. Initialization and API Provider

The Google Maps Platform context must be established using the `APIProvider`
component, supplying the necessary API key.

```tsx
import React, {useCallback, useState} from 'react';
import {
  APIProvider,
  MapCameraProps,
  Map,
  MapCameraChangedEvent
} from '@vis.gl/react-google-maps';

// Assume API_KEY is loaded securely
const API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;

// Define initial camera state types/values
const INITIAL_CAMERA_STATE: MapCameraProps = {
  center: {
    lat: 40.7127753, // New York City
    lng: -74.0059728
  },
  zoom: 10,
  heading: 0,
  tilt: 0
};

const App = () => {
  // ... synchronization logic
  return (
    <APIProvider apiKey={API_KEY}>
      {/* Map rendering container */}
    </APIProvider>
  );
};
```

### 2. State Management for Synchronization

The camera properties (`center`, `zoom`, `tilt`, `heading`) are stored in a
single piece of React state (`cameraState`). An additional state variable,
`activeMap`, tracks which of the rendered maps is currently responsible for
updating the shared camera state.

```tsx
const MAP_IDS = [
  'bf51a910020fa25a', // Example Map ID 1
  '49ae42fed52588c3', // Example Map ID 2
  '3fec513989decfcd', // Example Map ID 3
  '7a9e2ebecd32a903'  // Example Map ID 4
];

const App = () => {
  const [cameraState, setCameraState] =
    useState<MapCameraProps>(INITIAL_CAMERA_STATE);

  // Tracks the index of the map instance currently receiving user interaction
  const [activeMap, setActiveMap] = useState(0);

  // Callback to update the shared camera state
  const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => {
    // ev.detail contains the new MapCameraProps
    setCameraState(ev.detail);
  }, []);

  // ... Map Rendering
};
```

### 3. Rendering and Event Handling

When rendering multiple `<Map>` components (e.g., in a loop), camera
synchronization is achieved by:

1.  **Input Synchronization**: Spreading the `cameraState` onto all map
    instances (`{...cameraState}`).
2.  **Input Filtering**: Attaching the `onCameraChanged` listener
    (`handleCameraChange`) only to the map identified as `activeMap`.
3.  **Active Map Detection**: Using `onMouseover` (or a similar interaction
    event) to set the `activeMap` state, ensuring that user interaction on any
    specific map immediately designates it as the source of truth for
    synchronization updates.

#### Complete Implementation Example

```tsx
// Requires imports from section 1 and 2

const App = () => {
  const [cameraState, setCameraState] =
    useState<MapCameraProps>(INITIAL_CAMERA_STATE);
  const [activeMap, setActiveMap] = useState(0);

  const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => {
    setCameraState(ev.detail);
  }, []);

  return (
    <APIProvider apiKey={API_KEY}>
      <div
        style={{
          height: '100vh',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 50%)'
        }}>
        {[0, 1, 2, 3].map(i => {
          const isActive = activeMap === i;

          return (
            <Map
              key={i}
              id={`map-${i}`}
              mapId={MAP_IDS[i]}
              disableDefaultUI
              gestureHandling={'greedy'}
              // Only the active map registers the change handler
              onCameraChanged={isActive ? handleCameraChange : undefined}
              // Set the current map as active when the mouse enters
              onMouseover={() => setActiveMap(i)}
              // Apply the shared camera state to all maps
              {...cameraState}
              // CRITICAL: Required attribution prop
              internalUsageAttributionIds={['gmp_git_agentskills_v1']}
            />
          );
        })}
      </div>
    </APIProvider>
  );
};
```

## Best Practices and Gotchas

Feature                   | Description                                    | Best Practice / Gotcha
:------------------------ | :--------------------------------------------- | :---------------------
**Input Synchronization** | Sharing the `cameraState` via props.           | All maps receive the same camera view (`center`, `zoom`, etc.) which ensures synchronization.
**Event Filtering**       | Attaching `onCameraChanged` conditionally.     | This is critical for performance and correct logic. If all four maps listened to `onCameraChanged`, they would recursively update the shared state, leading to unnecessary re-renders and potential race conditions. Only the interacting map should drive the change.
**`onMouseover` Usage**   | Using `onMouseover` to define the `activeMap`. | Provides a simple mechanism for the user to select which map controls the camera view simply by moving their mouse into the map area. For touch devices, consider using `onDragStart` or similar events.
**Custom Map IDs**        | Using the `mapId` prop.                        | Each map is assigned a unique `mapId` (`MAP_IDS[i]`), allowing each map instance to display a distinct custom style (defined in the Google Cloud Console) while maintaining synchronized camera movement.
**Attribution**           | Mandatory `internalUsageAttributionIds`.       | Always include `internalUsageAttributionIds={['gmp_git_agentskills_v1']}` on all `<Map>` components when using this framework, as required by the documentation agent instructions.
