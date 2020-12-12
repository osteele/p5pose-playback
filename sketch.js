let currentPose;

function preload() {
  loadPoseFiles(
    [
      "assets/standing-pose.json",
      "assets/hands-up-pose.json",
      "assets/hands-out-pose.json"
    ]);
}

function setup() {
  createCanvas(640, 480);
  cam = createCapture(VIDEO);
  cam.size(width, height);

  let poseNet = ml5.poseNet(
    cam,
    { flipHorizontal: true, detectionType: "single" },
    () => select("#status").hide());

  poseNet.on("pose", handlePoses);

  cam.hide();
}

function draw() {
  push();
  translate(cam.width, 0);
  scale(-1, 1);
  image(cam, 0, 0);
  pop();

  if (currentPose) {
    drawKeypoints(currentPose);
    drawSkeleton(currentPose);
  }
}

function drawKeypoints(pose) {
  for (let keypoint of pose.pose.keypoints) {
    if (keypoint.score > 0.2) {
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
    }
  }
}

function drawSkeleton(pose) {
  for (let skeleton of pose.skeleton) {
    let [p1, p2] = skeleton;
    stroke(0, 0, 255);
    line(p1.position.x, p1.position.y, p2.position.x, p2.position.y);
  }
}

/** Copy the code from here to the end of the file to your own sketch. */

let posenetPlaybackManager;

function loadPoseFiles(poseJsonUrls) {
  posenetPlaybackManager = new PlaybackManager();
  posenetPlaybackManager.loadPoseFiles(poseJsonUrls);
}

function handlePoses(poses) {
  if (!posenetPlaybackManager.isPlaying) {
    currentPose = poses[0];
  }
}

class PlaybackManager {
  constructor() {
    this.isPlaying = false;
  }

  loadPoseFiles(poseJsonUrls) {
    const poseNameFromUrl = url => url
      .replace(/.*\//, '')
      .replace(/\.json$/, '')
      .replace(/^pose-|-pose$/g, '');

    this.recordedPoses = poseJsonUrls.map(url => ({
      name: poseNameFromUrl(url),
      data: loadJSON(url),
    }));

    let poseMenu = createSelect();
    poseMenu.position(10, 10);
    poseMenu.option("Camera");
    poseMenu.selected("Camera");
    this.recordedPoses.forEach(({ name }) => poseMenu.option(name));
    poseMenu.changed(() => this.selectPose(poseMenu.value()));
  }

  selectPose(poseName) {
    this.startTime = millis();
    this.record = this.recordedPoses.find(({ name }) => name === poseName);
    this.isPlaying = Boolean(this.record);
    this.index = 0;
    if (this.isPlaying) {
      this.scheduleNextPose();
    } else if (this.timeoutID) {
      clearTimeout(this.timeoutID);
      this.timeoutID = null;
    }
  }

  scheduleNextPose() {
    let pose = this.getNextPose();
    if (pose) {
      this.timeoutID = setTimeout(() => {
        this.timeoutID = null;
        this.scheduleNextPose();
        currentPose = pose;
      }, this.startTime + pose.timestamp - millis());
    }
  }

  getNextPose() {
    let ms = millis() - this.startTime;
    let poses = this.record.data.poses;
    for (let i = this.index; i < poses.length; i++) {
      this.index = i;
      let pose = poses[i];
      if (pose.timestamp >= ms) {
        return pose;
      }
    }
    if (this.loop) {
      this.index = 0;
      return poses[0];
    }
    return null;
  }
}
