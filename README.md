# P5 PoseNet Playback

This is an example of a sketch that accepts poses either from PoseNet, or from a
JSON file that was created by [P5 PoseNet
Recorder](https://github.com/osteele/p5pose-recorder).

You can try it out online [here](https://osteele.github.io/p5pose-playback/).

To create PoseNet files for it, run [P5 PoseNet
Recorder](https://github.com/osteele/p5pose-recorder) to create some JSON pose
files. You can use the online version of [P5 PoseNet
Recorder](https://osteele.github.io/p5pose-recorder/) for this.

Move the files into the `assets` directory in this folder, and optionally rename
them. Modify the array that is used as an argument to `loadPoseFiles()` on lines
6–8 to specify the paths of the pose files.

Once this is done, you can run the sketch as normal. The menu can be used to
switch between the webcam, and the recorded poses.

To use in your own sketch:

1. Copy pose JSON files into your own project.
2. Add a call to `loadPoseFiles()` to your `preload()` function. If your sketch
   does not have a `preload()` function, copy the one from `sketch.js` in this
   project instead.
3. Modify the arguments to `loadPoseFiles()`, as specified above.
4. Find the line is `sketch.js` that begins with:
   ```
   /** Copy the code from here to the end of the file
   ```
   Copy the `index.html` file, from this line to the end of the file, into your
   sketch.
