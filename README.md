# Email Scribe

A feature-rich, embeddable email editor (<285kb gzipped), designed for creating modular, email-safe designs. This semi-WYSIWYG editor allows you to build emails using pre-existing template modules, ensuring compatibility across various email clients.
![Email Editor](docs/Primary.png)

## Key Features

- **Import Email Templates**: Parse and import email templates (especially StampReady templates) as modular, editable components.

<div align="center"><img src="docs/AddModules.png" width="500" alt="Add Block"></div>

- **Embeddable SPA**: Completely isolated CSS to prevent conflicts with parent application styles that builds to a single js+css.

- **Export and Import**: Save your work as JSON, import previously saved designs, and save/load from server.

- **Download Safe HTML**: Generate and download sanitized, email-safe HTML.

- **Responsive Preview**: View your design across multiple device sizes (mobile, tablet, PC).

- **Theme Support**: Light/Dark mode that can sync with the parent application (defaults to 'theme-dark' class on body).

- **Mock Express Server**: Includes a mock server for image upload (with resizing), template serving, and preset management.

- **Bulk Settings**: Change overlapping/merged settings for multiple blocks simultaneously.

- **Server-Side Rendering Support**: Enables dynamic content injection via server-side processing.
  - Converts editable fields to placeholders (e.g., `%field_name%`)
  - Wraps blocks in uniquely identified templates
  - Facilitates iterative data population on the server

<div align="center"><img src="docs/SSR.png" width="500" alt="SSR Support"></div>

## How to run

- Clone the repo
- Run `bun i`
- Extract your templates in `Templates` folder
  - The folder structure should be like `Templates/xyzTemplate/` and `index.html` should be inside it alongside any images it needs. They'll be used relatively.
  - Suggested/Tested template: [Matah Responsive Email Set](https://themeforest.net/item/matah-responsive-email-set/10569882)

### Development

- First run `bun run serve` to start the server (for image uploads, template serving, and preset management)
- Then in a new terminal, run `bun run dev`

### Production

- `bun run build` followed by `bun run serve` (or your preferred server).

(All bun commands can be replaced with your preferred package manager/runtime environment)

## API and Server Requirements

The application comes with a mock Express server that handles image uploads, template serving, and preset management. For production use, you'll need to implement similar endpoints:

- `/upload`: POST endpoint for image uploads (with optional resizing)
- `/templates`: GET endpoint to serve email templates
- `/preset`: GET, POST, DELETE endpoints for managing presets
- `/presets`: GET endpoint to list all presets

Refer to the `api/routes` directory and `server.ts` for detailed implementation. The `.env.example` file outlines necessary environment variables:

```
VITE_API_URL=https://your-api-url.com
VITE_BASE_PATH=newsletter-builder
VITE_TEMPLATE_ID=Template1,Template2,Template3
```

(These vars are used for build, client querying as well as mock server)

## Project Structure

The project is a React SPA (Single Page Application) that uses Tanstack Query for data fetching, Zustand for state management, Radix components for UI, Handlebars for templating alognside other minor packages for various tasks.
![Project Structure](docs/ProjectStructure.png)

## Embedding

To embed this SPA in your project, include the compiled JS and CSS files. Ensure your server implements the required API endpoints as described in the API section.
