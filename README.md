# Email Scribe

A feature-rich, embeddable email editor (<250kb gzipped), designed for creating modular, email-safe designs. This semi-WYSIWYG editor allows you to build emails using pre-existing template modules, ensuring compatibility across various email clients.
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

Certainly! I'll update the README to include the new props and example. Here's an updated version of the README section:

## Using as a React Component

Info: This is the client-side aspect of the editor. At the very least, you'll need to implement a server that serves templates and handles image uploads (A fully functional example server is included in git repo of the project, check next section for more details).

```jsx
import { EmailScribe, PresetMode } from 'email-scribe';
import { Save } from 'lucide-react';

function App() {
  return (
    <EmailScribe
      apiUrl={import.meta.env.VITE_API_URL}
      basePath={import.meta.env.VITE_BASE_PATH}
      templatesToFetch={import.meta.env.VITE_TEMPLATE_ID.split(',')}
      ctaOne={{
        label: 'Download Preset Json',
        icon: <Save />,
        action: (subject, id, plainText, html, preset) => {
          stringtoJsonDownload(preset, 'preset.json');
        },
        hidden: false,
      }}
      ctaTwo={{ hidden: true }}
      presetMode={PresetMode.Default}
      preloadPreset={JSON.stringify(presetTest)}
    />
  );
}

function stringtoJsonDownload(data: string, filename: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
  a.download = filename;
  a.click();
}
```

### Props

| Prop             | Description                                         | Type       | Optional |
| ---------------- | --------------------------------------------------- | ---------- | -------- |
| apiUrl           | API calls start with this url                       | string     | No       |
| basePath         | API calls become: `apiUrl/basePath/route`           | string     | No       |
| templatesToFetch | Array of template names to fetch (purchased by you) | string[]   | No       |
| iconComponent    | Custom icon component. Can be React Node.           | ReactNode  | Yes      |
| title            | Title for the editor                                | string     | Yes      |
| preloadPreset    | Preset to load initially                            | string     | Yes      |
| presetMode       | Mode for preset handling                            | PresetMode | Yes      |
| ctaOne           | Configuration for the first CTA button              | CTAProps   | Yes      |
| ctaTwo           | Configuration for the second CTA button             | CTAProps   | Yes      |

### CTAProps

| Prop   | Description                                    | Type                                                                                   | Optional |
| ------ | ---------------------------------------------- | -------------------------------------------------------------------------------------- | -------- |
| label  | Label for the CTA button                       | string                                                                                 | Yes      |
| icon   | Icon component for the CTA button              | ReactNode                                                                              | Yes      |
| action | Function to execute when CTA button is clicked | (subject: string, id: string, plainText: string, html: string, preset: string) => void | Yes      |
| hidden | Whether to hide the CTA button                 | boolean                                                                                | Yes      |

Action parameters can be used to extract all useful data from the editor to be used in your application.

### PresetMode

An enum with the following values:

- `PresetMode.Default`
- `PresetMode.LocalOnly`
- `PresetMode.RemoteOnly`

## API and Server Requirements

The application comes with an Express server that handles image uploads, template serving, and preset management. For production use, you'll need to implement similar endpoints:

- `/upload`: POST endpoint for image uploads (with optional resizing)
- `/templates`: GET endpoint to serve email templates
- `/preset`: GET, POST, DELETE endpoints for managing presets (can be ignored if not needed)
- `/presets`: GET endpoint to list all presets (same as above)

Refer to the [server](https://github.com/royal-road/email-scribe/tree/main/server) directory and [server.ts](https://github.com/royal-road/email-scribe/blob/main/server/server.ts) for detailed implementation. Note the `.env.example` file for defaults.

## Using as a Standalone Application/Static build

### Setup

Note: All bun commands can be replaced with your preferred package manager/runtime environment

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

## Project Structure

The project is a React SPA (Single Page Application) that uses Tanstack Query for data fetching, Zustand for state management, Radix components for UI, Handlebars for templating alognside other minor packages for various tasks.
![Project Structure](docs/ProjectStructure.png)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
