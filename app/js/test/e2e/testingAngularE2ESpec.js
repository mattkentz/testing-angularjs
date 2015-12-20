describe('TestingAngularApp', function() {    
  
  beforeEach(function() {
    browser.get('http://0.0.0.0:8080/index.html');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Testing Angular');
  });
  
  it('should set the correct header', function() {
    expect(element(by.id('mainHeader')).getText()).toBe('Testing AngularJS Applications');
    expect(element(by.tagName('header')).getInnerHtml()).toBe('<h1 class="ng-binding">Testing AngularJS Applications</h1>');
    expect(element(by.binding('title')).getTagName()).toBe('h1');  
  });
});
