import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Click the 'Login' button to proceed with login.
        frame = context.pages[-1]
        # Click the 'Login' button to start login process
        elem = frame.locator('xpath=html/body/div[3]/header/div/div[2]/nav/button[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Input email and password, then click the login button.
        frame = context.pages[-1]
        # Input email address
        elem = frame.locator('xpath=html/body/div[3]/div[3]/div/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('jakeseol99@keduall.com')
        

        frame = context.pages[-1]
        # Input password
        elem = frame.locator('xpath=html/body/div[3]/div[3]/div/div[2]/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('password123')
        

        frame = context.pages[-1]
        # Click the login button to submit credentials
        elem = frame.locator('xpath=html/body/div[3]/div[3]/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the 'Textie에게 물어보세요' button to invoke the AI assistant.
        frame = context.pages[-1]
        # Click the 'Textie에게 물어보세요' button to invoke AI assistant 'Textie'
        elem = frame.locator('xpath=html/body/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Send a query to 'Textie' to test responsiveness and context awareness.
        frame = context.pages[-1]
        # Send a query to AI assistant to test responsiveness and context awareness
        elem = frame.locator('xpath=html/body/div[2]/div[3]/form/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Hello Textie, can you summarize a document for me?')
        

        frame = context.pages[-1]
        # Send the message to AI assistant
        elem = frame.locator('xpath=html/body/div[2]/div[3]/form/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Send a follow-up message to AI assistant to continue conversation and test context awareness and chat history retention.
        frame = context.pages[-1]
        # Send follow-up query to AI assistant to test context awareness and chat history retention
        elem = frame.locator('xpath=html/body/div[2]/div[3]/form/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Can you help me create a summary in the markdown editor?')
        

        frame = context.pages[-1]
        # Send the follow-up message to AI assistant
        elem = frame.locator('xpath=html/body/div[3]/header/div/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Locate the correct input field or interaction method for the AI assistant in the markdown editor interface and send a message to verify chat history retention.
        frame = context.pages[-1]
        # Click the 'Textie에게 물어보세요' button to reopen AI assistant interface and find correct input field
        elem = frame.locator('xpath=html/body/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Send message to AI assistant to confirm it remembers previous conversation about document summarization.
        frame = context.pages[-1]
        # Send message to AI assistant to check chat history retention after reopening assistant interface
        elem = frame.locator('xpath=html/body/div[2]/div[3]/form/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Do you remember our previous conversation about document summarization?')
        

        frame = context.pages[-1]
        # Send the message to AI assistant
        elem = frame.locator('xpath=html/body/div[2]/div[3]/form/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Open a new tab and navigate to http://localhost:3000 to recover from error and continue testing chat history persistence after reload.
        await page.goto('about:blank', timeout=10000)
        await asyncio.sleep(3)
        

        await page.goto('http://localhost:3000', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Invoke the AI assistant 'Textie' again and check if previous chat history is visible to confirm persistence after reload.
        frame = context.pages[-1]
        # Click the 'Textie에게 물어보세요' button to invoke AI assistant after reload
        elem = frame.locator('xpath=html/body/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Textie').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Online · Idle (Landing)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=무엇을 도와드릴까요? 문서 요약, 다이어그램 생성, 수식 변환 등 필요한 작업을 말씀해주세요.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Groq·Context Aware').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=나눠쓰지 말고, 여기서 모아서 보자. 지식은 모을수록 가치 있으니까.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=생각의 흐름을 끊지 않는 매끄러운 글쓰기 경험.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=복잡한 수식도 아름답고 정확하게 표현합니다.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=복잡한 구조를 시각적으로 명쾌하게 정리하세요.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=데이터 구조를 직관적으로 설계하고 관리합니다.').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    