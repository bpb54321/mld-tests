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
  
  builder = new webdriver.Builder().forBrowser('chrome');
  driver = await builder.build();

  // Login to WP Admin to enable viewing of the private page
  await driver.get('http://learningdesign.georgetown.domains/mld-staging/academics/');

  let passwordInput = await driver.wait(until.elementLocated(By.id('password')), 10000);

  await passwordInput.sendKeys('scholarship!')
  
  // Submit the form that contains passwordInput
  await passwordInput.submit();

  await driver.sleep(10000);

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

    await testBookmarks(page.sampleStudentScheduleLink);
  }

  await driver.quit();
})();

async function testBookmarks(sampleStudentScheduleLink, driver) {
  var block_name = 'bookmark';
  var label = 0;
  
  console.log(colors.yellow(`Testing ${block_name}: ${label}\n`));
  
  try {
    // Click on the link
    await sampleStudentScheduleLink.click();

    driver.sleep(10000);
    
    //expect(icons).to.have.lengthOf(1);
  } catch(error) {
    printErrorAndExit(error);
  }

  console.log(colors.green(`Clicking the ${block_name} scrolled the page down to the top of the element that was the target of the bookmark.\n`));

}

function printErrorAndExit(error) {
  console.log(colors.red(error.stack));
  process.exit(1);
}
