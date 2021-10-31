const streamMediaVideoElement = document.getElementById("stream-media");
const startMediaButton = document.getElementById("start-media");
const buttonText = document.getElementById("button-text");

const stopTracks = () => {
  if (streamMediaVideoElement.srcObject) {
    streamMediaVideoElement.srcObject
      .getTracks()
      ?.forEach((track) => track.stop());
  }
};

const setMediaToDefault = () => {
  stopTracks();
  streamMediaVideoElement.srcObject = null;
  buttonText.innerText = "Start";
};

const selectMediaStream = async () => {
  try {
    const media = await navigator.mediaDevices.getDisplayMedia();
    streamMediaVideoElement.srcObject = media;
    streamMediaVideoElement.onloadedmetadata = () => {
      streamMediaVideoElement.play();
      buttonText.innerText = "Show";
    };

    streamMediaVideoElement.addEventListener("leavepictureinpicture", () => {
      setMediaToDefault();
    });

    streamMediaVideoElement.addEventListener("suspend", () => {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        setMediaToDefault();
      }
    });
  } catch (error) {
    console.log("Error:", error);
    buttonText.innerText = "Start";
  }
};

startMediaButton.addEventListener("click", async () => {
  if (
    !streamMediaVideoElement.srcObject ||
    !streamMediaVideoElement.srcObject?.active
  ) {
    selectMediaStream();
    return;
  }

  startMediaButton.disabled = true;
  try {
    await streamMediaVideoElement.requestPictureInPicture();
  } catch (error) {
    console.log("Error:", error);
  }
  startMediaButton.disabled = false;
});

selectMediaStream();
