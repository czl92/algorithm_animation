// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
// conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
// of conditions and the following disclaimer in the documentation and/or other materials
// provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY David Galles ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of San Francisco

function BinaryTree(am, w, h) {
  this.init(am, w, h);
}

BinaryTree.prototype = new Algorithm();
BinaryTree.prototype.constructor = BinaryTree;
BinaryTree.superclass = Algorithm.prototype;

BinaryTree.prototype.init = function (am, w, h) {
  // Call the unit function of our "superclass", which adds a couple of
  // listeners, and sets up the undo stack
  BinaryTree.superclass.init.call(this, am, w, h);
  this.startingX = w / 2;
  this.nextIndex = 0;
  this.addControls();

  // Useful for memory management
  this.nextIndex = 0;

  // TODO:  Add any code necessary to set up your own algorithm.  Initialize data
  // structures, etc.

}

BinaryTree.prototype.addControls = function () {
  this.insertField = addControlToAlgorithmBar("Text", "");
  this.insertField.onkeydown = this.returnSubmit(this.insertField,
    this.insertCallback.bind(this), 4);
  this.insertButton = addControlToAlgorithmBar("Button", "Insert");
  this.insertButton.onclick = this.insertCallback.bind(this);
  this.controls = [];
  this.controls.push(this.insertButton);
  this.controls.push(this.insertField);
  // Add any necessary controls for your algorithm.
  //   There are libraries that help with text entry, buttons, check boxes, radio groups
  //
  // To add a button myButton:
  //	   this.mybytton = addControlToAlgorithmBar("Button", "MyButtonText");
  //     this.mybytton.onclick = this.myCallback.bind(this);
  //     this.controls.push(this.mybutton);
  //   where myCallback is a method on this function that implemnts the callback
  //
  // To add a text field myField:
  //    this.myField = addControlToAlgorithmBar("Text", "");
  //    this.myField.onkeydown = this.returnSubmit(this.myField,
  //                                               this.anotherCallback.bind(this), // callback to make when return is pressed
  //                                               maxFieldLen,                     // integer, max number of characters allowed in field
  //                                               intOnly);                        // boolean, true of only digits can be entered.
  //    this.controls.push(this.myField);
  //
  // To add a textbox:
  //   	this.myCheckbox = addCheckboxToAlgorithmBar("Checkbox Label");
  //      this.myCheckbox.onclick = this.checkboxCallback.bind(this);
  //      this.controls.push(myCheckbox);
  //
  // To add a radio button group:
  //	  this.radioButtonList = addRadioButtonGroupToAlgorithmBar(["radio button label 1",
  //                                                              "radio button label 2",
  //                                                              "radio button label 3"],
  //                                                             "MyButtonGroupName");
  //    this.radioButtonList[0].onclick = this.firstRadioButtonCallback.bind(this);
  //    this.controls.push(this.radioButtonList[0]);
  //    this.radioButtonList[1].onclick = this.secondRadioButtonCallback.bind(this);
  //    this.controls.push(this.radioButtonList[1]);
  //    this.radioButtonList[2].onclick = this.thirdRadioButtonCallback.bind(this);
  //    this.controls.push(this.radioButtonList[1]);
  //
  // Note that we are adding the controls to the controls array so that they can be enabled / disabled
  // by the animation manager (see enableUI / disableUI below)
}

BinaryTree.prototype.reset = function () {
  // Reset all of your data structures to *exactly* the state they have immediately after the init
  // function is called.  This method is called whenever an "undo" is performed.  Your data
  // structures are completely cleaned, and then all of the actions *up to but not including* the
  // last action are then redone.  If you implement all of your actions through the "implementAction"
  // method below, then all of this work is done for you in the Animation "superclass"

  // Reset the (very simple) memory manager
  this.nextIndex = 0;

}

//////////////////////////////////////////////
// Callbacks:
//////////////////////////////////////////////
//
//   All of your callbacks should *not* do any work directly, but instead should go through the
//   implement action command.  That way, undos are handled by ths system "behind the scenes"
//
//   A typical example:
//
BinaryTree.prototype.insertCallback = function (event) {
  // Get value to insert from textfield (created in addControls above)
  var insertedValue = this.insertField.value;

  // If you want numbers to all have leading zeroes, you can add them like this:
  insertedValue = this.normalizeNumber(insertedValue, 4);

  // Only do insertion if the text field is not empty ...
  if (insertedValue != "") {
    // Clear text field after operation
    this.insertField.value = "";
    // Do the actual work.  The function implementAction is defined in the algorithm superclass
    this.implementAction(this.insertElement.bind(this), insertedValue);
  }
}

BinaryTree.foreground_color = "#007700";
BinaryTree.background_color = "#EEFFEE";
BinaryTree.starting_Y = 50;
BinaryTree.width_delta = 50;
BinaryTree.height_delta = 50;
BinaryTree.link_color = "#007700";

BinaryTree.prototype.insertElement = function (insertedValue) {
  this.commands = new Array();
  if (this.treeRoot == null) {
    this.cmd("CreateCircle", this.nextIndex, insertedValue, this.startingX,
      BinaryTree.starting_Y);
    this.cmd("SetForegroundColor", this.nextIndex, BinaryTree.foreground_color);
    this.cmd("SetBackgroundColor", this.nextIndex, BinaryTree.background_color);
    this.cmd("Step");
    this.treeRoot = new TreeNode(insertedValue, this.nextIndex, this.startingX,
      BinaryTree.starting_Y);
  } else {
    this.cmd("CreateCircle", this.nextIndex, insertedValue, 100, 100);
    this.cmd("SetForegroundColor", this.nextIndex, BinaryTree.foreground_color);
    this.cmd("SetBackgroundColor", this.nextIndex, BinaryTree.background_color);
    this.cmd("Step");
    var treeNode = new TreeNode(insertedValue, this.nextIndex, 100, 100);
    this.insert(this.treeRoot, treeNode);
    this.resizeTree();
  }

  this.nextIndex++;
  // this.cmd("CreateCircle", this.nextIndex + 1, insertedValue + 1, 100, 100);
  // this.cmd("SetForegroundColor", this.nextIndex + 1,
  //     BinaryTree.foreground_color);
  // this.cmd("SetBackgroundColor", this.nextIndex + 1,
  //     BinaryTree.background_color);
  // this.cmd("Step");
  // this.cmd("Connect", this.nextIndex, this.nextIndex+1, BinaryTree.link_color);

  // this.treeRoot.right = new TreeNode(insertedValue + 1, this.nextIndex + 1, 100,
  //     100)
  this.resizeTree();
  return this.commands;
}

BinaryTree.prototype.insert = function (node, treeNode, stack) {
  if (node == null) {
    return;
  }

  /**
   * 使用栈实现
   */
  if (stack == null) {
    stack = [node];
  }

  stack.push(treeNode);

  /**
   * 递归实现
   */
  /**
  if (node.left == null && node.data >= treeNode.data) {
    node.left = treeNode;
    console.log(node.graphicID + '--' + treeNode.graphicID)
    this.cmd("Connect", node.graphicID, treeNode.graphicID, BinaryTree.LINK_COLOR);
    console.log(this.treeRoot);
  } else if (node.right == null && node.data < treeNode.data) {
    node.right = treeNode;
    console.log(node.graphicID + '--' + treeNode.graphicID)
    this.cmd("Connect", node.graphicID, treeNode.graphicID, BinaryTree.LINK_COLOR);
    console.log(this.treeRoot);
  } else {
    if (node.data >= treeNode.data) {
      this.insert(node.left, treeNode);
    } else {
      this.insert(node.right, treeNode);
    }
  }
   */
};

BinaryTree.prototype.resizeTree = function () {
  var startingPoint = this.startingX;
  this.resizeWidths(this.treeRoot);
  if (this.treeRoot != null) {
    if (this.treeRoot.leftWidth > startingPoint) {
      startingPoint = this.treeRoot.leftWidth;
    } else if (this.treeRoot.rightWidth > startingPoint) {
      startingPoint = Math.max(this.treeRoot.leftWidth,
        2 * startingPoint - this.treeRoot.rightWidth);
    }
    this.setNewPositions(this.treeRoot, startingPoint, BinaryTree.starting_Y,
      0);
    this.animateNewPositions(this.treeRoot);
    this.cmd("Step");
  }
}

BinaryTree.prototype.setNewPositions = function (tree, xPosition, yPosition,
  side) {
  if (tree != null) {
    tree.y = yPosition;
    if (side == -1) {
      xPosition = xPosition - tree.rightWidth;
    } else if (side == 1) {
      xPosition = xPosition + tree.leftWidth;
    }
    tree.x = xPosition;
    this.setNewPositions(tree.left, xPosition,
      yPosition + BinaryTree.height_delta, -1)
    this.setNewPositions(tree.right, xPosition,
      yPosition + BinaryTree.height_delta, 1)
  }

}

BinaryTree.prototype.animateNewPositions = function (tree) {
  if (tree != null) {
    this.cmd("Move", tree.graphicID, tree.x, tree.y);
    this.animateNewPositions(tree.left);
    this.animateNewPositions(tree.right);
  }
}

BinaryTree.prototype.resizeWidths = function (tree) {
  if (tree == null) {
    return 0;
  }
  tree.leftWidth = Math.max(this.resizeWidths(tree.left),
    BinaryTree.width_delta / 2);
  tree.rightWidth = Math.max(this.resizeWidths(tree.right),
    BinaryTree.width_delta / 2);
  return tree.leftWidth + tree.rightWidth;
}

function TreeNode(val, id, initialX, initialY) {
  this.data = val;
  this.x = initialX;
  this.y = initialY;
  this.graphicID = id;
  this.left = null;
  this.right = null;
}

//  Note that implementAction takes as parameters a function and an argument, and then calls that
//  function using that argument (while also storing the function/argument pair for future undos)

//////////////////////////////////////////////
// Doing actual work
//////////////////////////////////////////////
//   The functions that are called by implementAction (like insertElement in the comments above) need to:
//
//      1. Create an array of strings that represent commands to give to the animation manager
//      2. Return this array of commands
//
//    We strongly recommend that you use the this.cmd function, which is a handy utility function that
//    appends commands onto the instance variable this.commands
//
//    A simple example:
//
//BinaryTree.simpleAction(input)
//{
//	this.commands = [];  // Empty out our commands variable, so it isn't corrupted by previous actions
//
//	// Get a new memory ID for the circle that we are going to create
//	var circleID = nextIndex++;
//	var circleX = 50;
//	var circleY = 50;
//	
//	// Create a circle
//	this.cmd("CreateCircle", circleID, "Label",  circleX, circleY);
//	circleX = 100; 
//	// Move the circle
//	this.cmd("Move", circleID, circleX, circleY);
//	// First Animation step done
//	this.cmd("Step");
//	circleX = 50; 
//	circleY = 100; 
//	// Move the circle again
//	this.cmd("Move", circleID, circleX, circleY);
//	// Next Animation step done
//	this.cmd("Step");
//	// Return the commands that were generated by the "cmd" calls:
//	return this.commands;
//}

// Called by our superclass when we get an animation started event -- need to wait for the
// event to finish before we start doing anything
BinaryTree.prototype.disableUI = function (event) {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = true;
  }
}

// Called by our superclass when we get an animation completed event -- we can
/// now interact again.
BinaryTree.prototype.enableUI = function (event) {
  for (var i = 0; i < this.controls.length; i++) {
    this.controls[i].disabled = false;
  }
}

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new BinaryTree(animManag, canvas.width, canvas.height);
}