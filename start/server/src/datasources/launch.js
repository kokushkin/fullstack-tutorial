const axios = require('axios');

const baseURL = 'https://api.spacexdata.com/v2/launches';

class LaunchAPI  {

    async getAllLaunches() {
      const resp = await axios.get(baseURL);
        return Array.isArray(resp.data)
          ? resp.data.map(launch => this.launchReducer(launch))
          : [];
      }
    
    launchReducer(launch) {
        return {
            id: launch.flight_number || 0,
            cursor: `${launch.launch_date_unix}`,
            site: launch.launch_site && launch.launch_site.site_name,
            mission: {
              name: launch.mission_name,
              missionPatchSmall: launch.links.mission_patch_small,
              missionPatchLarge: launch.links.mission_patch,
            },
            rocket: {
              id: launch.rocket.rocket_id,
              name: launch.rocket.rocket_name,
              type: launch.rocket.rocket_type,
            },
        };
    }

    async getLaunchById({ launchId }) {
        const response = await axios.get(baseURL, { flight_number: launchId });
        return this.launchReducer(response.data[0]);
      }
      
    getLaunchesByIds({ launchIds }) {
        return Promise.all(
          launchIds.map(launchId => this.getLaunchById({ launchId })),
        );
      }
}

module.exports = LaunchAPI;