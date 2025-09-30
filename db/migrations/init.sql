CREATE TABLE startups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    foundedAt DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    fundingAmount DECIMAL(18, 2) NOT NULL
);

CREATE TABLE technologies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(255) NOT NULL,
    description TEXT,
    adoptionLevel VARCHAR(100) NOT NULL
);
