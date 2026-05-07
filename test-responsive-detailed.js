const { chromium } = require('playwright');

async function testResponsiveDesign() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  const viewports = [
    { name: 'Mobile (iPhone 12)', width: 375, height: 812, expectedMargin: '8%' },
    { name: 'Tablet (iPad)', width: 768, height: 1024, expectedMargin: '10%' },
    { name: 'Desktop (1440px)', width: 1440, height: 900, expectedMargin: '18%' }
  ];

  for (const viewport of viewports) {
    console.log(`\n========================================`);
    console.log(`Testing: ${viewport.name} (${viewport.width}px × ${viewport.height}px)`);
    console.log(`========================================`);

    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height }
    });
    const page = await context.newPage();

    try {
      await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });
      await page.waitForSelector('.chat-container', { timeout: 5000 });

      // Add a test message by typing and sending
      const inputField = await page.$('.input-field');
      if (inputField) {
        await inputField.fill('Test message for responsive design');
        const sendBtn = await page.$('.send-btn');
        if (sendBtn) {
          await sendBtn.click();
          // Wait for message to appear
          await page.waitForSelector('.message-bubble', { timeout: 5000 }).catch(() => {});
        }
      }

      // Get detailed viewport and style information
      const testData = await page.evaluate(() => {
        const messagesArea = document.querySelector('.messages-area');
        const inputArea = document.querySelector('.input-area');
        const messageBubble = document.querySelector('.message-bubble');
        const suggestionsGrid = document.querySelector('.suggestions-grid');
        const topBar = document.querySelector('.top-bar');

        // Parse padding value
        const parsePadding = (paddingStr) => {
          if (!paddingStr) return null;
          // Try to extract percentage or pixel values
          const matches = paddingStr.match(/(\d+(?:\.\d+)?)(px|%)/g);
          return matches ? matches.map(m => m) : paddingStr;
        };

        // Get computed styles
        const getStyles = (el) => {
          if (!el) return null;
          const style = window.getComputedStyle(el);
          return {
            padding: style.padding,
            paddingLeft: style.paddingLeft,
            paddingRight: style.paddingRight,
            maxWidth: style.maxWidth,
            fontSize: style.fontSize,
            display: style.display,
            gridTemplateColumns: style.gridTemplateColumns
          };
        };

        // Calculate padding percentage
        const calculatePaddingPercent = (el) => {
          if (!el) return null;
          const style = window.getComputedStyle(el);
          const paddingLeft = parseFloat(style.paddingLeft);
          const containerWidth = window.innerWidth;
          return ((paddingLeft / containerWidth) * 100).toFixed(1);
        };

        return {
          messagesArea: getStyles(messagesArea),
          messageAreaPaddingPercent: calculatePaddingPercent(messagesArea),
          inputArea: getStyles(inputArea),
          messageBubble: getStyles(messageBubble),
          suggestionsGrid: getStyles(suggestionsGrid),
          topBar: getStyles(topBar),
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          documentWidth: document.documentElement.scrollWidth,
          documentHeight: document.documentElement.scrollHeight,
          hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
          hasVerticalScroll: document.documentElement.scrollHeight > window.innerHeight
        };
      });

      // Display results
      console.log(`\nViewport: ${testData.viewportWidth}px × ${testData.viewportHeight}px`);
      console.log(`Document: ${testData.documentWidth}px × ${testData.documentHeight}px`);
      console.log('\nResponsive Measurements:');
      console.log(`- Messages Area Padding: ${testData.messagesArea?.padding}`);
      console.log(`- Messages Area Padding %: ${testData.messageAreaPaddingPercent}% (expected: ~${viewport.expectedMargin})`);
      console.log(`- Message Bubble Max-Width: ${testData.messageBubble?.maxWidth}`);
      console.log(`- Message Bubble Font-Size: ${testData.messageBubble?.fontSize}`);
      console.log(`- Suggestions Grid Columns: ${testData.suggestionsGrid?.gridTemplateColumns}`);
      console.log(`- Input Area Padding: ${testData.inputArea?.padding}`);
      console.log(`- Top Bar Padding: ${testData.topBar?.padding}`);

      // Scrolling behavior
      console.log('\nScrolling:');
      console.log(`- Has Horizontal Scroll: ${testData.hasHorizontalScroll}`);
      console.log(`- Has Vertical Scroll: ${testData.hasVerticalScroll}`);

      // Evaluate test result
      let testResult = {
        viewport: viewport.name,
        width: viewport.width,
        passed: true,
        issues: []
      };

      // Check for horizontal scrolling
      if (testData.hasHorizontalScroll) {
        testResult.passed = false;
        testResult.issues.push('FAIL: Horizontal scrolling detected');
      } else {
        testResult.issues.push('PASS: No horizontal scrolling');
      }

      // Check padding percentage
      const paddingPercent = parseFloat(testData.messageAreaPaddingPercent);
      const expectedPercent = parseFloat(viewport.expectedMargin);
      const tolerance = 2; // 2% tolerance
      if (Math.abs(paddingPercent - expectedPercent) <= tolerance) {
        testResult.issues.push(`PASS: Padding is ${testData.messageAreaPaddingPercent}% (expected ~${viewport.expectedMargin})`);
      } else {
        testResult.issues.push(`WARN: Padding is ${testData.messageAreaPaddingPercent}% (expected ~${viewport.expectedMargin})`);
      }

      // Check message bubble max-width
      if (testData.messageBubble?.maxWidth) {
        const bubblePercent = testData.messageBubble.maxWidth;
        console.log(`- Message Bubble Max-Width: ${bubblePercent}`);
        if (viewport.width <= 480) {
          testResult.issues.push(`Mobile message bubble: ${bubblePercent}`);
        } else if (viewport.width <= 768) {
          testResult.issues.push(`Tablet message bubble: ${bubblePercent}`);
        } else {
          testResult.issues.push(`Desktop message bubble: ${bubblePercent}`);
        }
      }

      // Check suggestions grid
      const gridCols = testData.suggestionsGrid?.gridTemplateColumns;
      if (gridCols) {
        const colCount = (gridCols.match(/\d+px/g) || []).length;
        if (viewport.width <= 768) {
          if (colCount === 1) {
            testResult.issues.push('PASS: Suggestions grid is 1 column (mobile/tablet)');
          } else {
            testResult.issues.push(`WARN: Suggestions grid is ${colCount} columns (expected 1)`);
          }
        } else {
          if (colCount >= 2) {
            testResult.issues.push('PASS: Suggestions grid is 2+ columns (desktop)');
          } else {
            testResult.issues.push(`WARN: Suggestions grid is ${colCount} columns (expected 2)`);
          }
        }
      }

      results.push(testResult);

    } catch (error) {
      console.error('Error during test:', error.message);
      results.push({
        viewport: viewport.name,
        width: viewport.width,
        passed: false,
        issues: ['ERROR: ' + error.message]
      });
    } finally {
      await context.close();
    }

    // Add delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary Report
  console.log(`\n\n========================================`);
  console.log(`RESPONSIVE DESIGN TEST SUMMARY`);
  console.log(`========================================`);

  for (const result of results) {
    console.log(`\n${result.viewport} (${result.width}px):`);
    result.issues.forEach(issue => console.log(`  ${issue}`));
  }

  const allPassed = results.every(r => r.passed);
  console.log('\n========================================');
  if (allPassed) {
    console.log('RESULT: DONE - All responsive design tests passed');
  } else {
    console.log('RESULT: FAILED - Some responsive tests did not pass');
  }
  console.log('========================================\n');

  await browser.close();
  process.exit(allPassed ? 0 : 1);
}

testResponsiveDesign().catch(console.error);
