"""Company config loader. Pick the company with `bench --site X set-config brandkit_company maple_ridge`.
Falls back to the first file in companies/."""
import json
import os

import frappe

_DIR = os.path.join(os.path.dirname(__file__), "companies")


def get_company():
	slug = frappe.conf.get("brandkit_company")
	files = sorted(f for f in os.listdir(_DIR) if f.endswith(".json"))
	name = f"{slug}.json" if slug and f"{slug}.json" in files else files[0]
	with open(os.path.join(_DIR, name)) as fh:
		return json.load(fh)
