import { SocialAuthService } from '@abacritt/angularx-social-login';
import { FacebookLoginProvider } from '@abacritt/angularx-social-login';
import { SocialUser } from '@abacritt/angularx-social-login/public-api';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AuthService } from 'src/app/services/common/auth.service';
import { UserAuthService } from 'src/app/services/common/models/user-auth.service';
import { UserService } from 'src/app/services/common/models/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent implements OnInit {

  constructor(private userAuthService: UserAuthService, spinner: NgxSpinnerService, private authService: AuthService,
    private activatedRoute: ActivatedRoute, private router: Router, private socialAuthService: SocialAuthService
  ) {
    super(spinner);
    socialAuthService.authState.subscribe(async (user: SocialUser) => {
      //console.log(user);
      this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
      switch (user.provider) {
        case "GOOGLE":
          await userAuthService.googleLogin(user, () => {});
          authService.identityCheck();
          this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
          break;

        case "FACEBOOK":
          await userAuthService.facebookLogin(user, () => {});
          authService.identityCheck();
          this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
          break;
      }
    });

    
  }

  ngOnInit(): void {
  }

  async login(usernameOrEmail: string, password: string) {
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    await this.userAuthService.login(usernameOrEmail, password, () => {
      this.authService.identityCheck();
      this.activatedRoute.queryParams.subscribe(queryParams => {
        const returnUrl: string = queryParams["returnUrl"];
        if (returnUrl) {
          this.router.navigate([returnUrl]);
        }
      });
      this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    });
  }

  facebookLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

}
