import { SecularHubMembersPage } from './app.po';

describe('secular-hub-members App', function() {
  let page: SecularHubMembersPage;

  beforeEach(() => {
    page = new SecularHubMembersPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
