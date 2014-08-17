#### Read Large Files Asynchronously  ####

Aim of this project is to read the large files and showing the results on UI without hanging it.

Nodejs is used to read files at backend. 

### How to build ###

plumgridExercise is build with Node. If you don't already have this, go install Node and NPM first.
- [Node Download!](<http://nodejs.org/download/>)


Pull the repository into local directory and point your working directory to this folder, then execute following command lines.

This will install all basic dependencies of the application.

```
$> npm install
```
Following will start server in listning mode. You can also set port of the server by changing it from config.json file

```
$> node server.js
```

If everything goes well, it node will log a message on console with a temp url for demo purpose.

It might show the [Local URL](<http://localhost:1314/index.html>) you can got to that URL for demo.

```
http://localhost:1314/index.html
```

If nothing comes up there might be a chance of port conflict, you can go to config.json for changing the port.

Log file must be placed inside folder by name log_file.txt, however file name can be changed from config.json
