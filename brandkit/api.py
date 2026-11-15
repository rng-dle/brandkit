import frappe

from brandkit.config import get_company


@frappe.whitelist(allow_guest=True)
def public_config():
	c = get_company()
	return {k: c[k] for k in ("name", "short", "legal", "tokens", "scrub", "hide_selectors")}
