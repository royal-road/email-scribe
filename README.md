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

<!-- <div align="center"><img src="docs/SSR.png" width="500" alt="SSR Support"></div> -->

## Using as a React Component

Info: This is the client-side aspect of the editor. At the very least, you'll need to implement a server that serves templates and handles image uploads (A fully functional example server is included in git repo of the project, check next section for more details).

```jsx
import { EmailScribe } from 'email-scribe';
function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <EmailScribe
        apiUrl='http://localhost:3002'
        basePath='email-scribe'
        templatesToFetch={['Boxed-01', 'Promotion-01', 'All-in-one']}
        iconComponent={<img src='./assets/someLogo.png' />}
        title='Embedded Email Scribe'
      />
    </div>
  );
}
```

### Props

| Prop             | Description                                         | Optional |
| ---------------- | --------------------------------------------------- | -------- |
| apiUrl           | API calls start with this url                       | No       |
| basePath         | API calls become: `apiUrl/basePath/route`           | No       |
| templatesToFetch | Array of template names to fetch (purchased by you) | No       |
| iconComponent    | Custom icon component. Can be React Node.           | Yes      |
| title            | Title for the editor                                | Yes      |

## API and Server Requirements

The application comes with an Express server that handles image uploads, template serving, and preset management. For production use, you'll need to implement similar endpoints:

- `/upload`: POST endpoint for image uploads (with optional resizing)
- `/templates`: GET endpoint to serve email templates
- `/preset`: GET, POST, DELETE endpoints for managing presets (can be ignored if not needed)
- `/presets`: GET endpoint to list all presets (same as above)

Refer to the [server](https://github.com/royal-road/email-scribe/tree/main/server) directory and [server.ts](https://github.com/royal-road/email-scribe/blob/main/server/server.ts) for detailed implementation. Note the `.env.example` file for defaults.

## Using as a Standalone Application/Static build

### Setup

- Clone the [repo](https://github.com/royal-road/email-scribe)
- Run `bun i` in root as well as in server directory.
- Extract your templates in `server/Templates` folder.
  - The folder structure should be like `server/Templates/xyzTemplate/` and `index.html` should be inside it alongside any resources embedded into templates placed relatively.
  - Suggested/Tested template: [Matah Responsive Email Set](https://themeforest.net/item/matah-responsive-email-set/10569882).
- Copy .env.example to .env and adjust as needed.

### Development

- First cd into server and run `bun run serve` to start the server (for image uploads, template serving, and preset management)
- Then in a new terminal in root directory, run `bun run dev`

### Production

- `bun run build:static` followed by `bun run serve` in server directory (or use your preferred compatible server implementation).
- To embed this SPA in your project, include the compiled JS and CSS files in your projects.

(All bun commands can be replaced with your preferred package manager/runtime environment)

## Project Structure

The project is a React SPA (Single Page Application) that uses Tanstack Query for data fetching, Zustand for state management, Radix components for UI, Handlebars for templating alognside other minor packages for various tasks.
![Project Structure](docs/ProjectStructure.png)
