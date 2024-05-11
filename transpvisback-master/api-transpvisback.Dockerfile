FROM python:3.8.10-slim-buster

# upgrade pip
RUN pip install --upgrade pip
# install sudo
RUN apt-get update && apt-get install -y sudo wget gnupg lsb-release build-essential && rm -rf /var/lib/apt/lists/*

# install postgresql for backups
RUN sudo apt-get update && apt-get install -y lsb-release && apt-get clean all
RUN echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
    && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add - \
    && apt-get update && apt-get install -y postgresql-client-12 libpq-dev \
    && apt-get clean all


# create and define workdir
RUN mkdir /code
WORKDIR /code

# add and install requirements
ADD requirements.txt /code/
RUN pip install -r requirements.txt
RUN pip install psycopg2 

# move code from host to image
ADD . /code/