FROM    centos:centos6

# Enable EPEL for Node.js
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# Install Node.js and npm
RUN     yum install -y tar which npm
RUN npm cache clean -f; npm install -g n; n 0.10.40; node -v
# Bundle app source
COPY . /src
# Install app dependencies
RUN cd /src; export LINK=g++; npm install

EXPOSE  3000
CMD ["node", "/src/app.js"]
