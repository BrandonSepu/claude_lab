const { chromium } = require('playwright');

async function testResponsiveDesign() {
  const browser = await chromium.launch({ headless: false });
  const results = [];

  const viewports = [
    { name: 'Mobile (iPhone 12)', width: 375, height: 812 },
    { name: 'Tablet (iPad)', width: 768, height: 1024 },
    { name: 'Desktop (1440px)', width: 1440, height: 900 }
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

      // Wait for the chat component to render
      await page.waitForSelector('.chat-container', { timeout: 5000 });

      // Get computed styles
      const styles = await page.evaluate(() => {
        const messagesArea = document.querySelector('.messages-area');
        const inputArea = document.querySelector('.input-area');
        const messageBubble = document.querySelector('.message-bubble');
        const suggestionsGrid = document.querySelector('.suggestions-grid');
        const topBar = document.querySelector('.top-bar');

        const getComputedStyle = (el) => {
          if (!el) return null;
          const style = window.getComputedStyle(el);
          return {
            padding: style.padding,
            maxWidth: style.maxWidth,
            fontSize: style.fontSize,
            gridTemplateColumns: style.gridTemplateColumns,
            display: style.display
          };
        };

        return {
          messagesArea: getComputedStyle(messagesArea),
          inputArea: getComputedStyle(inputArea),
          messageBubble: getComputedStyle(messageBubble),
          suggestionsGrid: getComputedStyle(suggestionsGrid),
          topBar: getComputedStyle(topBar),
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth
        };
      });

      console.log('\nComputed Styles:');
      console.log('- Messages Area Padding:', styles.messagesArea?.padding);
      console.log('- Message Bubble Max-Width:', styles.messageBubble?.maxWidth);
      console.log('- Suggestions Grid Columns:', styles.suggestionsGrid?.gridTemplateColumns);
      console.log('- Input Area Padding:', styles.inputArea?.padding);
      console.log('- Top Bar Padding:', styles.topBar?.padding);
      console.log('- Font Size (message bubble):', styles.messageBubble?.fontSize);
      console.log('- Has Horizontal Scroll:', styles.hasHorizontalScroll);

      // Test expectations
      let testResult = {
        viewport: viewport.name,
        passed: true,
        issues: []
      };

      // Check for horizontal scrolling
      if (styles.hasHorizontalScroll) {
        testResult.passed = false;
        testResult.issues.push('❌ Horizontal scrolling detected - content overflows');
      } else {
        testResult.issues.push('✓ No horizontal scrolling');
      }

      // Verify responsive padding
      const padding = styles.messagesArea?.padding;
      if (viewport.width <= 480) {
        if (!padding || !padding.includes('8%')) {
          testResult.issues.push('⚠ Mobile padding should be ~8%');
        } else {
          testResult.issues.push('✓ Mobile padding correct (8%)');
        }
      } else if (viewport.width <= 768) {
        if (!padding || !padding.includes('10%')) {
          testResult.issues.push('⚠ Tablet padding should be ~10%');
        } else {
          testResult.issues.push('✓ Tablet padding correct (10%)');
        }
      } else {
        if (!padding || !padding.includes('18%')) {
          testResult.issues.push('⚠ Desktop padding should be ~18%');
        } else {
          testResult.issues.push('✓ Desktop padding correct (18%)');
        }
      }

      // Check message bubble max-width
      const maxWidth = styles.messageBubble?.maxWidth;
      if (viewport.width <= 480) {
        testResult.issues.push(`Message bubble max-width: ${maxWidth}`);
      } else if (viewport.width <= 768) {
        testResult.issues.push(`Message bubble max-width: ${maxWidth}`);
      } else {
        testResult.issues.push(`Message bubble max-width: ${maxWidth}`);
      }

      // Check suggestions grid
      const gridColumns = styles.suggestionsGrid?.gridTemplateColumns;
      if (viewport.width <= 768) {
        if (gridColumns === '1fr') {
          testResult.issues.push('✓ Suggestions grid is 1 column (mobile/tablet)');
        } else {
          testResult.issues.push(`⚠ Suggestions grid columns: ${gridColumns} (expected 1fr)`);
        }
      } else {
        if (gridColumns && gridColumns.includes('1fr') && gridColumns.split(' ').length >= 2) {
          testResult.issues.push('✓ Suggestions grid is 2 columns (desktop)');
        } else {
          testResult.issues.push(`⚠ Suggestions grid columns: ${gridColumns} (expected 2 columns)`);
        }
      }

      results.push(testResult);

    } catch (error) {
      console.error('Error during test:', error.message);
      results.push({
        viewport: viewport.name,
        passed: false,
        issues: ['Error: ' + error.message]
      });
    } finally {
      await context.close();
    }
  }

  // Summary
  console.log(`\n\n========================================`);
  console.log(`TEST SUMMARY`);
  console.log(`========================================`);

  for (const result of results) {
    console.log(`\n${result.viewport}:`);
    result.issues.forEach(issue => console.log(`  ${issue}`));
  }

  const allPassed = results.every(r => r.passed);
  if (allPassed) {
    console.log('\n✓ All responsive design tests PASSED');
  } else {
    console.log('\n❌ Some responsive design tests FAILED');
  }

  await browser.close();
  process.exit(allPassed ? 0 : 1);
}

testResponsiveDesign().catch(console.error);
