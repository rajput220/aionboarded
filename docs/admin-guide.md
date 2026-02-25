# Admin Guide — AI Onboarded CMS

## Accessing the Admin Panel

Navigate to `/admin` on your site (e.g., `https://aionboarded.ai/admin`).

Log in with your admin credentials. First-time setup uses: `admin@aionboarded.ai` / `admin123!`

> **Change the default password immediately** via the admin panel: click your avatar → Account → change password.

## Roles

| Role | Permissions |
|---|---|
| **Admin** | Full access: create, edit, delete all content. Manage users. |
| **Editor** | Create and edit content. Cannot delete or manage users. |

## Publishing Content

### Blog Post

1. Go to **Content → Blog Posts → Create New**
2. Fill in:
   - **Title** — the headline
   - **Slug** — auto-generated from title (editable)
   - **Excerpt** — short summary (max 300 chars, used in cards and SEO)
   - **Content** — use the rich text editor
   - **Hero Image** — upload or select from media library
3. In the sidebar:
   - Select **Author**, **Categories**, **Tags**
   - Set **Status** to "Published"
   - Set **Published At** date
4. Click **Save**

Reading time is auto-calculated from content.

### Podcast Episode

1. Go to **Content → Podcast Episodes → Create New**
2. Fill in:
   - **Title**, **Slug**, **Description**
   - **Episode Number** and **Season Number**
   - **Audio Sources** tab: upload audio file OR paste Spotify/Apple/YouTube URLs
   - **Show Notes** — rich text
   - **Transcript** tab — optional
3. In the sidebar: set duration, hosts, tags, status, publish date
4. Click **Save**

### Newsletter Issue

1. Go to **Content → Newsletter Issues → Create New**
2. Fill in:
   - **Title**, **Slug**, **Issue Number** (increment from last)
   - **Excerpt** — preview text
   - **Content** — the full newsletter
3. Set status to "Published" and date
4. Click **Save**

### News Item

1. Go to **Content → News Items → Create New**
2. Fill in:
   - **Title**, **Slug**, **Excerpt**, **Content**
   - **Source URL** — link to original article
   - **Source Name** — publication name (e.g., "TechCrunch")
3. Check **Featured** to include in "Top 5 This Week"
4. Set status and date, click **Save**

## Managing Tags & Categories

- **Tags** are shared across all content types
- **Categories** are used only for blog posts
- Both auto-generate slugs from names
- Create them ahead of time, or as needed when publishing

## Managing Subscribers

1. Go to **Newsletter → Subscribers**
2. View all subscribers and their confirmation status
3. Only confirmed subscribers (green checkmark) have completed double opt-in

## Uploading Media

1. Go to **Media → Upload**
2. Upload images or audio files
3. Images are automatically optimized to three sizes: thumbnail (300px), card (768px), hero (1920px)
4. Always fill in the **Alt Text** for accessibility

## Draft / Publish Workflow

All content types support draft/publish:
- **Draft** — only visible to logged-in admin/editor users
- **Published** — visible to everyone on the public site

To unpublish content, change status back to "Draft" and save.

## SEO

Blog posts and pages have optional **SEO** fields:
- **Meta Title** — overrides the default title tag (max 70 chars)
- **Meta Description** — overrides the excerpt for search results (max 160 chars)
- **OG Image** — custom social sharing image

If left blank, the system uses the post title, excerpt, and hero image automatically.
