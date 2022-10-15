export const setPlayback = async (spotifyUser) => {
  const devices = await spotifyUser.getMyDevices().catch((e) => console.log(e));

  if (devices?.body?.devices?.length === 0) {
    return {
      status: 400,
      body: {
        title: 'Could not play',
        message: 'No devices found',
      },
    };
  }

  const playback = await spotifyUser
    .getMyCurrentPlaybackState()
    .catch((e) => console.log(e));

  if (playback?.statusCode === 200 || playback?.statusCode === 204) {
    // if (devices?.body.devices.length === 1) {
    await spotifyUser
      .transferMyPlayback([devices?.body?.devices[0]?.id ?? ''])
      .catch((e) => console.log(e));
    // }

    return { status: 204 };
  }

  return {
    status: 400,
    body: {
      title: 'Could not play',
      message: 'Uknown error',
    },
  };
};
