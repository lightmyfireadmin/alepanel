from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_valuation(page: Page):
    # Go to the homepage (assuming the component is on the homepage or accessible)
    # Based on the file structure, it seems to be a component. I need to find where it is used.
    # Looking at `alecia-app/src/app/page.tsx` or similar would be good, but I'll try root first.
    page.goto("http://localhost:3000")

    # Fill out the form
    # Revenue
    page.get_by_placeholder("Ex: 2000").fill("2000")
    # EBITDA
    page.get_by_placeholder("Ex: 500").fill("500")

    # Sector - this is a Select component from shadcn/ui
    # We need to click the trigger and then select an item
    page.get_by_role("combobox").click()
    page.get_by_role("option", name="Technologies & logiciels").click()

    # Click calculate
    page.get_by_role("button", name="Calculer ma valorisation").click()

    # Wait for calculation (it has a 2s delay in the code)
    # Check for result step
    expect(page.get_by_text("Valorisation estimée")).to_be_visible(timeout=5000)

    # Now fill out the capture form
    page.get_by_placeholder("Votre email").fill("test@example.com")
    page.get_by_placeholder("Votre entreprise").fill("Test Corp")

    # Click submit
    page.get_by_role("button", name="Recevoir l'analyse complète").click()

    # Expect success message
    expect(page.get_by_text("Merci !")).to_be_visible(timeout=5000)
    expect(page.get_by_text("Vous recevrez votre analyse détaillée sous 24h.")).to_be_visible()

    # Take screenshot
    page.screenshot(path="verification/valuation_success.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_valuation(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
