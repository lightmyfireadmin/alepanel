from playwright.sync_api import sync_playwright

def verify_marketing_panel():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create a context with larger viewport to see the dashboard layout
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        try:
            # Go to the admin marketing page
            # Note: Port 3000 is standard for Next.js
            page.goto("http://localhost:3000/admin/marketing")

            # Wait for content to load
            page.wait_for_load_state("networkidle")

            # Verify key elements
            # Check for header
            if page.get_by_text("Marketing Studio").count() == 0:
                print("Error: 'Marketing Studio' header not found")

            # Check for specific tabs
            if page.get_by_role("tab", name="Articles de Blog").count() == 0:
                print("Error: 'Articles de Blog' tab not found")

            # Take screenshot of the Marketing Studio
            page.screenshot(path="verification/marketing_studio.png")
            print("Screenshot saved to verification/marketing_studio.png")

            # Navigate back to Dashboard to verify the link and new layout
            page.goto("http://localhost:3000/admin")
            page.wait_for_load_state("networkidle")

            # Check for the Marketing card/link
            if page.get_by_text("Marketing Studio & Création IA").count() == 0:
                print("Error: Marketing highlight card not found on dashboard")

            # Take screenshot of the main Dashboard
            page.screenshot(path="verification/admin_dashboard.png")
            print("Screenshot saved to verification/admin_dashboard.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            # Take screenshot on error to debug
            page.screenshot(path="verification/error_state.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_marketing_panel()
