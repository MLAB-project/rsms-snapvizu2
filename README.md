# snapvizu2 - RSMS02 trigger snapshot visualizer

![Snapvizu2 with blank_signal](/doc/img/Snapvizu2_blank_signal.png)

Signal snapshot visualizer for [RSMS02 VLF lightning monitoring station](https://github.com/UniversalScientificTechnologies/RSMS02).

## Usage

To run:

	python3 server.py

Server listens on port 81. One can override the default snapshot directory (`/tmp/snaps`) through the `SNAPVIZU2_SNAP_DIR` environment variable, e.g.

	SNAPVIZU2_SNAP_DIR=/var/snaps/ python3 server.py

## Credits

Web page content derived from:

https://github.com/danchitnis/webgl-plot-examples

See LICENSE for attribution and distribution terms.
