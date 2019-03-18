const ESC = '\u001b['

export const output1 = `
${ESC}36m[Info]${ESC}39m    Starting build for screen
${ESC}36m[Info]${ESC}39m    Dashboard link: https://dashboard.balena-cloud.com/apps/12345/devices
${ESC}36m[Info]${ESC}39m    Running locally emulated build
${ESC}36m[Info]${ESC}39m    Pulling previous images for caching purposes...
${ESC}32m[Success]${ESC}39m  Successfully pulled cache images
${ESC}34m[Build]${ESC}39m  Step 1/7 : FROM balena/raspberrypi3-node:6-slim
${ESC}34m[Build]${ESC}39m   ---> abb7202dab50
${ESC}34m[Build]${ESC}39m  Step 2/7 : WORKDIR /usr/src/app
${ESC}34m[Build]${ESC}39m  [42m[30mUsing cache[39m[49m
${ESC}34m[Build]${ESC}39m   ---> 756c9c81d7e7
${ESC}34m[Build]${ESC}39m  Step 3/7 : COPY package.json package.json
${ESC}34m[Build]${ESC}39m   ---> addc8961d05e
${ESC}34m[Build]${ESC}39m  Removing intermediate container 5dccdcbb8f77
${ESC}34m[Build]${ESC}39m  Step 4/7 : RUN JOBS=MAX npm install --production --unsafe-perm && npm cache clean && rm -rf /tmp/*
${ESC}34m[Build]${ESC}39m   ---> Running in df1e558e9ce5
${ESC}34m[Build]${ESC}39m  simple-server-node@1.0.0 /usr/src/app
${ESC}34m[Build]${ESC}39m   ---> 2c28743bd61a
${ESC}34m[Build]${ESC}39m  Removing intermediate container df1e558e9ce5
${ESC}34m[Build]${ESC}39m  Step 5/7 : COPY . ./
${ESC}34m[Build]${ESC}39m   ---> c84f859e1f20
${ESC}34m[Build]${ESC}39m  Removing intermediate container 89995d505d04
${ESC}34m[Build]${ESC}39m  Step 6/7 : ENV INITSYSTEM on
${ESC}34m[Build]${ESC}39m   ---> Running in 2ff663998c3b
${ESC}34m[Build]${ESC}39m   ---> 17a7981f50a8
${ESC}34m[Build]${ESC}39m  Removing intermediate container 2ff663998c3b
${ESC}34m[Build]${ESC}39m  Step 7/7 : CMD npm start
${ESC}34m[Build]${ESC}39m   ---> Running in 3bb269cf163a
${ESC}34m[Build]${ESC}39m   ---> 8a6cba65df5a
${ESC}34m[Build]${ESC}39m  Removing intermediate container 3bb269cf163a
${ESC}34m[Build]${ESC}39m  Successfully built 8a6cba65df5a
${ESC}36m[Info]${ESC}39m    Uploading images
${ESC}32m[Success]${ESC}39m  Successfully uploaded images
${ESC}32m[Success]${ESC}39m  Release successfully created!
${ESC}36m[Info]${ESC}39m    ${ESC}90m┌─────────${ESC}39m${ESC}90m┬────────────${ESC}39m${ESC}90m┬────────────┐${ESC}39m
${ESC}36m[Info]${ESC}39m    ${ESC}90m│${ESC}39m ${ESC}1mService${ESC}22m ${ESC}90m│${ESC}39m ${ESC}1mImage Size${ESC}22m ${ESC}90m│${ESC}39m ${ESC}1mBuild Time${ESC}22m ${ESC}90m│${ESC}39m
${ESC}36m[Info]${ESC}39m    ${ESC}90m├─────────${ESC}39m${ESC}90m┼────────────${ESC}39m${ESC}90m┼────────────┤${ESC}39m
${ESC}36m[Info]${ESC}39m    ${ESC}90m│${ESC}39m screen  ${ESC}90m│${ESC}39m 155.94 MB  ${ESC}90m│${ESC}39m 49 seconds ${ESC}90m│${ESC}39m
${ESC}36m[Info]${ESC}39m    ${ESC}90m└─────────${ESC}39m${ESC}90m┴────────────${ESC}39m${ESC}90m┴────────────┘${ESC}39m
${ESC}36m[Info]${ESC}39m    Build finished in 1 minute
`
