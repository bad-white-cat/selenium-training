const { Key } = require('selenium-webdriver');

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
    }
}

module.exports = controlHelper;