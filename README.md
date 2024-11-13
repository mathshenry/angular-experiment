# AngularExperiment

This project implements solution to 2 different problems.

1 - Deadline countdown - a deadline is fetched with the amount of seconds left and the countdown is started.

2 - It checks existing cameras against the cameras requirements, checking if each camera fits the needs of the requirements.

## Test

Testing is not implemented in this project as it was not part of the scope.

## Mock

In order to run it with mocked data, make sure the `mock` property on `environment` used is set to `true`, otherwise the calls will go to the server through the proxy.

## Proxy

This project has a proxy config which is used to proxy requests to the backend.

To run it, first run `npm install` on the root folder, then `npm start`, which will already set the proxy file (please update it according to the server configuration).
