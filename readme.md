## Lachesis

Lachesis is a simple timer queue server using NodeJS and MongoDB for persistence.

### Usage

* Requests can be sent to Lachesis to create / read / update / delete timers through a REST API.
* Timers are evaluated locally in a queue on the server and stored for persistence in MongoDB.
* On expiration, a timer will send a callback containing a data payload to a URL indicated in it's creation.

### Limitations and Future Improvements

* Currently timers only fire their callback once, which can cause issues if the reciever is not online. The timer model already contains fields to track metrics on redemption attempts. Future versions will address this issue.
* Only CORS is used for authentication. Lachesis assumes that any valid traffic is trusted. Authentication should be performed on another layer.
* No current filtering capability. All timers are treated equally by the queue.

## Installation

Run:

```
touch .env
npm install
npm run start
```

### Environment Variables

Lachesis looks for the environment variables below in an .env file in the app's root directory:

#### Basics

```
PORT              // Port for the http Server, Passed to Express.
CORS_URLS         // An array of URLS which should be enabled for CORS. Will enable CORS universally if set to '*'
```

#### Databases

Lachesis requires a connection to MongoDB to store timers persistently. Credentials to connect to the database must be provided in one of the following ways:

```
MONGODB {         // An optional JSON object containing redis credentials.
  "url"           // URL of the mongoDB database.
}

MONGODB_URL       // A URL to a mongoDB database.
MONGODB_URI       // A URL to a mongoDB database.
PROD_MONGODB      // A URL to a mongoDB database. This value is populated by Heroku's Mongo Lab addon.

```

## API

### Create

To **CREATE** send a **POST** request to the `/timer` route.

Supported Parameters:
```
{
  startTS          // The timestamp that the timer should begin at. Will default to Date.now()
  endTS           // The timestamp that the timer should expire at. This is required if duration is not set.
  duration        // The duration of the timer. Setting this will automatically set the endTS based off of the startTS + duration.
  durationType    // The time unit of the duration - seconds 's', or milliseconds 'ms'. Defaults to 's' (seconds).
  payload         // An object containing data to be returned when the timer expires.
  callback        // The callback URL. The payload will be sent back with a POST request when the timer expires.
}

```

### Create

To **CREATE** send a **POST** request to the `/timer` route.
This will return the created timer with it's id.

Supported Parameters:
```
{
  startTS         // The timestamp that the timer should begin at. Will default to Date.now()
  endTS           // The timestamp that the timer should expire at. This is required if duration is not set.
  duration        // The duration of the timer. Setting this will automatically set the endTS based off of the startTS + duration.
  durationType    // The time unit of the duration - seconds 's', or milliseconds 'ms'. Defaults to 's' (seconds).
  payload         // An object containing data to be returned when the timer expires.
  callback        // The callback URL. The payload will be sent back with a POST request when the timer expires.
}
```

### Read

To **READ** send a **GET** request to the `/timer/:id` route.
This will return the timer and it's associated metadata.


### Update

To **UPDATE** send a **PATCH** request to the `/timer/:id` route.
This will return the updated timer.

Supported Parameters:
```
{
  startTS         // The timestamp that the timer should begin at. Will default to Date.now()
  endTS           // The timestamp that the timer should expire at. This is required if duration is not set.
  adjust          // An amount of time to adjust the timer by. This can be used to add or subtract remaining time from the timer.
  duration        // The duration of the timer. Setting this will automatically set the endTS based off of the startTS + duration.
  durationType    // The time unit of the duration or the adjust interval - seconds 's', or milliseconds 'ms'. Defaults to 's' (seconds).
  payload         // An object containing data to be returned when the timer expires.
  callback        // The callback URL. The payload will be sent back with a POST request when the timer expires.
}

```

### Delete

To **DELETE** send a **DELETE** request to the `/timer/:id` route.

This will return the deleted timer. The timer will be deleted immediately and it's callback will NOT be fired.
