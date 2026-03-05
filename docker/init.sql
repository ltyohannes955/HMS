-- HMS PostgreSQL initialization script
-- This runs when the container is first created

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create additional databases for testing if needed
-- CREATE DATABASE hms_test;
