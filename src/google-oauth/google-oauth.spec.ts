import { GoogleOauthService } from './google-oauth.service';

describe('Google O Auth service', () => {
  let service: GoogleOauthService;

  beforeEach(async () => {
    service = new GoogleOauthService();
  });

  it('It should return access token', async () => {
    const accessToken = await service.getAccessToken();
    expect(accessToken).toBeDefined();
  });
});
