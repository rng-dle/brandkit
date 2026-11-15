# brandkit — per-company design app

One small Frappe app per company that restyles the whole desk, login, apps screen and emails, and
strips vendor names from visible UI. The look lives in `brandkit/companies/<slug>.json`
(tokens, scrub map, selectors to hide) plus `public/images/logo.svg`; code is shared.

    bench get-app https://github.com/rng-dle/brandkit --branch company-skin
    bench --site SITE install-app brandkit        # install LAST so its single-value hooks win
    bench --site SITE set-config brandkit_company maple_ridge
    bench build --app brandkit && bench --site SITE migrate

What it does
- tokens -> CSS variables mapped onto stock desk variables (`public/css/brandkit.css`)
- runtime scrubber for chrome text/titles/icons (`public/js/brandkit.js`), skips user data
- site setup on install/migrate (`setup.py`): Website Settings, Navbar help links, apps-screen tile
  relabel, framework tile admin-only, email footer
- new company = copy the JSON, swap logo, set `brandkit_company`

Selectors target the v16 desk and should be tuned against the live DOM per release.
