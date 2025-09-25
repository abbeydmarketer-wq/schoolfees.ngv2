from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    page.goto("http://localhost:5000/")
    page.wait_for_load_state("networkidle")
    page.get_by_role("button", name="Register Now").first.click()
    page.wait_for_selector('h1:has-text("Create Your School Account")')
    page.screenshot(path="jules-scratch/verification/auth_page_with_theme.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)