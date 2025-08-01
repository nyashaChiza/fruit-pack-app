// locationTask.ts (or put at top of your main file)
import * as TaskManager from 'expo-task-manager';
import api from './api';
import { getToken } from './authServices';
import { getDriverDetails } from './userServices';
import { showToast } from "services/toastService";

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    showToast("error",'Error','Background location error');
    return;
  }

  if (data) {
    const { locations } = data;
    const location = locations[0];
    if (!location) return;

    const { latitude, longitude } = location.coords;

    try {
      const token = await getToken();
      const driver = await getDriverDetails(token);

      if (!driver?.id) return;

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await api.post(`/drivers/driver/${driver.id}/location`, { latitude, longitude });

      console.log(`📍 Location shared: ${latitude}, ${longitude}`);
    } catch (err) {
      showToast("error",'Error','Failed to share location in background');
      
    }
  }
});

export { LOCATION_TASK_NAME };
