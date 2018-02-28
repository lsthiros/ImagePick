import * as Konva from '../node_modules/konva';
import * as Q from 'q';

class GridCell {
  selected: boolean;
  lines: Array<Konva.Line>;
  bounds: Konva.Rect;
  notify?: () => void;

  constructor (x: number, y: number, w: number, h: number, notify?: () => void) {
    let xPos: number = x * w;
    let yPos: number = y * h;

    this.selected = false;
    this.lines = new Array<Konva.Line>(7);
    this.bounds = new Konva.Rect({
      x: xPos,
      y: yPos,
      width: w,
      height: h,
      stroke: 'black',
      strokeWidth: 3
    });

    var linePoints: Array<Array<number>> = new Array<Array<number>>(7);
    for (var idx = 0; idx <= 4; idx++) {
      linePoints[idx] = [idx * (w/4), 0, w, (4 - idx) * (h/4)];
    }
    for (var idx = 0; idx < 3; idx++) {
      linePoints[idx + 4] = [0, (idx + 1) * (h/4), (3 - idx) * (w/4), h];
    }

    var idx: number = 0;
    for (let points of linePoints) {
      var newLine = new Konva.Line({
        points: points,
        stroke: 'red',
        strokeWidth: 3,
        visible: false
      });
      newLine.move({
        x: xPos,
        y: yPos 
      });
      this.lines[idx++] = newLine;
    }

    this.bounds.on('mousedown', () => this.toggleState());
    this.notify = notify;
  };

  toggleState() {

    if (this.selected) {
      console.log('deselected');
      this.selected = false;
      this.bounds.stroke('black');
      for (let line of this.lines) {
        line.hide();
        line.draw();
      }
    } else {
      console.log('selected');
      this.selected = true;
      this.bounds.stroke('red');
      for (let line of this.lines) {
        line.show();
        line.draw();
      }
    }

    this.bounds.moveToTop();
    this.bounds.draw();

    if(this.notify) {
      this.notify();
    }
  }
};

export class ImageGrid {
  imageLoaded: Q.Promise<void>;
  image: Konva.Image;
  cells: Array<GridCell>;

  getSelected(): Array<number> {
    var res: Array<number> = new Array<number>();
    var idx: number = 0;

    for (let cell of this.cells) {
      if (cell.selected) {
        res.push(idx);
      }
      idx += 1;
    }
    return res;
  }

  constructor (srcImage: HTMLImageElement, tileWidth: number, tileHeight: number, canvasTarget) {
    this.cells = new Array<GridCell>(tileWidth * tileHeight);


    let iWidth: number = srcImage.width;
    let iHeight: number = srcImage.height;
    let bWidth: number = srcImage.width / tileWidth;
    let bHeight: number = srcImage.height / tileHeight;

    var scene = new Konva.Stage({
      container: canvasTarget.id,
      width: iWidth,
      height: iHeight
    });

    var imageLayer = new Konva.Layer();
    let image = new Konva.Image({
      image: srcImage,
      x: 0,
      y: 0,
      width: iWidth,
      height: iHeight
    });

    imageLayer.add(image);

    var gridLayer: Konva.Layer = new Konva.Layer();
    for (let wIdx = 0; wIdx < tileWidth; wIdx++) {
      for (let hIdx = 0; hIdx < tileHeight; hIdx++) {
        var newCell = new GridCell(wIdx, hIdx, bWidth, bHeight, () => gridLayer.draw());
        this.cells[wIdx + hIdx * tileWidth] = newCell;
        gridLayer.add(newCell.bounds);
        for (let line of newCell.lines) {
          gridLayer.add(line);
        }
      }
    }
    scene.add(imageLayer);
    scene.add(gridLayer);
  }
};

