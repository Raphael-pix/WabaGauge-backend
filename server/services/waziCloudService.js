const axios = require('axios');
require('dotenv').config();

const { WAZIUP_API_BASE_URL, WAZIUP_USERNAME, WAZIUP_PASSWORD } = process.env;

let authToken = null;

// Function to authenticate and get the token
async function authenticate() {
  try {
    const response = await axios.post(`${WAZIUP_API_BASE_URL}/auth/token`, {
      username: WAZIUP_USERNAME,
      password: WAZIUP_PASSWORD
    });
    authToken = response;
  } catch (error) {
    console.error('Error authenticating with Waziup:', error);
    throw new Error('Authentication failed');
  }
}

// Function to get the authentication token, refreshing it if necessary
async function getAuthToken() {
  if (!authToken) {
    await authenticate();
  }
  return authToken;
}

// Function to create device
async function createDevice(deviceId) {
  const token = await getAuthToken();
  try{
  const response = await axios.post(`${WAZIUP_API_BASE_URL}/devices`, {
    id: deviceId
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'accept': 'application/json'
    }
  });
  return response.data;
  } catch (error) {
    console.error('Error getting device status from Waziup:', error);
    throw new Error('Failed to get device status');
  }
}
// Function to get device details
async function getDeviceDetails(deviceId) {
  const token = await getAuthToken();
  try {
    const response = await axios.get(`${WAZIUP_API_BASE_URL}/devices/${deviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting device status from Waziup:', error);
    throw new Error('Failed to get device status');
  }
}

// Function to set device status
async function setDeviceStatus(deviceId, status) {
  const token = await getAuthToken();
  try {
    const response = await axios.patch(`${WAZIUP_API_BASE_URL}/devices/${deviceId}`, {
      status
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error setting device status on Waziup:', error);
    throw new Error('Failed to set device status');
  }
}

module.exports = {
  getDeviceDetails,
  setDeviceStatus,
  createDevice
};
