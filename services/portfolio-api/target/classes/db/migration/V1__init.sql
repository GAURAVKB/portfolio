CREATE TABLE admin_users (
    id         BIGSERIAL PRIMARY KEY,
    username   VARCHAR(50)  UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE projects (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    tech_stack  VARCHAR(500),
    github_url  VARCHAR(500),
    demo_url    VARCHAR(500),
    image_url   VARCHAR(500),
    featured    BOOLEAN      DEFAULT FALSE,
    sort_order  INTEGER      DEFAULT 0,
    created_at  TIMESTAMPTZ  DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE skills (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    category    VARCHAR(100),
    proficiency INTEGER      CHECK (proficiency BETWEEN 0 AND 100),
    icon_class  VARCHAR(100),
    sort_order  INTEGER      DEFAULT 0
);

CREATE TABLE blog_posts (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(500) NOT NULL,
    slug            VARCHAR(500) UNIQUE NOT NULL,
    content         TEXT,
    excerpt         TEXT,
    cover_image_url VARCHAR(500),
    published       BOOLEAN     DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE testimonials (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    role       VARCHAR(255),
    company    VARCHAR(255),
    content    TEXT         NOT NULL,
    avatar_url VARCHAR(500),
    visible    BOOLEAN      DEFAULT TRUE
);

CREATE TABLE contacts (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    subject    VARCHAR(500),
    message    TEXT         NOT NULL,
    read       BOOLEAN      DEFAULT FALSE,
    created_at TIMESTAMPTZ  DEFAULT NOW()
);

-- Admin user is created programmatically by DataInitializer.java on first startup
-- This ensures the bcrypt hash is always generated correctly by Spring Security
