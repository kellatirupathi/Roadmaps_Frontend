// client/src/services/roadmapService.js
import api from './api';

/**
 * Save roadmap metadata to the database
 * @param {Object} metadata - Roadmap metadata
 * @param {string} metadata.companyName - Company name
 * @param {string} metadata.role - Role name
 * @param {Array} metadata.techStacks - Array of tech stack names
 * @param {string} metadata.publishedUrl - URL of the published roadmap
 * @param {string} metadata.filename - HTML filename
 * @param {string} metadata.createdDate - Creation date
 * @param {boolean} metadata.isConsolidated - Whether this is a consolidated roadmap
 * @param {Array} metadata.roles - Array of role objects for consolidated roadmaps
 * @returns {Promise} - The API response
 */
export const saveRoadmapMetadata = async (metadata) => {
  return api.post('/roadmaps', metadata);
};

/**
 * Get all saved roadmaps
 * @returns {Promise} - The API response with all roadmaps
 */
export const getAllRoadmaps = async () => {
  return api.get('/roadmaps');
};

/**
 * Get a specific roadmap by ID
 * @param {string} id - The roadmap ID
 * @returns {Promise} - The API response with the roadmap
 */
export const getRoadmapById = async (id) => {
  return api.get(`/roadmaps/${id}`);
};

/**
 * Delete a roadmap
 * @param {string} id - The roadmap ID
 * @returns {Promise} - The API response
 */
export const deleteRoadmap = async (id) => {
  return api.delete(`/roadmaps/${id}`);
};

/**
 * Get consolidated roadmaps
 * @returns {Promise} - The API response with consolidated roadmaps
 */
export const getConsolidatedRoadmaps = async () => {
  return api.get('/roadmaps/consolidated');
};

/**
 * Get roadmaps by role
 * @param {string} role - The role to filter by
 * @returns {Promise} - The API response with filtered roadmaps
 */
export const getRoadmapsByRole = async (role) => {
  return api.get(`/roadmaps/role/${role}`);
};