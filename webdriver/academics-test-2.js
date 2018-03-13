// TO-DO: Measure the scroll position of the window before clicking the link and verify 
// that it is 0.

// Selenium Webdriver
// https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index.html
const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
const Key = webdriver.Key;

// Change the colors in the console
var colors = require('colors');

// Chai JS assertion library
const expect = require('chai').expect;

// Custom utilities library
const util = require('./utilities');

(async function() {
  let driver;
  let page;
  let builder;
  let screen_sizes;
  let heading_1;
  
  builder = new webdriver.Builder().forBrowser('chrome');
  driver = await builder.build();

  // Login to WP Admin to enable viewing of the private page
  await driver.get('http://learningdesign.georgetown.domains/mld-staging/academics/');

  let passwordInput = await driver.wait(until.elementLocated(By.id('password')), 10000);

  await passwordInput.sendKeys('scholarship!')
  
  // Submit the form that contains passwordInput
  await passwordInput.submit();

  // Wait for the actual Academics page to load
  heading_1 = await driver.wait(until.elementLocated(By.css('h1.feature__heading')), 10000, 
    'Timed out while waiting to locate h1.feature__heading');
  await driver.wait(until.elementTextIs(heading_1, 'Academics'), 10000,
    `Timed out for waiting for the h1's text to be 'Academics'`);

  // Setup page object: get references to WebElements that we will test
  page = {
    // Single elements
    elementLocators: {
      programRequirement: '.program-requirement',
      sampleStudentScheduleLink: 'a[href="#sample-schedule"]',
    },
    // Groups of elements
    groupLocators: {
      programRequirements: '.program-requirement', 
    },
  };

  for (let elementLocator in page.elementLocators) {
    page[elementLocator] = await driver.findElement(By.css(page.elementLocators[elementLocator]));
  }

  for (let groupLocator in page.groupLocators) {
    page[groupLocator] = await driver.findElements(By.css(page.groupLocators[groupLocator]));
  }

  screen_sizes = [
    // {
    //   name: 'xs',
    //   width: 320,
    //   height: 600,
    // },
    // {
    //   name: 'sm',
    //   width: 576,
    //   height: 600,
    // },
    // {
    //   name: 'md',
    //   width: 768,
    //   height: 600,
    // },
    // {
    //   name: 'lg',
    //   width: 992,
    //   height: 600,
    // },
    {
      name: 'xl',
      width: 1200,
      height: 600,
    },
  ];

  for (let screen_size of screen_sizes) {
    console.log(colors.magenta.bold(`[${screen_size.name}]\n`));

    await driver.manage().window().setRect({
      width: screen_size.width,
      height: screen_size.height,
    });

    await testBookmarks(page.sampleStudentScheduleLink, driver);
  }

  await driver.quit();
})();

async function testBookmarks(sampleStudentScheduleLink, driver) {
  let block_name = 'sample schedule link';
  let window_start_scroll_position;
  let window_end_scroll_position;
  
  console.log(colors.yellow(`Testing ${block_name}\n`));
  
  try {

    // Get the start scroll position of the window
    window_start_scroll_position = await driver.executeScript(function() {
      return jQuery(window).scrollTop();
    });

    // Click on the link
    await sampleStudentScheduleLink.click();

    // Wait the transition time for the smooth scroll
    driver.sleep(1500);

    window_end_scroll_position = await driver.executeScript(function() {
      return jQuery(window).scrollTop();
    });

    expect(window_start_scroll_position).to.not.equal(window_end_scroll_position);
    console.log(colors.green(`\tVerified that the window scroll position changes after you click the link.\n`));

  } catch(error) {
    printErrorAndExit(error);
  }

}

function printErrorAndExit(error) {
  console.log(colors.red(error.stack));
  process.exit(1);
}
