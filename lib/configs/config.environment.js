/*
 # config.environment.js
 # Environment Config
 */

/**
 # Module Dependencies
 */

const express = require('express');

/**
 # Configuration Methods
 */

const getCORSConfig = () => {
  const clientUrl = process.env.CLIENT_URL;
  const corsUrls = process.env.CORS_URLS || [];

  return corsUrls !== '*' ? [clientUrl, ...corsUrls] : ['*'];
};

const getConfig = async () => ({
  env: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 8080,
  clientUrl: process.env.CLIENT_URL, // Replace this with array of CORS URLs
  corsUrls: getCORSConfig(),
  app: express(),
});

/**
 # Module Exports
 */

module.exports = getConfig;
