dataCollector
=============

Node.js and Javascript for creating simple forms that collect different types of data that I want to capture.  I created this little set of code because I have all kinds of things that I found myself wanting to capture and I wanted to do so in an easy manner.  I know there is a lot of different ways to capture data like this out there but as a newbie in the programming space I wanted to create my own.  It is fun and allows me be more in control of what the programs do.

This is a work in progress so I expect to provide a lot of updates.  Currently the way you would use the program is as follows:

1. In the views folder are Jade templates.  If you wanted to capture data you would open an exiting Jade template form and modify it to capture the data you want.
2. Start the mongodb, right now it points to a test database if you want to change that update the app.js file in the main folder
3. Start the node.js app by running app.js
4. In your browser go to http://localhost:1337/[formName] and your form should come up, insert data and submit.
5. After you submit data you can see the in a simple table view at http://localhost:1337/form/[formName].  I used handsontable.js to create my tables for me.  In the Public/js folder you will see the javascript for it there and can modify that as needed.
6. Create more content!  The code has some simple get, save, update, and remove functions to it that use json data that is sent to the server.  You will find those functions in the formUtilies.js file.

I hope to add graphs using D3 to some of my forms as an example/template also I am always looking to improve my code.  I just started learning javascript and node a couple weeks ago.  
