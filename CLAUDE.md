---

description: Project conventions for Eta.js templating, Bun runtime, and Git workflow. globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, *.eta, package.json" always
Apply: true

---

# Project Conventions

## Architecture

The website uses [**Eta.js**](https://eta.js.org/) as its templating engine and [**Bun**](https://bun.com/) as its JavaScript runtime, package manager, build tool, and test runner.

### Directory structure

- `/pages/` — All website page templates and template content files.
- `/layout/` — Shared page layouts and reusable layout templates.
- `/docs/` — Generated website content published through GitHub Pages.

### Eta.js templating

- Use Eta.js for all server-side HTML templating.
- Keep all page templates and content files under `/pages/`.
- Keep shared layouts and reusable layout templates under `/layout/`.
- Reuse existing layouts and partials instead of duplicating markup.
- Follow existing Eta.js syntax, configuration, and rendering conventions.
- Do not introduce another templating engine or frontend framework without explicit approval.
- Refer to the [Eta.js documentation](https://eta.js.org/) when necessary.

## Git Workflow

Every task MUST follow this workflow.

### 1. Create a task branch

Before making any changes, create a new branch from the appropriate base branch.

Branch naming convention:

`as###-task-description`

Examples:

- `as001-update-homepage`
- `as002-fix-navigation`
- `as003-add-contact-page`

Use the assigned or next available task number and lowercase kebab-case descriptions.

Never work directly on `main` or `website`.

### 2. Implement changes

- Make all changes on the task branch.
- Follow the existing project architecture and conventions.
- Keep changes focused on the assigned task.
- Avoid unnecessary dependencies and unrelated modifications.

### 3. Test and verify

- Run relevant tests and verification commands.
- Ensure existing tests continue to pass.
- Review changes for unintended modifications.

### 4. Generate website content

Before opening a pull request, ALWAYS regenerate the website content:

bash

```
bun run generate
```

This command generates the latest website content in `/docs/`.

Requirements:

- Run generation after completing implementation changes.
- Ensure all generated `/docs/` changes are included in the task branch.
- Review generated files for unexpected changes or errors.
- Do not manually edit generated files in `/docs/` unless explicitly required.
- If generation fails, investigate and resolve the issue before proceeding.

### 5. Push and open a pull request

After implementation, testing, and content generation are complete:

- Push the task branch to the remote repository.
- Include generated `/docs/` changes in the push.
- Open a GitHub pull request targeting the `website` branch.
- Provide a descriptive title and implementation summary.
- Include relevant testing and verification details.
- Mention that `bun run generate` was executed.
- Do not merge the pull request unless explicitly instructed.

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
- Bun automatically loads `.env` files. Do not use `dotenv`.
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

Before installing dependencies, check whether Bun or the standard runtime already provides the required functionality.

## Testing

Use Bun's built-in test runner.

Run all tests:

bash

```
bun test
```

Example:

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

## Development Guidelines

- Follow the existing project structure.
- Use Eta.js for HTML templating.
- Keep page templates and content under `/pages/`.
- Keep shared layouts under `/layout/`.
- Prefer reusable layouts and partials over duplicated markup.
- Use semantic HTML and accessible markup.
- Follow existing CSS and JavaScript conventions.
- Avoid unnecessary dependencies.
- Do not modify deployment configuration or unrelated infrastructure unless required.

## Deployment

The website is deployed through GitHub Pages.

- Generated website content is stored in `/docs/`.
- `/docs/` must be regenerated using `bun run generate` before every pull request.
- The `website` branch is the required pull-request target.
- Do not assume deployment has occurred simply because a pull request was opened.
- Do not modify the deployment process without explicit requirements.

## General Claude Instructions

1. Read the existing implementation before making changes.
2. Create the required task branch before editing files.
3. Follow Eta.js and Bun conventions.
4. Prefer existing project utilities and patterns.
5. Run appropriate tests and verification commands.
6. Run `bun run generate` to regenerate `/docs/`.
7. Review the complete diff, including generated files.
8. Push the completed task branch.
9. Open a pull request targeting `website`.
10. Report the changes, tests, generation results, and pull request URL.

Keep this document updated whenever project tooling, scripts, architecture, or conventions change.