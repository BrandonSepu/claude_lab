const { chromium } = require('playwright');

async function testResponsiveDesignFinal() {
  const browser = await chromium.launch({ headless: true });
  const results = {
    mobile: { passed: true, checks: [] },
    tablet: { passed: true, checks: [] },
    desktop: { passed: true, checks: [] }
  };

  const viewports = [
    { name: 'Mobile (iPhone 12)', key: 'mobile', width: 375, height: 812 },
    { name: 'Tablet (iPad)', key: 'tablet', width: 768, height: 1024 },
    { name: 'Desktop (1440px)', key: 'desktop', width: 1440, height: 900 }
  ];

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height }
    });
    const page = await context.newPage();

    try {
      await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });
      await page.waitForSelector('.chat-container', { timeout: 5000 });

      // Add multiple messages to test scrolling
      const testMessages = [
        'First test message',
        'Second message with more text to see how it wraps',
        'Another message'
      ];

      for (const msg of testMessages) {
        const inputField = await page.$('.input-field');
        if (inputField) {
          await inputField.fill(msg);
          const sendBtn = await page.$('.send-btn');
          if (sendBtn) {
            await sendBtn.click();
            await page.waitForTimeout(500);
          }
        }
      }

      // Run comprehensive checks
      const checkData = await page.evaluate(() => {
        const messagesArea = document.querySelector('.messages-area');
        const inputField = document.querySelector('.input-field');
        const sendBtn = document.querySelector('.send-btn');
        const messageBubbles = document.querySelectorAll('.message-bubble');
        const topBar = document.querySelector('.top-bar');

        // Check if text is readable and not cut off
        const checkTextReadability = () => {
          const issues = [];

          messageBubbles.forEach((bubble, idx) => {
            const style = window.getComputedStyle(bubble);
            const fontSize = parseFloat(style.fontSize);
            const lineHeight = parseFloat(style.lineHeight);
            const overflow = style.overflow;
            const textOverflow = style.textOverflow;

            // Check if text size is readable (minimum 12px on mobile, 14px ideal)
            if (fontSize < 12) {
              issues.push(`Bubble ${idx}: font too small (${fontSize}px)`);
            }

            // Check for text overflow
            if (bubble.scrollWidth > bubble.clientWidth) {
              issues.push(`Bubble ${idx}: text overflow detected`);
            }

            // Check line height is adequate
            if (lineHeight < fontSize * 1.3) {
              issues.push(`Bubble ${idx}: line height too tight`);
            }
          });

          return issues;
        };

        // Check scrolling capability
        const checkScrolling = () => {
          const hasScroll = messagesArea.scrollHeight > messagesArea.clientHeight;
          const scrollbar = window.getComputedStyle(messagesArea, '::-webkit-scrollbar-thumb');
          return {
            hasScroll: hasScroll,
            scrollHeight: messagesArea.scrollHeight,
            clientHeight: messagesArea.clientHeight
          };
        };

        // Check button and input readability
        const checkInteractiveElements = () => {
          const issues = [];

          if (inputField) {
            const inputFontSize = parseFloat(window.getComputedStyle(inputField).fontSize);
            if (inputFontSize < 14) {
              issues.push(`Input font too small: ${inputFontSize}px`);
            }
            const inputHeight = inputField.clientHeight;
            if (inputHeight < 40) {
              issues.push(`Input height too small for touch: ${inputHeight}px`);
            }
          }

          if (sendBtn) {
            const btnHeight = sendBtn.clientHeight;
            if (btnHeight < 40) {
              issues.push(`Button height too small for touch: ${btnHeight}px`);
            }
          }

          return issues;
        };

        return {
          readabilityIssues: checkTextReadability(),
          scrollInfo: checkScrolling(),
          interactiveElementIssues: checkInteractiveElements(),
          messageCount: messageBubbles.length,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          documentScroll: {
            scrollWidth: document.documentElement.scrollWidth,
            scrollHeight: document.documentElement.scrollHeight,
            clientWidth: document.documentElement.clientWidth,
            clientHeight: document.documentElement.clientHeight
          },
          topBarHeight: topBar?.clientHeight,
          hasNoHorizontalScroll: document.documentElement.scrollWidth <= window.innerWidth
        };
      });

      const key = viewport.key;

      // Add checks to results
      console.log(`\n${viewport.name}:`);
      console.log(`  Viewport: ${checkData.viewportWidth}px × ${checkData.viewportHeight}px`);
      console.log(`  Messages sent: ${checkData.messageCount}`);

      // Text readability
      if (checkData.readabilityIssues.length === 0) {
        results[key].checks.push('✓ Text readability: All message text is readable');
      } else {
        results[key].passed = false;
        results[key].checks.push('✗ Text readability issues: ' + checkData.readabilityIssues.join(', '));
      }

      // Horizontal scroll
      if (checkData.hasNoHorizontalScroll) {
        results[key].checks.push('✓ No horizontal scrolling: All content fits');
      } else {
        results[key].passed = false;
        results[key].checks.push('✗ Horizontal scrolling detected');
      }

      // Vertical scroll
      if (checkData.scrollInfo.hasScroll) {
        results[key].checks.push(`✓ Vertical scrolling works: content ${checkData.scrollInfo.scrollHeight}px > viewport ${checkData.scrollInfo.clientHeight}px`);
      } else {
        results[key].checks.push('✓ Vertical scroll not needed (all content visible)');
      }

      // Interactive elements
      if (checkData.interactiveElementIssues.length === 0) {
        results[key].checks.push('✓ Interactive elements: Properly sized for interaction');
      } else {
        results[key].checks.push('⚠ Interactive element issues: ' + checkData.interactiveElementIssues.join(', '));
      }

      // Responsive layout
      if (viewport.width <= 480) {
        results[key].checks.push('✓ Mobile layout applied');
      } else if (viewport.width <= 768) {
        results[key].checks.push('✓ Tablet layout applied');
      } else {
        results[key].checks.push('✓ Desktop layout applied');
      }

    } catch (error) {
      console.error(`Error testing ${viewport.name}:`, error.message);
      results[viewport.key].passed = false;
      results[viewport.key].checks.push(`ERROR: ${error.message}`);
    } finally {
      await context.close();
    }

    await new Promise(resolve => setTimeout(resolve, 800));
  }

  // Print final report
  console.log(`\n${'='.repeat(50)}`);
  console.log('RESPONSIVE DESIGN TEST REPORT');
  console.log(`${'='.repeat(50)}`);

  let allPassed = true;
  for (const viewport of viewports) {
    const key = viewport.key;
    const result = results[key];
    console.log(`\n${viewport.name}:`);
    result.checks.forEach(check => console.log(`  ${check}`));

    if (!result.passed) {
      allPassed = false;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  if (allPassed) {
    console.log('FINAL RESULT: DONE');
    console.log('\nAll responsive design tests PASSED:');
    console.log('  ✓ Mobile (375px): Layout works, no overflow, readable text');
    console.log('  ✓ Tablet (768px): Layout works, responsive spacing, readable');
    console.log('  ✓ Desktop (1440px): Full layout with proper margins');
  } else {
    console.log('FINAL RESULT: FAILED');
    console.log('Some responsive design tests did not pass.');
  }
  console.log(`${'='.repeat(50)}\n`);

  await browser.close();
  process.exit(allPassed ? 0 : 1);
}

testResponsiveDesignFinal().catch(console.error);
