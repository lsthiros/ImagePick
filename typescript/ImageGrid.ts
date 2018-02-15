import * as Konva from '../node_modules/konva';
import * as Q from '../node_modules/@types/q';

export class ImageSelector {
  imageLoaded: Q.Promise<void>;
  image: Konva.Image;
  canvasTarget: HTMLDivElement;
  cells: Array<Konva.Rect>;

  constructor (imageLocation: URL, tileWidth: number, tileHeight: number) {
    var srcImage: HTMLImageElement = new Image();
    this.cells = new Array<Konva.Rect>(tileWidth * tileHeight);
    this.imageLoaded = imageDeferred.promise;

    var imageDeferred: Q.Deferred<void> = Q.defer();

    srcImage.onload = () => {
      let bWidth: number = srcImage.width / tileWidth;
      let bHeight: number = srcImage.height / tileHeight;

      var scene = new Konva.Stage({
        container: this.canvasTarget.id,
        width: srcImage.width,
        height: srcImage.height
      });

      var layer = new Konva.Layer();

      for (let wIdx = 0; wIdx < tileWidth; wIdx++) {
        for (let hIdx = 0; hIdx < tileHeight; hIdx++) {
          let newCell = new Konva.Rect({
            x: wIdx * bWidth,
            y: hIdx * bHeight,
            width: bWidth,
            height: bHeight,
            stroke: 'red',
            strokeWidth: 3
          })
          this.cells[wIdx + hIdx * tileWidth] = newCell;
          layer.add(newCell);
        }
      }
      scene.add(layer);
      imageDeferred.resolve();
    }
  }
}
