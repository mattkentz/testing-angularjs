describe('TestingAngularApp', function() {    
  
  beforeEach(function() {
    browser.get('http://0.0.0.0:8080/index.html');
    
    newCityField = element(by.model('newDestination.city'));
    newCountryField = element(by.model('newDestination.country'));
    addDestinationButton =  element(by.name('addDestinationButton'));
    destinationList = element.all(by.repeater('destination in destinations'));
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Testing Angular');
  });
  
  it('should set the correct header', function() {
    expect(element(by.id('mainHeader')).getText()).toBe('Testing AngularJS Applications');
    expect(element(by.tagName('header')).getInnerHtml()).toBe('<h1 class="ng-binding">Testing AngularJS Applications</h1>');
    expect(element(by.binding('title')).getTagName()).toBe('h1');  
  });
  
  it('should add destination to destination list', function() {       
    expect(destinationList.count()).toBe(0);

    newCityField.sendKeys("Rome");
    newCountryField.sendKeys("Italy");
    addDestinationButton.click();

    expect(destinationList.count()).toBe(1);

    // Clear the fields otherwise text is appended
    newCityField.clear();
    newCountryField.clear();

    newCityField.sendKeys("Madrid");
    newCountryField.sendKeys("Spain");
    addDestinationButton.click();

    expect(destinationList.count()).toBe(2); 

    element.all(by.repeater('destination in destinations').row(0)).then(
      function(elements)
      {
        expect(elements[0].getText()).toContain("Rome, Italy");
      }
    );
    
    element.all(by.repeater('destination in destinations').row(1)).then(
      function(elements)
      {
        expect(elements[0].getText()).toContain("Madrid, Spain");
      }
    );
  });
});
