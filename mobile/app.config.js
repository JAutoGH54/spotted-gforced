module.exports = ({ config }) => {
  // Find the Mapbox plugin and inject the secret download token from environment variables
  if (config.plugins) {
    config.plugins = config.plugins.map((plugin) => {
      if (Array.isArray(plugin) && plugin[0] === '@rnmapbox/maps') {
        return [
          '@rnmapbox/maps',
          {
            ...plugin[1],
            RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOAD_TOKEN || 'MAPBOX_DOWNLOAD_TOKEN_PLACEHOLDER',
          },
        ];
      }
      return plugin;
    });
  }

  return config;
};
