
import asyncio
from playwright.async_api import async_playwright
import sys

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Collect console logs
        logs = []
        page.on('console', lambda msg: logs.append(msg.text))

        try:
            await page.goto('http://localhost:5173/committee')
            await page.wait_for_load_state('networkidle')
            await page.screenshot(path='/home/jules/verification/committee_page.png')

            print("--- BROWSER CONSOLE LOGS ---")
            for log in logs:
                print(log)
            print("-----------------------------")

        except Exception as e:
            print(f"An error occurred: {e}", file=sys.stderr)
        finally:
            await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
