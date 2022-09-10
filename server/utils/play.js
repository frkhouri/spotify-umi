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

export const playEpisode = async (spotifyUser, episodeId, showName) => {
  const playlist = await spotifyUser
    .createPlaylist('Podcast', {
      public: false,
    })
    .catch((e) => {
      console.log(e);
      return {
        status: e.body?.error?.status ?? 400,
        body: {
          title: 'Could not play',
          message: e.body?.error?.message,
        },
      };
    });

  await spotifyUser
    .addTracksToPlaylist(playlist.body.id, [`spotify:episode:${episodeId}`])
    .catch((e) => {
      console.log(e);
      return {
        status: e.body?.error?.status ?? 400,
        body: {
          title: 'Could not play',
          message: e.body?.error?.message,
        },
      };
    });

  await spotifyUser
    .play({ context_uri: `spotify:playlist:${playlist.body.id}` })
    .catch((e) => {
      console.log(e);
      return {
        status: e.body?.error?.status ?? 400,
        body: {
          title: 'Could not play',
          message: e.body?.error?.message,
        },
      };
    });

  await spotifyUser.unfollowPlaylist(playlist.body.id).catch((e) => {
    console.log(e);
    return {
      status: e.body?.error?.status ?? 400,
      body: {
        title: 'Could not play',
        message: e.body?.error?.message,
      },
    };
  });

  return {
    status: 204,
  };
};
