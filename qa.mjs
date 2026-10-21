import { chromium } from 'playwright-core';
import fs from 'node:fs';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const errors = [];
for (const width of [1440, 768, 390, 320]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  page.on('pageerror', err => errors.push(`${width}: ${err.message}`));
  for (const route of ['/', '/about/', '/our-work/', '/support/', '/projects/']) {
    const response = await page.goto(`http://127.0.0.1:8765${route}`);
    assert.equal(response.status(), 200, `${route} response`);
    assert.ok(await page.locator('h1').isVisible(), `${route} h1 visible at ${width}`);
    assert.equal(await page.evaluate(() => document.body.innerText.includes('â†') || document.body.innerText.includes('Â·')), false, `${route} garbled punctuation`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    if (overflow) console.log('Overflow', width, route, await page.evaluate(() => [...document.querySelectorAll('*')].filter(el => el.getBoundingClientRect().right > innerWidth + 2).slice(0,8).map(el => [el.tagName, el.className, Math.round(el.getBoundingClientRect().right)])));
    assert.equal(overflow, false, `${route} horizontal overflow at ${width}`);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 15)); } scrollTo(0, 0); });
    await page.locator('img[loading="lazy"]').evaluateAll(images => Promise.all(images.map(image => image.decode().catch(() => {}))));
    assert.equal(await page.locator('main img, header img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true, `${route} broken image at ${width}`);
    await page.screenshot({ path: `qa-${width}-${route.replaceAll('/','') || 'home'}.png`, fullPage: true });
    await page.evaluate(() => scrollTo(0, 500));
    assert.ok(Math.abs(await page.locator('.site-header').evaluate(header => header.getBoundingClientRect().top)) < 2, `${route} sticky header at ${width}`);
    await page.evaluate(() => scrollTo(0, 0));
    if (route === '/') assert.equal(await page.locator('.hero-copy h1').evaluate(heading => heading.scrollWidth > heading.clientWidth + 2), false, `hero heading clipped at ${width}`);
    if (width === 390) {
      assert.equal(await page.locator('.menu-toggle').evaluate(button => getComputedStyle(button).borderTopWidth), '0px');
      await page.locator('.menu-toggle').click();
      assert.equal(await page.locator('.mobile-nav').isVisible(), true);
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
      assert.match(await page.locator('.menu-toggle span').first().evaluate(bar => getComputedStyle(bar).transform), /matrix\(/);
      await page.locator('.menu-toggle').click();
      assert.equal(await page.locator('.mobile-nav').isVisible(), false);
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      await page.locator('.menu-toggle').click();
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.mobile-nav').isVisible(), false);
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      for (const target of ['/', '/about/', '/our-work/', '/support/', '/projects/']) {
        await page.locator('.menu-toggle').click();
        await page.locator(`.mobile-nav a[href="${target}"]`).click();
        assert.equal(new URL(page.url()).pathname, target);
        await page.goto(`http://127.0.0.1:8765${route}`);
      }
    }
    if (route === '/projects/' && width === 390) {
      assert.equal(await page.locator('[data-gallery]').count(), 40);
      assert.match(await page.locator('[data-gallery="8"] img').getAttribute('alt'), /wooden home/);
      assert.equal(await page.locator('.gallery-category').count(), 4);
      assert.equal(await page.locator('#classroom, .gallery-jump a[href="#classroom"]').count(), 0);
      assert.equal(await page.locator('.video-grid video').count(), 5);
      for (const [index, video] of (await page.locator('.video-grid video').all()).entries()) {
        await video.evaluate(element => new Promise((resolve, reject) => {
          if (element.readyState >= 1) return resolve();
          element.addEventListener('loadedmetadata', resolve, { once: true });
          element.addEventListener('error', reject, { once: true });
          element.load();
        }));
        assert.ok(await video.evaluate(element => element.duration > 0 && element.videoWidth > 0));
        await video.evaluate(async element => { element.muted = true; await element.play(); });
        await page.waitForFunction(index => document.querySelectorAll('.video-grid video')[index].currentTime > 0, index);
        await video.evaluate(element => element.pause());
      }
      await page.locator('[data-gallery="0"]').click();
      assert.equal(await page.locator('.lightbox').isVisible(), true);
      await page.keyboard.press('ArrowRight');
      assert.match(await page.locator('.lightbox figcaption').textContent(), /02/);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.lightbox').isVisible(), false);
      await page.locator('[data-gallery="39"]').click();
      assert.equal(await page.locator('.lightbox').isVisible(), true);
      assert.match(await page.locator('.lightbox figcaption').textContent(), /Seminar speakers/);
      await page.keyboard.press('Escape');
      await page.locator('.gallery-jump a[href="#seminars"]').click();
      assert.equal(new URL(page.url()).hash, '#seminars');
    }
    if (route === '/our-work/' && width === 390) assert.equal(await page.locator('.program-media img').count(), 3);
    if (route === '/support/' && width === 390) {
      await page.locator('[data-copy]').first().click();
      await page.waitForFunction(() => /copied|failed/i.test(document.querySelector('.copy-status')?.textContent || ''));
      assert.match(await page.locator('.copy-status').textContent(), /(copied|failed)/i);
    }
    if (width === 390 || width === 1440) {
      await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' });
      const scan = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } }));
      if (scan.violations.length) console.log('Axe violations', route, JSON.stringify(scan.violations.map(v => [v.id, v.nodes.map(n => [n.target, n.failureSummary])])));
      assert.equal(scan.violations.length, 0, `${route} axe violations`);
    }
  }
  await page.close();
}
const noScript = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
await noScript.goto('http://127.0.0.1:8765/about/');
assert.equal(await noScript.locator('h1').isVisible(), true);
assert.equal(await noScript.locator('.mobile-nav').isVisible(), true);
await noScript.close();
const noAnimation = await browser.newPage({ viewport: { width: 390, height: 844 } });
await noAnimation.route('**/{gsap.min.js,ScrollTrigger.min.js}', route => route.abort());
await noAnimation.goto('http://127.0.0.1:8765/');
assert.equal(await noAnimation.locator('h1').isVisible(), true);
await noAnimation.close();
const motion = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
motion.on('pageerror', err => errors.push(`motion: ${err.message}`));
await motion.goto('http://127.0.0.1:8765/');
await motion.waitForFunction(() => Number(getComputedStyle(document.querySelector('.hero-copy h1')).opacity) > .98);
await motion.close();
assert.deepEqual(errors, []);
console.log('Browser QA: 5 routes x 4 widths; images, sticky header, headings, mobile menu, gallery, and copy feedback passed. Axe at 390 and 1440px, normal and reduced motion, no-JS navigation, and missing-GSAP fallback passed.');
await browser.close();
