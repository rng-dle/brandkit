// Brandkit: apply company tokens, rebrand chrome, scrub vendor names from visible UI.
(function () {
	const B = (window.frappe && frappe.boot && frappe.boot.brandkit) || window.__brandkit;
	const root = document.documentElement;

	function tokens(t) {
		const m = {
			"--bk-primary": t.primary, "--bk-primary-hover": t.primary_hover, "--bk-accent": t.accent,
			"--bk-page": t.page_bg, "--bk-card": t.card_bg, "--bk-control": t.control_bg, "--bk-border": t.border,
			"--bk-text": t.text, "--bk-heading": t.heading, "--bk-muted": t.muted,
			"--bk-nav": t.navbar_bg, "--bk-nav-text": t.navbar_text, "--bk-side": t.sidebar_bg,
			"--bk-success": t.success, "--bk-warning": t.warning, "--bk-danger": t.danger,
			"--bk-radius": t.radius, "--bk-radius-sm": t.radius_sm, "--bk-font": t.font, "--bk-shadow": t.shadow,
		};
		Object.keys(m).forEach((k) => m[k] && root.style.setProperty(k, m[k]));
	}

	let rules = [];
	function scrubText(s) {
		let out = s;
		rules.forEach(([re, to]) => (out = out.replace(re, to)));
		return out;
	}
	const SKIP = "script,style,textarea,input,code,pre,.ql-editor,.frappe-control,.form-control,[contenteditable],.list-row,.grid-row,.dt-cell,.report-wrapper";
	// Only chrome is scrubbed, never user data. Rows/cells/forms are skipped.
	const CHROME = ".navbar,.desktop-container,.desktop,.sidebar,.layout-side-section,.dock,.login-content,.for-login,.web-footer,.page-head .title-text,.dropdown-menu,.modal-title,.onboarding-widget-box,body > .footer";

	function sweep(node) {
		const scope = node.nodeType === 1 ? [node] : [];
		scope.forEach((n) => {
			const hosts = n.matches && n.matches(CHROME) ? [n] : Array.from(n.querySelectorAll ? n.querySelectorAll(CHROME) : []);
			hosts.forEach((h) => {
				const w = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
				let t;
				while ((t = w.nextNode())) {
					if (t.parentElement && t.parentElement.closest(SKIP)) continue;
					const v = scrubText(t.nodeValue);
					if (v !== t.nodeValue) t.nodeValue = v;
				}
				h.querySelectorAll("[title],[placeholder],[aria-label]").forEach((e) => {
					["title", "placeholder", "aria-label"].forEach((a) => {
						const v = e.getAttribute(a);
						if (v) {
							const s = scrubText(v);
							if (s !== v) e.setAttribute(a, s);
						}
					});
				});
			});
		});
	}

	function title() {
		const s = scrubText(document.title);
		if (s !== document.title) document.title = s;
	}

	function icons() {
		document.querySelectorAll('link[rel~="icon"]').forEach((l) => (l.href = "/assets/brandkit/images/favicon.svg"));
		document.querySelectorAll(".app-logo, .navbar-brand img, .desktop-icon img[src*='erpnext'], img[src*='/assets/erpnext/'], img[src*='frappe-framework'], .app-logo img").forEach((i) => {
			if (i.tagName === "IMG") i.src = "/assets/brandkit/images/logo.svg";
		});
	}

	function hideCss(sels) {
		if (!sels || !sels.length) return;
		const s = document.createElement("style");
		s.textContent = sels.join(",") + "{display:none!important}";
		document.head.appendChild(s);
	}

	function init(cfg) {
		tokens(cfg.tokens || {});
		hideCss(cfg.hide_selectors);
		rules = Object.entries(cfg.scrub || {})
			.sort((a, b) => b[0].length - a[0].length)
			.map(([k, v]) => [new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), v]);
		const run = () => { sweep(document.body); title(); icons(); };
		run();
		let q = 0;
		new MutationObserver((muts) => {
			if (q) return;
			q = requestAnimationFrame(() => {
				q = 0;
				muts.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && sweep(n)));
				title();
				icons();
			});
		}).observe(document.body, { childList: true, subtree: true });
	}

	function go() {
		const cfg = (window.frappe && frappe.boot && frappe.boot.brandkit) || window.__brandkit;
		if (cfg) return init(cfg);
		// Website/login pages have no boot payload: load the config once.
		fetch("/api/method/brandkit.api.public_config").then((r) => r.json()).then((r) => r.message && init(r.message)).catch(() => {});
	}
	if (document.body) go(); else document.addEventListener("DOMContentLoaded", go);
})();
