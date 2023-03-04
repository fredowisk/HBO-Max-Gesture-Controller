const { GestureDescription, Finger, FingerCurl } = window.fp;

const ScrollDownGesture = new GestureDescription("scroll-down"); // ✊️
const ScrollUpGesture = new GestureDescription("scroll-up"); // 🖐
const ClickGesture = new GestureDescription("click"); // 🤏

// Rock
// -----------------------------------------------------------------------------
// thumb: half curled
// accept no curl with a bit lower confidence
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
ScrollDownGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

// all other fingers: curled
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  ScrollDownGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  ScrollDownGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

// Paper
// -----------------------------------------------------------------------------
// no finger should be curled
for (let finger of Finger.all) {
  ScrollUpGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

// Click
// ----------------------------------------------------------------------------

ClickGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
ClickGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.6);

ClickGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 0.6);
ClickGesture.addCurl(Finger.Index, FingerCurl.HalfCurl, 1.0);

for (let finger of [Finger.Middle, Finger.Ring, Finger.Pinky]) {
  ClickGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  ClickGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

const knownGestures = [ScrollDownGesture, ScrollUpGesture, ClickGesture];

export { knownGestures };
