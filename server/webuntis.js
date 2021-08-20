const {Builder, By, Key, until} = require("selenium-webdriver");
const PATH = "/home/sebastian/work/Webuntis - Webscraper/webdriver/geckodriver";
const URL = "https://neilo.webuntis.com/WebUntis/index.do#/basic/login";

//sleep function for testing
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function enter_school(driver) {
    let school_input = await driver.findElement(By.xpath("/html/body/div/main/div[1]/div/div/div/span[1]/div[2]/input"));
    await school_input.sendKeys("Anichstraße");
    await sleep(2000)
    await school_input.sendKeys(Key.RETURN);
    await sleep(2000)
}

async function login_to_webuntis(driver){
  const input_felder = await driver.findElements(By.className("un-input-group__input"))
  await input_felder[0].sendKeys("username");
  await input_felder[1].sendKeys("pwd");
  await input_felder[1].sendKeys(Key.RETURN);
}


async function main() {
    let driver = await new Builder().forBrowser("firefox").build();
    await driver.get(URL);

    let CurrentUrl = await driver.getCurrentUrl()

    if (CurrentUrl == "https://webuntis.com/#/basic/login"){
      console.log("selecting school");
      await enter_school(driver);
      await login_to_webuntis(driver);

    } else if (driver.getCurrentUrl() == "https://neilo.webuntis.com/WebUntis/?school=htl1-innsbruck#/basic/login"){
      console.log("on login screen");
      await login_to_webuntis(driver);
    } else if (CurrentUrl == "https://neilo.webuntis.com/today"){
     console.log("already loged in");
    }

    await driver.wait(until.elementLocated(By.className("item-name")),10000);
    await sleep(5000);

    let Stundenplan_button = (await driver.findElements(By.className("item-name")))[4].click();

    await sleep(9000); 
    await driver.quit();



  }

main()

