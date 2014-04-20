Sony dev test
=============
simple SPA-test utilizing the provided API. the resulted app is a simple account/game titles management web app, on top of which a simple card game of "memory" has been built. app was tested in chrome, safari & firefox (no IE available on mac)
the project was developed using the TDD approach with jasmine

javascript technologies used:
	> backbonejs with underscorejs & requirejs
	> jasmine (test driven development)
	> nodejs with express & bower

to start the app:
	- clone the repository to you computer
	- go to terminal and navigate to current folder
	- type "npm install && npm start" wait for the process to end
	- open browser and go to "localhost:3001" for the app or "localhost:3001/tests" for the test suite


thigs to add:
	> grunt compilation task
	> "better" design
	> custom "card faces" for each game
