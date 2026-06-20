-- P2W INTERPLUS — Influencer Platform Schema

-- ตาราง Creator (คนหางาน)
CREATE TABLE IF NOT EXISTS creators (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    phone       VARCHAR(20),
    password    VARCHAR(255) NOT NULL,
    platforms   TEXT[],                         -- ['instagram','tiktok','youtube']
    followers   VARCHAR(50),                    -- '10K-50K'
    category    VARCHAR(100),                   -- 'food', 'tech', 'lifestyle'
    status      VARCHAR(20) DEFAULT 'pending',  -- pending | approved | rejected
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ตาราง Jobs (งานที่ P2W โพสต์)
CREATE TABLE IF NOT EXISTS jobs (
    id              SERIAL PRIMARY KEY,
    code            VARCHAR(20) UNIQUE NOT NULL,  -- P2W-001, P2W-002
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    content_type    TEXT[],                        -- ['photo','video','reel']
    duration        VARCHAR(100),                  -- '30 วินาที - 1 นาที'
    deadline        DATE,
    location        VARCHAR(200),
    channels        TEXT[],                        -- ['instagram','tiktok']
    budget          VARCHAR(100),                  -- '500-1000 บาท'
    requirements    TEXT,
    contact_note    TEXT,
    status          VARCHAR(30) DEFAULT 'open',
    -- open | urgent | very_urgent | taken | completed | cancelled
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- Index สำหรับ query เร็วขึ้น
CREATE INDEX IF NOT EXISTS idx_creators_status ON creators(status);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_code ON jobs(code);
