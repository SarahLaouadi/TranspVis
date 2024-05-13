Instructions to run the application locally:

I- Server:

  1- Download and install python 3.8.10 on your machine.
  
  2- Download and install Docker desktop for windows:  https://docs.docker.com/desktop/install/windows-install/   ### require WSL installation: example // ubuntu 22.04.3 LTS
  
  3- run docker desktop.
  
  4- Open the folder transpvisback-master with VSCode then open a Git Bash terminal in VSCode.
  
  5- run the command: 
  
  	docker compose build 
   
  and wait until all requirements are installed. NB: may take a long time if you have a bad internet connection
  
  6- run the command: docker compose up to run the server
  
  7- open another git bash terminal in vs code: 
  
    7.1- run the command: docker-compose exec api-transpvisback bash
	
    7.2- run the command: python manage.py makemigrations and wait until it finishes
	
    7.2- run the command: python manage.py migrate and wait until it finishes
	
  8- go back to the first terminal where the docker is running and make sure there are no errors.
  

II- Front-end:

  1- Right click on the transvis-front-main folder and click "open git Bash here"
  
  2- run the command: "npm install" and wait until it finishes installing all the necessary packages.
  
  3- run the command: "npm start" to run the front-end
  

III- For any problems contact: js_laouadi@esi.dz

