from brandkit.config import get_company


def extend_bootinfo(bootinfo):
	c = get_company()
	bootinfo.brandkit = {k: c[k] for k in ("name", "short", "legal", "tokens", "scrub", "hide_selectors")}
	bootinfo.app_name = c["name"]
