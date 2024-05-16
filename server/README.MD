# MP4 to HLS Conversion with Custom Headers

```.
├── index.html --> frontend
├── mp4-to-hls
│   ├── convert.js --> run to convert the input
│   └── input.mp4
├── package.json
├── package-lock.json
└── server.js --> server
```

## Install packages

Please, use

```
npm ci
```

And dont mess up with `package-lock.json`

## How to run it

1. First, convert the video

```
node mp4-to-hls/convert.js
```

This will convert `input.mp4` to `mp4-to-hls/hls-ouput`
The HLS format contains some specific configurations. It basically breaks the `.mp4` into a `m3u8` file, which serves as a playlist for the client and provides information about the segments of the video.

**_you need to use `ctrl+c` to end the conversion process_**

2. Then, run the server

```
node server.js
```

3. Finally, open the `index.html` file. You can use a server to serve the file, such as [Live Sever](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
