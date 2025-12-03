CREATE TABLE IF NOT EXISTS minecraft_servers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ip VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    players INTEGER DEFAULT 0,
    max_players INTEGER DEFAULT 100,
    version VARCHAR(50),
    is_online BOOLEAN DEFAULT true,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_servers_added_at ON minecraft_servers(added_at DESC);
CREATE INDEX idx_servers_players ON minecraft_servers(players DESC);