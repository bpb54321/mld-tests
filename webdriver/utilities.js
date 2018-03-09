/**
 * Custom utilities for browser testing with Selenium Webdriver Node.js implementation.
 * @author Brian Blosser <bpb54321@gmail.com>
 */

 /**
 * Returns true if elementAbove is {space} pixels above elementBelow.
 * @param {*} elementAbove 
 * @param {*} elementBelow 
 * @param {*} space 
 */
exports.aboveBelow = async function(elementAbove, elementBelow, space) {
  let elementAboveBounds = await getElementBoundaryLines(elementAbove);
  let elementBelowBounds = await getElementBoundaryLines(elementBelow);

  let diff = elementBelowBounds.top - (elementAboveBounds.bottom + space);

  if (diff === 0) {
    return true;
  } else {
    return false;
  }
}

// Functions to build:
exports.elementsAreEvenlySpaced = function(elements, direction) {

}

exports.elementsSpacedByGivenAmount = function(elements, amount, direction) {

}

/**
 * Compares two elements to see if they are right-aligned. The two elements are right-aligned if the right edges of their
 * blocks have the same x position values.
 * @param {WebElement} element1 
 * @param {WebElement} element2 
 * @param {Number} tolerance The tolerance, in pixels, to use when comparing the positions of the two elements. 
 */
exports.areRightAligned = async function(element1, element2, tolerance = 5) {
  return new Promise( async function(resolve, reject){
    var element1Rect;
		var element2Rect;
		var element1RightEdgePosition;
		var element2RightEdgePosition;
		var differenceInPosition;

    if ( (element1 === undefined ) || (element2 === undefined)) {
      reject(new Error('Either element1 or element2 is undefined'));
    } else {
      element1Rect = await element1.getRect();
			element2Rect = await element2.getRect();
			
			element1RightEdgePosition = element1Rect.x + element1Rect.width;
			element2RightEdgePosition = element2Rect.x + element2Rect.width;

			differenceInPosition = element1RightEdgePosition - element2RightEdgePosition;

			resolve( Math.abs(differenceInPosition) <= tolerance );
    }
  });
}

/**
 * Determins if an element is inside another element with optional padding and tolerance.
 * @param containingElementRect The rect object of the containing WebElement, should ressemble this:
 * {height: number, width: number, x: number, y: number}.
 * @param insideElementRect The rect object of the WebElement that should be inside the containingElement.
 * @param paddingLeft Whether there is padding between the two elements. 
 * @param paddingRight
 * @param paddingTop
 * @param paddingBottom
 * @param tolerance 
 */
exports.isElementInsideOtherElement = async function(containingElement, insideElement, 		paddingLeft = undefined, paddingRight = undefined, paddingTop = undefined, paddingBottom = undefined, tolerance = 0) {
  let containingElementBoundaries = await getElementBoundaryLines(containingElement);
  let insideElementBoundaries = await getElementBoundaryLines(insideElement);

  let leftIsGood = areBoundariesWithinTolerance(containingElementBoundaries.left, insideElementBoundaries.left, paddingLeft, tolerance); // left
  let rightIsGood = areBoundariesWithinTolerance(insideElementBoundaries.right, containingElementBoundaries.right, paddingRight, tolerance); // right
  let topIsGood = areBoundariesWithinTolerance(containingElementBoundaries.top, insideElementBoundaries.top, paddingTop, tolerance); // top
  let bottomIsGood = areBoundariesWithinTolerance(insideElementBoundaries.bottom, containingElementBoundaries.bottom, paddingBottom, tolerance); // bottom
  
  if (leftIsGood && rightIsGood && topIsGood && bottomIsGood) {
    return true;
  } else {
    return false;
  }
}


// Private Functions //
async function getElementBoundaryLines(element) {
  let elementRect = await element.getRect();
  return {
    left: elementRect.x,
    right: elementRect.x + elementRect.width,
    top: elementRect.y,
    bottom: elementRect.y + elementRect.height,
  };
}

function areBoundariesWithinTolerance(lesserBoundary, greaterBoundary, padding, tolerance) {
  let difference;
  // Don't care how far inside the lesserBoundary the greaterBoundary is
  if (padding === undefined) {
    difference = greaterBoundary - lesserBoundary;
    if (difference >= 0) {
      return true;
    } else if (Math.abs(difference) <= tolerance) {
      return true;
    } else {
      return false;
    }
  // The lesserBoundary + padding must be within tolerance of the greaterBoundary
  } else {
    difference = greaterBoundary - (lesserBoundary + padding);
    if (Math.abs(difference) <= tolerance) {
      return true;
    } else {
      return false;
    }
  }
  
  
}