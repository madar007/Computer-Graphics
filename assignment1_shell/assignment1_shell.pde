import java.io.*;
import java.util.*;
import java.math.BigDecimal;
// File name of currently loaded example (rendered on the bottom of the
// screen for your convenience).
String currentFile;


/*****************************************************
 * Place variables for describing the L-System here. *
 * These might include the final expansion of turtle *
 * commands, the step size d, etc.                   *
 *****************************************************/
String spec = "";
float x = 350;
float y = 350;
int d = 5;
float incrementAngle = 0;
 
/*
 * This method is automatically called when ever a new L-System is
 * loaded (either by pressing 1 - 6, or 'o' to open a file dialog).
 *
 * The lines array will contain every line from the selected 
 * description file. You can assume it's a valid description file,
 * so it will have a length of 6:
 *
 *   lines[0] = number of production rule applications
 *   lines[1] = angle increment in degrees
 *   lines[2] = initial axiom
 *   lines[3] = production rule for F (or the string 'nil')
 *   lines[4] = production rule for X (or the string 'nil')
 *   lines[5] = production rule for Y (or the string 'nil')
 */
void processLSystem(String[] lines) {
  // This method process the L-system 
  // and produce whatever data structures needed to
  // draw the L-system when drawLSystem() is called.
  incrementAngle = Float.parseFloat(lines[1]);
  int numberOfProduction = Integer.parseInt(lines[0]);
  String rule = ""; 
  String initial = "";
  initial = lines[2];
  // loops through by the number of production rule applications
  for (int i = 1; i < numberOfProduction+1; i++) {
      int j = 0;
      while (j < initial.length()) {
          //if equal to 'F', substitute with production rule for F
          if (initial.charAt(j) == 'F') {
              initial = initial.substring(0, j) + lines[3]
                  + initial.substring(j+1, initial.length());
              j+=lines[3].length();
          }
          //if equal to 'X', substitute with production rule for X
          else if (initial.charAt(j) == 'X') {
              initial = initial.substring(0, j) + lines[4]
                  + initial.substring(j+1, initial.length());
              j+=lines[4].length();
          }
          //if equal to 'Y', substitute with production rule for Y
          else if (initial.charAt(j) == 'Y') {
              initial = initial.substring(0, j) + lines[5]
                  + initial.substring(j+1, initial.length());
              j+=lines[5].length();  
          }
          else {
              j++; 
          }
      }
  }
  spec = initial;
}

/*
 * This method is called every frame after the background has been
 * cleared to white, but before the current file name is written to
 * the screen.
 *
 * It is not called if there is no loaded file.
 */
void drawLSystem() {
  // Implement your LSystem rendering here 
  x = 300;
  y = 520;
  float delta = 270;
  Stack stack = new Stack();
  // goes through the string from processLSystem
  for (int i = 0; i < spec.length(); i++) {
      // if equal to 'F', move forward with step size d and heading delta
      if (spec.charAt(i) == 'F') {
          line(x, y, x+d*cos(radians(delta)), y+d*sin(radians(delta)));
          x = x+d*cos(radians(delta));
          y = y+d*sin(radians(delta));
          println(x, " ", y);
      }
      // if equal to '+' increment delta by increment angle
      else if (spec.charAt(i) == '+') {
          delta += incrementAngle;
          delta = delta%360;
      }
      // if equal to '-' decrement delta by increment angle
      else if (spec.charAt(i) == '-') {
          delta -= incrementAngle;
          delta = delta%360;
      }
      // if equal to '[' push to stack
      else if (spec.charAt(i) == '[') {
          float[] position= new float[3];
          position[0] = x;
          position[1] = y;
          position[2] = delta;
          stack.push(position); 
      }
      // if equal to ']' pop from stack
      else if (spec.charAt(i) == ']') {
          float[] position = (float[]) stack.pop();
          x = position[0];
          y = position[1];
          delta = position[2];
      }
  }
}

void setup() {
  size(750, 750);
}

void draw() {
  background(255);
  if (currentFile != null) {
    drawLSystem();
  }
  
  fill(0);
  stroke(0);
  textSize(15);
  if (currentFile == null) {
    text("Press [1-6] to load an example, or 'o' to open a dialog", 5, 695);
  } else {
    text("Press '+' for increase in step size d or '-' for decrease in step size d", 5, 50);
    text("Current l-system: " + currentFile, 5, 695);
  }
}

void keyReleased() {
  /*********************************************************
   * The examples loaded by pressing 1 - 6 must be placed  *
   * in the data folder within your sketch directory.      *
   * The same goes for any of your own files you'd like to *
   * load with relative paths.                             *
   *********************************************************/

  if (key == 'o' || key == 'O') {
    // NOTE: This option will not work if you're running the
    // Processing sketch with JavaScript and your browser.
    selectInput("Select a file to load:", "fileSelected");
  } else if (key == '1') {
    loadLSystem("example1.txt");
  } else if (key == '2') {
    loadLSystem("example2.txt");
  } else if (key == '3') {
    loadLSystem("example3.txt");
  } else if (key == '4') {
    loadLSystem("example4.txt");
  } else if (key == '5') {
    loadLSystem("example5.txt");
  } else if (key == '6') {
    loadLSystem("example6.txt");
  } else if (key == '7') { 
    loadLSystem("sierpinski.txt");
  } else if (key == '+') {
    d++;
  } else if (key == '-') {
    d--;
  }
  // else modify the above code to include
  // keyboard shortcuts for your own examples
}

import java.io.File;
void fileSelected(File selection) {
  if (selection == null) {
    println("File selection cancelled."); 
  } else {
    loadLSystem(selection.getAbsolutePath()); 
  }
}

void loadLSystem(String filename) {
  
  String[] contents = loadStrings(filename);
  processLSystem(contents);
  currentFile = filename;
}

