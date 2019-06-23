const { Key } = require('selenium-webdriver');
const { timeout } = require('../params.js');

const controlHelper = {

    selectDropdownValue: (driver, element, text) => {
        driver.executeScript(
            "const select = arguments[0];" +
            "for(var i = 0; i < select.options.length; i+=1)"+ 
            "{ if(select.options[i].text == arguments[1])"+
            "{ select.options[i].selected = true; } }" + 
            "arguments[0].dispatchEvent(new Event('change'))",
            element, text);
    },

    setCheckboxChecked: (element) => {
        return element.isSelected().then(result => {
            return result ? element : element.click();
        })
    },

    clearAndFill: (element, number) => {
        return element.getAttribute("value")
        .then(res => {
            for(let i = 0; i < res.length; i+= 1) {
                element.sendKeys(Key.DELETE)  
            }
        })
        .then(() => element.sendKeys(number));
    },

    waitForNewWindowOpen: waitForNewWindowOpen = async (driver, oldWindows, count = timeout/1000) => {
        let newWindows = await driver.getAllWindowHandles();
        if(newWindows.length > oldWindows.length) {
            return newWindows.filter(el => oldWindows.indexOf(el) < 0); //returns all new tabs appeared in []
        }
        else if (count > 0) {
            await driver.sleep(1000);
            return await this.waitForNewWindowOpen(driver, oldWindows, count - 1);
        }
        else throw `New tabs wasn\'t open during ${count} seconds`;
    }
}

module.exports = controlHelper;