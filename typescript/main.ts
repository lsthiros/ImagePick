import * as $ from 'jquery';
import * as Q from 'q';
import { ImageGrid } from './ImageGrid';

declare var require: any;

let header = require('../templates/header.handlebars');
let Submitter = require('../templates/submitter.handlebars');

interface TurkQuestion {
  imageId: string;
  assignmentId?: string;
};

class AnswerSubmitter {
  $renderElement: JQuery<HTMLElement>;
  grid: ImageGrid;

  constructor(grid: ImageGrid, assignmentId: string) {
    var $element = $(Submitter({assignmentId: assignmentId}));
    this.grid = grid;
    $element.submit((e) => {this.submitForm()});
    this.$renderElement = $element;
  }

  submitForm() {
    let answer: Array<number> = this.grid.getSelected();
    this.$renderElement.find('#answer').val(JSON.stringify(answer));
  }

}

function getQFromUrl(loc: URL): TurkQuestion {
  let params: URLSearchParams = loc.searchParams;

  if (!params.has('assignmentId')) {
    throw new Error('Invalid URL: assignmentId not found');
  }

  let aid: string = params.get('assignmentId');
  let question: TurkQuestion;


  if (aid === "ASSIGNMENT_ID_NOT_AVAILABLE") {
    question = {imageId: '00331faa41f4af9da5c4fb5a9891d860'};
  } else {
    if (!params.has('imageId')) {
      throw new Error('Invalid URL: Valid Assignment with missing imageId');
    }
    // question = {imageId: params.get('imageId'),
    question = {imageId:params.get('imageId'),
      assignmentId: aid};
  }

  return question;
}

$(() => {
  let question: TurkQuestion = getQFromUrl(new URL(document.location.href));
  let urlBase: string = 'https://s3-us-west-1.amazonaws.com/cprc-road-detect/index/';
  var imageReady: Q.Deferred<void> = Q.defer();
  var image: HTMLImageElement = new Image();

  image.onload = () => {imageReady.resolve()};

  imageReady.promise.then( () => {
    let $canvas = $('#container')[0];
    var grid: ImageGrid = new ImageGrid(image, 12, 12, $canvas);

    $('#headerArea').append($(header({gridWidth: 23, gridHeight:23})));

    if (question.assignmentId) {
      let submitter: AnswerSubmitter = new AnswerSubmitter(grid, question.assignmentId);
      $('#submitArea').append(submitter.$renderElement);
    } else {
      $('#submitArea').html('<button type="button" class="btn btn-primary" disabled>Sample Question Cannot Be Submitted</button>');
    }
  }).done();

  image.src = urlBase + question.imageId.slice(0, 2) + '/' + question.imageId.slice(2) + '.png';

});
