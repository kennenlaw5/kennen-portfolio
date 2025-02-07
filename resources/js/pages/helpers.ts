import axios from 'axios'

const RESUME_URL = 'https://docs.google.com/document/d/14K7hLjViIuXXpuLgtiFRXHqMCbRjiwqoC5CeOnR1uDg/export?format=pdf'
export const downloadResume = async () => {
  try {
    const response = await axios.get(RESUME_URL, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}))
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Kennen Lawrence - Resume.pdf'); // Specify your custom filename here
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error downloading file', error);
  }
};
