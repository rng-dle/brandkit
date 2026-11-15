app_name = "brandkit"
app_title = "Brandkit"
app_publisher = "Nastaliq"
app_description = "Per-company design layer: tokens, logo, login, apps screen, neutral wording"
app_email = "dev@example.com"
app_license = "MIT"
required_apps = ["frappe"]

# Later-installed apps win for the single-value hooks below, so install this last.
app_logo_url = "/assets/brandkit/images/logo.svg"
app_include_css = "/assets/brandkit/css/brandkit.css"
app_include_js = "/assets/brandkit/js/brandkit.js"
web_include_css = "/assets/brandkit/css/brandkit.css"
web_include_js = "/assets/brandkit/js/brandkit.js"
website_context = {
	"favicon": "/assets/brandkit/images/favicon.svg",
	"splash_image": "/assets/brandkit/images/logo.svg",
}
extend_bootinfo = "brandkit.boot.extend_bootinfo"
after_install = "brandkit.setup.apply"
after_migrate = "brandkit.setup.apply"
