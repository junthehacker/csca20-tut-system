# csca20-tut-system
Tutorial system for CSCA20 course.

## System Requirements

* UNIX-like OS, Windows will prob work but is not tested.
* MongoDB
* Node.js (10+ recommended)
* Admin access to IA either on
    * https://csed.utsc.utoronto.ca/
    * or your local environment.
    
We use a project called I.A. to achieve SSO (UofT Auth). You can read more about the project here: https://github.com/junthehacker/Identity-Atheneum

## Quick Start

To run the service, you will first need to run the following command to setup the configuration file

```bash
$ cp .env.example .env
$ vim .env # or use nano, vi etc.
```

Enter proper configuration details and save the file. Then run the following command to install dependencies

```
$ npm install # or npm ci
```

After you have installed the dependencies, run the following command to start the development server:

```
$ npm start
```

--------

Developed with ❤️ by students at UofT Scarborough
