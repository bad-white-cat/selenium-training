const controlHelper = {

    selectDropdownValue: (driver, element, text) => {
        driver.executeScript(
            "const select = arguments[0];" +
            "for(var i = 0; i < select.options.length; i+=1)"+ 
            "{ if(select.options[i].text == arguments[1])"+
            "{ select.options[i].selected = true; } }" + 
            "arguments[0].dispatchEvent(new Event('change'))",
            element, text);
    }
}

module.exports = controlHelper;