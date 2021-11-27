# Random Grid Gallery

 * Responsive and customizable image gallery component
 * Detects the original orientation of your photo
 * Creates a random arrangement of photos on the grid

## Preview

no whitespace  | with whitespace
------------- | -------------
[![no-whitespace.jpg](https://i.postimg.cc/prjswd1S/no-whitespace.jpg)](https://postimg.cc/8f1dWTGd) | [![whitespace.jpg](https://i.postimg.cc/D00CBgq7/whitespace.jpg)](https://postimg.cc/PvGzq137)

## Getting started
### Installation
Random Grid Gallery requires React 16.0.0 or later.
>`npm install random-grid-gallery`
### Import 
`import { Gallery } from "random-grid-gallery";`
### Setup Example
```
const photos = [
  "https://images.example",
  "https://images.example",
  "https://images.example",
  "https://images.example",
];

function App() {
  return (
    <div className="app">
      <Gallery photos={photos} maxCols={1} />
    </div>
  );
}
```
## Props
* `photos` - array of strings(url), see example above, `default: []`
* `maxCols` - number of columns in a row, `default: 5`
* `gap` - gaps between  images,, `default: 10`
* `whitespace` - grid layout with free spaces, `default: false`









