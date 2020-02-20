# Live Dashboard

This is a sample project to display live data.

## Getting Started

Download or checkout the project on your local machine.
The whole project has been dockerized so the quickest way to run the project is to use Docker.

### Prerequisites

```
Docker
```

### Installing

Checkout or download the project and run the following command in the folder where you downloaded everything.

```
docker-compose up
```

By default the app runs on port 4200, so to use it just type the following address on your browser.

```
http://localhost:4200
```

## Adding new data

In order to see live data appear in the dashboard you can POST new info to the backend at the following endpoint.

```
POST http://localhost:3000/api/download
```

Example data:
```
{
	"data": {
		"latitude": "-0.127758", 
		"longitude": "40.507351", 
		"appId": "APP_IOS", 
		"downloadedAt": "11/11/2019"	
	}
}
```

## Built With

* [Angular](https://angular.io) - Frontend
* [Express.js](https://expressjs.com) - Backend
* [PostgreSQL](https://www.postgresql.org) - Database


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
