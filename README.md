# map-geo-palengke-sample

A **Vue 3 component** for displaying interactive Leaflet maps with custom GeoJSON data for stalls and scope areas. Includes search, click popups, and optional overlay information.  

---

## Features

- Display markers from `stalls-data` and `scope-data`.
- Click markers to see stall information (popup overlay).
- Search control for `scope-data`.
- Supports Leaflet plugins:
  - `leaflet-control-geocoder`
  - `leaflet-search`
  - `leaflet.locatecontrol`
  - `leaflet.browser.print`
- Fully configurable map center and zoom.
- Emits `stall-click` event when a stall is clicked.
- Ready to install as npm library.

---

## Installation

```bash
npm install map-geo-palengke-sample
