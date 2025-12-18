from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the home page
            page.goto("http://localhost:3000")

            # 1. Check if HomeClient content is rendered
            # Look for "Scroll" indicator or Hero text
            page.wait_for_selector("text=Scroll", timeout=10000)
            print("Home page loaded")

            # 2. Check if Contact Widget is present
            # It has an aria-label "Open contact menu" (or similar from translations) or just use the button role
            # We used aria-label={isOpen ? t("close") : t("openContact")}
            # Since translations might be tricky, let's look for the MessageSquare icon or the button class

            # Take a screenshot of the home page with the widget
            page.screenshot(path="verification/home_page.png")
            print("Home page screenshot taken")

            # 3. Interact with Team Member
            # Find a team member and click
            # We used role="button" and aria-label for team members
            # Let's try to click the first one
            team_members = page.locator("div[role='button'][aria-label^='View details for']")
            if team_members.count() > 0:
                team_members.first.click()
                print("Clicked team member")
                # Wait for dialog
                page.wait_for_selector("div[role='dialog']")
                print("Dialog opened")
                page.screenshot(path="verification/team_modal.png")

                # Close dialog
                page.keyboard.press("Escape")
            else:
                print("No team members found")

            # 4. Open Contact Widget
            # The button has a specific class or we can find it by icon presence (harder in text)
            # Let's try finding the button by its aria-label if we knew the translation.
            # Fallback: find the button in fixed position bottom-right
            # Or use the class 'btn-gold' + 'rounded-full'
            widget_btn = page.locator(".fixed.bottom-6.right-6 button")
            if widget_btn.count() > 0:
                widget_btn.click()
                print("Clicked contact widget")
                page.wait_for_timeout(500) # Wait for animation
                page.screenshot(path="verification/contact_widget_open.png")
            else:
                print("Contact widget button not found")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_frontend()
