# Brandkit

White-label branding and theme customization for the ERP desk.

## Features

- **App branding**: custom app name, logo, and favicon — synced automatically
  to Website Settings so the Desk and the public website match.
- **Theme colors**: set a Primary and Secondary color from a single settings
  page (any hex value); applied live across the Desk UI.
- **Help menu**: add a custom link/label to the Desk Help dropdown.
- **Update popup**: show a one-time announcement/update message to users per
  browser session.
- **"Powered by" text**: override the default footer credit line.

## Installation

```bash
bench get-app /path/to/brandkit
bench --site your-site install-app brandkit
bench build --app brandkit
bench --site your-site migrate
```

## Configuration

Go to **Brandkit Settings** (single doctype, under the Brandkit module) in the
Desk and fill in the fields. Changes apply on the next page load / session
refresh for other users, and immediately for the user who saved it after a
browser refresh.

## License

MIT
