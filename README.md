# catjs
Cali-Lang to JavaScript compiler.

# About:
Catjs is a cali-lang to javascript transpiler. It's entirely written in cali-lang and uses the native ast.ca library to convert the cali-lang AST into javascript. The goal of catjs is to allow much of the native cali-lang code to be compiled directly into JavaScript and ran in the web browser.

The example site can be viewed at <a href='http://catjs.cali-lang.com/' target='_blank'>catjs.cali-lang.com/</a> .

# Requirements:
Catjs requires a local installation of cali-lang version 0.95a or later. Get the latest version at <a href='http://www.cali-lang.com/' target='_blank'>http://www.cali-lang.com/</a> .

# License:
Catjs is licensed under the Apache 2 License.

# Basic Usage:
Using catjs is fairly simple and straightforward. You can serve the compiled JS as is and simply send it to the browser. Another option is to compile and cache in a variable to be used over and over by the web server. Yet another option is to compile and save to file and just serve the file from a web server. 

Note: The resulting compiled JS code relies on catjs.js JavaScript file. This file needs to be included in the page with a script tag and served from the web server along with the page and the results from the compiled JS. 

<pre>
// Include catjs library.
include net.catjs.catjs;

...

// Create a new catjs object with the module name that 
// we wish to compile to JS.
cjs = new catjs('somePackage.someModule');

// Call compile with optional pretty argument.
// If pretty == true, then the resulting JS will have newline 
// and indentation characters.
jsstr = cjs.compile(true);

// The results stored in jsstr is the text JavaScript compiled 
// from the cali-lang module.


</pre>

# Implemented Objects:
* Basic language structures
* lang
* null
* bool
* int *
* double *
* string *
* list
* map
* exceptions
* callbacks
* console *
* sys
* json *
* url *
* httpClient *
* wsClient

\* Select methods haven't been implemented yet. Some methods aren't implemented because they just don't apply in the browser such as file IO because of security limitations. 

A word about the dom ... Most programming languages have no native notion of a window or DOM. In order for cali-lang code to interface with the window and document objects within a web browser these objects need to be created. It's not a requirement for catjs to have native implementations of win/doc objects in order to compile to JavaScript and interface with the window/document however they are required for unit testing in cali-lang outside of the browser. Currently the win/doc objects can be used, but don't exist in native cali-lang code ... on the todo list.

# Example Program:
You can launch the example program from Linux/Unix/OSX by running the runTest.sh shell script. On windows or if you want to run it yourself use the command below. Once the program is launched navigate to localhost:8080 to view the page. The test page includes a few hundred tests compiled from cali-lang into JS.

shell> cali -Xss10M catjsTest.ca

# TODO:
Implement win and doc classes in cali-lang to support local testing. Implement other base cali-lang objects such as regex, hex, uuid ...
