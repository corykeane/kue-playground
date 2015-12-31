## Kue Playground


### start the web UI

```js
DEBUG=* npm start
```

Start one or more of a worker type

```js
node emailworker.js
node heavyworker.js
```

run a producer to product `N` number of jobs

```js
node email 1000
node heavy 10
node fail 2
node priority 3
```
