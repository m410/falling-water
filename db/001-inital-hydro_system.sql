-- Init script to create the `hydro_system` table
-- Run with: psql -h 127.0.0.1 -d "falling_water" -U fallingwater -f db/init-hydro_system.sql

CREATE TABLE IF NOT EXISTS hydro_system (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'offline',
    flow_rate DECIMAL(10,3) DEFAULT 0.0,
    capacity DECIMAL(10,3),
    settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Optional index for lookups by status
CREATE INDEX IF NOT EXISTS idx_hydro_system_status ON hydro_system(status);
