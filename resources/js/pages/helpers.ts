import axios from 'axios'
import {ANALYTICS_EVENTS, trackEvent} from 'JS/analytics'

export const downloadResume = async () => {
  try {
    const response = await axios.get(window.APP_CONFIG.resume_url, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}))
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Kennen Lawrence - Resume.pdf'); // Specify your custom filename here
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url)
    trackEvent(ANALYTICS_EVENTS.RESUME_DOWNLOAD)
  } catch (error) {
    console.error('Error downloading file', error);
  }
};
