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
  await driver.get('http://learninganddesign.georgetown.local/wp-login.php');

  let usernameInput = await driver.wait(until.elementLocated(By.id('user_login')), 10000);
  let passwordInput = await driver.wait(until.elementLocated(By.id('user_pass')), 10000);

  await usernameInput.sendKeys('bb1020');
  await passwordInput.sendKeys('B80lquE4aEpb!UBdFg')
  
  // Submit the form that contains passwordInput
  await passwordInput.submit();

  // Wait for redirect to /wp-admin/
  await driver.wait(until.urlIs('http://learninganddesign.georgetown.local/wp-admin/'), 10000);

  await driver.get('http://learninganddesign.georgetown.local/academics-2/');

  // Setup page object: get references to WebElements that we will test
  page = {
    elementLocators: {
      programRequirement: '.program-requirement', // This will find the instance of the component
    },
    groupLocators: {
      programRequirements: '.program-requirement', // This will find all the components
    },
  };

  for (let elementLocator in page.elementLocators) {
    page[elementLocator] = await driver.findElement(By.css(page.elementLocators[elementLocator]));
  }

  for (let groupLocator in page.groupLocators) {
    page[groupLocator] = await driver.findElements(By.css(page.groupLocators[groupLocator]));
  }

  screen_sizes = [
    {
      name: 'xs',
      width: 320,
      height: 600,
    },
    {
      name: 'sm',
      width: 576,
      height: 600,
    },
    {
      name: 'md',
      width: 768,
      height: 600,
    },
    {
      name: 'lg',
      width: 992,
      height: 600,
    },
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

    for (let [index, program_requirement] of page.programRequirements.entries()) {
      await testProgramRequirement(program_requirement, screen_size.name, index);
    }
  }

  await driver.quit();
})();

async function testProgramRequirement(program_requirement, screen_size_name, label) {
  const block_name = '.program-requirement';
  let element_name;
  let icons;
  let icon;
  let icon_rect;
  let icon_bounds;
  let is_centered;
  
  console.log(colors.yellow(`Testing ${block_name}: ${label}\n`));

  element_name = `${block_name}__icon`;
  
  try {
    icons = await program_requirement.findElements(By.css(`${element_name}\n`));
    expect(icons).to.have.lengthOf(1);
  } catch(error) {
    printErrorAndExit(error);
  }
  console.log(colors.green(`The ${block_name} has one ${element_name}\n`));

  icon = icons[0];
  
  try {
    icon_rect = await icon.getRect();
    switch (screen_size_name) {
      case 'xs':
        expect(icon_rect.width).to.equal(30);
        break;
      case 'sm':
        expect(icon_rect.width).to.equal(40);
        break;
      case 'md':
        expect(icon_rect.width).to.equal(30);
        break;
      case 'lg':
        expect(icon_rect.width).to.equal(40);
        break;
      case 'xl':
        expect(icon_rect.width).to.equal(60);
        break;
    }
  } catch(error) {
    printErrorAndExit(error);
  }
  console.log(colors.green(`${element_name} width is correct.\n`));


  console.log(colors.green(`${element_name} should have the correct x-axis alignment.\n`));
  try {
    switch (screen_size_name) {
      case 'xs':
        is_centered = await util.isCenteredInBlock(icon, 'x-axis'); 
        expect(is_centered).to.be.true;
        break;
      case 'sm':
        break;
      case 'md':
        break;
      case 'lg':
        break;
      case 'xl':
        break;
    }
  } catch(error) {
    printErrorAndExit(error);
  }

}

function printErrorAndExit(error) {
  console.log(colors.red(error.stack));
  process.exit(1);
}
