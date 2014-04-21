Sony dev test
=============
simple SPA-test utilizing the provided API. the resulted app is a simple account/game titles management web app, on top of which a simple card game of "memory" has been built. app was tested in chrome, safari & firefox (no IE available on mac)

the project was developed using the TDD approach with jasmine



development time:

1. ~0.5 hrs:	sketch out "main screens" and user interaction, application flow

2. ~2 hrs: 		setup development environment (node server, requirejs bootstraps & jasmine, dependencies, git etc.)

3. ~1.5 hrs: 	study given API, test communication and troubleshoot "_g.load" method for issues with PUT requests

4. 4-6 hrs:		develop app with backbonejs using the TDD approach with jasmine

5. 6-8 hrs:		"skin", test and debug the application



javascript technologies used:
	> backbonejs with underscorejs & requirejs
	> jasmine (test driven development)
	> nodejs with express & bower

to start the app:
	- clone the repository to you computer
	- go to terminal and navigate to current folder
	- type "npm install && npm start" & wait for the process to end
	- open browser and go to "localhost:3001" for the app or "localhost:3001/tests" for the jasmine test suite

thigs to add:
	> grunt compilation task
	> "better" design
	> custom "card faces" for each game

