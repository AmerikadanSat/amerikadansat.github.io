# AGENTS.md

## Project

AmerikadanSat website (`https://amerikadansat.com`).

The website uses [**Eta.js**](https://eta.js.org/) as its templating engine and [**Bun**](https://bun.com/) as its JavaScript runtime, package manager, and test runner.

### Project structure

- `/pages/` — All website page templates and template content files.
- `/layout/` — Shared page layouts and layout templates.
- `/docs/` — GitHub Pages deployment output, served from the `website` branch.

### Templating conventions

- Use Eta.js for all server-side HTML templating.
- Follow the existing Eta syntax and conventions.
- Keep page-specific content and templates under `/pages/`.
- Keep shared layouts and reusable layout templates under `/layout/`.
- Reuse existing layouts and partials instead of duplicating markup.
- Keep templates maintainable, modular, and consistent across the website.
- Do not introduce another templating engine or frontend framework without explicit approval.
- Consult the [Eta.js documentation](https://eta.js.org/) when working with template syntax, configuration, or rendering.

## Git Workflow

Every task must follow this workflow.

### 1. Create a task branch

Before making any changes, create a new branch from the appropriate base branch.

Use the following naming convention:

`as###-task-description`

Examples:

- `as001-update-homepage`
- `as002-fix-navigation`
- `as003-add-contact-page`
- `as004-refactor-layouts`

Replace `###` with the assigned or next available task number. Use lowercase kebab-case for the task description.

Never work directly on `main` or `website`.

### 2. Implement and verify

- Make all changes on the task branch.
- Follow the project's existing conventions and architecture.
- Run relevant tests and verification commands.
- Review your changes and ensure no unrelated modifications are included.

### 3. Generate website content

Before opening a pull request, regenerate the website content:

bash

```
bun run generate
```

- Always run this command after completing implementation changes.
- This generates the latest website content in `/docs/`.
- Ensure the generated `/docs/` content is included in the task branch.
- Review the generated files for unexpected changes or errors.
- Do not manually edit generated files in `/docs/` unless explicitly required.
- If generation fails, investigate and resolve the issue before proceeding.

### 4. Push and open a pull request

Once implementation, testing, and content generation are complete:

- Push the task branch to the remote repository, including generated `/docs/` changes.
- Open a GitHub pull request targeting the `website` branch.
- Provide a descriptive title and summary.
- Include relevant implementation details and testing performed.
- Do not merge the pull request unless explicitly instructed.

The `website` branch is the target for all task pull requests.

## Runtime & Package Management

**Always prefer Bun over Node.js and other JavaScript package managers.**

Use Bun equivalents instead of Node.js, npm, Yarn, pnpm, or npx.

|Preferred|Avoid|
|---|---|
|`bun <file>`|`node <file>` / `ts-node <file>`|
|`bun test`|`jest` / `vitest`|
|`bun build <file.html\|file.ts\|file.css>`|`webpack` / `esbuild`|
|`bun install`|`npm install` / `yarn install` / `pnpm install`|
|`bun run <script>`|`npm run` / `yarn run` / `pnpm run`|
|`bunx <package> <command>`|`npx <package> <command>`|

Additional conventions:

- Use Bun for scripts, dependencies, builds, and tests.
- Bun automatically loads `.env` files. Do not add or use `dotenv`.
- Prefer built-in Bun APIs over third-party Node.js packages.
- Do not introduce alternative runtimes or package managers without explicit approval.

## APIs & Built-in Features

Prefer Bun's native APIs instead of external dependencies.

|Purpose|Preferred|Avoid|
|---|---|---|
|HTTP server|`Bun.serve()`|`express`|
|SQLite|`bun:sqlite`|`better-sqlite3`|
|Redis|`Bun.redis`|`ioredis`|
|PostgreSQL|`Bun.sql`|`pg` / `postgres.js`|
|WebSockets|Built-in `WebSocket`|`ws`|
|File operations|`Bun.file`|`node:fs` readFile/writeFile|
|Shell commands|`Bun.$`|`execa`|

Before installing a dependency, check whether Bun or the standard runtime already provides the required functionality.

## Testing

Use Bun's built-in test runner.

Run all tests with:

bash

```
bun test
```

Example test:

ts

```
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

Testing conventions:

- Write tests using `bun:test`.
- Run relevant tests after making changes.
- Add tests for new functionality where appropriate.
- Do not introduce Jest or Vitest.
- Ensure existing tests continue to pass.

## Development Guidelines

- Follow the existing project structure.
- Use Eta.js for HTML templating.
- Keep all page templates and content in `/pages/`.
- Keep shared layouts in `/layout/`.
- Prefer reusable components and layouts over duplicated code.
- Use semantic HTML and accessible markup.
- Follow existing CSS and JavaScript conventions.
- Avoid unnecessary dependencies.
- Keep changes focused on the assigned task.
- Do not modify deployment configuration or unrelated infrastructure unless required by the task.

## Deployment

The website is deployed through GitHub Pages.

- Deployment output is served from `/docs/` on the `website` branch.
- All completed task branches must target `website` through a pull request.
- Do not assume deployment has occurred simply because a pull request was opened.
- Do not modify the deployment process without explicit requirements.

## General Agent Instructions

1. Read the existing implementation before making changes.
2. Create the required task branch before editing files.
3. Follow the Eta.js and Bun conventions described in this document.
4. Prefer existing project utilities and patterns over introducing new dependencies.
5. Run appropriate tests and verification commands.
6. Review the final diff for unintended changes.
7. Push the completed task branch.
8. Open a pull request targeting `website`.
9. Report the changes made, verification performed, and pull request URL.

When project tooling, scripts, or conventions change, update this document to keep it accurate.