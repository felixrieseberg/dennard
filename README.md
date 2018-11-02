# Dennard

A tiny 0-dependencies cross-platform Node.js module that shows the memory
footprint for applications. Named after Robert Dennard, inventor of DRAM.

## Installation

```
npm i -g dennard
```

## Usage

On macOS, the tool needs to run as `sudo`. Internally, this module calls
`footprint`, which requires `sudo` privileges.

```sh
sudo dennard Chrome
┌──────────────────────────────┬───────────┬───────────────┐
│ name                         │ pid       │ megabytes     │
├──────────────────────────────┼───────────┼───────────────┤
│ Google Chrome Helper         │ 22801     │ 359.97        │
│ Google Chrome                │ 21721     │ 260.6         │
│ Google Chrome Helper         │ 21725     │ 242.6         │
│ Google Chrome Helper         │ 21730     │ 151.89        │
│ Google Chrome Helper         │ 36459     │ 130.96        │
│ Google Chrome Helper         │ 21739     │ 96.16         │
│ Google Chrome Helper         │ 21737     │ 75.79         │
│ Google Chrome Helper         │ 21746     │ 62.71         │
│ Google Chrome Helper         │ 21740     │ 56.5          │
│ Google Chrome Helper         │ 36125     │ 44.46         │
│ Google Chrome Helper         │ 21736     │ 37.01         │
│ Google Chrome Helper         │ 21738     │ 28.68         │
│ Google Chrome Helper         │ 57516     │ 22.93         │
│ crashpad_handler             │ 21723     │ 1.59          │
│ AlertNotificationService     │ 21728     │ 1.16          │
└──────────────────────────────┴───────────┴───────────────┘

 Total memory footprint: 1469.1MB
```

## License
MIT, please see `LICENSE` for details
