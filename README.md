# Mushaf Ali Portfolio

A responsive personal portfolio built with plain HTML, CSS, and JavaScript. The homepage introduces Mushaf Ali; About, Activities, Skills, Tools, Projects, Services, and Contact each have a dedicated page. The shared theme selector and AI chatbot are available throughout the site.

## Pages

- `index.html` — Home
- `about.html` — Education, interests, and vision
- `activities.html` — Community and leadership roles
- `skills.html` — Programming, AI, machine learning, and generative AI
- `tools.html` — Frameworks, libraries, development tools, and technologies
- `projects.html` — Featured projects and repositories
- `services.html` — Services and inquiry links
- `contact.html` — Contact details and disabled contact form

## Run locally

Open `index.html` directly, or serve the project directory with a static web server such as the VS Code Live Server extension. No build step or package installation is required.

## Hosting

The root `CNAME` file is configured for the custom domain `mushafali.live`. The Git remote points to `mushafmirdev/mushaf-portfolio-ai` on the `main` branch. This checkout does not include a Pages workflow or build configuration, so confirm the publishing source in the repository's GitHub Pages settings. The intended site URLs are:

- https://mushafali.live/
- https://mushafali.live/about.html
- https://mushafali.live/activities.html
- https://mushafali.live/skills.html
- https://mushafali.live/tools.html
- https://mushafali.live/projects.html
- https://mushafali.live/services.html
- https://mushafali.live/contact.html

The deployed branch is `main`.

## Theme

The site follows the visitor's operating-system color preference by default. The navigation menu allows choosing System, Light, or Dark; explicit choices are stored in browser local storage.

## AI assistant

`chatbot.js` sends the visitor's message, an ISO timestamp, and a locally generated user ID to the configured n8n webhook. The webhook must be online and allow browser requests from the deployed site. The current URL uses an ngrok free domain, which may change or become unavailable; update `webhookUrl` in `chatbot.js` if the endpoint changes. No API key is included in the frontend.

## Contact form

The contact form is intentionally disabled because this static site has no message-processing backend. Visitors can use the direct email link instead.
